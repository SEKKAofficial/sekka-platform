/* SEKKA PWA install flow — isolated from the main app and Supabase logic */
(() => {
  "use strict";

  let installPrompt = null;
  let overlay, installButton, statusText, helpText;
  const DISMISS_KEY = "sekka_install_dismissed_at";
  const DISMISS_DAYS = 7;

  const isStandalone = () =>
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  const isIOS = () => /iphone|ipad|ipod/i.test(window.navigator.userAgent);

  function makeModal() {
    if (document.getElementById("sekka-install-overlay")) {
      overlay = document.getElementById("sekka-install-overlay");
      installButton = document.getElementById("sekka-install-now");
      statusText = document.getElementById("sekka-install-status");
      helpText = document.getElementById("sekka-install-help");
      return;
    }

    overlay = document.createElement("div");
    overlay.id = "sekka-install-overlay";
    overlay.hidden = true;
    overlay.innerHTML = `
      <section id="sekka-install-card" role="dialog" aria-modal="true" aria-labelledby="sekka-install-title" dir="rtl">
        <img id="sekka-install-logo" src="./icon-192.png" alt="شعار سِكّة">
        <h2 id="sekka-install-title">خلّي سِكّة على موبايلك</h2>
        <p>ثبّت سِكّة للوصول إليها بسهولة من الشاشة الرئيسية، وتجربة أسرع في كل مرة.</p>
        <div id="sekka-install-actions">
          <button type="button" class="sekka-install-btn" id="sekka-install-now">تثبيت التطبيق</button>
          <button type="button" class="sekka-install-btn" id="sekka-install-later">ليس الآن</button>
        </div>
        <p id="sekka-install-status" aria-live="polite"></p>
        <p id="sekka-install-help"></p>
      </section>`;
    document.body.appendChild(overlay);

    installButton = overlay.querySelector("#sekka-install-now");
    statusText = overlay.querySelector("#sekka-install-status");
    helpText = overlay.querySelector("#sekka-install-help");

    installButton.addEventListener("click", async () => {
      if (!installPrompt) {
        statusText.textContent = "التثبيت غير متاح من هذا المتصفح حاليًا.";
        return;
      }
      installButton.disabled = true;
      try {
        installPrompt.prompt();
        const choice = await installPrompt.userChoice;
        if (choice && choice.outcome === "accepted") {
          statusText.textContent = "جاري تثبيت سِكّة…";
        } else {
          statusText.textContent = "مفيش مشكلة، تقدر تثبّتها في أي وقت.";
        }
      } catch (error) {
        console.error("SEKKA install prompt error:", error);
        statusText.textContent = "تعذّر فتح نافذة التثبيت. حدّث الصفحة وحاول تاني.";
      } finally {
        installPrompt = null;
        updateButton();
      }
    });

    overlay.querySelector("#sekka-install-later").addEventListener("click", () => {
      try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch (_) {}
      overlay.hidden = true;
    });

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) overlay.hidden = true;
    });
  }

  function updateButton() {
    if (!installButton || !helpText) return;
    if (isStandalone()) {
      installButton.textContent = "التطبيق مثبت بالفعل";
      installButton.disabled = true;
      helpText.textContent = "افتح سِكّة من أيقونتها على الشاشة الرئيسية.";
      return;
    }
    if (installPrompt) {
      installButton.textContent = "تثبيت التطبيق";
      installButton.disabled = false;
      helpText.textContent = "اضغط على الزر لفتح نافذة التثبيت الرسمية.";
      return;
    }
    installButton.textContent = "التثبيت غير متاح حاليًا";
    installButton.disabled = true;
    if (isIOS()) {
      helpText.textContent = "على iPhone: افتح الرابط في Safari، ثم اضغط مشاركة، وبعدها «إضافة إلى الشاشة الرئيسية».";
    } else {
      helpText.textContent = "لو لم يظهر خيار التثبيت، افتح الرابط في Chrome وتأكد من اتصال الإنترنت ثم أعد تحميل الصفحة.";
    }
  }

  function shouldShow() {
    if (isStandalone()) return false;
    try {
      const dismissedAt = Number(localStorage.getItem(DISMISS_KEY) || 0);
      return !dismissedAt || (Date.now() - dismissedAt) > DISMISS_DAYS * 86400000;
    } catch (_) {
      return true;
    }
  }

  function showModal() {
    if (!overlay || !shouldShow()) return;
    updateButton();
    overlay.hidden = false;
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installPrompt = event;
    updateButton();
    // If the prompt became available after the welcome modal appeared, enable its button.
    if (overlay && !overlay.hidden) updateButton();
  });

  window.addEventListener("appinstalled", () => {
    installPrompt = null;
    if (statusText) statusText.textContent = "تم تثبيت سِكّة بنجاح.";
    if (installButton) {
      installButton.textContent = "تم التثبيت";
      installButton.disabled = true;
    }
    try { localStorage.removeItem(DISMISS_KEY); } catch (_) {}
    window.setTimeout(() => { if (overlay) overlay.hidden = true; }, 1400);
  });

  function start() {
    makeModal();
    if (isStandalone()) return;
    window.setTimeout(showModal, 900);
    // Some browsers dispatch beforeinstallprompt slightly after initial page load.
    window.addEventListener("pageshow", updateButton, { once: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
