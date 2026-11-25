-- سِكّة | صلاحيات ودوال لوحة الإدارة | شغّله بعد rides_setup.sql
-- لتعيين أدمن: insert into public.admins(user_id) values ('UID من Authentication > Users');

alter table public.driver_profiles add column if not exists reject_reason text, add column if not exists reviewed_by uuid, add column if not exists reviewed_at timestamptz;
create table if not exists public.admin_audit (id bigint generated always as identity primary key, admin_id uuid not null, action text not null, target text, details text, created_at timestamptz not null default now());
alter table public.admin_audit enable row level security;
revoke all on public.admin_audit from anon, authenticated;

-- السائق لا يغيّر حالته ولا بيانات المراجعة، ولا يعدّل بياناته بعد الاعتماد
create or replace function public.protect_driver_row() returns trigger
language plpgsql set search_path = public as $$
begin
  new.updated_at := now();
  if auth.uid() is null or public.is_admin() then return new; end if;
  new.user_id := old.user_id; new.reject_reason := old.reject_reason; new.reviewed_by := old.reviewed_by; new.reviewed_at := old.reviewed_at;
  new.approval_status := case when old.approval_status = 'rejected' then 'pending' else old.approval_status end;
  new.vehicle_status := case when old.vehicle_status = 'rejected' then 'pending' else old.vehicle_status end;
  if old.approval_status = 'approved' and old.vehicle_status = 'approved' and
     (new.full_name, new.dob, new.phone, new.vehicle_type, new.brand, new.model, new.year, new.color, new.plate, new.relation, new.doc_paths)
     is distinct from
     (old.full_name, old.dob, old.phone, old.vehicle_type, old.brand, old.model, old.year, old.color, old.plate, old.relation, old.doc_paths)
  then raise exception 'locked: profile approved'; end if;
  return new;
end $$;
drop policy if exists dp_insert on public.driver_profiles;
create policy dp_insert on public.driver_profiles for insert to authenticated
  with check (user_id = auth.uid() and approval_status = 'pending' and vehicle_status = 'pending' and not is_online and reject_reason is null and reviewed_by is null);

create or replace function public.admin_drivers() returns table (user_id uuid, email text, full_name text, dob date, phone text, phone2 text, area text, place text, vehicle_type text, brand text, model text, year int, color text, plate text, relation text, photo_path text, doc_paths jsonb, approval_status text, vehicle_status text, is_online boolean, reject_reason text, created_at timestamptz)
language sql stable security definer set search_path = public, auth as $$
  select d.user_id, u.email::text, d.full_name, d.dob, d.phone, d.phone2, d.area, d.place, d.vehicle_type, d.brand, d.model, d.year, d.color, d.plate, d.relation, d.photo_path, d.doc_paths, d.approval_status, d.vehicle_status, d.is_online, d.reject_reason, d.created_at
  from public.driver_profiles d join auth.users u on u.id = d.user_id where public.is_admin() order by d.created_at desc $$;

create or replace function public.admin_set_status(p_user uuid, p_approval text, p_vehicle text, p_reason text default null) returns void
language plpgsql security definer set search_path = public as $$
declare rej boolean;
begin
  if not public.is_admin() then raise exception 'forbidden'; end if;
  if p_approval not in ('pending','approved','rejected') or p_vehicle not in ('pending','approved','rejected') then raise exception 'bad status'; end if;
  rej := p_approval = 'rejected' or p_vehicle = 'rejected';
  if rej and coalesce(btrim(p_reason), '') = '' then raise exception 'reason required'; end if;
  update public.driver_profiles set approval_status = p_approval, vehicle_status = p_vehicle, reject_reason = case when rej then btrim(p_reason) else null end,
    reviewed_by = auth.uid(), reviewed_at = now(), is_online = case when p_approval = 'approved' and p_vehicle = 'approved' then is_online else false end
    where user_id = p_user;
  if not found then raise exception 'not found'; end if;
  insert into public.admin_audit (admin_id, action, target, details) values (auth.uid(), 'driver_status', p_user::text, p_approval || '/' || p_vehicle || coalesce(' - ' || btrim(p_reason), ''));
end $$;

create or replace function public.admin_get_settings() returns jsonb
language sql stable security definer set search_path = public as $$
  select case when public.is_admin() then (select coalesce(jsonb_object_agg(key, val), '{}'::jsonb) from public.app_settings) else null end $$;

create or replace function public.admin_set_setting(p_key text, p_val text) returns void
language plpgsql security definer set search_path = public as $$
declare rng jsonb := '{"base_fare":[0,200],"per_km":[0,100],"per_min":[0,50],"min_fare":[0,500],"round_to":[0.5,10],"mult_tuktuk":[0.3,5],"mult_taxi":[0.3,5],"mult_car":[0.3,5],"night_start":[0,23],"night_end":[0,23],"night_mult":[1,5],"surge_manual":[1,5],"surge_auto":[0,1],"surge_step":[0,2],"surge_max":[1,5],"free_wait_min":[0,30],"wait_per_min":[0,20],"road_factor":[1,3],"avg_speed_kmh":[5,80],"commission_pct":[0,50],"service_radius_km":[1,300],"max_trip_km":[1,200],"map_lat":[-90,90],"map_lng":[-180,180],"rider_enabled":[0,1]}'; v numeric; old text;
begin
  if not public.is_admin() then raise exception 'forbidden'; end if;
  if rng -> p_key is null then raise exception 'bad key'; end if;
  begin v := btrim(p_val)::numeric; exception when others then raise exception 'bad value'; end;
  if v < (rng -> p_key ->> 0)::numeric or v > (rng -> p_key ->> 1)::numeric then raise exception 'out of range'; end if;
  select val into old from public.app_settings where key = p_key;
  insert into public.app_settings (key, val) values (p_key, v::text) on conflict (key) do update set val = excluded.val;
  insert into public.admin_audit (admin_id, action, target, details) values (auth.uid(), 'setting', p_key, coalesce(old, '-') || ' -> ' || v::text);
end $$;

create or replace function public.admin_overview() returns jsonb
language sql stable security definer set search_path = public as $$
  select case when public.is_admin() then jsonb_build_object(
    'drivers', (select count(*) from public.driver_profiles),
    'pending', (select count(*) from public.driver_profiles where approval_status = 'pending' or vehicle_status = 'pending'),
    'online', (select count(*) from public.driver_profiles where is_online),
    'rides_today', (select count(*) from public.rides where created_at > now() - interval '1 day'),
    'completed', (select count(*) from public.rides where status = 'completed'),
    'revenue', (select coalesce(sum(fare), 0) from public.rides where status = 'completed'),
    'commission', (select coalesce(sum(commission), 0) from public.rides where status = 'completed')) else null end $$;

create or replace function public.admin_rides() returns jsonb
language sql stable security definer set search_path = public as $$
  select case when public.is_admin() then (select coalesce(jsonb_agg(x order by c desc), '[]'::jsonb) from (
    select jsonb_build_object('id', r.id, 'status', r.status, 'veh', r.vehicle_type, 'pickup', r.pickup, 'dest', r.dest, 'km', r.km, 'fare', r.fare, 'commission', r.commission, 'created', r.created_at) as x, r.created_at as c
    from public.rides r order by r.created_at desc limit 50) t) else null end $$;

do $$ declare f text; begin
  foreach f in array array['admin_drivers()','admin_set_status(uuid,text,text,text)','admin_get_settings()','admin_set_setting(text,text)','admin_overview()','admin_rides()'] loop
    execute format('revoke all on function public.%s from public, anon', f);
    execute format('grant execute on function public.%s to authenticated', f);
  end loop;
end $$;
