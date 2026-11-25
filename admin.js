(() => {
'use strict';
const SB = 'https://aawuvkpmcoahhsczryid.supabase.co', KEY = 'sb_publishable_zFI5QubbX7IWzHLwzrzitA_KQT88nSL';
const db = window.supabase ? window.supabase.createClient(SB, KEY, { auth: { persistSession: true, autoRefreshToken: true } }) : null;
const $ = s => document.querySelector(s);
const esc = t => String(t == null ? '' : t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ST = { pending: 'قيد المراجعة', approved: 'معتمد', rejected: 'مرفوض' }, PC = { pending: 'w', approved: '', rejected: 'x' };
const VT = { tuktuk: 'توكتوك', taxi: 'تاكسي', car: 'سيارة' }, RS = { requested: 'بحث عن سائق', accepted: 'مقبولة', arrived: 'وصل السائق', started: 'جارية', completed: 'مكتملة', cancelled: 'ملغاة' };
const TABS = [['ov', 'نظرة عامة'], ['dr', 'السائقون'], ['pr', 'التسعير'], ['ri', 'الرحلات']];
const GROUPS = [
  ['الأسعار الأساسية', [['base_fare', 'سعر البداية (ج)', 0.5], ['per_km', 'سعر الكيلو (ج)', 0.5], ['per_min', 'سعر الدقيقة (ج)', 0.5], ['min_fare', 'الحد الأدنى للرحلة (ج)', 1], ['round_to', 'التقريب لأقرب (ج)', 0.5]]],
  ['معامل نوع المركبة', [['mult_tuktuk', 'توكتوك ×', 0.05], ['mult_taxi', 'تاكسي ×', 0.05], ['mult_car', 'سيارة ×', 0.05]]],
  ['الزيادات', [['night_mult', 'معامل الليل ×', 0.05], ['night_start', 'بداية الليل (ساعة 0-23)', 1], ['night_end', 'نهاية الليل (ساعة 0-23)', 1], ['surge_manual', 'زيادة يدوية ×  (مطر، مناسبة…)', 0.05], ['surge_auto', 'زيادة تلقائية عند الطلب المرتفع (1 تشغيل / 0 إيقاف)', 1], ['surge_step', 'شدة الزيادة التلقائية', 0.05], ['surge_max', 'أقصى زيادة ×', 0.05]]],
  ['الانتظار', [['free_wait_min', 'دقائق انتظار مجانية', 1], ['wait_per_min', 'سعر دقيقة الانتظار (ج)', 0.5]]],
  ['تقدير المسافة والوقت', [['road_factor', 'معامل الطرق (فوق الخط المستقيم)', 0.05], ['avg_speed_kmh', 'متوسط السرعة (كم/س)', 1]]],
  ['التشغيل', [['commission_pct', 'عمولة سِكّة %', 0.5], ['rider_enabled', 'تشغيل خدمة الركاب (1/0)', 1], ['service_radius_km', 'نطاق الخدمة (كم)', 1], ['max_trip_km', 'أقصى مسافة للرحلة (كم)', 1], ['map_lat', 'خط عرض مركز الخدمة', 0.0001], ['map_lng', 'خط طول مركز الخدمة', 0.0001]]]
];
let tab = 'ov', rows = [], cfg = {}, ovw = null, rides = [], filt = 'all', q = '', cur = null, blobs = [], docs = [], idle;
const toast = (m, bad) => { const t = $('#toast'); t.textContent = m; t.className = 'on' + (bad ? ' bad' : ''); clearTimeout(toast.t); toast.t = setTimeout(() => t.className = '', 3200); };
const rpc = async (fn, a) => { const { data, error } = await db.rpc(fn, a || {}); if (error) throw error; return data; };
const ov = r => (r.approval_status === 'rejected' || r.vehicle_status === 'rejected') ? 'rejected' : (r.approval_status === 'approved' && r.vehicle_status === 'approved') ? 'approved' : 'pending';
const pill = (t, c) => `<span class="pill ${c || ''}">${esc(t)}</span>`;
const fmt = d => { try { return new Date(d).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' }); } catch (e) { return ''; } };
const emsg = e => { const m = String((e && e.message) || ''); return m.includes('forbidden') ? 'ليست لديك صلاحية الإدارة' : m.includes('out of range') ? 'القيمة خارج الحد المسموح' : m.includes('bad value') ? 'قيمة غير صحيحة' : m.includes('reason required') ? 'اكتب سبب الرفض' : 'تعذّر تنفيذ العملية'; };

function resetIdle() { clearTimeout(idle); idle = setTimeout(() => out(true), 30 * 60 * 1000); }
['click', 'keydown', 'touchstart'].forEach(ev => document.addEventListener(ev, () => { if (!$('#app').hidden) resetIdle(); }, { passive: true }));
async function out(auto) { try { await db.auth.signOut(); } catch (e) {} $('#app').hidden = true; $('#login').hidden = false; $('#lerr').textContent = auto ? 'انتهت الجلسة بسبب عدم النشاط' : ''; }
async function enter(user) {
  let ok = false; try { ok = (await db.rpc('is_admin')).data === true; } catch (e) {}
  if (!ok) { await db.auth.signOut(); $('#lerr').textContent = 'هذا الحساب لا يملك صلاحية الإدارة'; return; }
  $('#login').hidden = true; $('#app').hidden = false; $('#me').textContent = user.email; resetIdle(); show('ov');
}
async function show(t) {
  tab = t; closeP();
  $('#nav').innerHTML = TABS.map(([k, l]) => `<button class="${k === t ? 'on' : ''}" data-a="tab" data-v="${k}">${l}</button>`).join('');
  $('#main').innerHTML = '<p class="mu">جارٍ التحميل…</p>';
  try {
    if (t === 'ov') ovw = await rpc('admin_overview');
    if (t === 'dr') rows = await rpc('admin_drivers') || [];
    if (t === 'pr') cfg = await rpc('admin_get_settings') || {};
    if (t === 'ri') rides = await rpc('admin_rides') || [];
  } catch (e) { $('#main').innerHTML = '<div class="card">تعذّر تحميل البيانات</div>'; return toast(emsg(e), true); }
  draw();
}
function draw() { $('#main').innerHTML = { ov: vOv, dr: vDr, pr: vPr, ri: vRi }[tab](); if (tab === 'pr') calc(); if (tab === 'dr') wireSearch(); }
const k = (l, n, c) => `<div class="card"><span class="mu">${l}</span><b ${c ? `class="${c}"` : ''}>${esc(n)}</b></div>`;
function vOv() { const o = ovw || {}; return `<h1>نظرة عامة</h1><div class="ks">${k('إجمالي السائقين', o.drivers)}${k('بانتظار المراجعة', o.pending)}${k('متصلون الآن', o.online)}${k('رحلات آخر 24 ساعة', o.rides_today)}${k('الرحلات المكتملة', o.completed)}${k('إجمالي الأجرة (ج)', o.revenue)}${k('عمولة سِكّة (ج)', o.commission)}</div>`; }
const list = () => rows.filter(r => (filt === 'all' || ov(r) === filt) && (!q || (r.full_name + r.phone + r.email + (r.plate || '')).toLowerCase().includes(q.toLowerCase())));
const tbl = () => list().map(r => `<div class="tr"><b>${esc(r.full_name)}<br><span class="mu" dir="ltr">${esc(r.email)}</span></b><span>${esc(VT[r.vehicle_type])} · ${esc(r.brand)} ${esc(r.model)}</span><span>${esc(r.area)}</span><span class="mu">${fmt(r.created_at)}</span>${pill(ST[ov(r)], PC[ov(r)])}<button data-a="rv" data-v="${esc(r.user_id)}">مراجعة</button></div>`).join('') || '<p class="mu">لا توجد نتائج</p>';
function vDr() { const c = { all: rows.length, pending: 0, approved: 0, rejected: 0 }; rows.forEach(r => c[ov(r)]++); return `<h1>السائقون</h1><div class="row"><input id="sq" placeholder="بحث بالاسم أو الهاتف أو البريد أو اللوحة" aria-label="بحث" value="${esc(q)}">${[['all', 'الكل'], ['pending', 'بانتظار المراجعة'], ['approved', 'معتمد'], ['rejected', 'مرفوض']].map(([f, l]) => `<button class="chip ${filt === f ? 'on' : ''}" data-a="flt" data-v="${f}">${l} ${c[f]}</button>`).join('')}</div><div class="card tw"><div class="tr h"><span>السائق</span><span>المركبة</span><span>المنطقة</span><span>التاريخ</span><span>الحالة</span><span></span></div><div id="tbl">${tbl()}</div></div>`; }
function wireSearch() { const s = $('#sq'); if (s) s.oninput = () => { q = s.value.trim(); $('#tbl').innerHTML = tbl(); }; }
function vRi() { return `<h1>آخر الرحلات</h1><div class="card tw"><div class="tr r h"><span>الحالة</span><span>المركبة</span><span>المسار</span><span>المسافة</span><span>الأجرة</span><span>العمولة</span></div>${rides.map(r => `<div class="tr r">${pill(RS[r.status] || r.status, r.status === 'completed' ? '' : r.status === 'cancelled' ? 'x' : 'w')}<span>${esc(VT[r.veh])}</span><span>${esc(r.pickup)} ← ${esc(r.dest)}</span><span>${esc(r.km)} كم</span><b>${esc(r.fare)} ج</b><span>${esc(r.commission)} ج</span></div>`).join('') || '<p class="mu">لا توجد رحلات</p>'}</div>`; }
function vPr() {
  return `<h1>التسعير والإعدادات</h1><p class="mu">أي تغيير يسري على الطلبات الجديدة فورًا. كل التغييرات مسجّلة في سجل العمليات.</p>${GROUPS.map(([t, f]) => `<div class="card"><h3>${t}</h3><div class="fg">${f.map(([key, l, st]) => `<label>${l}<input type="number" inputmode="decimal" step="${st}" data-k="${key}" value="${esc(cfg[key] != null ? cfg[key] : '')}" dir="ltr"></label>`).join('')}</div></div>`).join('')}<div class="row"><button class="btn" data-a="savecfg">حفظ التغييرات</button></div>
  <div class="card"><h3>حاسبة السعر (تجربة)</h3><div class="calc"><label>المسافة (كم)<input id="c_km" type="number" value="3" step="0.5" dir="ltr"></label><label>المركبة<select id="c_v"><option value="tuktuk">توكتوك</option><option value="taxi" selected>تاكسي</option><option value="car">سيارة</option></select></label><label>ليل؟<select id="c_n"><option value="0">لا</option><option value="1">نعم</option></select></label><label>زيادة ×<input id="c_s" type="number" value="1" step="0.1" dir="ltr"></label><div><span class="mu">الإجمالي التقريبي</span><div class="tot" id="c_t">—</div><span class="mu" id="c_d"></span></div></div></div>`;
}
const cv = key => { const el = document.querySelector(`[data-k="${key}"]`); return el && el.value !== '' ? +el.value : +cfg[key]; };
function calc() {
  const km = +$('#c_km').value || 0, mins = Math.ceil(km / Math.max(cv('avg_speed_kmh') || 25, 5) * 60), sub = Math.max(cv('min_fare') || 0, cv('base_fare') + km * cv('per_km') + mins * cv('per_min')), vm = cv('mult_' + $('#c_v').value), nm = $('#c_n').value === '1' ? cv('night_mult') : 1, sg = Math.min(Math.max(+$('#c_s').value || 1, 1), cv('surge_max') || 5), rd = Math.max(cv('round_to') || 1, 0.5);
  $('#c_t').textContent = Math.max(rd, Math.round(sub * vm * nm * sg / rd) * rd) + ' ج';
  $('#c_d').textContent = `${mins} دقيقة تقريبًا · قبل الضرب: ${Math.round(sub * 100) / 100} ج`;
}
async function saveCfg() {
  const ch = [...document.querySelectorAll('[data-k]')].filter(i => i.value !== '' && String(cfg[i.dataset.k]) !== String(+i.value));
  if (!ch.length) return toast('لا توجد تغييرات');
  try { for (const i of ch) { await rpc('admin_set_setting', { p_key: i.dataset.k, p_val: String(+i.value) }); cfg[i.dataset.k] = String(+i.value); } toast('تم حفظ ' + ch.length + ' تغيير'); }
  catch (e) { toast(emsg(e), true); }
}
const SAFE = /^[0-9a-f-]{36}\/[\w.-]+$/i;
async function blob(path) { if (!SAFE.test(path || '')) return null; const { data } = await db.storage.from('driver-docs').download(path); if (!data) return null; const u = URL.createObjectURL(data); blobs.push(u); return u; }
function closeP() { $('#ov').hidden = true; $('#panel').innerHTML = ''; blobs.splice(0).forEach(u => URL.revokeObjectURL(u)); cur = null; }
async function review(id) {
  const r = rows.find(x => x.user_id === id); if (!r) return; cur = r;
  const kv = (l, v, l2) => v ? `<div class="kv"><span>${l}</span><b${l2 ? ' dir="ltr"' : ''}>${esc(v)}</b></div>` : '';
  docs = [...(r.photo_path ? [{ label: 'الصورة الشخصية', path: r.photo_path }] : []), ...(Array.isArray(r.doc_paths) ? r.doc_paths : [])];
  const opt = s => ['pending', 'approved', 'rejected'].map(v => `<option value="${v}" ${s === v ? 'selected' : ''}>${ST[v]}</option>`).join('');
  $('#panel').innerHTML = `<div class="row"><h2 class="fx">${esc(r.full_name)}</h2><button class="btn o sm" data-a="cl">إغلاق</button></div>${pill(ST[ov(r)], PC[ov(r)])}
  <div class="card">${kv('البريد', r.email, 1)}${kv('الهاتف', r.phone, 1)}${kv('هاتف بديل', r.phone2, 1)}${kv('تاريخ الميلاد', r.dob)}${kv('المنطقة', [r.area, r.place].filter(Boolean).join(' - '))}${kv('المركبة', `${VT[r.vehicle_type]} · ${r.brand} ${r.model} · ${r.year} · ${r.color}`)}${kv('اللوحة', r.plate)}${kv('العلاقة بالمركبة', r.relation === 'owner' ? 'مالك' : 'مفوَّض')}${kv('تاريخ التسجيل', fmt(r.created_at))}${r.reject_reason ? kv('آخر سبب رفض', r.reject_reason) : ''}</div>
  <h3>المستندات</h3><div class="docs">${docs.map((d, i) => `<div class="doc"><div class="ph" id="d${i}">…</div><span>${esc(d.label)}</span><button class="btn o sm" data-a="doc" data-v="${i}">فتح</button></div>`).join('') || '<p class="mu">لا توجد مستندات</p>'}</div>
  <div class="card"><h3>قرار الإدارة</h3><label for="sa">اعتماد السائق</label><select id="sa">${opt(r.approval_status)}</select><label for="sv">اعتماد المركبة</label><select id="sv">${opt(r.vehicle_status)}</select><label for="rs">سبب الرفض (يظهر للسائق)</label><textarea id="rs" maxlength="300"></textarea><div class="row"><button class="btn fx" data-a="all">اعتماد الكل</button><button class="btn o fx" data-a="save">حفظ القرار</button></div></div>`;
  $('#ov').hidden = false;
  docs.forEach(async (d, i) => { try { const el = $('#d' + i); if (!el) return; if (/\.pdf$/i.test(d.path)) { el.textContent = 'PDF'; return; } const u = await blob(d.path); if (u && $('#d' + i)) { const im = document.createElement('img'); im.src = u; im.alt = d.label; $('#d' + i).replaceWith(im); } else if (el) el.textContent = '—'; } catch (e) {} });
}
async function decide(a, v) {
  const reason = $('#rs').value;
  if ((a === 'rejected' || v === 'rejected') && !reason.trim()) return toast('اكتب سبب الرفض', true);
  if (!confirm(`تأكيد القرار لـ ${cur.full_name}\nالسائق: ${ST[a]} — المركبة: ${ST[v]}`)) return;
  try { await rpc('admin_set_status', { p_user: cur.user_id, p_approval: a, p_vehicle: v, p_reason: reason.trim() || null }); toast('تم حفظ القرار'); closeP(); show('dr'); }
  catch (e) { toast(emsg(e), true); }
}
const A = {
  tab: v => show(v), out: () => out(), cl: closeP, rv: v => review(v), flt: v => { filt = v; draw(); }, savecfg: saveCfg,
  all: () => decide('approved', 'approved'), save: () => decide($('#sa').value, $('#sv').value),
  doc: async v => { const d = docs[+v]; if (!d || !SAFE.test(d.path || '')) return; const w = window.open('', '_blank'); try { const { data, error } = await db.storage.from('driver-docs').createSignedUrl(d.path, 120); if (error || !data) throw error; if (w) { w.opener = null; w.location = data.signedUrl; } } catch (e) { if (w) w.close(); toast('تعذّر فتح الملف', true); } }
};
document.addEventListener('click', e => { const b = e.target.closest('[data-a]'); if (b && A[b.dataset.a]) A[b.dataset.a](b.dataset.v); });
document.addEventListener('input', e => { if (tab === 'pr' && (e.target.dataset.k || e.target.id.startsWith('c_'))) calc(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#ov').hidden) closeP(); });
$('#lf').addEventListener('submit', async e => {
  e.preventDefault(); const err = $('#lerr'); err.textContent = '';
  if (!db) return void (err.textContent = 'تعذّر تحميل مكتبة الدخول');
  const { data, error } = await db.auth.signInWithPassword({ email: $('#le').value.trim(), password: $('#lp').value });
  if (error) return void (err.textContent = 'بيانات الدخول غير صحيحة');
  $('#lp').value = ''; enter(data.user);
});
if (db) db.auth.getSession().then(({ data }) => { if (data.session) enter(data.session.user); });
})();
