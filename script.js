const SUPABASE_URL = "https://aawuvkpmcoahhsczryid.supabase.co";

const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_zFI5QubbX7IWzHLwzrzitA_KQT88nSL";

const db = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);
/* سِكّة | SEKKA — app.js (Frontend فقط، جاهز للربط لاحقًا بـ Supabase) */
(function () {
'use strict';

/* ===== الشعارات (مضمّنة حتى لا تحتاج رفع ملفات) ===== */
const LOGO = { splash: 'data:image/jpeg;base64,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gYUUUUAFITSE0lAxc0lFJTAU0lFJQOwtJRRmgYlJS0lAwooxRQAUlFFABRSUUDCiiigBaWkooELS0maM0ALS5ppooAWlpKKBDqM0lLmgBc0tNpaBBRRRQIUUuabRQA+imUoNIB9JSZFJmgB9J1puaAcUAOoppNGaAFzS5FNpKAHEikNJRTAKKTNFAxSabmiigYUUZpKBhmjpRSUAFLSUUABpKDRQAUlFFAwopBRQMWkoopALmikpaYhaKKKBC0UmaWgAFOFNFGaAHUZpKKAFzRSClzQIUGlptLQIWikzRmgLC0UZozQFgooooAKKKKACiiigQuaQmikNA7BmkopaBiUUUUgCikJooGGKM0hNFMAooooAKSiigAoopKBhSGiigYUUUUAFFFFABRQKKAHUU0UtAhaM0UUCFopKUUAFKDSGigBTSUUUAKTxQDSUtACilpKTNIQ6jNNpaAFBozSA0UwFJoBpKM0gFopDRmmAZoBpKKQC0UGimAUgopCaBimkJoooAKKSigYtJRRQIKSiigYUlFFAwooopAFFJRTAKToaWigYUtJS5oEFFFFAC0tNpaBC0CkpaADNLSUUCFopKWgAooooAUGikpM0AOopAaM0ALRSZozQApozSZooAXNFJRQAtGaSigB2aTNJRQAlGKWigAopKKACiikzQMWkpOtLQAUlFFAwpKWkoAWiikoAKKKKBhiiiigApRSUUCFooozQAUUhNLSAUUUlFMLC0tIKKBC0UmaWgAzRS0lAhaKSjNABiiijNAC0UUUAFFJS0AFFFFABRRmkzQAtBpKKACiiigAopKKBhmikNFAwooopAFFJS0AJRRRTAKKKKACiiigYlLSUUALRRRQIKOaKKBhS0lLQIKKKKACiiikAtFJRTAdSZozRQIWikooAWikooAWiiigQUUE0UAFFJmloAKKTNLQMKKSigAooooAKQ0UUhhRRRQAUUUUwCkoooAKKKKACiikoGBNFJzRQMKWkoHWgGKKWk70uaBBRRRQAUUUUCFzRSUUALRSUtABRRRQAUUUUAFFFFIApaSigBaKSigBaM0lFAWFopKKAFBo5pKM0AFFFFMAoopKAFopM0UAFFFFABRRRQAUUUUAFFJRQMKKKQ0AKaKQUUFAaSiloEJS5pKWgBaWkpDQIdSCgUUALRRRQAUUUUCClpKKAFopKXNABRRmigAooooAKKKBQAUUUUAFFFFABRRRQAUUUUAFBozSUAFFFFAwooooAKKKSgAooooAKCaKQ0BYKKSigYtFFFAB2pKKSgYtFFLQAmaBRRQAopabmnDpQIKWkyKM0CFoppOaXNAWFopM0uaACiiigAooooEFFFFAC5ozSUUAFLmkooAXNGaSigAooooAKKKKACiiigAoozSZoGLSZozSZoAWik3UoPFAWDNITSHrRQOwZoo6UUDCjNJRQAtFFFAH/2Q==', icon: 'data:image/jpeg;base64,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' };

/* ===== الإعدادات =====
   riderEnabled: لا يكفي تغييرها من الواجهة. عند ربط Supabase تُقرأ من جدول إعدادات
   في الخادم، ويجب أن تتحقق سياسات RLS من إتاحة طلب الرحلات للراكب أيضًا. */
const CONFIG = { riderEnabled: false };

/* ===== طبقة الربط بالخادم =====
   كل دالة هنا تُستبدل لاحقًا باستدعاء Supabase. لا توجد مفاتيح سرّية في هذا الملف. */
const API = {
  _() {
    return Promise.reject(new Error('NOT_CONNECTED'));
  },

  async signUp(d) {
    const { data, error } = await db.auth.signUp({
      email: d.email,
      password: d.password,
      options: {
        emailRedirectTo: 'https://sekkaofficial.github.io/sekka-platform/',
        data: { display_name: d.name }
      }
    });
    if (error) throw error;
    return data;
  },

  async signIn(d) {
    const { data, error } = await db.auth.signInWithPassword({
      email: d.email,
      password: d.password
    });
    if (error) throw error;
    return data.user;
  },

  async resetPassword(d) {
    const { error } = await db.auth.resetPasswordForEmail(d.email, {
      redirectTo: 'https://sekkaofficial.github.io/sekka-platform/'
    });
    if (error) throw error;
  },

  async verifyEmail() {
    const { data, error } = await db.auth.getSession();
    if (error) throw error;
    if (!data.session) throw new Error('لم يتم تأكيد البريد بعد');
    return data.session.user;
  },

  async resendCode(d) {
    const { error } = await db.auth.resend({
      type: 'signup',
      email: d.email
    });
    if (error) throw error;
  },

  registerDriver(d) { return this._(d); },
  setDriverOnline(v) { return this._(v); },
  submitComplaint(d) { return this._(d); },
  saveAddress(d) { return this._(d); },
  requestRide(d) { return this._(d); },
  rateDriver(d) { return this._(d); }
};

/* ===== الحالة ===== */
const S = {
  user: null,
  reg: {},
  ride: {},
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
const ic = n => `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${P[n] || ''}</svg>`;

/* ===== عناصر مساعدة للقوالب ===== */
const hdr = (t, back = true) => `<header class="hdr">${back ? `<button class="ib" data-back aria-label="رجوع">${ic('chev')}</button>` : '<span></span>'}<h1>${t}</h1><span class="ib ghost"></span></header>`;
const pill = (t, k) => `<span class="pill ${k || ''}">${t}</span>`;
const empty = (i, t, s) => `<div class="empty">${ic(i)}<b>${t}</b><span>${s || ''}</span></div>`;
const val = n => esc(S.reg[n] || '');
const fld = (label, name, type = 'text', extra = '') => `<label class="f"><span>${label}</span><input name="${name}" type="${type}" value="${val(name)}" ${extra}></label>`;
const btn = (t, go, cls = '') => `<button class="btn ${cls}" data-go="${go}">${t}</button>`;
const menu = (i, t, go) => `<button class="menu" data-go="${go}"><span class="l">${ic(i)}${t}</span>${ic('chev')}</button>`;
const mapBox = (txt) => `<div class="map"><svg viewBox="0 0 300 220" preserveAspectRatio="none"><path d="M40 180 C90 150 100 90 150 100 S230 60 262 40" fill="none" stroke="#10b981" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 10"/><circle cx="40" cy="180" r="9" fill="#064e3b"/><circle cx="262" cy="40" r="9" fill="#10b981"/></svg><p>${txt || 'تظهر الخريطة هنا عند ربط خدمة الخرائط'}</p></div>`;
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
const routes = {
  home: () => `
    <div class="brand">${logoImg}<h2>سِكّة — مشوارك أسهل</h2><p>منصة النقل المحلية في رشيد</p></div>
    <p class="welcome">أهلًا بك في سِكّة، اختر كيف تريد المتابعة</p>
    <button class="role" data-go="r-start"><span class="big">${ic('user')}</span><span><b>أنا راكب</b><span>اطلب مشوارك بسهولة</span></span></button>
    <button class="role" data-go="d-start"><span class="big">${ic('steer')}</span><span><b>أنا سائق</b><span>انضم إلى فريق سائقين سِكّة</span></span></button>
    <div class="links">${S.user ? `<button class="link" data-go="profile">ملفي الشخصي</button>` : `<button class="link" data-go="login">تسجيل الدخول</button><button class="link" data-go="signup">إنشاء حساب جديد</button>`}</div>`,

  signup: () => `${hdr('إنشاء حساب جديد')}
    <form data-form="signup" novalidate>
      ${fld('الاسم الكامل', 'name', 'text', 'required autocomplete="name"')}
      ${fld('البريد الإلكتروني', 'email', 'email', 'required dir="ltr" autocomplete="email"')}
      ${fld('كلمة المرور (8 أحرف على الأقل)', 'pw', 'password', 'required autocomplete="new-password"')}
      ${fld('تأكيد كلمة المرور', 'pw2', 'password', 'required autocomplete="new-password"')}
      <label class="chk"><input type="checkbox" name="terms"><span>أوافق على <button type="button" class="link" data-act="legal" data-v="terms">الشروط والأحكام</button> و<button type="button" class="link" data-act="legal" data-v="privacy">سياسة الخصوصية</button></span></label>
      <button class="btn" type="submit">إنشاء الحساب</button>
    </form>
    <div class="links"><span>لديك حساب؟</span><button class="link" data-go="login">تسجيل الدخول</button></div>`,

  login: () => `${hdr('تسجيل الدخول')}
    <form data-form="login" novalidate>
      ${fld('البريد الإلكتروني', 'email', 'email', 'required dir="ltr" autocomplete="email"')}
      ${fld('كلمة المرور', 'pw', 'password', 'required autocomplete="current-password"')}
      <button class="btn" type="submit">دخول</button>
    </form>
    <div class="links"><button class="link" data-go="forgot">نسيت كلمة المرور؟</button><button class="link" data-go="signup">إنشاء حساب جديد</button></div>`,

  forgot: () => `${hdr('استعادة كلمة المرور')}
    <div class="card"><p>اكتب بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور.</p>
    <form data-form="forgot" novalidate>${fld('البريد الإلكتروني', 'email', 'email', 'required dir="ltr"')}<button class="btn" type="submit">إرسال الرابط</button></form></div>
    ${btn('العودة لتسجيل الدخول', 'login', 'sec')}`,

  verify: () => `${hdr('التحقق من البريد الإلكتروني')}
    <div class="card"><p>أدخل رمز التحقق المكوّن من 6 أرقام المرسل إلى بريدك الإلكتروني.</p>
    <form data-form="verify" novalidate><label class="f"><span>رمز التحقق</span><input name="code" inputmode="numeric" maxlength="6" dir="ltr" required placeholder="------"></label>
    <button class="btn" type="submit">تأكيد</button></form>
    <button class="btn lite" data-act="resend">إعادة إرسال الرمز</button></div>`,

  profile: () => `${hdr('الملف الشخصي')}
    ${S.user ? `<div class="avatar">${ic('user')}</div>
    <div class="card"><div class="row"><span>الاسم</span><b>${esc(S.user.name)}</b></div><div class="row"><span>البريد الإلكتروني</span><b dir="ltr">${esc(S.user.email)}</b></div></div>
    <button class="btn sec" data-act="logout">${ic('out')} تسجيل الخروج</button>`
    : `<div class="card">${empty('user', 'أنت غير مسجّل الدخول', 'سجّل الدخول لعرض بيانات حسابك')}${btn('تسجيل الدخول', 'login')}${btn('إنشاء حساب جديد', 'signup', 'sec')}</div>`}`,

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

  'd-home': () => `
    <div class="brand" style="padding:16px 0 4px;text-align:right;display:flex;align-items:center;gap:12px">${logoImg.replace('<img', '<img style="width:48px;height:48px;border-radius:14px"')}<div><h2 style="margin:0;font-size:1.15rem">لوحة السائق</h2><p>سِكّة — مشوارك أسهل</p></div><button class="ib" style="margin-right:auto" data-go="d-notif" aria-label="الإشعارات">${ic('bell')}</button></div>
    <div class="card"><div class="row"><span class="l">${ic('wallet').replace('wallet', '')}<b>استقبال الرحلات</b></span><button class="switch ${S.drv.online ? 'on' : ''}" data-act="online" role="switch" aria-checked="${S.drv.online}" aria-label="حالة الاتصال"></button></div>
      ${driverGate() ? `<p class="note">${ic('lock').replace('class="ic"', 'class="ic" style="width:14px;height:14px;vertical-align:-2px"')} لا يمكن تفعيل استقبال الرحلات قبل اعتماد حسابك ومركبتك.</p>` : ''}</div>
    <div class="grid2">
      <div class="stat"><small>حالة الحساب</small>${pill(S.drv.account, S.user ? 'ok' : 'off')}</div>
      <div class="stat"><small>اعتماد السائق</small>${pill(S.drv.approval, S.drv.approved ? 'ok' : 'wait')}</div>
      <div class="stat"><small>حالة المركبة</small>${pill(S.drv.vehicle, S.drv.vehApproved ? 'ok' : 'wait')}</div>
      <div class="stat"><small>حالة الاتصال</small>${pill(S.drv.online ? 'متصل' : 'غير متصل', S.drv.online ? 'ok' : 'off')}</div></div>
    <div class="card"><h3>خطوات تفعيل حسابك</h3><ol class="steps">
      <li><span class="dot ${S.user ? 'done' : ''}">${S.user ? '✓' : 1}</span>إنشاء حساب وتسجيل الدخول</li>
      <li><span class="dot ${S.reg.submitted ? 'done' : ''}">${S.reg.submitted ? '✓' : 2}</span>إكمال بيانات السائق والمركبة والمستندات</li>
      <li><span class="dot ${S.drv.approved ? 'done' : ''}">${S.drv.approved ? '✓' : 3}</span>مراجعة الإدارة واعتماد الحساب والمركبة</li></ol>
      ${S.reg.submitted ? '' : btn('أكمل التسجيل كسائق', 'd-reg1')}</div>
    <div class="card" style="padding:6px 14px">${menu('route', 'الرحلة الحالية', 'd-cur')}${menu('star', 'التقييمات', 'd-rate')}${menu('bell', 'الإشعارات', 'd-notif')}${menu('user', 'الملف الشخصي', 'profile')}</div>`,

  'd-req': () => `${hdr('الطلبات الجديدة', false)}<div class="card">${empty('list', 'لا توجد طلبات جديدة', driverGate() ? 'تظهر الطلبات هنا بعد اعتماد حسابك ومركبتك وتفعيل الاتصال.' : 'فعّل الاتصال لتصلك الطلبات القريبة منك.')}</div>`,
  'd-cur': () => `${hdr('الرحلة الحالية')}<div class="card">${empty('route', 'لا توجد رحلة جارية', 'ستظهر تفاصيل الرحلة هنا عند قبولك لطلب.')}</div>${btn('الطلبات الجديدة', 'd-req', 'sec')}`,
  'd-trips': () => `${hdr('سجل الرحلات', false)}<div class="card">${empty('clock', 'لا توجد رحلات سابقة', 'ستجد هنا رحلاتك المكتملة بعد أول رحلة.')}</div>`,
  'd-earn': () => `${hdr('الأرباح والعمولات', false)}
    <div class="grid2"><div class="stat"><small>إجمالي الأرباح</small><b>—</b></div><div class="stat"><small>عمولة سِكّة</small><b>—</b></div></div>
    <div class="card">${empty('wallet', 'لا توجد أرباح بعد', 'تُعرض الأرباح والعمولات هنا بعد إتمام الرحلات، وتُحدَّد نسبة العمولة من إدارة سِكّة.')}</div>`,
  'd-rate': () => `${hdr('التقييمات')}<div class="card">${empty('star', 'لا توجد تقييمات بعد', 'تظهر تقييمات الركاب لك هنا بعد رحلاتك.')}</div>`,
  'd-notif': () => `${hdr('الإشعارات')}<div class="card"><div class="row"><span class="l">${ic('bell')}<span>أكمل بيانات التسجيل ليتم اعتماد حسابك ومركبتك.</span></span></div></div>`,
  'd-me': () => `${hdr('حسابي', false)}${S.user ? `<div class="avatar">${S.reg.photo ? `<img src="${S.reg.photo}" alt="">` : ic('user')}</div><p class="welcome">${esc(S.user.name)}</p>` : ''}
    <div class="card" style="padding:6px 14px">${menu('user', 'الملف الشخصي', 'profile')}${menu('steer', 'تسجيل بيانات السائق', 'd-reg1')}${menu('star', 'التقييمات', 'd-rate')}${menu('bell', 'الإشعارات', 'd-notif')}${menu('help', 'المساعدة والشكاوى', 'help')}
    <button class="menu" data-go="home"><span class="l">${ic('swap')}تغيير نوع المستخدم</span>${ic('chev')}</button>
    ${S.user ? `<button class="menu" data-act="logout"><span class="l">${ic('out')}تسجيل الخروج</span>${ic('chev')}</button>` : menu('lock', 'تسجيل الدخول', 'login')}</div>`,

  /* ----- الراكب (واجهة جاهزة ومقفولة عن الاستخدام العام) ----- */
  'r-gate': () => `${hdr('خدمة الركاب', false)}<div class="card" style="margin-top:40px">${empty('clock', 'خدمة الركاب ستتوفر قريبًا في رشيد', 'نعمل على تجهيز الخدمة لتصلك بأفضل صورة. يمكنك الانضمام إلينا كسائق من الصفحة الرئيسية.')}</div>${btn('العودة إلى الصفحة الرئيسية', 'home')}`,
  'r-start': () => routes['r-home'](),
  'r-home': () => `<div class="brand" style="padding:16px 0 4px;text-align:right">${logoImg.replace('<img', '<img style="width:48px;height:48px;border-radius:14px"')}<h2 style="font-size:1.2rem">إلى أين تريد الذهاب؟</h2></div>
    ${mapBox()}
    <div class="card" style="padding:6px 14px">${menu('pin', S.ride.pick ? esc(S.ride.pick) : 'موقع الانطلاق', 'r-pick')}${menu('route', S.ride.dest ? esc(S.ride.dest) : 'الوجهة', 'r-dest')}</div>
    ${btn('اختيار نوع المركبة', 'r-veh')}`,
  'r-pick': () => `${hdr('موقع الانطلاق')}${mapBox('حدّد موقعك على الخريطة')}<form data-form="rpick" novalidate>${fld('عنوان الانطلاق', 'pick', 'text', 'required')}<button class="btn" type="submit">تأكيد الانطلاق</button></form>`,
  'r-dest': () => `${hdr('تحديد الوجهة')}${mapBox('حدّد وجهتك على الخريطة')}<form data-form="rdest" novalidate>${fld('عنوان الوجهة', 'dest', 'text', 'required')}<button class="btn" type="submit">تأكيد الوجهة</button></form>`,
  'r-veh': () => `${hdr('اختر نوع المركبة')}<div class="vgrid" style="grid-template-columns:1fr">${['tuktuk', 'taxi', 'car'].map(k => `<button class="role" style="margin:0" data-act="rveh" data-v="${k}"><span class="big">${ic(k === 'tuktuk' ? 'tuk' : k)}</span><span><b>${VT[k]}</b><span>اختر ${VT[k]} لمشوارك</span></span></button>`).join('')}</div>`,
  'r-price': () => `${hdr('تأكيد الطلب')}<div class="card"><div class="row"><span>من</span><b>${esc(S.ride.pick || '—')}</b></div><div class="row"><span>إلى</span><b>${esc(S.ride.dest || '—')}</b></div><div class="row"><span>المركبة</span><b>${VT[S.ride.veh] || '—'}</b></div><div class="row"><span>السعر</span><b>يُحسب من الخادم</b></div></div><p class="note">يظهر السعر النهائي قبل التأكيد ولا يُعتمد سعر غير صادر من النظام.</p><button class="btn" data-act="rconfirm">تأكيد الطلب</button>`,
  'r-search': () => `${hdr('جارٍ البحث عن سائق')}<div class="card" style="text-align:center"><div class="spin"></div><b>نبحث لك عن أقرب سائق</b><p class="note">يمكنك إلغاء الطلب في أي وقت.</p></div>${btn('عرض بيانات السائق', 'r-drv', 'lite')}${btn('إلغاء الطلب', 'r-home', 'sec')}`,
  'r-drv': () => `${hdr('بيانات السائق والمركبة')}<div class="card"><div class="avatar">${ic('user')}</div><div class="row"><span>السائق</span><b>—</b></div><div class="row"><span>المركبة</span><b>—</b></div><div class="row"><span>رقم اللوحة</span><b>—</b></div><div class="row"><span>التقييم</span><b>—</b></div></div>${btn('متابعة الرحلة على الخريطة', 'r-live')}`,
  'r-live': () => `${hdr('متابعة الرحلة')}${mapBox('يظهر موقع السائق مباشرة عند ربط خدمة التتبع')}<div class="card"><div class="row"><span>حالة الرحلة</span>${pill('بانتظار السائق', 'wait')}</div></div>${btn('تأكيد بدء الرحلة برمز PIN', 'r-pin')}`,
  'r-pin': () => `${hdr('رمز بدء الرحلة')}<div class="card" style="text-align:center"><p>أعطِ هذا الرمز للسائق عند الركوب لتأكيد بدء الرحلة.</p><div class="pin"><b>•</b><b>•</b><b>•</b><b>•</b></div><p class="note">يصلك الرمز بعد قبول السائق للطلب.</p></div>${btn('إنهاء الرحلة', 'r-end')}`,
  'r-end': () => `${hdr('انتهت الرحلة')}<div class="card">${empty('check', 'وصلت إلى وجهتك', 'نتمنى أن تكون رحلتك مريحة.')}</div>${btn('قيّم السائق', 'r-rate')}`,
  'r-rate': () => `${hdr('تقييم السائق')}<form data-form="rate" class="card" novalidate><p style="text-align:center">كيف كانت رحلتك؟</p><div class="stars">${[1, 2, 3, 4, 5].map(n => `<button type="button" data-act="star" data-v="${n}" aria-label="${n} نجوم">${ic('star')}</button>`).join('')}</div><label class="f"><span>ملاحظات (اختياري)</span><textarea name="note" rows="3"></textarea></label><button class="btn" type="submit">إرسال التقييم</button></form>`,
  'r-hist': () => `${hdr('سجل الرحلات', false)}<div class="card">${empty('clock', 'لا توجد رحلات سابقة', 'ستظهر رحلاتك هنا.')}</div>`,
  'r-saved': () => `${hdr('العناوين المحفوظة', false)}<div class="card">${empty('pin', 'لا توجد عناوين محفوظة', 'أضف عنوان البيت أو العمل لتطلب أسرع.')}</div>
    <form data-form="addr" class="card" novalidate><h3>إضافة عنوان</h3>${fld('اسم العنوان (مثل: البيت)', 'label', 'text', 'required')}${fld('العنوان', 'address', 'text', 'required')}<button class="btn" type="submit">حفظ العنوان</button></form>`,
  'r-prof': () => `${hdr('الملف الشخصي', false)}${routes.profile().replace(/^[\s\S]*?<\/header>/, '')}<div class="card" style="padding:6px 14px">${menu('help', 'المساعدة والشكاوى', 'help')}<button class="menu" data-go="home"><span class="l">${ic('swap')}تغيير نوع المستخدم</span>${ic('chev')}</button></div>`,
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
  if (name.startsWith('r-') && !riderOpen()) name = 'r-gate';
  if (!routes[name]) name = 'home';
  if (!replace && cur !== name) stack.push(cur);
  cur = name; render();
}
function back() { cur = stack.pop() || 'home'; if (cur.startsWith('r-') && !riderOpen()) cur = 'home'; render(); }
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
    toast(e && e.message === 'NOT_CONNECTED' ? 'تعذّر الاتصال بالخادم حاليًا، لم يتم حفظ بياناتك. حاول مرة أخرى لاحقًا.' : 'حدث خطأ غير متوقع، حاول مرة أخرى.', true);
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
    if (!emailOk(d.email)) return fail('البريد الإلكتروني غير صحيح', f.email);
    if (d.pw.length < 8) return fail('كلمة المرور يجب ألا تقل عن 8 أحرف', f.pw);
    if (d.pw !== d.pw2) return fail('كلمتا المرور غير متطابقتين', f.pw2);
    if (!f.terms.checked) return fail('يجب الموافقة على الشروط وسياسة الخصوصية');
    send(async () => { await API.signUp({ name: d.name, email: d.email, password: d.pw }); S.user = { name: d.name, email: d.email }; go('verify'); });
  },
  login(f) {
    const d = fd(f);
    if (!emailOk(d.email)) return fail('البريد الإلكتروني غير صحيح', f.email);
    if (!d.pw) return fail('اكتب كلمة المرور', f.pw);
    send(async () => { const u = await API.signIn({ email: d.email, password: d.pw }); S.user = u; S.drv.account = 'نشط'; go('home', true); toast('أهلًا بك في سِكّة'); });
  },
  forgot(f) {
    const d = fd(f);
    if (!emailOk(d.email)) return fail('البريد الإلكتروني غير صحيح', f.email);
    send(async () => { await API.resetPassword({ email: d.email }); toast('تم إرسال رابط الاستعادة إلى بريدك'); go('login'); });
  },
  verify(f) {
    const d = fd(f);
    if (!/^\d{6}$/.test(d.code)) return fail('اكتب رمزًا من 6 أرقام', f.code);
    send(async () => { await API.verifyEmail({ code: d.code }); S.drv.account = 'نشط'; toast('تم تأكيد بريدك الإلكتروني'); go('home', true); });
  },
  reg1(f) {
    const d = fd(f);
    if (d.name.trim().length < 3) return fail('اكتب اسمك الكامل', f.name);
    if (!d.dob) return fail('حدّد تاريخ الميلاد', f.dob);
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
    Object.assign(S.reg, d); go('d-reg3');
  },
  reg3(f) {
    const ins = [...f.querySelectorAll('input[type=file]')];
    const miss = ins.find(i => !i.files.length);
    if (miss) return fail('ارفع جميع المستندات المطلوبة');
    send(async () => { await API.registerDriver(S.reg); S.reg.submitted = true; S.drv.approval = 'قيد المراجعة'; S.drv.vehicle = 'قيد المراجعة'; toast('تم إرسال طلبك للمراجعة'); go('d-home', true); });
  },
  rpick(f) { const d = fd(f); if (d.pick.trim().length < 2) return fail('اكتب موقع الانطلاق', f.pick); S.ride.pick = d.pick; back(); },
  rdest(f) { const d = fd(f); if (d.dest.trim().length < 2) return fail('اكتب الوجهة', f.dest); S.ride.dest = d.dest; back(); },
  rate(f) {
    if (!S.stars) return fail('اختر عدد النجوم');
    send(async () => { await API.rateDriver({ stars: S.stars, note: f.note.value }); toast('شكرًا لتقييمك'); go('r-home', true); });
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
  logout() { S.user = null; S.drv.account = 'غير مسجّل الدخول'; stack.length = 0; go('home', true); toast('تم تسجيل الخروج'); },
  resend() { send(async () => { await API.resendCode({}); toast('تم إرسال الرمز'); }); },
  online() {
    if (driverGate()) return toast('لا يمكن تفعيل استقبال الرحلات قبل اعتماد حسابك ومركبتك', true);
    send(async () => { await API.setDriverOnline(!S.drv.online); S.drv.online = !S.drv.online; render(); });
  },
  rveh(el) { S.ride.veh = el.dataset.v; go('r-price'); },
  rconfirm() { send(async () => { await API.requestRide(S.ride); go('r-search'); }); },
  star(el) { S.stars = +el.dataset.v; document.querySelectorAll('.stars button').forEach((b, i) => b.classList.toggle('on', i < S.stars)); }
};

/* ===== الأحداث ===== */
document.addEventListener('click', e => {
  const a = e.target.closest('[data-act]'); if (a && acts[a.dataset.act]) { e.preventDefault(); return acts[a.dataset.act](a); }
  const g = e.target.closest('[data-go]'); if (g) return go(g.dataset.go);
  if (e.target.closest('[data-back]')) back();
  if (e.target.id === 'sheet') acts.close();
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
    S.reg.photo = URL.createObjectURL(i.files[0]);
    $('#avatar').innerHTML = `<img src="${S.reg.photo}" alt="">`;
  } else if (lb) { lb.classList.add('has'); lb.querySelector('span').textContent = i.files[0].name; }
});

/* ===== البداية ===== */
function boot() {

  let seen = false;
  try { seen = sessionStorage.getItem('sekka_splash') === '1'; } catch (e) { /* التخزين غير متاح */ }
  const sp = $('#splash');
  go('home', true);
  if (seen) { sp.hidden = true; return; }
  setTimeout(() => {
    sp.classList.add('out');
    try { sessionStorage.setItem('sekka_splash', '1'); } catch (e) { /* تجاهل */ }
    setTimeout(() => { sp.hidden = true; }, 700);
  }, 2200);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
