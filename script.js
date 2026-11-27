const SUPABASE_URL = "https://aawuvkpmcoahhsczryid.supabase.co";

const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_zFI5QubbX7IWzHLwzrzitA_KQT88nSL";

const db = (window.supabase && window.supabase.createClient)
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } })
  : null;
/* سِكّة | SEKKA — app.js (Frontend فقط، جاهز للربط لاحقًا بـ Supabase) */
(function () {
'use strict';

/* ===== الشعارات (مضمّنة حتى لا تحتاج رفع ملفات) ===== */
const LOGO = { icon: 'data:image/jpeg;base64,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' };

/* ===== الإعدادات =====
   riderEnabled: لا يكفي تغييرها من الواجهة. عند ربط Supabase تُقرأ من جدول إعدادات
   في الخادم، ويجب أن تتحقق سياسات RLS من إتاحة طلب الرحلات للراكب أيضًا. */
/* ===== المظهر (فاتح/داكن/تلقائي) ===== */
const THEME_KEY = 'sekka_theme';
const themeMode = () => { try { return localStorage.getItem(THEME_KEY) || 'auto'; } catch (e) { return 'auto'; } };
function applyTheme(m) {
  const dark = m === 'dark' || (m !== 'light' && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dk', dark);
  const tc = document.querySelector('meta[name="theme-color"]'); if (tc) tc.content = dark ? '#0b1713' : '#064e3b';
}
applyTheme(themeMode());
try { matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (themeMode() === 'auto') applyTheme('auto'); }); } catch (e) {}
const CONFIG = { riderEnabled: false };

/* ===== طبقة الربط بالخادم =====
   كل دالة هنا تُستبدل لاحقًا باستدعاء Supabase. لا توجد مفاتيح سرّية في هذا الملف. */
const need = () => { if (!db) throw new Error('NOT_CONNECTED'); };
const mapUser = u => ({ name: (u.user_metadata && u.user_metadata.display_name) || u.email, email: u.email });
const ST = { pending: 'قيد المراجعة', approved: 'معتمد', rejected: 'مرفوض' };
let drvLoaded = false, drvPromise = null;
function errMsg(e) {
  const m = String((e && (e.message || e.code)) || '').toLowerCase();
  if (m === 'not_connected') return 'تعذّر الاتصال بالخادم حاليًا، لم يتم حفظ بياناتك. حاول مرة أخرى لاحقًا.';
  if (m.includes('invalid login')) return 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
  if (m.includes('not confirmed')) return 'أكّد بريدك الإلكتروني من الرابط اللي وصلك أولًا';
  if (m.includes('already registered')) return 'البريد ده مسجّل قبل كده، جرّب تسجيل الدخول';
  if (m.includes('rate limit') || m.includes('too many') || (e && e.status === 429)) return 'محاولات كتير، استنى شوية وجرّب تاني';
  if (m.includes('session missing')) return 'انتهت صلاحية الرابط، اطلب رابطًا جديدًا';
  if (m.includes('different from the old')) return 'اختر كلمة مرور مختلفة عن القديمة';
  if (m === 'auth') return 'سجّل الدخول أولًا';
  if (m === 'big') return 'حجم الملف كبير (الحد 5 ميجا)';
  if (m === 'type' || m === 'img') return 'نوع الملف غير مدعوم، ارفع صورة أو PDF';
  if (m.includes('failed to fetch') || m.includes('network')) return 'تعذّر الاتصال بالإنترنت';
  if (m.includes('row-level security') || m.includes('locked') || m.includes('permission')) return 'غير مسموح بهذا الإجراء حاليًا';
  if (m.includes('too fast')) return 'استنى ثانية بين الرسائل';
  if (m.includes('role set')) return 'تم اختيار نوع الحساب من قبل';
  if (m.includes('bad phone')) return 'رقم الهاتف غير صحيح';
  if (m.includes('bad name')) return 'الاسم يجب أن يكون من 2 إلى 40 حرفًا';
  if (m.includes('price_changed')) return 'تغيّر السعر، راجع السعر الجديد ثم أكّد';
  if (m.includes('out of area')) return 'الموقع خارج نطاق الخدمة';
  if (m.includes('too short')) return 'المسافة قصيرة جدًا';
  if (m.includes('too long')) return 'المسافة أطول من الحد المسموح';
  if (m.includes('bad location')) return 'حدّد الموقع على الخريطة أولًا';
  if (m.includes('duplicate key')) return 'عندك رحلة جارية بالفعل';
  if (m.includes('rider disabled')) return 'خدمة الركاب غير متاحة حاليًا';
  if (m === 'taken') return 'الطلب اتقبل من سائق تاني';
  if (m.includes('not allowed')) return 'غير مسموح بهذا الإجراء حاليًا';
  if (m.includes('check constraint')) return 'راجع العناوين التي كتبتها';
  return 'حدث خطأ غير متوقع، حاول مرة أخرى.';
}
function prep(file) {
  return new Promise((res, rej) => {
    if (file.type === 'application/pdf') return file.size > 5242880 ? rej(new Error('BIG')) : res(file);
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return rej(new Error('TYPE'));
    const url = URL.createObjectURL(file), im = new Image();
    im.onload = () => {
      const k = Math.min(1, 1600 / Math.max(im.width, im.height)), c = document.createElement('canvas');
      c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
      c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
      c.toBlob(b => b ? res(b) : rej(new Error('IMG')), 'image/jpeg', 0.82);
    };
    im.onerror = () => { URL.revokeObjectURL(url); rej(new Error('IMG')); };
    im.src = url;
  });
}
const API = {
  _() { return Promise.reject(new Error('NOT_CONNECTED')); },
  async uid() { need(); const { data } = await db.auth.getUser(); if (!data || !data.user) throw new Error('AUTH'); return data.user.id; },
  async signUp(d) {
    need();
    const { data, error } = await db.auth.signUp({ email: d.email, password: d.password, options: { emailRedirectTo: 'https://sekkaofficial.github.io/sekka-platform/', data: { display_name: d.name, phone: String(d.phone || '').replace(/\s/g, '') } } });
    if (error) throw error; return data;
  },
  async signIn(d) { need(); const { data, error } = await db.auth.signInWithPassword({ email: d.email, password: d.password }); if (error) throw error; return data.user; },
  async signOut() { if (db) await db.auth.signOut({ scope: 'local' }); },
  async resetPassword(d) { need(); const { error } = await db.auth.resetPasswordForEmail(d.email, { redirectTo: 'https://sekkaofficial.github.io/sekka-platform/' }); if (error) throw error; },
  async updatePassword(pw) { need(); const { error } = await db.auth.updateUser({ password: pw }); if (error) throw error; },
  async resendCode(d) { need(); const { error } = await db.auth.resend({ type: 'signup', email: d.email }); if (error) throw error; },
  async registerDriver(d, f) {
    const uid = await this.uid();
    const up = async (file, tag) => {
      const b = await prep(file), p = `${uid}/${tag}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${b.type === 'application/pdf' ? 'pdf' : 'jpg'}`;
      const { error } = await db.storage.from('driver-docs').upload(p, b, { contentType: b.type }); if (error) throw error; return p;
    };
    const photo_path = f.photo ? await up(f.photo, 'photo') : null, doc_paths = [];
    for (const x of f.docs) doc_paths.push({ label: x.label, path: await up(x.file, 'doc') });
    const { error } = await db.from('driver_profiles').upsert({ user_id: uid, full_name: d.name.trim(), dob: d.dob, phone: d.phone.replace(/\s/g, ''), phone2: d.phone2 ? d.phone2.replace(/\s/g, '') : null, area: d.area, place: d.place || null, vehicle_type: d.vtype, brand: d.brand.trim(), model: d.model.trim(), year: +d.year, color: d.color.trim(), plate: d.plate ? d.plate.trim() : null, relation: d.rel, photo_path, doc_paths }, { onConflict: 'user_id' });
    if (error) throw error;
  },
  async myDriver() { const uid = await this.uid(); const { data, error } = await db.from('driver_profiles').select('*').eq('user_id', uid).maybeSingle(); if (error) throw error; return data; },
  async setDriverOnline(v) { const uid = await this.uid(); const { error } = await db.from('driver_profiles').update({ is_online: !!v }).eq('user_id', uid); if (error) throw error; },
  submitComplaint(d) { return this._(d); },
  saveAddress(d) { return this._(d); },
  async rpc(fn, a) { need(); const { data, error } = await db.rpc(fn, a || {}); if (error) throw error; return data; },
  requestRide(d) { return this.rpc('request_ride', { p_pickup: d.pick, p_dest: d.dest, p_veh: d.veh, p_plat: d.plat, p_plng: d.plng, p_dlat: d.dlat, p_dlng: d.dlng, p_expected: d.expected }); },
  quote(d) { return this.rpc('quote_ride', { p_plat: d.plat, p_plng: d.plng, p_dlat: d.dlat, p_dlng: d.dlng, p_veh: d.veh }); },
  rateDriver(d) { return this.rpc('rate_ride', { p_id: d.id, p_stars: d.stars, p_note: d.note || '' }); }
};

/* ===== الحالة ===== */
const S = {
  user: null,
  reg: {},
  ride: {}, me: null, notifs: { unread: 0, items: [] }, rd: null, dr: null, reqs: [], cfg: { fares: {} },
  drv: { account: 'غير مسجّل الدخول', approval: 'لم يُقدَّم الطلب', vehicle: 'غير مسجّلة', approved: false, vehApproved: false, online: false },
  stars: 0
};

const $ = s => document.querySelector(s);
const esc = t => String(t == null ? '' : t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ===== الأيقونات ===== */
const P = {
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
  steer: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2"/><path d="M12 14v7M10 11.5L3.5 10M14 11.5l6.5-1.5"/>',
  car: '<path d="M5 16l1.5-5.5A2 2 0 0 1 8.4 9h7.2a2 2 0 0 1 1.9 1.5L19 16"/><rect x="3" y="16" width="18" height="4" rx="1.5"/>',
  taxi: '<path d="M10 3h4v2h-4zM5 16l1.5-5.5A2 2 0 0 1 8.4 8h7.2a2 2 0 0 1 1.9 1.5L19 16"/><rect x="3" y="16" width="18" height="4" rx="1.5"/>',
  tuk: '<path d="M3 16V9l4-3h7l3 4h3v6"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>',
  home: '<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  wallet: '<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 10h18M16 15h2"/>',
  star: '<polygon points="12 2 15 9 22 9.5 17 14.5 18.5 22 12 18 5.5 22 7 14.5 2 9.5 9 9"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10 21h4"/>',
  pin: '<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  chev: '<path d="M9 6l6 6-6 6"/>',
  check: '<path d="M5 12l5 5 9-10"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  up: '<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>',
  out: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  swap: '<path d="M7 4L3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"/>',
  route: '<circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h7a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>'
};
Object.assign(P, {
  shield: '<path d="M12 3l8 3v6c0 4.5-3.2 7.8-8 9-4.8-1.2-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.2"/>',
  chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-5.4A8 8 0 1 1 21 12z"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  send: '<path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/>',
  moon: '<path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
  flag: '<path d="M5 21V4M5 4h12l-2 4 2 4H5"/>'
});
const ic = n => `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${P[n] || ''}</svg>`;

/* ===== عناصر مساعدة للقوالب ===== */
const hdr = (t, back = true) => `<header class="hdr">${back ? `<button class="ib" data-back aria-label="رجوع">${ic('chev')}</button>` : '<span></span>'}<h1>${t}</h1><span class="ib ghost"></span></header>`;
const pill = (t, k) => `<span class="pill ${k || ''}">${t}</span>`;
const empty = (i, t, s) => `<div class="empty">${ic(i)}<b>${t}</b><span>${s || ''}</span></div>`;
const val = n => esc(S.reg[n] || '');
const fld = (label, name, type = 'text', extra = '') => `<label class="f"><span>${label}</span><input name="${name}" type="${type}" value="${val(name)}" ${extra}></label>`;
const btn = (t, go, cls = '') => `<button class="btn ${cls}" data-go="${go}">${t}</button>`;
const menu = (i, t, go) => `<button class="menu" data-go="${go}"><span class="l">${ic(i)}${t}</span>${ic('chev')}</button>`;
const mapBox = (txt) => `<div class="map"><svg viewBox="0 0 300 220" preserveAspectRatio="none"><path d="M40 180 C90 150 100 90 150 100 S230 60 262 40" fill="none" stroke="#10b981" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 10"/><circle cx="40" cy="180" r="9" fill="#064e3b"/><circle cx="262" cy="40" r="9" fill="#10b981"/></svg><p>${txt || 'حدّد موقع الانطلاق والوجهة على الخريطة من الأسفل'}</p></div>`;
const avUrl = p => p ? `${SUPABASE_URL}/storage/v1/object/public/avatars/${encodeURI(p)}` : '';
const avatarEl = (p, nm, big) => p ? `<img class="av${big ? ' big' : ''}" src="${esc(avUrl(p))}" alt="">` : `<span class="av${big ? ' big' : ''}">${esc(String(nm || '؟').trim().charAt(0) || '؟')}</span>`;
const myName = () => (S.me && S.me.name) || (S.user && S.user.name) || '';
const ago = t => { const m = Math.max(0, Math.round((Date.now() - new Date(t)) / 60000)); return m < 1 ? 'الآن' : m < 60 ? `منذ ${m} د` : m < 1440 ? `منذ ${Math.round(m / 60)} س` : new Date(t).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' }); };
let AC;
function beep(f = 880, d = 0.16, n = 1) { try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); for (let i = 0; i < n; i++) { const o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime + i * (d + 0.08); o.frequency.value = f; g.gain.value = 0.07; o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + d); } } catch (e) {} }
function resizeImg(file, max, q) {
  return new Promise((res, rej) => {
    const u = URL.createObjectURL(file), im = new Image();
    im.onload = () => { const k = Math.min(1, max / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = Math.round(im.width * k); c.height = Math.round(im.height * k); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(u); c.toBlob(b => b ? res(b) : rej(new Error('IMG')), 'image/jpeg', q); };
    im.onerror = () => { URL.revokeObjectURL(u); rej(new Error('IMG')); }; im.src = u;
  });
}
const contact = (ph, unread) => `<div class="row2">${phoneOk(ph || '') ? `<a class="btn sec" href="tel:${ph}">${ic('phone')} اتصال</a>` : ''}<button class="btn sec" data-go="chat">${ic('chat')} رسالة${unread ? `<i class="cb">${unread}</i>` : ''}</button></div>`;
const msearch = () => `<form class="srch" data-form="msearch" novalidate><input name="q" placeholder="ابحث عن عنوان أو مكان في رشيد…" aria-label="بحث" autocomplete="off"><button aria-label="بحث">${ic('search')}</button></form><div id="sres" class="sres"></div>`;
const statsHtml = () => { const t = S.dstat || {}; return `<div class="sq"><span>${ic('list')}</span><b>${t.today_trips != null ? esc(t.today_trips) : '—'}</b><small>رحلات اليوم</small></div><div class="sq"><span>${ic('wallet')}</span><b>${t.today_net != null ? esc(t.today_net) + ' ج' : '—'}</b><small>أرباح اليوم</small></div><div class="sq"><span>${ic('star')}</span><b>${t.avg ? esc(t.avg) : '—'}</b><small>التقييم</small></div>`; };
const reqsHtml = () => {
  if (S.dr) return `<div class="card rise"><div class="row"><b>عندك رحلة جارية</b></div>${btn('فتح الرحلة الحالية', 'd-cur')}</div>`;
  if (!S.drv.online) return `<div class="card">${empty('car', 'أنت غير متصل', 'فعّل الاتصال من الخريطة لتصلك الطلبات.')}</div>`;
  if (!S.reqs.length) return `<div class="card" style="text-align:center"><div class="radar"><i></i><i></i><i></i></div><b>في انتظار طلب جديد…</b><p class="note">هيظهرلك الطلب على الشاشة فور وصوله</p></div>`;
  return `<h3 class="sec-t">الطلبات الجديدة</h3>${S.reqs.map(r => `<div class="card rq rise"><div class="row"><span>من</span><b>${esc(r.pickup)}</b></div><div class="row"><span>إلى</span><b>${esc(r.dest)}</b></div><div class="row"><span>${esc(r.km)} كم · ${esc(r.mins)} د</span><b>${esc(r.fare)} ج كاش</b></div><button class="btn" data-act="dacc" data-v="${esc(r.id)}">قبول الطلب</button></div>`).join('')}`;
};
const driverGate = () => !S.drv.approved || !S.drv.vehApproved;
const logoImg = `<img src="${LOGO.icon}" alt="سِكّة">`;

/* ===== مستندات المركبات (القائمة النهائية تحددها الإدارة وفق المتطلبات القانونية) ===== */
const DOCS = {
  common: ['صورة بطاقة الرقم القومي (وجه)', 'صورة بطاقة الرقم القومي (ظهر)', 'رخصة القيادة'],
  tuktuk: ['رخصة تسيير المركبة'],
  taxi: ['رخصة تسيير المركبة', 'ترخيص التاكسي'],
  car: ['رخصة تسيير المركبة'],
  owner: [],
  deleg: ['مستند التفويض باستخدام المركبة']
};
const VT = { tuktuk: 'توكتوك', taxi: 'تاكسي', car: 'سيارة' };

/* ===== الصفحات ===== */
const LOADING = '<div class="card" style="text-align:center"><div class="spin"></div><p class="note">جارٍ التحميل…</p></div>';
const rideRow = x => `<div class="card rise"><div class="row"><span>${esc(x.pickup)} ← ${esc(x.dest)}</span><b>${esc(x.fare)} ج</b></div><div class="row"><small>${new Date(x.created).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' })}</small>${pill(x.status === 'completed' ? 'مكتملة' : 'ملغاة', x.status === 'completed' ? 'ok' : 'off')}</div></div>`;
const routes = {
  home: () => `
    <div class="brand">${logoImg}<h2>سِكّة — مشوارك أسهل</h2><p>منصة النقل المحلية في رشيد</p></div>
    <p class="welcome">أهلًا بك في سِكّة، اختر كيف تريد المتابعة</p>
    <button class="role" data-go="r-start"><span class="big">${ic('user')}</span><span><b>أنا راكب</b><span>اطلب مشوارك بسهولة</span></span></button>
    <button class="role" data-go="d-start"><span class="big">${ic('steer')}</span><span><b>أنا سائق</b><span>انضم إلى فريق سائقين سِكّة</span></span></button>
    <div class="links">${S.user ? `<button class="link" data-go="profile">ملفي الشخصي</button>` : `<button class="link" data-go="login">تسجيل الدخول</button><button class="link" data-go="signup">إنشاء حساب جديد</button>`}</div>`,

  welcome: () => `<div class="wl"><div class="wl-hero"><i class="orb o1"></i><i class="orb o2"></i><i class="orb o3"></i><div class="wl-logo">${logoImg}</div><h1>سِكّة</h1><p>مشوارك أسهل في رشيد</p></div>
    <div class="wl-card rise"><h2>ابدأ رحلتك مع سِكّة</h2><ul class="feat">
      <li><span>${ic('shield')}</span><div><b>أمان في كل رحلة</b><small>رمز تأكيد يربطك بسائقك المعتمد</small></div></li>
      <li><span>${ic('tag')}</span><div><b>أسعار واضحة</b><small>تعرف أجرتك قبل ما تطلب</small></div></li>
      <li><span>${ic('chat')}</span><div><b>تواصل مباشر</b><small>اتصال ورسائل مع السائق أثناء الرحلة</small></div></li></ul>
      <button class="btn" data-go="signup">إنشاء حساب جديد</button><button class="btn sec" data-go="login">لدي حساب بالفعل</button>
      <p class="note c">بالمتابعة أنت توافق على <button class="link" data-act="legal" data-v="terms">الشروط</button> و<button class="link" data-act="legal" data-v="privacy">سياسة الخصوصية</button></p></div></div>`,

  signup: () => `<div class="ah rise"><button class="ib" data-go="welcome" aria-label="رجوع">${ic('chev')}</button><div class="wl-logo sm">${logoImg}</div><h1>إنشاء حساب جديد</h1><p>دقيقة واحدة وتبدأ مشوارك</p></div>
    <form data-form="signup" novalidate class="rise">
      ${fld('الاسم الكامل', 'name', 'text', 'required autocomplete="name" maxlength="40"')}
      ${fld('البريد الإلكتروني', 'email', 'email', 'required dir="ltr" autocomplete="email"')}
      ${fld('رقم الهاتف (للتواصل أثناء الرحلة)', 'phone', 'tel', 'required inputmode="tel" dir="ltr" autocomplete="tel" maxlength="11" placeholder="01012345678"')}
      ${fld('كلمة المرور (8 أحرف على الأقل)', 'pw', 'password', 'required autocomplete="new-password"')}
      ${fld('تأكيد كلمة المرور', 'pw2', 'password', 'required autocomplete="new-password"')}
      <label class="chk"><input type="checkbox" name="terms"><span>أوافق على <button type="button" class="link" data-act="legal" data-v="terms">الشروط والأحكام</button> و<button type="button" class="link" data-act="legal" data-v="privacy">سياسة الخصوصية</button></span></label>
      <button class="btn" type="submit">إنشاء الحساب</button>
    </form>
    <div class="links"><span>لديك حساب؟</span><button class="link" data-go="login">تسجيل الدخول</button></div>`,

  login: () => `<div class="ah rise"><button class="ib" data-go="welcome" aria-label="رجوع">${ic('chev')}</button><div class="wl-logo sm">${logoImg}</div><h1>أهلًا بعودتك</h1><p>سجّل دخولك لمتابعة مشوارك</p></div>
    <form data-form="login" novalidate class="rise">
      ${fld('البريد الإلكتروني', 'email', 'email', 'required dir="ltr" autocomplete="email"')}
      ${fld('كلمة المرور', 'pw', 'password', 'required autocomplete="current-password"')}
      <button class="btn" type="submit">دخول</button>
    </form>
    <div class="links"><button class="link" data-go="forgot">نسيت كلمة المرور؟</button><button class="link" data-go="signup">إنشاء حساب جديد</button></div>`,

  rolepick: () => `<div class="ah rise"><div class="wl-logo sm">${logoImg}</div><h1>مرحبًا ${esc(myName())}</h1><p>اختر كيف تريد استخدام سِكّة</p></div>
    <button class="rolec rise" data-act="pickrole" data-v="rider"><span class="rc-i">${ic('user')}</span><span class="fx"><b>أنا راكب</b><small>اطلب مشوارك وتابع سائقك لحظة بلحظة</small></span>${ic('chev')}</button>
    <button class="rolec rise" data-act="pickrole" data-v="driver"><span class="rc-i">${ic('steer')}</span><span class="fx"><b>أنا سائق</b><small>استقبل الطلبات واكسب من مشاويرك</small></span>${ic('chev')}</button>
    <p class="note c">اختيارك بيتحفظ مع حسابك وهتفتح عليه تلقائيًا. لتغييره تواصل مع الدعم.</p>`,

  complete: () => `<div class="ah rise"><div class="wl-logo sm">${logoImg}</div><h1>أكمل بياناتك</h1><p>رقم الهاتف مطلوب للتواصل أثناء الرحلات</p></div>
    <form data-form="complete" novalidate class="rise">${fld('رقم الهاتف', 'phone', 'tel', 'required inputmode="tel" dir="ltr" maxlength="11" placeholder="01012345678"')}<button class="btn" type="submit">حفظ ومتابعة</button></form>
    <button class="btn sec" data-act="logout">تسجيل الخروج</button>`,

  wait: () => `<div class="wt"><div class="wl-logo">${logoImg}</div>${S.meErr ? `<p>${/function|PGRST202|schema cache|permission denied/i.test(S.meMsg || '') ? 'الخادم غير مُجهَّز بعد (شغّل v3_setup.sql في Supabase)' : 'تعذّر تحميل بياناتك، تأكد من الاتصال'}</p><p class="note" dir="ltr" style="max-width:300px;word-break:break-word">${esc(S.meMsg || '')}</p><button class="btn" data-act="retry">إعادة المحاولة</button><button class="btn sec" data-act="logout">تسجيل الخروج</button>` : '<div class="spin"></div>'}</div>`,

  account: () => {
    if (!S.user) return `${hdr('حسابي', false)}<div class="card">${empty('user', 'أنت غير مسجّل الدخول', 'سجّل الدخول للمتابعة')}${btn('تسجيل الدخول', 'login')}</div>`;
    const p = S.prof, m = S.me || {}, drv = m.role === 'driver', kv = (l, v) => v ? `<div class="row"><span>${l}</span><b>${esc(v)}</b></div>` : '';
    return `${hdr('حسابي', false)}<div class="phero rise"><button class="avedit" data-go="editp" aria-label="تعديل الصورة">${avatarEl(m.avatar, m.name, true)}<i>${ic('camera')}</i></button><h2>${esc(m.name || '')}</h2><p dir="ltr">${esc(m.phone || '')}</p><p dir="ltr" class="sub">${esc(S.user.email)}</p>${pill(drv ? 'سائق' : 'راكب', 'ok')}</div>
    ${drv && p ? `<div class="card kv rise"><h3>بيانات المركبة</h3>${kv('حالة الحساب', ST[p.approval_status])}${kv('النوع', VT[p.vehicle_type])}${kv('المركبة', `${p.brand} ${p.model} · ${p.color}`)}${kv('اللوحة', p.plate)}</div>` : ''}
    <div class="card rise" style="padding:6px 14px">${menu('edit', 'تعديل الملف الشخصي', 'editp')}${menu('lock', 'تغيير كلمة المرور', 'newpw')}${menu('bell', 'الإشعارات', 'notif')}${drv ? menu('star', 'التقييمات', 'd-rate') : ''}${drv && !S.reg.submitted ? menu('steer', 'تسجيل بيانات السائق', 'd-reg1') : ''}${menu('help', 'المساعدة والشكاوى', 'help')}</div>
    <div class="card rise" style="padding:6px 14px"><button class="menu" data-act="theme"><span class="l">${ic('moon')}المظهر</span><b class="val">${{ auto: 'تلقائي', light: 'فاتح', dark: 'داكن' }[themeMode()]}</b></button><button class="menu" data-act="push"><span class="l">${ic('bell')}إشعارات الهاتف</span><b class="val" id="pushs">…</b></button></div>
    <button class="btn sec" data-act="logout">${ic('out')} تسجيل الخروج</button>`;
  },
  profile: () => routes.account(),
  'd-me': () => routes.account(),
  'r-prof': () => routes.account(),

  editp: () => { const m = S.me || {}; return `${hdr('تعديل الملف الشخصي')}<form data-form="editp" novalidate class="rise"><label class="avpick"><span id="avprev">${avatarEl(m.avatar, m.name, true)}</span><span class="lk2">${ic('camera')} تغيير الصورة</span><input type="file" name="avatar" accept="image/jpeg,image/png,image/webp" hidden></label>
    <label class="f"><span>الاسم المعروض</span><input name="name" value="${esc(m.name || '')}" maxlength="40" autocomplete="name" required></label>
    <label class="f"><span>رقم الهاتف</span><input name="phone" value="${esc(m.phone || '')}" dir="ltr" inputmode="tel" maxlength="11" required></label>
    ${m.role === 'driver' ? '<p class="note">الاسم القانوني المسجّل لدى الإدارة لا يتغيّر من هنا، والاسم المعروض هو اللي يظهر للركاب.</p>' : ''}
    <button class="btn" type="submit">حفظ التغييرات</button></form>`; },

  chat: () => { const r = chatRide();
    if (!r) return `${hdr('المحادثة')}<div class="card">${empty('chat', 'لا توجد رحلة حالية', 'المحادثة متاحة أثناء الرحلة فقط.')}</div>`;
    const drv = S.me && S.me.role === 'driver', nm = drv ? r.rider : (r.driver && r.driver.name), av = drv ? r.ravatar : (r.driver && r.driver.avatar), ph = (drv ? r.rphone : (r.driver && r.driver.phone)) || '';
    return `<header class="hdr ch-h"><button class="ib" data-back aria-label="رجوع">${ic('chev')}</button><div class="row">${avatarEl(av, nm)}<h1>${esc(nm || '')}</h1></div>${phoneOk(ph) ? `<a class="ib" href="tel:${ph}" aria-label="اتصال">${ic('phone')}</a>` : '<span class="ib ghost"></span>'}</header><div class="chat" id="cmsgs" aria-live="polite"></div><form data-form="chat" class="cform" novalidate><input name="m" maxlength="500" autocomplete="off" placeholder="اكتب رسالة…" aria-label="رسالة"><button class="send" type="submit" aria-label="إرسال">${ic('send')}</button></form>`; },

  notif: () => `${hdr('الإشعارات')}${S.notifs.items.length ? S.notifs.items.map(x => `<button class="nitem rise ${x.read ? '' : 'new'}" data-act="nopen" data-v="${esc((x.data && x.data.url) || '')}"><span class="ni">${ic(NI[x.kind] || 'bell')}</span><span class="fx"><b>${esc(x.title)}</b><small>${esc(x.body)}</small></span><time>${ago(x.at)}</time></button>`).join('') : `<div class="card">${empty('bell', 'لا توجد إشعارات', 'ستظهر هنا تنبيهات رحلاتك ورسائلك.')}</div>`}`,
  'd-notif': () => routes.notif(),
  'r-notif': () => routes.notif(),

  forgot: () => `${hdr('استعادة كلمة المرور')}
    <div class="card"><p>اكتب بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور.</p>
    <form data-form="forgot" novalidate>${fld('البريد الإلكتروني', 'email', 'email', 'required dir="ltr"')}<button class="btn" type="submit">إرسال الرابط</button></form></div>
    ${btn('العودة لتسجيل الدخول', 'login', 'sec')}`,

  newpw: () => `${hdr('كلمة مرور جديدة')}<div class="card"><form data-form="newpw" novalidate>${fld('كلمة المرور الجديدة (8 أحرف على الأقل)', 'pw', 'password', 'required autocomplete="new-password"')}${fld('تأكيد كلمة المرور', 'pw2', 'password', 'required autocomplete="new-password"')}<button class="btn" type="submit">حفظ كلمة المرور</button></form></div>`,

verify: () => `${hdr('تأكيد البريد الإلكتروني')}
<div class="card">
  <p>تم إرسال رابط تأكيد إلى بريدك الإلكتروني.</p>
  <p>افتح بريدك واضغط على رابط التأكيد لتفعيل حسابك في سِكّة.</p>
  <p>لو الرسالة مش موجودة، راجع مجلد الرسائل غير المرغوب فيها.</p>
  <button class="btn lite" data-act="resend">إعادة إرسال رابط التأكيد</button>
  <button class="btn sec" data-go="login">العودة لتسجيل الدخول</button>
</div>`,

  profile: () => {
    if (!S.user) return `${hdr('الملف الشخصي')}<div class="card">${empty('user', 'أنت غير مسجّل الدخول', 'سجّل الدخول لعرض بيانات حسابك')}${btn('تسجيل الدخول', 'login')}${btn('إنشاء حساب جديد', 'signup', 'sec')}</div>`;
    const p = S.prof, st = k => k === 'approved' ? 'ok' : (k === 'rejected' ? '' : 'wait');
    const kv = (l, v, ltr) => v ? `<div class="row"><span>${l}</span><b${ltr ? ' dir="ltr"' : ''}>${esc(v)}</b></div>` : '';
    let since = ''; try { since = p ? new Date(p.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' }) : ''; } catch (e) {}
    return `${hdr('الملف الشخصي')}
    <div class="phero"><div class="avatar">${S.avatar ? `<img src="${esc(S.avatar)}" alt="">` : ic('user')}</div><h2>${esc(p ? p.full_name : S.user.name)}</h2><p dir="ltr">${esc(S.user.email)}</p>${p ? pill(ST[p.approval_status] || '—', st(p.approval_status)) : pill('حساب مستخدم', 'off')}</div>
    ${p ? `<div class="card kv"><h3>البيانات الشخصية</h3>${kv('الاسم الكامل', p.full_name)}${kv('رقم الهاتف', p.phone, 1)}${kv('رقم بديل', p.phone2, 1)}${kv('المنطقة', [p.area, p.place].filter(Boolean).join(' - '))}${kv('عضو منذ', since)}</div>
    <div class="card kv"><h3>بيانات المركبة</h3>${kv('النوع', VT[p.vehicle_type])}${kv('الماركة والموديل', `${p.brand} ${p.model}`)}${kv('سنة الصنع', String(p.year))}${kv('اللون', p.color)}${kv('رقم اللوحة', p.plate)}${kv('علاقتك بالمركبة', p.relation === 'owner' ? 'مالك' : 'مفوَّض')}<div class="row"><span>حالة المركبة</span>${pill(ST[p.vehicle_status] || '—', st(p.vehicle_status))}</div></div>`
    : `<div class="card kv"><h3>بيانات الحساب</h3>${kv('الاسم', S.user.name)}${kv('البريد الإلكتروني', S.user.email, 1)}</div>${btn('انضم كسائق', 'd-start', 'lite')}`}
    <div class="card" style="padding:6px 14px">${menu('lock', 'تغيير كلمة المرور', 'newpw')}${menu('help', 'المساعدة والشكاوى', 'help')}</div>
    ${p ? '<p class="note" style="text-align:center">لتعديل بياناتك بعد الاعتماد تواصل مع إدارة سِكّة.</p>' : ''}
    <button class="btn sec" data-act="logout">${ic('out')} تسجيل الخروج</button>`;
  },

  /* ----- السائق ----- */
  'd-start': () => `${hdr('سائقو سِكّة')}
    <div class="hero"><h2>انضم إلى فريق سائقين سِكّة</h2><p>سجّل بياناتك وبيانات مركبتك، وبعد مراجعة الإدارة واعتماد حسابك ومركبتك تستطيع استقبال الرحلات.</p></div>
    <div class="card"><h3>خطوات الانضمام</h3><ol class="steps">
      <li><span class="dot">1</span>إنشاء حساب</li><li><span class="dot">2</span>بياناتك الشخصية</li><li><span class="dot">3</span>بيانات المركبة</li><li><span class="dot">4</span>رفع المستندات</li><li><span class="dot">5</span>مراجعة الإدارة والاعتماد</li></ol></div>
    ${btn('ابدأ التسجيل كسائق', 'd-reg1')}${btn('لوحة السائق', 'd-home', 'sec')}
    <div class="links"><button class="link" data-go="signup">إنشاء حساب</button><button class="link" data-go="login">تسجيل الدخول</button></div>`,

  'd-reg1': () => `${hdr('بياناتك الشخصية')}<div class="prog"><i class="on"></i><i></i><i></i></div><p class="note">الخطوة 1 من 3</p>
    <form data-form="reg1" novalidate>
      <div style="text-align:center"><div class="avatar" id="avatar">${S.reg.photo ? `<img src="${S.reg.photo}" alt="">` : ic('user')}</div>
      <label class="up" style="justify-content:center">${ic('up')} الصورة الشخصية<input type="file" name="photo" accept="image/*"></label></div>
      ${fld('الاسم الكامل', 'name', 'text', 'required')}
      ${fld('تاريخ الميلاد', 'dob', 'date', 'required')}
      ${fld('رقم الهاتف', 'phone', 'tel', 'required dir="ltr" inputmode="tel" placeholder="01xxxxxxxxx"')}
      ${fld('رقم بديل (اختياري)', 'phone2', 'tel', 'dir="ltr" inputmode="tel"')}
      <label class="f"><span>المنطقة</span><select name="area" required><option value="">اختر المنطقة</option><option ${S.reg.area === 'رشيد' ? 'selected' : ''}>رشيد</option><option ${S.reg.area === 'أخرى' ? 'selected' : ''}>أخرى</option></select></label>
      ${fld('الحي أو القرية', 'place', 'text')}
      <button class="btn" type="submit">التالي: بيانات المركبة</button>
    </form>`,

  'd-reg2': () => `${hdr('بيانات المركبة')}<div class="prog"><i class="on"></i><i class="on"></i><i></i></div><p class="note">الخطوة 2 من 3</p>
    <form data-form="reg2" novalidate>
      <span class="f"><span style="display:block;font-weight:600">نوع المركبة</span></span>
      <div class="vgrid">${['tuktuk', 'taxi', 'car'].map(k => `<label class="ch"><input type="radio" name="vtype" value="${k}" ${S.reg.vtype === k ? 'checked' : ''}><span class="chb">${ic(k === 'tuktuk' ? 'tuk' : k)}${VT[k]}</span></label>`).join('')}</div>
      ${fld('الماركة', 'brand', 'text', 'required')}
      ${fld('الموديل', 'model', 'text', 'required')}
      ${fld('سنة الصنع', 'year', 'number', 'required min="1980" max="2030" inputmode="numeric"')}
      ${fld('اللون', 'color', 'text', 'required')}
      ${fld('رقم اللوحة (إن وُجد)', 'plate', 'text')}
      <span class="f"><span style="display:block;font-weight:600">علاقتك بالمركبة</span></span>
      <div class="vgrid" style="grid-template-columns:1fr 1fr">${[['owner', 'مالك'], ['deleg', 'مفوَّض']].map(([k, t]) => `<label class="ch"><input type="radio" name="rel" value="${k}" ${S.reg.rel === k ? 'checked' : ''}><span class="chb">${t}</span></label>`).join('')}</div>
      <button class="btn" type="submit">التالي: المستندات</button>
    </form>`,

  'd-reg3': () => {
    const list = [...DOCS.common, ...(DOCS[S.reg.vtype] || []), ...(DOCS[S.reg.rel] || [])];
    return `${hdr('المستندات المطلوبة')}<div class="prog"><i class="on"></i><i class="on"></i><i class="on"></i></div><p class="note">الخطوة 3 من 3 — مستندات ${VT[S.reg.vtype] || 'المركبة'} (${S.reg.rel === 'deleg' ? 'مفوَّض' : 'مالك'})</p>
    <form data-form="reg3" novalidate>
      ${list.map((d, i) => `<div class="f"><span style="display:block;font-weight:600;margin-bottom:5px">${d}</span><label class="up">${ic('up')}<span>اضغط لاختيار الملف</span><input type="file" name="doc${i}" accept="image/*,.pdf"></label></div>`).join('')}
      <p class="note">قد تطلب الإدارة مستندات إضافية وفق المتطلبات القانونية لكل نوع مركبة.</p>
      <button class="btn" type="submit">إرسال الطلب للمراجعة</button>
    </form>`;
  },

  'd-home': () => {
    const m = S.me || {}, head = `<div class="dh rise"><button class="avbtn" data-go="d-me" aria-label="حسابي">${avatarEl(m.avatar, m.name)}</button><div class="fx"><small>مرحبًا</small><h2>${esc(m.name || '')}</h2></div><button class="ib bell" data-go="notif" aria-label="الإشعارات">${ic('bell')}<i class="nb" hidden></i></button></div>`;
    if (driverGate()) return `${head}<div class="card rise"><h3>خطوات تفعيل حسابك</h3><ol class="steps"><li><span class="dot done">✓</span>إنشاء حساب وتسجيل الدخول</li><li><span class="dot ${S.reg.submitted ? 'done' : ''}">${S.reg.submitted ? '✓' : 2}</span>إكمال بيانات السائق والمركبة والمستندات</li><li><span class="dot ${S.drv.approved ? 'done' : ''}">${S.drv.approved ? '✓' : 3}</span>مراجعة واعتماد الإدارة</li></ol>${S.reg.submitted ? '' : btn('أكمل التسجيل كسائق', 'd-reg1')}</div><div class="grid2 rise"><div class="stat"><small>اعتماد السائق</small>${pill(S.drv.approval, S.drv.approved ? 'ok' : 'wait')}</div><div class="stat"><small>حالة المركبة</small>${pill(S.drv.vehicle, S.drv.vehApproved ? 'ok' : 'wait')}</div></div>`;
    return `${head}<div class="tri rise" id="dstats">${statsHtml()}</div><div class="dmapw rise"><div id="dmap" dir="ltr"></div><div class="dstate" id="dstate"></div><button class="ib gps" data-act="dgps" aria-label="موقعي">${ic('pin')}</button></div><div id="dreqs"></div>`;
  },
  'd-req': () => `${hdr('الطلبات الجديدة', false)}${!S.drv.online ? `<div class="card">${empty('list', 'فعّل الاتصال لتصلك الطلبات', 'من لوحة السائق فعّل استقبال الرحلات.')}</div>` : S.dr ? `<div class="card">${empty('route', 'عندك رحلة جارية', 'أنهِ رحلتك الحالية أولًا.')}</div>${btn('الرحلة الحالية', 'd-cur')}` : S.reqs.length ? S.reqs.map(r => `<div class="card rise"><div class="row"><span>من</span><b>${esc(r.pickup)}</b></div><div class="row"><span>إلى</span><b>${esc(r.dest)}</b></div><div class="row"><span>الأجرة</span><b>${esc(r.fare)} ج كاش</b></div><div class="row"><span>المسافة</span><b>${esc(r.km)} كم · ${esc(r.mins)} د</b></div><button class="btn" data-act="dacc" data-v="${esc(r.id)}">قبول الطلب</button></div>`).join('') : `<div class="card" style="text-align:center"><div class="radar"><i></i><i></i><i></i></div><b>في انتظار طلب جديد…</b><p class="note">يتم التحديث تلقائيًا</p></div>`}`,
  'd-cur': () => {
    const r = S.dr;
    if (!r) return `${hdr('الرحلة الحالية')}<div class="card">${empty('route', 'لا توجد رحلة جارية', 'ستظهر تفاصيل الرحلة هنا عند قبولك لطلب.')}</div>${btn('الطلبات الجديدة', 'd-req', 'sec')}`;
    const i = ['accepted', 'arrived', 'started'].indexOf(r.status);
    return `${hdr('الرحلة الحالية', false)}<div class="lmap" id="lmap" dir="ltr"></div><div class="prog">${[0, 1, 2].map(k => `<i class="${k <= i ? 'on' : ''}"></i>`).join('')}</div><div class="card rise"><div class="row"><span>الراكب</span><b>${esc(r.rider || 'راكب')}</b></div><div class="row"><span>من</span><b>${esc(r.pickup)}</b></div><div class="row"><span>إلى</span><b>${esc(r.dest)}</b></div><div class="row"><span>الأجرة</span><b>${esc(r.fare)} ج كاش</b></div><div class="row"><span>المسافة</span><b>${esc(r.km)} كم · ${esc(r.mins)} د</b></div></div>${contact(r.rphone, r.unread)}${(() => { const la = r.status === 'started' ? r.dlat : r.plat, ln = r.status === 'started' ? r.dlng : r.plng; return la ? `<a class="btn sec" target="_blank" rel="noopener noreferrer" href="https://www.google.com/maps/dir/?api=1&destination=${Number(la)},${Number(ln)}">فتح الملاحة</a>` : ''; })()}${r.status === 'accepted' ? '<button class="btn" data-act="dadv" data-v="arrived">وصلت لنقطة الالتقاء</button><button class="btn sec" data-act="drel">تخلّي عن الرحلة</button>' : r.status === 'arrived' ? `<form data-form="dpin" class="card" novalidate>${fld('رمز الرحلة من الراكب (٤ أرقام)', 'pin', 'text', 'required inputmode="numeric" maxlength="4" autocomplete="off"')}<button class="btn" type="submit">بدء الرحلة</button></form><button class="btn sec" data-act="drel">تخلّي عن الرحلة</button>` : '<button class="btn" data-act="dadv" data-v="completed">إنهاء الرحلة وتحصيل الأجرة</button>'}`;
  },
  'd-trips': () => `${hdr('سجل الرحلات', false)}${S.hist === undefined ? LOADING : S.hist.length ? S.hist.map(rideRow).join('') : `<div class="card">${empty('clock', 'لا توجد رحلات سابقة', 'ستجد هنا رحلاتك المكتملة بعد أول رحلة.')}</div>`}`,
  'd-earn': () => `${hdr('الأرباح والعمولات', false)}${S.dstat === undefined ? LOADING : S.dstat ? `<div class="grid2"><div class="stat rise"><small>صافي الأرباح</small><b>${esc(S.dstat.gross - S.dstat.commission)} ج</b></div><div class="stat rise"><small>عمولة سِكّة</small><b>${esc(S.dstat.commission)} ج</b></div><div class="stat rise"><small>الرحلات المكتملة</small><b>${esc(S.dstat.trips)}</b></div><div class="stat rise"><small>تقييمك</small><b>${S.dstat.avg ? esc(S.dstat.avg) : '—'}</b></div></div>` : `<div class="card">${empty('wallet', 'لا توجد أرباح بعد', 'تظهر الأرباح هنا بعد إتمام الرحلات.')}</div>`}`,
  'd-rate': () => { const L = (S.hist || []).filter(x => x.rating); return `${hdr('التقييمات')}${S.hist === undefined ? LOADING : L.length ? L.map(x => `<div class="card rise"><div class="row"><b>${'★'.repeat(x.rating)}${'☆'.repeat(5 - x.rating)}</b><small>${new Date(x.created).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' })}</small></div>${x.note ? `<p>${esc(x.note)}</p>` : ''}</div>`).join('') : `<div class="card">${empty('star', 'لا توجد تقييمات بعد', 'تظهر تقييمات الركاب لك هنا بعد رحلاتك.')}</div>`}`; },
  /* ----- الراكب (واجهة جاهزة ومقفولة عن الاستخدام العام) ----- */
  'r-gate': () => `${hdr('خدمة الركاب', false)}<div class="card" style="margin-top:40px">${empty('clock', 'خدمة الركاب ستتوفر قريبًا في رشيد', 'نعمل على تجهيز الخدمة لتصلك بأفضل صورة. يمكنك الانضمام إلينا كسائق من الصفحة الرئيسية.')}</div>${btn('العودة إلى الصفحة الرئيسية', 'home')}`,
  'r-start': () => routes['r-home'](),
  'r-home': () => `<div class="dh rise"><button class="avbtn" data-go="r-prof" aria-label="حسابي">${avatarEl(S.me && S.me.avatar, myName())}</button><div class="fx"><small>مرحبًا ${esc(myName())}</small><h2>إلى أين تريد الذهاب؟</h2></div><button class="ib bell" data-go="notif" aria-label="الإشعارات">${ic('bell')}<i class="nb" hidden></i></button></div>
    ${mapBox()}
    <div class="card" style="padding:6px 14px">${menu('pin', S.ride.plat ? esc(S.ride.pick) : 'موقع الانطلاق', 'r-pick')}${menu('route', S.ride.dlat ? esc(S.ride.dest) : 'الوجهة', 'r-dest')}</div>
    <button class="btn" data-act="rnext">اختيار نوع المركبة</button>`,
  'r-pick': () => `${hdr('موقع الانطلاق')}${msearch()}<div class="pmap" id="pmap" dir="ltr"><i class="ppin"></i><button type="button" class="ib gps" data-act="gps" aria-label="موقعي الحالي">${ic('pin')}</button></div><p class="note">حرّك الخريطة ليكون الدبوس على المكان المطلوب.</p><form data-form="rpick" novalidate>${fld('وصف المكان (اختياري)', 'pick', 'text', 'maxlength="100"')}<button class="btn" type="submit">تأكيد</button></form>`,
  'r-dest': () => `${hdr('تحديد الوجهة')}${msearch()}<div class="pmap" id="pmap" dir="ltr"><i class="ppin"></i><button type="button" class="ib gps" data-act="gps" aria-label="موقعي الحالي">${ic('pin')}</button></div><p class="note">حرّك الخريطة ليكون الدبوس على المكان المطلوب.</p><form data-form="rdest" novalidate>${fld('وصف المكان (اختياري)', 'dest', 'text', 'maxlength="100"')}<button class="btn" type="submit">تأكيد</button></form>`,
  'r-veh': () => `${hdr('اختر نوع المركبة')}<div class="vgrid" style="grid-template-columns:1fr">${['tuktuk', 'taxi', 'car'].map(k => `<button class="role" style="margin:0" data-act="rveh" data-v="${k}"><span class="big">${ic(k === 'tuktuk' ? 'tuk' : k)}</span><span><b>${VT[k]}</b><span>اختر ${VT[k]} لمشوارك</span></span></button>`).join('')}</div>`,
  'r-price': () => { const q = S.quote, row = (l, v) => `<div class="row"><span>${l}</span><b>${v}</b></div>`;
    return `${hdr('تأكيد الطلب')}<div class="card rise">${row('من', esc(S.ride.pick || '—'))}${row('إلى', esc(S.ride.dest || '—'))}${row('المركبة', VT[S.ride.veh] || '—')}</div>${q === undefined ? LOADING : q && q.total ? `<div class="card rise">${row('المسافة التقريبية', esc(q.km) + ' كم')}${row('الزمن التقريبي', esc(q.min) + ' دقيقة')}${row('سعر البداية', esc(q.base) + ' ج')}${row(`المسافة (${esc(q.per_km)} ج للكيلو)`, esc(q.dist_fee) + ' ج')}${row(`الوقت (${esc(q.per_min)} ج للدقيقة)`, esc(q.time_fee) + ' ج')}${q.veh_mult != 1 ? row('معامل المركبة', '×' + esc(q.veh_mult)) : ''}${q.night_mult != 1 ? row('زيادة الليل', '×' + esc(q.night_mult)) : ''}${q.surge > 1 ? row('زيادة الطلب المرتفع', '×' + esc(q.surge)) : ''}<div class="row" style="font-size:1.15rem"><span>الإجمالي (كاش)</span><b>${esc(q.total)} ج</b></div></div><p class="note">السعر ثابت بعد التأكيد، وقد يُضاف رسم انتظار بعد الدقائق المجانية.</p><button class="btn" data-act="rconfirm">تأكيد الطلب</button>` : `<div class="card">${empty('route', 'تعذّر حساب السعر', S.quoteErr || 'حاول مرة أخرى')}</div>${btn('رجوع', 'r-home', 'sec')}`}`; },
  'r-search': () => `${hdr('جارٍ البحث عن سائق', false)}<div class="card rise" style="text-align:center"><div class="radar"><i></i><i></i><i></i></div><b>نبحث لك عن أقرب سائق</b><p class="note">${esc(S.ride.pick || '')} ← ${esc(S.ride.dest || '')}</p></div><button class="btn sec" data-act="rcancel">إلغاء الطلب</button>`,
  'r-drv': () => routes['r-live'](),
  'r-pin': () => routes['r-live'](),
  'r-live': () => {
    const r = S.rd; if (!r) return routes['r-home']();
    const d = r.driver || {}, st = { accepted: ['السائق في الطريق إليك', 'wait'], arrived: ['السائق وصل لنقطة الالتقاء', 'ok'], started: ['الرحلة جارية', 'ok'] }[r.status] || ['—', 'wait'];
    return `${hdr('متابعة الرحلة', false)}<div class="lmap" id="lmap" dir="ltr"></div><div class="card rise"><div class="row"><span>الحالة</span>${pill(st[0], st[1])}</div><div class="row"><span>السائق</span><b>${esc(d.name || '—')}</b></div><div class="row"><span>المركبة</span><b>${esc(d.veh || '—')}</b></div><div class="row"><span>اللوحة</span><b>${esc(d.plate || '—')}</b></div><div class="row"><span>التقييم</span><b>${d.avg ? esc(d.avg) : 'جديد'}</b></div><div class="row"><span>الأجرة</span><b>${esc(r.fare)} ج كاش</b></div></div>${contact(d.phone, r.unread)}${r.status !== 'started' ? `<div class="card rise" style="text-align:center"><p>أعطِ هذا الرمز للسائق عند الركوب</p><div class="pin">${String(r.pin || '').split('').map(c => `<b>${esc(c)}</b>`).join('')}</div></div><button class="btn sec" data-act="rcancel">إلغاء الرحلة</button>` : ''}`;
  },
  'r-end': () => `${hdr('انتهت الرحلة', false)}<div class="card rise">${empty('check', 'وصلت إلى وجهتك', `المبلغ المطلوب: ${S.rd ? esc(S.rd.fare) : ''} ج كاش للسائق`)}</div>${btn('قيّم السائق', 'r-rate')}<button class="btn sec" data-act="rskip">تخطي التقييم</button>`,
  'r-rate': () => `${hdr('تقييم السائق')}<form data-form="rate" class="card rise" novalidate><p style="text-align:center">كيف كانت رحلتك؟</p><div class="stars">${[1, 2, 3, 4, 5].map(n => `<button type="button" data-act="star" data-v="${n}" aria-label="${n} نجوم">${ic('star')}</button>`).join('')}</div><label class="f"><span>ملاحظات (اختياري)</span><textarea name="note" rows="3" maxlength="300"></textarea></label><button class="btn" type="submit">إرسال التقييم</button></form>`,
  'r-hist': () => `${hdr('سجل الرحلات', false)}${S.hist === undefined ? LOADING : S.hist.length ? S.hist.map(rideRow).join('') : `<div class="card">${empty('clock', 'لا توجد رحلات سابقة', 'ستظهر رحلاتك هنا.')}</div>`}`,
  'r-saved': () => `${hdr('العناوين المحفوظة', false)}<div class="card">${empty('pin', 'لا توجد عناوين محفوظة', 'أضف عنوان البيت أو العمل لتطلب أسرع.')}</div>
    <form data-form="addr" class="card" novalidate><h3>إضافة عنوان</h3>${fld('اسم العنوان (مثل: البيت)', 'label', 'text', 'required')}${fld('العنوان', 'address', 'text', 'required')}<button class="btn" type="submit">حفظ العنوان</button></form>`,
  help: () => `${hdr('المساعدة والشكاوى')}<form data-form="help" class="card" novalidate><h3>أرسل شكوى أو استفسارًا</h3>
    <label class="f"><span>نوع الرسالة</span><select name="type" required><option value="">اختر</option><option>شكوى</option><option>استفسار</option><option>مشكلة في رحلة</option><option>مشكلة في الحساب</option></select></label>
    <label class="f"><span>التفاصيل</span><textarea name="msg" rows="4" required></textarea></label><button class="btn" type="submit">إرسال</button></form>`
};

/* ===== الراوتر ===== */
const TABS = {
  d: [['d-home', 'home', 'الرئيسية'], ['d-req', 'list', 'الطلبات'], ['d-trips', 'clock', 'الرحلات'], ['d-earn', 'wallet', 'الأرباح'], ['d-me', 'user', 'حسابي']],
  r: [['r-home', 'home', 'الرئيسية'], ['r-hist', 'clock', 'رحلاتي'], ['r-saved', 'pin', 'عناويني'], ['r-prof', 'user', 'حسابي']]
};
const TABROUTES = { d: ['d-home', 'd-req', 'd-trips', 'd-earn', 'd-me'], r: ['r-home', 'r-hist', 'r-saved', 'r-prof', 'r-start'] };
const stack = []; let cur = 'home';

function riderOpen() { return CONFIG.riderEnabled === true; }
function go(name, replace) {
  if (name === 'home') name = landing();
  if (/^d-reg[123]$/.test(name) && !S.user) { toast('سجّل الدخول أو أنشئ حسابًا أولًا', true); name = 'login'; }
  if (/^d-reg[123]$/.test(name) && S.reg.submitted) { toast(S.drv.approved ? 'حسابك معتمد، لتعديل بياناتك تواصل مع الإدارة' : 'طلبك قيد المراجعة بالفعل', true); name = 'd-home'; }
  if (name.startsWith('r-') && !riderOpen()) name = 'r-gate';
  if (!routes[name]) name = 'home';
  if (!replace && cur !== name) { stack.push(cur); try { history.pushState(null, ''); } catch (e) {} }
  cur = name; render();
}
function back() { if (stack.length) { try { history.back(); return; } catch (e) {} } popTo(); }
function popTo() { cur = stack.pop() || 'home'; if (cur === 'home') cur = landing(); if (cur.startsWith('r-') && !riderOpen()) cur = 'home'; render(); }
window.addEventListener('popstate', popTo);
function render() {
  const v = $('#view');
  v.innerHTML = routes[cur]();
  v.style.animation = 'none'; void v.offsetWidth; v.style.animation = '';
  window.scrollTo(0, 0);
  const g = cur.startsWith('d-') && TABROUTES.d.includes(cur) ? 'd' : (TABROUTES.r.includes(cur) && riderOpen() ? 'r' : null);
  const t = $('#tabs');
  t.hidden = !g;
  t.innerHTML = g ? TABS[g].map(([r, i, l]) => `<button data-go="${r}" class="${(cur === r || (r === 'r-home' && cur === 'r-start')) ? 'on' : ''}">${ic(i)}${l}</button>`).join('') : '';
}

/* ===== رسائل وتحميل ===== */
let tt;
function toast(msg, err) {
  const t = $('#toast'); t.textContent = msg; t.className = 'toast show' + (err ? ' err' : '');
  clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 3200);
}
async function send(fn) {
  $('#loader').hidden = false;
  try { return await fn(); }
  catch (e) {
    console.error(e); toast(errMsg(e), true);
  } finally { $('#loader').hidden = true; }
}
function fail(msg, el) {
  toast(msg, true);
  if (el) { el.classList.add('bad'); el.focus(); el.addEventListener('input', () => el.classList.remove('bad'), { once: true }); }
  return false;
}
const fd = f => Object.fromEntries(new FormData(f).entries());
const emailOk = e => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
const phoneOk = p => /^01[0125]\d{8}$/.test(p.replace(/\s/g, ''));

/* ===== النماذج ===== */
const forms = {
  signup(f) {
    const d = fd(f);
    if (d.name.trim().length < 3) return fail('اكتب اسمك الكامل', f.name);
    if (!phoneOk(d.phone || '')) return fail('رقم الهاتف غير صحيح (مثال 01012345678)', f.phone);
    if (!emailOk(d.email)) return fail('البريد الإلكتروني غير صحيح', f.email);
    if (d.pw.length < 8) return fail('كلمة المرور يجب ألا تقل عن 8 أحرف', f.pw);
    if (d.pw !== d.pw2) return fail('كلمتا المرور غير متطابقتين', f.pw2);
    if (!f.terms.checked) return fail('يجب الموافقة على الشروط وسياسة الخصوصية');
    send(async () => {
  const r = await API.signUp({ name: d.name, email: d.email, password: d.pw, phone: d.phone });
  S.reg.name = d.name.trim();
  S.reg.email = d.email.trim();
  if (r && r.session) { go('wait', true); toast('أهلًا بك في سِكّة'); } else { S.user = null; go('verify'); toast('تم إرسال رابط التأكيد إلى بريدك الإلكتروني'); }
});
  },
  login(f) {
    const d = fd(f);
    if (!emailOk(d.email)) return fail('البريد الإلكتروني غير صحيح', f.email);
    if (!d.pw) return fail('اكتب كلمة المرور', f.pw);
    send(async () => { const u = await API.signIn({ email: d.email, password: d.pw }); S.user = mapUser(u); S.drv.account = 'نشط'; drvLoaded = false; go('wait', true); afterAuth(); toast('أهلًا بك في سِكّة'); });
  },
  forgot(f) {
    const d = fd(f);
    if (!emailOk(d.email)) return fail('البريد الإلكتروني غير صحيح', f.email);
    send(async () => { await API.resetPassword({ email: d.email }); toast('تم إرسال رابط الاستعادة إلى بريدك'); go('login'); });
  },
  newpw(f) {
    const d = fd(f);
    if (d.pw.length < 8) return fail('كلمة المرور يجب ألا تقل عن 8 أحرف', f.pw);
    if (d.pw !== d.pw2) return fail('كلمتا المرور غير متطابقتين', f.pw2);
    send(async () => { await API.updatePassword(d.pw); toast('تم تغيير كلمة المرور'); go(S.hasDriver ? 'd-home' : 'home', true); });
  },
  reg1(f) {
    const d = fd(f);
    if (d.name.trim().length < 3) return fail('اكتب اسمك الكامل', f.name);
    if (!d.dob) return fail('حدّد تاريخ الميلاد', f.dob);
    { const a = new Date(d.dob), t = new Date(); let age = t.getFullYear() - a.getFullYear(); if (t < new Date(t.getFullYear(), a.getMonth(), a.getDate())) age--; if (isNaN(age) || age < 18 || age > 80) return fail('لازم يكون عمرك 18 سنة على الأقل', f.dob); }
    if (!phoneOk(d.phone)) return fail('رقم الهاتف غير صحيح (يبدأ بـ 01 ويتكون من 11 رقمًا)', f.phone);
    if (d.phone2 && !phoneOk(d.phone2)) return fail('الرقم البديل غير صحيح', f.phone2);
    if (!d.area) return fail('اختر المنطقة', f.area);
    const { photo, ...rest } = d; Object.assign(S.reg, rest); go('d-reg2');
  },
  reg2(f) {
    const d = fd(f);
    if (!d.vtype) return fail('اختر نوع المركبة');
    if (!d.brand.trim() || !d.model.trim() || !d.color.trim()) return fail('أكمل بيانات المركبة');
    const y = +d.year; if (!(y >= 1980 && y <= 2030)) return fail('سنة الصنع غير صحيحة', f.year);
    if (!d.rel) return fail('حدّد علاقتك بالمركبة (مالك أو مفوَّض)');
    if (d.vtype === 'taxi' && !d.plate.trim()) return fail('رقم اللوحة مطلوب للتاكسي', f.plate);
    Object.assign(S.reg, d); go('d-reg3');
  },
  reg3(f) {
    const ins = [...f.querySelectorAll('input[type=file]')];
    const miss = ins.find(i => !i.files.length);
    if (miss) return fail('ارفع جميع المستندات المطلوبة');
    const docs = ins.map(i => ({ label: i.closest('.f').querySelector('span').textContent, file: i.files[0] }));
    send(async () => { await API.registerDriver(S.reg, { photo: S.photoFile, docs }); S.reg.submitted = true; S.drv.approval = 'قيد المراجعة'; S.drv.vehicle = 'قيد المراجعة'; S.drv.approved = false; S.drv.vehApproved = false; toast('تم إرسال طلبك للمراجعة'); go('d-home', true); });
  },
  complete(f) {
    const d = fd(f); if (!phoneOk(d.phone)) return fail('رقم الهاتف غير صحيح (مثال 01012345678)', f.phone);
    send(async () => { await API.rpc('update_profile', { p_name: '', p_phone: d.phone.replace(/\s/g, ''), p_avatar: null }); await loadMe(); });
  },
  editp(f) {
    const d = fd(f), nm = d.name.trim();
    if (nm.length < 2) return fail('الاسم يجب أن يكون حرفين على الأقل', f.name);
    if (!phoneOk(d.phone)) return fail('رقم الهاتف غير صحيح', f.phone);
    send(async () => {
      let path = null;
      if (S.newAvatar) { const uid = await API.uid(), b = await resizeImg(S.newAvatar, 320, 0.82); path = `${uid}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`; const { error } = await db.storage.from('avatars').upload(path, b, { contentType: 'image/jpeg' }); if (error) throw error; }
      await API.rpc('update_profile', { p_name: nm, p_phone: d.phone.replace(/\s/g, ''), p_avatar: path });
      S.newAvatar = null; S.dpos = null; stopWatch(); hideReq(false); ignored.clear(); await loadMe(); toast('تم حفظ التغييرات'); back();
    });
  },
  chat(f) {
    const m = f.m.value.trim(), r = chatRide(); if (!m || !r) return; f.m.value = '';
    API.rpc('send_message', { p_ride: r.id, p_body: m }).then(() => pullChat()).catch(e => { toast(errMsg(e), true); f.m.value = m; });
  },
  msearch(f) {
    const q = f.q.value.trim(); if (q.length < 3 || !S.map) return;
    const c = S.cfg, vb = c.lat ? `&viewbox=${c.lng - 0.5},${c.lat + 0.5},${c.lng + 0.5},${c.lat - 0.5}&bounded=1` : '';
    fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&accept-language=ar&countrycodes=eg${vb}&q=${encodeURIComponent(q)}`).then(r => r.json()).then(res => { S.sres = res; $('#sres').innerHTML = res.length ? res.map((x, i) => `<button type="button" class="sr" data-act="sr" data-v="${i}">${ic('pin')}<span>${esc(x.display_name)}</span></button>`).join('') : '<p class="note c">لا توجد نتائج</p>'; }).catch(() => toast('تعذّر البحث، حاول مرة أخرى', true));
  },
  rpick(f) { if (!S.map) return fail('الخريطة غير متاحة، تأكد من الاتصال'); const c = S.map.getCenter(); S.ride.plat = c.lat; S.ride.plng = c.lng; S.ride.pick = fd(f).pick.trim() || 'موقع محدد على الخريطة'; back(); },
  rdest(f) { if (!S.map) return fail('الخريطة غير متاحة، تأكد من الاتصال'); const c = S.map.getCenter(); S.ride.dlat = c.lat; S.ride.dlng = c.lng; S.ride.dest = fd(f).dest.trim() || 'موقع محدد على الخريطة'; back(); },
  dpin(f) {
    const d = fd(f), pin = d.pin.trim().replace(/[٠-٩]/g, c => '٠١٢٣٤٥٦٧٨٩'.indexOf(c));
    if (!/^\d{4}$/.test(pin)) return fail('اكتب الرمز المكوّن من 4 أرقام', f.pin);
    send(async () => { const r = await API.rpc('driver_advance', { p_id: S.dr.id, p_to: 'started', p_pin: pin }); if (r.error) return toast(r.error === 'locked' ? 'تم قفل الرمز، تواصل مع الإدارة' : 'الرمز غير صحيح', true); S.dr = r.ride; render(); });
  },
  rate(f) {
    if (!S.stars) return fail('اختر عدد النجوم');
    send(async () => { await API.rateDriver({ id: S.rd.id, stars: S.stars, note: f.note.value }); S.rd = null; S.stars = 0; toast('شكرًا لتقييمك'); go('r-home', true); });
  },
  addr(f) {
    const d = fd(f); if (!d.label.trim() || !d.address.trim()) return fail('أكمل بيانات العنوان');
    send(async () => { await API.saveAddress(d); toast('تم حفظ العنوان'); f.reset(); });
  },
  help(f) {
    const d = fd(f); if (!d.type) return fail('اختر نوع الرسالة', f.type);
    if (d.msg.trim().length < 10) return fail('اكتب تفاصيل أكثر (10 أحرف على الأقل)', f.msg);
    send(async () => { await API.submitComplaint(d); toast('تم إرسال رسالتك'); f.reset(); });
  }
};

/* ===== الإجراءات ===== */
const LEGAL = {
  terms: ['الشروط والأحكام', ['تتيح سِكّة الربط بين الركاب والسائقين، ولا تُقدَّم الخدمة إلا بعد اعتماد حساب السائق ومركبته.', 'يلتزم المستخدم بإدخال بيانات صحيحة واستخدام التطبيق بشكل قانوني.', 'يحق لسِكّة إيقاف أي حساب يخالف الشروط أو يسيء استخدام الخدمة.', 'الأسعار والعمولات تُعلن داخل التطبيق قبل تأكيد الطلب.']],
  privacy: ['سياسة الخصوصية', ['نجمع البيانات اللازمة لتشغيل الخدمة فقط: الاسم، البريد الإلكتروني، رقم الهاتف، بيانات المركبة والمستندات.', 'لا نشارك بياناتك مع أي جهة إلا بحكم القانون أو لتنفيذ الخدمة.', 'يمكنك طلب تعديل بياناتك أو حذف حسابك عبر المساعدة والشكاوى.']]
};
const acts = {
  legal(el) { const [t, ps] = LEGAL[el.dataset.v]; const s = $('#sheet'); s.innerHTML = `<div><h3>${t}</h3>${ps.map(p => `<p>${p}</p>`).join('')}<button class="btn" data-act="close">فهمت</button></div>`; s.hidden = false; },
  close() { $('#sheet').hidden = true; },
  logout() { send(async () => { await API.signOut(); resetSession(); toast('تم تسجيل الخروج'); }); },
  resend() {
  send(async () => {
    if (!S.reg.email) return fail('البريد الإلكتروني غير موجود، سجّل بياناتك مرة أخرى');
    await API.resendCode({ email: S.reg.email });
    toast('تم إرسال رابط التأكيد إلى بريدك الإلكتروني');
  });
},
  online() {
    if (driverGate()) return toast('لا يمكن تفعيل استقبال الرحلات قبل اعتماد حسابك ومركبتك', true);
    send(async () => { await API.setDriverOnline(!S.drv.online); S.drv.online = !S.drv.online; if (S.drv.online) startWatch(); else { S.reqs = []; hideReq(false); stopWatch(); } if (cur === 'd-home') homeBits(); else render(); pollCtl(); });
  },
  rqno() { hideReq(true); },
  rqyes(el) { const id = el.dataset.v; hideReq(false); acts.dacc({ dataset: { v: id } }); },
  dgps() { if (S.dpos && S.dmap) S.dmap.setView([S.dpos.lat, S.dpos.lng], 16); else { toast('جارٍ تحديد موقعك…'); startWatch(); } },
  sr(el) { const x = (S.sres || [])[+el.dataset.v]; if (!x || !S.map) return; S.map.setView([+x.lat, +x.lon], 17); $('#sres').innerHTML = ''; const i = document.querySelector('form[data-form="rpick"] input[name=pick], form[data-form="rdest"] input[name=dest]'); if (i && !i.value) i.value = String(x.display_name).split('،')[0].slice(0, 100); },
  pickrole(el) { send(async () => { await API.rpc('set_role', { p_role: el.dataset.v }); await loadMe(); }); },
  retry() { send(async () => { await loadMe(); }); },
  theme() { const nx = { auto: 'light', light: 'dark', dark: 'auto' }[themeMode()]; try { localStorage.setItem(THEME_KEY, nx); } catch (e) {} applyTheme(nx); render(); },
  async push() { try { if (S.push === 'on') { await disablePush(); toast('تم إيقاف إشعارات الهاتف'); } else { await enablePush(); toast('تم تفعيل إشعارات الهاتف'); } } catch (e) { toast(pushMsg(e), true); } pushRefresh(); },
  async pushyes() { acts.close(); try { await enablePush(); toast('تم تفعيل الإشعارات'); } catch (e) { toast(pushMsg(e), true); } },
  nopen(el) { openTarget({ url: el.dataset.v }); },
  rveh(el) { S.ride.veh = el.dataset.v; go('r-price'); },
  rnext() { if (!S.ride.plat || !S.ride.dlat) return toast('حدّد موقع الانطلاق والوجهة أولًا', true); go('r-veh'); },
  gps() { if (!navigator.geolocation || !S.map) return toast('تحديد الموقع غير متاح', true); navigator.geolocation.getCurrentPosition(p => S.map && S.map.setView([p.coords.latitude, p.coords.longitude], 17), () => toast('اسمح للتطبيق بالوصول لموقعك', true), { enableHighAccuracy: true, timeout: 10000 }); },
  rconfirm() { if (!S.user) { toast('سجّل الدخول أولًا', true); return go('login'); } send(async () => { try { await API.requestRide({ ...S.ride, expected: S.quote && S.quote.total }); } catch (e) { if (String(e.message).includes('price_changed')) await ENTER['r-price'](); throw e; } await syncRider(); pollCtl(); }); },
  rcancel() { if (!S.rd) return go('r-home', true); send(async () => { await API.rpc('cancel_ride', { p_id: S.rd.id }); S.rd = null; toast('تم إلغاء الطلب'); go('r-home', true); }); },
  rskip() { send(async () => { await API.rateDriver({ id: S.rd.id, stars: 0 }); S.rd = null; go('r-home', true); }); },
  dacc(el) { send(async () => { S.dr = await API.rpc('accept_ride', { p_id: el.dataset.v }); S.reqs = []; go('d-cur', true); }); },
  dadv(el) { send(async () => { const r = await API.rpc('driver_advance', { p_id: S.dr.id, p_to: el.dataset.v }); if (el.dataset.v === 'completed') { S.dr = null; S.dstat = undefined; toast('تم إنهاء الرحلة'); go('d-home', true); } else { S.dr = r.ride; render(); } }); },
  drel() { send(async () => { await API.rpc('driver_release', { p_id: S.dr.id }); S.dr = null; toast('تم تحريرك من الرحلة'); go('d-req', true); }); },
  star(el) { S.stars = +el.dataset.v; document.querySelectorAll('.stars button').forEach((b, i) => b.classList.toggle('on', i < S.stars)); }
};

/* ===== الأحداث ===== */
document.addEventListener('click', e => {
  const a = e.target.closest('[data-act]'); if (a && acts[a.dataset.act]) { e.preventDefault(); return acts[a.dataset.act](a); }
  const g = e.target.closest('[data-go]'); if (g) return go(g.dataset.go);
  if (e.target.closest('[data-back]')) back();
  if (e.target.id === 'sheet') acts.close();
});
document.addEventListener('change', e => {
  const i = e.target; if (i.name !== 'avatar' || !i.files || !i.files[0]) return;
  const f = i.files[0]; if (!/^image\/(jpeg|png|webp)$/.test(f.type)) return toast('اختر صورة JPG أو PNG', true);
  S.newAvatar = f; $('#avprev').innerHTML = `<img class="av big" src="${URL.createObjectURL(f)}" alt="">`;
});
document.addEventListener('submit', e => {
  const f = e.target.closest('[data-form]'); if (!f) return;
  e.preventDefault(); forms[f.dataset.form](f);
});
document.addEventListener('change', e => {
  const i = e.target;
  if (i.type !== 'file' || !i.files[0]) return;
  const lb = i.closest('.up');
  if (i.name === 'photo') {
    S.photoFile = i.files[0];
    S.reg.photo = URL.createObjectURL(i.files[0]);
    $('#avatar').innerHTML = `<img src="${S.reg.photo}" alt="">`;
  } else if (lb) { lb.classList.add('has'); lb.querySelector('span').textContent = i.files[0].name; }
});

/* ===== البداية ===== */
const RECOVERY = /type=recovery/.test(location.hash);
let resolveReady; const READY = new Promise(r => { resolveReady = r; });
function resetSession() {
  if (S.avatar) { try { URL.revokeObjectURL(S.avatar); } catch (e) {} }
  S.user = null; S.reg = {}; S.photoFile = null; S.prof = null; S.hasDriver = false; S.avatar = null; S.me = null; S.notifs = { unread: 0, items: [] }; nLast = null; chatLast = 0; S.newAvatar = null; S.rd = null; S.dr = null; S.reqs = []; S.hist = undefined; S.dstat = undefined; stopPoll(); drvLoaded = false; drvPromise = null;
  S.drv = { account: 'غير مسجّل الدخول', approval: 'لم يُقدَّم الطلب', vehicle: 'غير مسجّلة', approved: false, vehApproved: false, online: false };
  stack.length = 0; go('home', true);
}
async function loadDriver() {
  try {
    const p = await API.myDriver(); if (!p) return;
    S.prof = p; S.hasDriver = true;
    S.reg.submitted = p.approval_status !== 'rejected'; S.reg.vtype = p.vehicle_type; S.reg.rel = p.relation;
    S.drv.approval = ST[p.approval_status] || p.approval_status; S.drv.vehicle = ST[p.vehicle_status] || p.vehicle_status;
    S.drv.approved = p.approval_status === 'approved'; S.drv.vehApproved = p.vehicle_status === 'approved';
    S.drv.online = !!p.is_online && S.drv.approved && S.drv.vehApproved;
    if (cur === 'home') go('d-home', true); else if (cur.startsWith('d-') || cur === 'profile') render();
    if (p.photo_path && !S.avatar) {
      try {
        const { data } = await db.storage.from('driver-docs').download(p.photo_path);
        if (data) { S.avatar = URL.createObjectURL(data); if (cur === 'profile' || cur === 'd-me') render(); }
      } catch (e) {}
    }
  } catch (e) { console.error('loadDriver', e); }
}
const redraw = () => { try { $('#view').innerHTML = routes[cur](); } catch (e) { console.error(e); } };
async function load(fn, a, k) { S[k] = undefined; try { S[k] = await API.rpc(fn, a); } catch (e) { S[k] = k === 'hist' ? [] : null; console.error(e); } if (ENTER[cur]) redraw(); }
const ENTER = { 'r-price': async () => { S.quote = undefined; S.quoteErr = ''; try { S.quote = await API.quote(S.ride); } catch (e) { S.quote = null; S.quoteErr = errMsg(e); } if (cur === 'r-price') redraw(); }, 'r-pick': () => initMap('pick'), 'r-dest': () => initMap('dest'), 'r-hist': () => load('my_rides', { p_role: 'r' }, 'hist'), 'd-trips': () => load('my_rides', { p_role: 'd' }, 'hist'), 'd-rate': () => load('my_rides', { p_role: 'd' }, 'hist'), 'd-earn': () => load('driver_stats', {}, 'dstat') };
function initMap(kind) {
  const el = $('#pmap'); if (!el) return;
  if (S.map) { try { S.map.remove(); } catch (e) {} S.map = null; }
  if (typeof L === 'undefined') { el.insertAdjacentHTML('afterbegin', '<p class="note" style="padding:70px 16px;text-align:center">تعذّر تحميل الخريطة، تأكد من الاتصال بالإنترنت</p>'); return; }
  const lat = S.ride[kind === 'pick' ? 'plat' : 'dlat'], lng = S.ride[kind === 'pick' ? 'plng' : 'dlng'];
  S.map = L.map(el).setView(lat ? [lat, lng] : [S.cfg.lat || 31.4042, S.cfg.lng || 30.417], 16);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap' }).addTo(S.map);
}
ENTER.chat = () => { chatLast = 0; pullChat(true); clearInterval(chatT); chatT = setInterval(pullChat, 2500); };
ENTER.notif = async () => { try { S.notifs = await API.rpc('my_notifications', { p_limit: 40 }); if (cur === 'notif') redraw(); await API.rpc('read_notifications'); S.notifs.unread = 0; document.querySelectorAll('.nb').forEach(b => { b.hidden = true; }); } catch (e) {} };
ENTER['d-notif'] = ENTER['r-notif'] = ENTER.notif;
ENTER.account = ENTER['d-me'] = ENTER['r-prof'] = ENTER.profile = () => pushRefresh();
ENTER['d-home'] = () => { initDMap(); homeBits(); loadStats(); };
ENTER['r-live'] = () => initLMap('rider');
ENTER['d-cur'] = () => initLMap('driver');
const _r0 = render; render = function () { if (cur !== 'd-home') killMap('dmap'); if (cur !== 'r-live' && cur !== 'd-cur') { killMap('lmap'); S.lcar = null; } if (cur !== 'chat') { clearInterval(chatT); chatT = null; } if (S.map && cur !== 'r-pick' && cur !== 'r-dest') { try { S.map.remove(); } catch (e) {} S.map = null; } _r0(); const e = ENTER[cur]; if (e) e(); };
let pollT = null, lastSig = '';
function stopPoll() { clearInterval(pollT); pollT = null; lastSig = ''; }
async function loadCfg() { try { S.cfg = (await API.rpc('app_config')) || { fares: {} }; CONFIG.riderEnabled = S.cfg.rider_enabled === true; if (cur === 'r-gate' && riderOpen()) go('r-home', true); } catch (e) { console.error('cfg', e); } }
async function syncRider() {
  const r = await API.rpc('my_ride'); let sig = 'null', dl = null; if (r) { const { dloc, ...rest } = r; dl = dloc; sig = JSON.stringify(rest); } S.rd = r;
  const want = !r ? null : r.status === 'requested' ? 'r-search' : r.status === 'completed' ? 'r-end' : 'r-live';
  if (want && cur !== want && !(want === 'r-end' && cur === 'r-rate')) go(want, true);
  else if (want && sig !== lastSig && cur === want) render();
  else if (!r && ['r-search', 'r-live', 'r-end'].includes(cur)) { go('r-home', true); toast('انتهى الطلب'); }
  if (dl && cur === 'r-live') moveCar(dl);
  lastSig = sig;
}
async function syncDriver() {
  if (S.dr) {
    const r = await API.rpc('driver_ride');
    if (!r) { S.dr = null; toast('تم إلغاء الرحلة من الراكب', true); go('d-req', true); } else if (JSON.stringify(r) !== JSON.stringify(S.dr)) { S.dr = r; if (cur === 'd-cur') render(); }
    return;
  }
  if (!S.drv.online) return;
  const q = await API.rpc('open_requests');
  if (JSON.stringify(q) !== JSON.stringify(S.reqs)) { S.reqs = q; if (cur === 'd-req') render(); else if (cur === 'd-home') paintReqs(); }
  if (S.reqShown && !q.some(x => x.id === S.reqShown)) hideReq(false);
  if (!S.reqShown && cur !== 'd-cur') { const nx = q.find(x => !ignored.has(x.id)); if (nx) offerReq(nx); }
}
async function startSession() {
  await loadCfg(); pollCtl();
  try {
    if (riderOpen()) await syncRider();
    if (S.hasDriver && S.drv.online) { startWatch(); const r = await API.rpc('driver_ride'); if (r) { S.dr = r; go('d-cur', true); } }
  } catch (e) { console.error('session', e); }
  offerPush(); pushRefresh();
  const g = new URLSearchParams(location.search).get('go'); if (g) { try { history.replaceState(null, '', location.pathname); } catch (e) {} openTarget({ url: g }); }
}
function landing() {
  if (!S.user) return 'welcome';
  if (!S.me) return 'wait';
  if (!S.me.phone) return 'complete';
  if (!S.me.role) return 'rolepick';
  return S.me.role === 'driver' ? 'd-home' : 'r-home';
}
async function loadMe() {
  try { S.me = await API.rpc('my_profile'); S.meErr = false; S.meMsg = ''; } catch (e) { console.error('me', e); S.meErr = true; S.meMsg = String((e && (e.message || e.code)) || ''); }
  if (['home', 'welcome', 'login', 'signup', 'verify', 'forgot', 'wait', 'complete', 'rolepick'].includes(cur)) go(landing(), true);
}
const chatRide = () => S.me && S.me.role === 'driver' ? S.dr : S.rd;
let chatT = null, chatLast = 0;
async function pullChat(first) {
  const r = chatRide(); if (!r || cur !== 'chat') return;
  try { const ms = await API.rpc('get_messages', { p_ride: r.id, p_after: chatLast }); if (ms.length) { chatLast = ms[ms.length - 1].id; paintMsgs(ms, first); } else if (first) paintMsgs([], true); } catch (e) { console.error(e); }
}
function paintMsgs(ms, first) {
  const c = $('#cmsgs'); if (!c) return;
  if (!ms.length && !c.children.length) c.innerHTML = '<p class="note c" style="margin:auto">ابدأ المحادثة، وهتوصله رسالتك فورًا.</p>';
  if (ms.length) { const n = c.querySelector('.note'); if (n) n.remove(); }
  ms.forEach(m => c.insertAdjacentHTML('beforeend', `<div class="msg ${m.mine ? 'me' : ''}"><span>${esc(m.body)}</span><small>${new Date(m.at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</small></div>`));
  c.scrollTop = c.scrollHeight; if (!first && ms.some(m => !m.mine)) beep(660, 0.1, 1);
}
const NI = { ride_request: 'car', ride: 'route', chat: 'chat', account: 'user' };
let nLast = null;
async function syncNotifs() {
  const n = await API.rpc('my_notifications', { p_limit: 15 }); S.notifs = n;
  const top = n.items.length ? n.items[0].id : 0;
  if (nLast === null) nLast = top;
  else if (top > nLast) { n.items.filter(x => x.id > nLast && !x.read && x.kind !== 'ride_request').reverse().forEach(banner); nLast = top; }
  document.querySelectorAll('.nb').forEach(b => { b.hidden = !n.unread; b.textContent = n.unread > 9 ? '9+' : n.unread; });
}
function banner(x) {
  let b = $('#nbanner'); if (!b) { b = document.createElement('button'); b.id = 'nbanner'; b.className = 'nbanner'; document.body.appendChild(b); }
  b.innerHTML = `<span class="ni">${ic(NI[x.kind] || 'bell')}</span><span class="fx"><b>${esc(x.title)}</b><small>${esc(x.body)}</small></span>`;
  b.dataset.u = (x.data && x.data.url) || ''; b.classList.add('on'); beep(740, 0.12, 2);
  try { navigator.vibrate && navigator.vibrate(120); } catch (e) {}
  clearTimeout(banner.t); banner.t = setTimeout(() => b.classList.remove('on'), 4500);
}
document.addEventListener('click', e => { const b = e.target.closest('#nbanner'); if (b) { b.classList.remove('on'); openTarget({ url: b.dataset.u }); } });
function openTarget(d) { const u = d && d.url; if (['chat', 'r-live', 'r-end', 'd-req', 'd-home', 'd-cur', 'notif'].includes(u)) go(u); }
const b64u = t => { const r = atob((t + '='.repeat((4 - t.length % 4) % 4)).replace(/-/g, '+').replace(/_/g, '/')); return Uint8Array.from([...r].map(c => c.charCodeAt(0))); };
async function pushState() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) return /iphone|ipad/i.test(navigator.userAgent) ? 'ios' : 'unsupported';
  if (!S.cfg.vapid) return 'noconfig'; if (Notification.permission === 'denied') return 'denied';
  try { const reg = await navigator.serviceWorker.ready; return (await reg.pushManager.getSubscription()) && Notification.permission === 'granted' ? 'on' : 'off'; } catch (e) { return 'off'; }
}
const PLBL = { on: 'مفعّلة', off: 'غير مفعّلة', denied: 'محظورة من المتصفح', unsupported: 'غير مدعومة', ios: 'ثبّت التطبيق أولًا', noconfig: 'غير متاحة حاليًا' };
async function pushRefresh() { S.push = await pushState(); const e = $('#pushs'); if (e) e.textContent = PLBL[S.push] || ''; }
async function enablePush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) throw 'unsupported';
  if (!S.cfg.vapid) throw 'noconfig';
  if ((await Notification.requestPermission()) !== 'granted') throw 'denied';
  const reg = await navigator.serviceWorker.ready; let sub = await reg.pushManager.getSubscription();
  if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64u(S.cfg.vapid) });
  const j = sub.toJSON(); await API.rpc('save_push_sub', { p_endpoint: j.endpoint, p_p256dh: j.keys.p256dh, p_auth: j.keys.auth });
}
async function disablePush() { const reg = await navigator.serviceWorker.ready, sub = await reg.pushManager.getSubscription(); if (sub) { const ep = sub.endpoint; await sub.unsubscribe(); await API.rpc('drop_push_sub', { p_endpoint: ep }); } }
const pushMsg = e => ({ denied: 'تم رفض الإذن، فعّله من إعدادات المتصفح', unsupported: 'جهازك لا يدعم الإشعارات', noconfig: 'الإشعارات لم تُفعَّل من الإدارة بعد' }[e] || errMsg(e));
async function offerPush() {
  try {
    if (!S.cfg.vapid || !('Notification' in window) || !('PushManager' in window)) return;
    if (Notification.permission === 'granted') { enablePush().catch(() => {}); return; }
    if (Notification.permission !== 'default' || localStorage.getItem('sekka_push_asked')) return;
    localStorage.setItem('sekka_push_asked', '1');
    setTimeout(() => { const s = $('#sheet'); s.innerHTML = `<div><h3>فعّل الإشعارات</h3><p>لتصلك ${S.me && S.me.role === 'driver' ? 'الطلبات الجديدة' : 'تحديثات رحلتك ورسائل السائق'} حتى لو التطبيق مقفول.</p><button class="btn" data-act="pushyes">تفعيل الإشعارات</button><button class="btn sec" data-act="close">لاحقًا</button></div>`; s.hidden = false; }, 1500);
  } catch (e) {}
}
const tiles = m => L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap' }).addTo(m);
const mkIcon = k => L.divIcon({ className: 'mkw', html: `<div class="mk ${k}">${k === 'car' ? ic('car') : k === 'flag' ? ic('flag') : ''}</div>`, iconSize: [38, 38], iconAnchor: [19, k === 'car' || k === 'me' ? 19 : 38] });
const killMap = k => { if (S[k]) { try { S[k].remove(); } catch (e) {} S[k] = null; } };
let watchId = null, lastPing = 0;
function onPos(p, center) {
  S.dpos = { lat: p.coords.latitude, lng: p.coords.longitude };
  if (S.dmark) { S.dmark.setLatLng([S.dpos.lat, S.dpos.lng]); if (center && S.dmap) S.dmap.setView([S.dpos.lat, S.dpos.lng], 16); }
  if (S.lmap && cur === 'd-cur') moveCar(S.dpos);
  const t = Date.now(); if ((S.drv.online || S.dr) && t - lastPing > 6000) { lastPing = t; API.rpc('driver_ping', { p_lat: S.dpos.lat, p_lng: S.dpos.lng }).catch(() => {}); }
}
function startWatch() { if (watchId !== null || !navigator.geolocation) return; watchId = navigator.geolocation.watchPosition(p => onPos(p, !S.dpos), e => { if (e.code === 1) toast('فعّل الموقع عشان تستقبل الطلبات', true); }, { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 }); }
function stopWatch() { if (watchId !== null) { try { navigator.geolocation.clearWatch(watchId); } catch (e) {} watchId = null; } }
function initDMap() {
  const el = $('#dmap'); if (!el) return; killMap('dmap');
  if (typeof L === 'undefined') { el.innerHTML = '<p class="note c" style="padding:90px 16px">تعذّر تحميل الخريطة، تأكد من الاتصال</p>'; return; }
  const c = S.dpos ? [S.dpos.lat, S.dpos.lng] : [S.cfg.lat || 31.4042, S.cfg.lng || 30.417];
  S.dmap = L.map(el, { zoomControl: false }).setView(c, 15); tiles(S.dmap); S.dmark = L.marker(c, { icon: mkIcon('me') }).addTo(S.dmap);
  if (!S.dpos && navigator.geolocation) navigator.geolocation.getCurrentPosition(p => onPos(p, true), () => {}, { enableHighAccuracy: true, timeout: 8000 });
}
function initLMap(who) {
  const el = $('#lmap'); killMap('lmap'); S.lcar = null; const r = who === 'rider' ? S.rd : S.dr; if (!el || !r || !r.plat) return;
  if (typeof L === 'undefined') { el.innerHTML = '<p class="note c" style="padding:80px 16px">تعذّر تحميل الخريطة</p>'; return; }
  const pa = [r.plat, r.plng], pb = [r.dlat, r.dlng], pts = [pa, pb];
  S.lmap = L.map(el, { zoomControl: false }); tiles(S.lmap);
  L.polyline([pa, pb], { color: '#10b981', weight: 4, dashArray: '6 8' }).addTo(S.lmap); L.marker(pa, { icon: mkIcon('pin') }).addTo(S.lmap); L.marker(pb, { icon: mkIcon('flag') }).addTo(S.lmap);
  const d = who === 'rider' ? r.dloc : S.dpos; if (d) { moveCar(d); pts.push([d.lat, d.lng]); }
  S.lmap.fitBounds(pts, { padding: [40, 40], maxZoom: 16 });
}
function moveCar(p) { if (!S.lmap || !p) return; if (!S.lcar) S.lcar = L.marker([p.lat, p.lng], { icon: mkIcon('car') }).addTo(S.lmap); else S.lcar.setLatLng([p.lat, p.lng]); }
function homeBits() {
  const e = $('#dstate'); if (e) e.innerHTML = `<span class="live ${S.drv.online ? 'on' : ''}"><i></i>${S.drv.online ? 'أنت متصل الآن' : 'أنت غير متصل'}</span><button class="switch ${S.drv.online ? 'on' : ''}" data-act="online" role="switch" aria-checked="${S.drv.online}" aria-label="حالة الاتصال"></button>`;
  paintReqs();
}
function paintReqs() { const e = $('#dreqs'); if (e) e.innerHTML = reqsHtml(); }
async function loadStats() { try { S.dstat = await API.rpc('driver_stats'); } catch (e) { return; } const e = $('#dstats'); if (e) e.innerHTML = statsHtml(); }
const ignored = new Set(); let reqT = null;
function hideReq(ign) { clearInterval(reqT); const o = $('#reqo'); if (o) o.classList.remove('on'); if (ign && S.reqShown) ignored.add(S.reqShown); S.reqShown = null; }
function offerReq(r) {
  S.reqShown = r.id; let o = $('#reqo');
  if (!o) { o = document.createElement('div'); o.id = 'reqo'; o.className = 'reqo'; o.setAttribute('role', 'alertdialog'); o.setAttribute('aria-label', 'طلب جديد'); document.body.appendChild(o); }
  let c = 25;
  o.innerHTML = `<div class="reqc"><div class="row"><h2>طلب مشوار جديد</h2><span class="cd" id="rcd">${c}</span></div><div class="ln"><i class="d1"></i><span><small>من</small><b>${esc(r.pickup)}</b></span></div><div class="ln"><i class="d2"></i><span><small>إلى</small><b>${esc(r.dest)}</b></span></div><div class="trio"><div><small>المسافة</small><b>${esc(r.km)} كم</b></div><div><small>الزمن</small><b>${esc(r.mins)} د</b></div><div class="fare"><small>الأجرة كاش</small><b>${esc(r.fare)} ج</b></div></div><div class="row"><button class="btn sec" data-act="rqno">رفض</button><button class="btn" data-act="rqyes" data-v="${esc(r.id)}">قبول</button></div></div>`;
  requestAnimationFrame(() => o.classList.add('on')); beep(880, 0.18, 3); try { navigator.vibrate && navigator.vibrate([300, 120, 300, 120, 300]); } catch (e) {}
  clearInterval(reqT); reqT = setInterval(() => { c--; const e = $('#rcd'); if (e) e.textContent = c; if (c > 0 && c % 8 === 0) beep(880, 0.15, 2); if (c <= 0) hideReq(true); }, 1000);
}
let polling = false;
async function runPoll() {
  if (polling) return; polling = true;
  try { if (S.rd || ['r-search', 'r-live', 'r-end'].includes(cur)) await syncRider(); if (S.drv.online || S.dr) await syncDriver(); await syncNotifs(); } catch (e) { console.error('poll', e); } finally { polling = false; }
}
function pollCtl() { stopPoll(); if (!S.user) return; pollT = setInterval(runPoll, 3500); runPoll(); }
document.addEventListener('visibilitychange', () => { if (!document.hidden && S.user && pollT) runPoll(); });
function afterAuth() {
  if (drvLoaded) return drvPromise;
  drvLoaded = true;
  drvPromise = new Promise(r => setTimeout(r, 0)).then(loadMe).then(loadDriver).then(startSession);
  return drvPromise;
}
function boot() {
  let seen = false;
  try { seen = sessionStorage.getItem('sekka_splash') === '1'; } catch (e) {}
  const sp = $('#splash');
  go('home', true);
  try { history.replaceState(null, ''); } catch (e) {}
  const hideSplash = () => { sp.classList.add('out'); try { sessionStorage.setItem('sekka_splash', '1'); } catch (e) {} setTimeout(() => { sp.hidden = true; }, 700); };
  Promise.all([new Promise(r => setTimeout(r, seen ? 0 : 2200)), Promise.race([READY, new Promise(r => setTimeout(r, 4500))])]).then(hideSplash);
  if (RECOVERY) go('newpw', true);
  if (!db) { toast('تعذّر تحميل خدمة الحساب، تأكد من الاتصال بالإنترنت', true); resolveReady(); return; }
  loadCfg();
  db.auth.onAuthStateChange((event, session) => {
    if (event === 'PASSWORD_RECOVERY') { go('newpw', true); return; }
    if (session && session.user) {
      S.user = mapUser(session.user); S.drv.account = 'نشط';
      if (event === 'SIGNED_IN' && ['login', 'signup', 'verify', 'forgot', 'welcome'].includes(cur)) go('wait', true);
      afterAuth();
    } else if (event === 'SIGNED_OUT' && S.user) { resetSession(); }
  });
  db.auth.getSession().then(async ({ data, error }) => {
    if (error) throw error;
    const u = data.session && data.session.user;
    if (u) { S.user = mapUser(u); S.drv.account = 'نشط'; render(); await afterAuth(); }
  }).catch(e => console.error('Session restore error:', e)).finally(resolveReady);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', e => { if (e.data && e.data.type === 'open') openTarget(e.data.data); });
  window.addEventListener('load', () => { navigator.serviceWorker.register('./service-worker.js', { scope: './' }).catch(e => console.error('SEKKA PWA registration failed:', e)); });
}
})();
