-- سِكّة | محرّك الرحلات والتسعير | شغّله مرة واحدة في Supabase > SQL Editor (بعد schema.sql)
-- الجداول مقفولة تمامًا من التطبيق، وكل الوصول عبر دوال آمنة. السعر يُحسب في الخادم فقط.

create table if not exists public.app_settings (key text primary key, val text not null);
insert into public.app_settings (key, val) values
  ('rider_enabled','1'),
  ('base_fare','5'), ('per_km','7'), ('per_min','2'), ('min_fare','10'), ('round_to','1'),
  ('mult_tuktuk','0.8'), ('mult_taxi','1'), ('mult_car','1.2'),
  ('night_start','0'), ('night_end','5'), ('night_mult','1.2'),
  ('surge_manual','1'), ('surge_auto','1'), ('surge_step','0.25'), ('surge_max','2'),
  ('free_wait_min','3'), ('wait_per_min','1'),
  ('road_factor','1.3'), ('avg_speed_kmh','25'),
  ('commission_pct','10'), ('service_radius_km','40'), ('max_trip_km','30'),
  ('map_lat','31.4042'), ('map_lng','30.4170')
on conflict (key) do nothing;
alter table public.app_settings enable row level security;
revoke all on public.app_settings from anon, authenticated;

create table if not exists public.rides (
  id uuid primary key default gen_random_uuid(),
  rider_id uuid not null references auth.users(id) on delete cascade,
  driver_id uuid references auth.users(id) on delete set null,
  pickup text not null check (char_length(pickup) between 2 and 120),
  dest text not null check (char_length(dest) between 2 and 120),
  plat float8, plng float8, dlat float8, dlng float8,
  km numeric, mins int, fare_detail jsonb,
  vehicle_type text not null check (vehicle_type in ('tuktuk','taxi','car')),
  fare int not null check (fare > 0),
  wait_fee int not null default 0,
  commission int not null default 0,
  status text not null default 'requested' check (status in ('requested','accepted','arrived','started','completed','cancelled')),
  rating int check (rating between 1 and 5),
  rating_note text check (char_length(rating_note) <= 300),
  rider_done boolean not null default false,
  arrived_at timestamptz, started_at timestamptz, completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists one_active_rider on public.rides (rider_id) where status in ('requested','accepted','arrived','started');
create unique index if not exists one_active_driver on public.rides (driver_id) where status in ('accepted','arrived','started');
create index if not exists rides_open on public.rides (status, vehicle_type, created_at);
create table if not exists public.ride_pins (ride_id uuid primary key references public.rides(id) on delete cascade, pin text not null, attempts int not null default 0);
alter table public.rides enable row level security;
alter table public.ride_pins enable row level security;
revoke all on public.rides, public.ride_pins from anon, authenticated;

create or replace function public._cfg(k text, d numeric) returns numeric
language sql stable security definer set search_path = public as $$
  select coalesce((select val::numeric from public.app_settings where key = k), d) $$;

create or replace function public._dist_km(a float8, b float8, c float8, d float8) returns numeric
language sql immutable as $$
  select (6371 * 2 * asin(least(1, sqrt(power(sin(radians((c - a) / 2)), 2) + cos(radians(a)) * cos(radians(c)) * power(sin(radians((d - b) / 2)), 2)))))::numeric $$;

-- حساب السعر: (بداية + كيلو×المسافة + دقيقة×الزمن) مع حد أدنى، ثم × المركبة × الليل × الازدحام، ثم تقريب
create or replace function public._quote(a_lat float8, a_lng float8, b_lat float8, b_lng float8, p_veh text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare km numeric; mins int; vm numeric; base numeric; pk numeric; pm numeric; sub numeric; nm numeric := 1; sg numeric; h int; ns int; ne int; op int; dr int; ratio numeric; rnd numeric; total numeric; clat numeric; clng numeric; rad numeric;
begin
  if a_lat is null or a_lng is null or b_lat is null or b_lng is null or abs(a_lat) > 90 or abs(b_lat) > 90 or abs(a_lng) > 180 or abs(b_lng) > 180 then raise exception 'bad location'; end if;
  vm := _cfg('mult_' || coalesce(p_veh, ''), null);
  if vm is null then raise exception 'bad vehicle'; end if;
  clat := _cfg('map_lat', 31.4042); clng := _cfg('map_lng', 30.4170); rad := _cfg('service_radius_km', 40);
  if _dist_km(clat, clng, a_lat, a_lng) > rad or _dist_km(clat, clng, b_lat, b_lng) > rad then raise exception 'out of area'; end if;
  km := round(_dist_km(a_lat, a_lng, b_lat, b_lng) * _cfg('road_factor', 1.3), 1);
  if km < 0.3 then raise exception 'too short'; end if;
  if km > _cfg('max_trip_km', 30) then raise exception 'too long'; end if;
  mins := ceil(km / greatest(_cfg('avg_speed_kmh', 25), 5) * 60);
  base := _cfg('base_fare', 5); pk := _cfg('per_km', 7); pm := _cfg('per_min', 2);
  sub := greatest(_cfg('min_fare', 0), base + km * pk + mins * pm);
  h := extract(hour from (now() at time zone 'Africa/Cairo'))::int; ns := _cfg('night_start', 0)::int; ne := _cfg('night_end', 5)::int;
  if (ns <= ne and h >= ns and h < ne) or (ns > ne and (h >= ns or h < ne)) then nm := _cfg('night_mult', 1); end if;
  sg := _cfg('surge_manual', 1);
  if _cfg('surge_auto', 0) = 1 then
    select count(*) into op from public.rides where status = 'requested' and vehicle_type = p_veh and created_at > now() - interval '10 minutes';
    select count(*) into dr from public.driver_profiles where vehicle_type = p_veh and is_online and approval_status = 'approved' and vehicle_status = 'approved';
    ratio := op::numeric / greatest(dr, 1);
    if ratio > 1 then sg := greatest(sg, 1 + _cfg('surge_step', 0.25) * (ratio - 1)); end if;
  end if;
  sg := least(sg, _cfg('surge_max', 2));
  rnd := greatest(_cfg('round_to', 1), 0.5);
  total := greatest(rnd, round(sub * vm * nm * sg / rnd) * rnd);
  return jsonb_build_object('km', km, 'min', mins, 'base', base, 'per_km', pk, 'per_min', pm, 'dist_fee', round(km * pk, 2), 'time_fee', mins * pm,
    'subtotal', round(sub, 2), 'veh_mult', vm, 'night_mult', nm, 'surge', round(sg, 2), 'total', total::int);
end $$;

create or replace function public._ride_json(r public.rides, mode text) returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object('id', r.id, 'status', r.status, 'pickup', r.pickup, 'dest', r.dest, 'veh', r.vehicle_type, 'fare', r.fare, 'km', r.km, 'mins', r.mins, 'created', r.created_at)
  || case mode
     when 'rider' then jsonb_build_object('pin', (select pin from public.ride_pins where ride_id = r.id),
       'driver', (select jsonb_build_object('name', d.full_name, 'veh', d.brand || ' ' || d.model || ' · ' || d.color, 'plate', d.plate,
                  'avg', (select round(avg(x.rating)::numeric, 1) from public.rides x where x.driver_id = r.driver_id and x.rating is not null))
                  from public.driver_profiles d where d.user_id = r.driver_id))
     when 'driver' then jsonb_build_object('plat', r.plat, 'plng', r.plng, 'dlat', r.dlat, 'dlng', r.dlng,
       'rider', (select split_part(coalesce(u.raw_user_meta_data ->> 'display_name', 'راكب'), ' ', 1) from auth.users u where u.id = r.rider_id))
     else '{}'::jsonb end
$$;

create or replace function public.app_config() returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object('rider_enabled', public._cfg('rider_enabled', 0) = 1, 'lat', public._cfg('map_lat', 31.4042), 'lng', public._cfg('map_lng', 30.4170), 'radius', public._cfg('service_radius_km', 40)) $$;

create or replace function public.quote_ride(p_plat float8, p_plng float8, p_dlat float8, p_dlng float8, p_veh text) returns jsonb
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'auth'; end if;
  return public._quote(p_plat, p_plng, p_dlat, p_dlng, p_veh);
end $$;

create or replace function public.request_ride(p_pickup text, p_dest text, p_veh text, p_plat float8, p_plng float8, p_dlat float8, p_dlng float8, p_expected int default null) returns uuid
language plpgsql security definer set search_path = public as $$
declare v_id uuid; q jsonb; t int;
begin
  if auth.uid() is null then raise exception 'auth'; end if;
  if public._cfg('rider_enabled', 0) <> 1 then raise exception 'rider disabled'; end if;
  q := public._quote(p_plat, p_plng, p_dlat, p_dlng, p_veh); t := (q ->> 'total')::int;
  if p_expected is not null and abs(t - p_expected) > greatest(2, round(t * 0.05)) then raise exception 'price_changed'; end if;
  update public.rides set status = 'cancelled', updated_at = now() where status = 'requested' and created_at < now() - interval '10 minutes';
  insert into public.rides (rider_id, pickup, dest, plat, plng, dlat, dlng, km, mins, fare_detail, vehicle_type, fare)
    values (auth.uid(), btrim(p_pickup), btrim(p_dest), p_plat, p_plng, p_dlat, p_dlng, (q ->> 'km')::numeric, (q ->> 'min')::int, q, p_veh, t) returning id into v_id;
  insert into public.ride_pins (ride_id, pin) values (v_id, lpad((floor(random() * 10000))::int::text, 4, '0'));
  return v_id;
end $$;

create or replace function public.my_ride() returns jsonb
language plpgsql security definer set search_path = public as $$
declare r public.rides;
begin
  if auth.uid() is null then return null; end if;
  update public.rides set status = 'cancelled', updated_at = now() where rider_id = auth.uid() and status = 'requested' and created_at < now() - interval '10 minutes';
  select * into r from public.rides where rider_id = auth.uid() and (status in ('requested','accepted','arrived','started') or (status = 'completed' and not rider_done)) order by created_at desc limit 1;
  if not found then return null; end if;
  return public._ride_json(r, 'rider');
end $$;

create or replace function public.cancel_ride(p_id uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  update public.rides set status = 'cancelled', updated_at = now() where id = p_id and rider_id = auth.uid() and status in ('requested','accepted','arrived');
  if not found then raise exception 'not allowed'; end if;
end $$;

create or replace function public.rate_ride(p_id uuid, p_stars int, p_note text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if p_stars is null or p_stars not between 0 and 5 then raise exception 'bad stars'; end if;
  update public.rides set rating = nullif(p_stars, 0), rating_note = left(btrim(coalesce(p_note, '')), 300), rider_done = true, updated_at = now()
    where id = p_id and rider_id = auth.uid() and status = 'completed' and not rider_done;
  if not found then raise exception 'not allowed'; end if;
end $$;

create or replace function public.open_requests() returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare v text;
begin
  select vehicle_type into v from public.driver_profiles where user_id = auth.uid() and approval_status = 'approved' and vehicle_status = 'approved' and is_online;
  if v is null then return '[]'::jsonb; end if;
  return coalesce((select jsonb_agg(t.x order by t.c) from (
    select public._ride_json(r, 'open') as x, r.created_at as c from public.rides r
    where r.status = 'requested' and r.vehicle_type = v and r.created_at > now() - interval '10 minutes' order by r.created_at limit 10) t), '[]'::jsonb);
end $$;

create or replace function public.accept_ride(p_id uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare v text; r public.rides;
begin
  select vehicle_type into v from public.driver_profiles where user_id = auth.uid() and approval_status = 'approved' and vehicle_status = 'approved' and is_online;
  if v is null then raise exception 'not allowed'; end if;
  update public.rides set driver_id = auth.uid(), status = 'accepted', updated_at = now()
    where id = p_id and status = 'requested' and driver_id is null and vehicle_type = v and rider_id <> auth.uid() returning * into r;
  if not found then raise exception 'taken'; end if;
  return public._ride_json(r, 'driver');
end $$;

create or replace function public.driver_ride() returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare r public.rides;
begin
  select * into r from public.rides where driver_id = auth.uid() and status in ('accepted','arrived','started') limit 1;
  if not found then return null; end if;
  return public._ride_json(r, 'driver');
end $$;

create or replace function public.driver_advance(p_id uuid, p_to text, p_pin text default null) returns jsonb
language plpgsql security definer set search_path = public as $$
declare r public.rides; p public.ride_pins; pct numeric; w int := 0;
begin
  select * into r from public.rides where id = p_id and driver_id = auth.uid() for update;
  if not found then raise exception 'not allowed'; end if;
  if p_to = 'arrived' and r.status = 'accepted' then
    update public.rides set status = 'arrived', arrived_at = now(), updated_at = now() where id = r.id returning * into r;
  elsif p_to = 'started' and r.status = 'arrived' then
    select * into p from public.ride_pins where ride_id = r.id for update;
    if p.attempts >= 5 then return jsonb_build_object('error', 'locked'); end if;
    if p.pin is distinct from btrim(coalesce(p_pin, '')) then
      update public.ride_pins set attempts = attempts + 1 where ride_id = r.id;
      return jsonb_build_object('error', 'bad_pin');
    end if;
    update public.rides set status = 'started', started_at = now(), updated_at = now() where id = r.id returning * into r;
  elsif p_to = 'completed' and r.status = 'started' then
    pct := public._cfg('commission_pct', 0);
    w := greatest(0, ceil(extract(epoch from (r.started_at - r.arrived_at)) / 60) - public._cfg('free_wait_min', 3))::int * public._cfg('wait_per_min', 0)::int;
    update public.rides set status = 'completed', completed_at = now(), updated_at = now(), wait_fee = w, fare = fare + w, commission = round((fare + w) * pct / 100) where id = r.id returning * into r;
  else
    raise exception 'not allowed';
  end if;
  return jsonb_build_object('ride', public._ride_json(r, 'driver'));
end $$;

create or replace function public.driver_release(p_id uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  update public.rides set status = 'requested', driver_id = null, arrived_at = null, updated_at = now() where id = p_id and driver_id = auth.uid() and status in ('accepted','arrived');
  if not found then raise exception 'not allowed'; end if;
end $$;

create or replace function public.my_rides(p_role text) returns jsonb
language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(t.x order by t.c desc), '[]'::jsonb) from (
    select jsonb_build_object('id', r.id, 'pickup', r.pickup, 'dest', r.dest, 'fare', r.fare, 'status', r.status, 'created', r.created_at, 'rating', r.rating, 'note', r.rating_note) as x, r.created_at as c
    from public.rides r
    where r.status in ('completed','cancelled') and (case when p_role = 'd' then r.driver_id else r.rider_id end) = auth.uid() and (p_role <> 'd' or r.status = 'completed')
    order by r.created_at desc limit 30) t $$;

create or replace function public.driver_stats() returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object('trips', count(*), 'gross', coalesce(sum(fare), 0), 'commission', coalesce(sum(commission), 0), 'avg', round(avg(rating)::numeric, 1))
  from public.rides where driver_id = auth.uid() and status = 'completed' $$;

revoke all on function public._cfg(text, numeric), public._dist_km(float8, float8, float8, float8), public._quote(float8, float8, float8, float8, text), public._ride_json(public.rides, text) from public, anon, authenticated;
revoke all on function public.app_config() from public;
grant execute on function public.app_config() to anon, authenticated;
do $$ declare f text; begin
  foreach f in array array['quote_ride(float8,float8,float8,float8,text)','request_ride(text,text,text,float8,float8,float8,float8,int)','my_ride()','cancel_ride(uuid)','rate_ride(uuid,int,text)','open_requests()','accept_ride(uuid)','driver_ride()','driver_advance(uuid,text,text)','driver_release(uuid)','my_rides(text)','driver_stats()'] loop
    execute format('revoke all on function public.%s from public, anon', f);
    execute format('grant execute on function public.%s to authenticated', f);
  end loop;
end $$;
