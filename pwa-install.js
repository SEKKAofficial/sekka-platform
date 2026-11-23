/* SEKKA PWA install flow — isolated from the main app, Supabase and the service worker.
   Depends only on: pwa-install.css and ./icon-192.png (optional: falls back to a drawn badge). */
(() => {
  "use strict";

  // Never initialise twice (duplicate <script> tags, bfcache, etc.)
  if (window.__sekkaPwaInstallLoaded) return;
  window.__sekkaPwaInstallLoaded = true;

  /* ---------- Config ---------- */
  const LOGO_SRC = "./icon-192.png";                       // same path used in manifest.json
  const INSTALLED_KEY = "sekka_pwa_installed";             // permanent, never removed by this script
  const DISMISS_KEY = "sekka_install_dismissed_at";        // "ليس الآن" on the install window
  const NOTICE_DISMISS_KEY = "sekka_installed_notice_dismissed_at"; // "ليس الآن" on the success window
  const SNOOZE_MS = 24 * 60 * 60 * 1000;               // 7 days
  const PROMPT_GRACE_MS = 1200;                            // wait for beforeinstallprompt before deciding
  const SPLASH_MAX_WAIT_MS = 6000;                         // never wait for the splash longer than this
  const CLOSE_MS = 260;                                    // must be >= CSS transition time
  const INSTALL_CONFIRM_MS = 20000;                        // wait for appinstalled after the user accepted

  const TEXT = {
    title: "خلّي سِكّة على موبايلك",
    installDesc: "ثبّت سِكّة وافتحها بلمسة من الشاشة الرئيسية، بسرعة أكبر وبدون ما تدوّر على الرابط كل مرة.",
    installBtn: "تثبيت التطبيق",
    later: "ليس الآن",
    guideDescIOS: "على iPhone التثبيت بيتم يدويًا من Safari.",
    guideHelpIOS: "افتح الرابط في Safari، اضغط زر المشاركة، ثم اختر «إضافة إلى الشاشة الرئيسية».",
    guideDesc: "نافذة التثبيت التلقائي مش متاحة في المتصفح ده دلوقتي.",
    guideHelp: "افتح الرابط في Chrome، ثم من قائمة المتصفح (⋮) اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية». لو الخيار مش ظاهر، حدّث الصفحة وتأكد من اتصال الإنترنت.",
    ok: "حسنًا",
    opening: "جاري فتح نافذة التثبيت…",
    accepted: "تم قبول التثبيت، بانتظار اكتماله على جهازك…",
    acceptedSlow: "لو أيقونة سِكّة لم تظهر على الشاشة الرئيسية خلال لحظات، جرّب التثبيت من قائمة المتصفح (⋮).",
    declined: "مفيش مشكلة، تقدر تثبّتها في أي وقت من قائمة المتصفح (⋮).",
    failed: "تعذّر فتح نافذة التثبيت. جرّب من قائمة المتصفح (⋮) أو حدّث الصفحة.",
    successTitle: "تم تثبيت سِكّة بنجاح!",
    successDesc: "سِكّة بقت على جهازك. افتحها في أي وقت من أيقونتها على الشاشة الرئيسية.",
    successBtn: "افتح سِكّة من الشاشة الرئيسية",
    successHelp: "ارجع للشاشة الرئيسية في موبايلك وابحث عن أيقونة سِكّة، أو افتحها من قائمة التطبيقات، ثم اضغط عليها.",
    successClose: "تمام"
  };

  /* ---------- Safe storage (works even if localStorage is blocked) ---------- */
  const memory = {};
  const store = {
    get(key) {
      try { return window.localStorage.getItem(key); } catch (_) { return memory[key] || null; }
    },
    set(key, value) {
      try { window.localStorage.setItem(key, value); } catch (_) { memory[key] = value; }
    }
  };

  /* ---------- Environment ---------- */
  const standaloneQuery = window.matchMedia ? window.matchMedia("(display-mode: standalone)") : null;
  const isStandalone = () =>
    Boolean(standaloneQuery && standaloneQuery.matches) ||
    window.navigator.standalone === true ||
    (typeof document.referrer === "string" && document.referrer.indexOf("android-app://") === 0);

  const isIOS = () =>
    /iphone|ipad|ipod/i.test(window.navigator.userAgent) ||
    (window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);

  const prefersReducedMotion = () =>
    Boolean(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  const isSnoozed = (key) => {
    const at = Number(store.get(key) || 0);
    return Boolean(at) && Date.now() - at < SNOOZE_MS;
  };

  const markInstalled = () => store.set(INSTALLED_KEY, String(Date.now()));
  const wasInstalledBefore = () => Boolean(store.get(INSTALLED_KEY));

  /* ---------- State ---------- */
  let deferredPrompt = null;     // the real beforeinstallprompt event
  let promptSeen = false;        // fired during this page load => the app is NOT installed right now
  let justInstalled = false;     // appinstalled fired during this page load
  let view = "install";          // "install" | "guide" | "success"
  let overlay, card, logo, logoWrap, body, titleEl, descEl, nowBtn, laterBtn, statusEl, helpEl;
  let lastFocus = null;
  let closeTimer = 0;
  let confirmTimer = 0;
  let successStep = 0;           // 0 = first click not done yet, 1 = instructions shown
  let busy = false;

  /* ---------- Events that must be captured immediately ---------- */
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();      // keep the real prompt for our own button
    deferredPrompt = event;
    promptSeen = true;
    if (!overlay || overlay.hidden) {
      if (!isStandalone() && !justInstalled && !isSnoozed(DISMISS_KEY) && document.body) openModal("install");
      return;
    }
    if (justInstalled || busy) return;
    // The window opened before the event arrived: upgrade guidance (or a stale "installed" notice) to the real install window.
    if (view === "guide" || view === "success") setView("install");
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    justInstalled = true;
    busy = false;
    window.clearTimeout(confirmTimer);
    markInstalled();             // permanent: nothing in this script ever removes it
    ensureDom();
    if (overlay.hidden) {
      openModal("success");      // success is always shown, even if the install window was snoozed
    } else {
      setView("success");
    }
  });

  /* ---------- DOM ---------- */
  function template() {
    return (
      '<section id="sekka-install-card" role="dialog" aria-modal="true" ' +
      'aria-labelledby="sekka-install-title" aria-describedby="sekka-install-desc" dir="rtl" data-view="install">' +
        '<div id="sekka-install-hero" aria-hidden="true">' +
          '<span class="sekka-ring sekka-ring-a"></span>' +
          '<span class="sekka-ring sekka-ring-b"></span>' +
          '<div id="sekka-install-logo-wrap">' +
            '<img id="sekka-install-logo" alt="" width="76" height="76" decoding="async">' +
            '<span id="sekka-install-fallback">سِكّة</span>' +
            '<span id="sekka-install-check">' +
              '<svg viewBox="0 0 52 52" focusable="false">' +
                '<circle class="sekka-check-circle" cx="26" cy="26" r="23"></circle>' +
                '<path class="sekka-check-mark" d="M15 27.5l8 8L37.5 18"></path>' +
              '</svg>' +
            '</span>' +
          '</div>' +
          '<span id="sekka-install-road"></span>' +
        '</div>' +
        '<div id="sekka-install-body">' +
          '<h2 id="sekka-install-title"></h2>' +
          '<p id="sekka-install-desc"></p>' +
          '<p id="sekka-install-help"></p>' +
          '<div id="sekka-install-actions">' +
            '<button type="button" class="sekka-install-btn" id="sekka-install-now"></button>' +
            '<button type="button" class="sekka-install-btn" id="sekka-install-later"></button>' +
          '</div>' +
          '<p id="sekka-install-status" role="status" aria-live="polite"></p>' +
        '</div>' +
      '</section>'
    );
  }

  function ensureDom() {
    if (overlay && document.body.contains(overlay)) return;

    overlay = document.getElementById("sekka-install-overlay");
    const created = !overlay;
    if (created) {
      overlay = document.createElement("div");
      overlay.id = "sekka-install-overlay";
      overlay.hidden = true;
    }
    // Reuse an existing overlay if it is complete; only fill it when our inner markup is missing.
    if (!overlay.querySelector("#sekka-install-card")) overlay.innerHTML = template();
    if (created) document.body.appendChild(overlay);

    card = overlay.querySelector("#sekka-install-card");
    logo = overlay.querySelector("#sekka-install-logo");
    logoWrap = overlay.querySelector("#sekka-install-logo-wrap");
    body = overlay.querySelector("#sekka-install-body");
    titleEl = overlay.querySelector("#sekka-install-title");
    descEl = overlay.querySelector("#sekka-install-desc");
    nowBtn = overlay.querySelector("#sekka-install-now");
    laterBtn = overlay.querySelector("#sekka-install-later");
    statusEl = overlay.querySelector("#sekka-install-status");
    helpEl = overlay.querySelector("#sekka-install-help");

    // Logo: only the icon already declared in manifest.json; if it fails to load, a drawn badge is used instead.
    logo.addEventListener("error", () => {
      logoWrap.classList.add("is-fallback");
    }, { once: true });
    logo.addEventListener("load", () => {
      if (logo.naturalWidth > 0) logoWrap.classList.remove("is-fallback");
    });
    logo.src = LOGO_SRC;

    nowBtn.addEventListener("click", onPrimaryClick);
    laterBtn.addEventListener("click", onSecondaryClick);
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) dismiss();
    });
    overlay.addEventListener("keydown", onKeydown);
  }

  /* ---------- Views ---------- */
  function applyView(name, status) {
    view = name;
    card.setAttribute("data-view", name);
    statusEl.textContent = status || "";
    successStep = 0;

    nowBtn.hidden = false;
    nowBtn.disabled = false;
    laterBtn.hidden = false;
    laterBtn.disabled = false;
    helpEl.hidden = false;

    if (name === "success") {
      titleEl.textContent = TEXT.successTitle;
      descEl.textContent = TEXT.successDesc;
      nowBtn.textContent = TEXT.successBtn;
      laterBtn.textContent = TEXT.later;
      helpEl.textContent = "";
      helpEl.hidden = true;
    } else if (name === "guide") {
      titleEl.textContent = TEXT.title;
      const ios = isIOS();
      descEl.textContent = ios ? TEXT.guideDescIOS : TEXT.guideDesc;
      helpEl.textContent = ios ? TEXT.guideHelpIOS : TEXT.guideHelp;
      nowBtn.hidden = true;          // no disabled install button when the real prompt is unavailable
      laterBtn.textContent = TEXT.ok;
    } else {
      titleEl.textContent = TEXT.title;
      descEl.textContent = TEXT.installDesc;
      nowBtn.textContent = TEXT.installBtn;
      laterBtn.textContent = TEXT.later;
      helpEl.textContent = "";
      helpEl.hidden = true;
    }
  }

  function setView(name, status) {
    if (!overlay || overlay.hidden || name === view || prefersReducedMotion()) {
      applyView(name, status);
      return;
    }
    // Smooth cross-fade between views (opacity/transform only).
    body.classList.add("is-swapping");
    card.setAttribute("data-view", name);
    window.setTimeout(() => {
      applyView(name, status);
      body.classList.remove("is-swapping");
    }, 150);
  }

  /* ---------- Open / close ---------- */
  function openModal(name) {
    ensureDom();
    window.clearTimeout(closeTimer);
    applyView(name);
    lastFocus = document.activeElement;
    overlay.hidden = false;
    // Force a frame so the CSS transition runs from the closed state.
    void overlay.offsetWidth;
    overlay.classList.add("is-open");
    const target = nowBtn.hidden ? laterBtn : nowBtn;
    window.setTimeout(() => {
      try { target.focus({ preventScroll: true }); } catch (_) {}
    }, 60);
  }

  function closeModal() {
    if (!overlay || overlay.hidden) return;
    overlay.classList.remove("is-open");
    window.clearTimeout(closeTimer);
    closeTimer = window.setTimeout(() => {
      overlay.hidden = true;
      if (lastFocus && typeof lastFocus.focus === "function" && document.contains(lastFocus)) {
        try { lastFocus.focus({ preventScroll: true }); } catch (_) {}
      }
      lastFocus = null;
    }, prefersReducedMotion() ? 0 : CLOSE_MS);
  }

  // "ليس الآن" / outside click / Escape — snooze for 7 days. Never touches the installed flag.
  function dismiss() {
    if (view === "success") store.set(NOTICE_DISMISS_KEY, String(Date.now()));
    else store.set(DISMISS_KEY, String(Date.now()));
    window.clearTimeout(confirmTimer);
    closeModal();
  }

  function onKeydown(event) {
    if (event.key === "Escape") {
      event.stopPropagation();
      dismiss();
      return;
    }
    if (event.key !== "Tab") return;
    const items = Array.prototype.filter.call(
      card.querySelectorAll("button"),
      (el) => !el.hidden && !el.disabled
    );
    if (!items.length) { event.preventDefault(); return; }
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    else if (!card.contains(document.activeElement)) { event.preventDefault(); first.focus(); }
  }

  /* ---------- Buttons ---------- */
  async function onPrimaryClick() {
    if (view === "success") {
      // There is no reliable web API to launch an installed PWA from a browser tab,
      // so we only guide the user, then close on the next tap.
      if (successStep === 0) {
        successStep = 1;
        statusEl.textContent = "";
        helpEl.hidden = false;
        helpEl.textContent = TEXT.successHelp;
        nowBtn.textContent = TEXT.successClose;
        laterBtn.hidden = true;
      } else {
        dismiss();
      }
      return;
    }

    if (view !== "install" || busy) return;

    if (!deferredPrompt) {          // event no longer available (already used or never fired)
      setView("guide");
      return;
    }

    const promptEvent = deferredPrompt;
    deferredPrompt = null;          // prompt() can only be used once per event
    busy = true;
    nowBtn.disabled = true;
    laterBtn.disabled = true;
    statusEl.textContent = TEXT.opening;

    try {
      await promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      if (choice && choice.outcome === "accepted") {
        // Accepting is NOT proof that installation finished: wait for "appinstalled".
        statusEl.textContent = TEXT.accepted;
        window.clearTimeout(confirmTimer);
        confirmTimer = window.setTimeout(() => {
          if (!justInstalled && statusEl) statusEl.textContent = TEXT.acceptedSlow;
          laterBtn.disabled = false;
        }, INSTALL_CONFIRM_MS);
        busy = false;
        return;
      }
      store.set(DISMISS_KEY, String(Date.now()));
      busy = false;
      laterBtn.disabled = false;
      setView("guide", TEXT.declined);
    } catch (error) {
      console.error("SEKKA install prompt error:", error);
      busy = false;
      laterBtn.disabled = false;
      setView("guide", TEXT.failed);
    }
  }

  function onSecondaryClick() {
    if (busy) return;
    dismiss();
  }

  /* ---------- When to show ---------- */
  function splashGone() {
    const splash = document.getElementById("splash");
    if (!splash || !document.body.contains(splash) || splash.hidden) return true;
    const cs = window.getComputedStyle(splash);
    return cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) < 0.05;
  }

  function decideAndShow() {
    if (isStandalone() || justInstalled) return;

    if (wasInstalledBefore() && !promptSeen) {
      // Installed earlier and Chrome is NOT offering installation => show the "already installed" window.
      if (!isSnoozed(NOTICE_DISMISS_KEY)) openModal("success");
      return;
    }
    // Not installed (or the user uninstalled: Chrome offered the prompt again).
    if (isSnoozed(DISMISS_KEY)) return;
    openModal(deferredPrompt ? "install" : "guide");
  }

  function scheduleShow() {
    const startedAt = Date.now();
    const wait = isIOS() ? 700 : 3500;
    const tick = () => {
      if (isStandalone() || justInstalled) return;
      if (overlay && !overlay.hidden) return;
      if (Date.now() - startedAt < wait) { window.setTimeout(tick, 250); return; }
      decideAndShow();
    };
    window.setTimeout(tick, 250);
  }

  function detectInstalledApps() {
    // Best-effort only: returns results only if manifest.json declares related_applications.
    // Safe no-op otherwise.
    if (!navigator.getInstalledRelatedApps) return Promise.resolve();
    return navigator.getInstalledRelatedApps()
      .then((apps) => { if (apps && apps.length) markInstalled(); })
      .catch(() => {});
  }

  function onStandaloneChange() {
    if (isStandalone()) {
      markInstalled();
      if (overlay && !overlay.hidden) closeModal();
    }
  }

  function start() {
    if (isStandalone()) {
      // Opened from the installed icon: remember that the app is installed, show nothing, touch nothing.
      markInstalled();
      return;
    }
    if (standaloneQuery) {
      if (standaloneQuery.addEventListener) standaloneQuery.addEventListener("change", onStandaloneChange);
      else if (standaloneQuery.addListener) standaloneQuery.addListener(onStandaloneChange);
    }
    detectInstalledApps().then(scheduleShow);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
