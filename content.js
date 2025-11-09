// content.js
(function () {
  console.log("[M9 AutoStarter] Content script active.");

  // --- Cấu hình ---
  const SILENT_TIMEOUT = 10 * 60 * 1000; // 10 phút không hoạt động => refresh
  const CHECK_INTERVAL = 60 * 1000; // kiểm tra mỗi phút
  const SAFE_MARGIN = 60 * 1000; // cộng thêm 1 phút an toàn
  let lastActivity = Date.now();

  // --- Hook fetch để ghi nhận hoạt động mạng ---
  const origFetch = window.fetch;
  window.fetch = async (...args) => {
    lastActivity = Date.now();
    return origFetch.apply(this, args);
  };

  // --- Auto click "Start session" ---
  function tryClickStartSession() {
    const btn = Array.from(document.querySelectorAll("button")).find(b => {
      const txt = (b.textContent || "").toLowerCase();
      return txt.includes("start session");
    });
    if (btn && !btn.disabled) {
      btn.click();
      console.log("[M9 AutoStarter] ✅ Auto-clicked Start session");

      chrome.storage.local.get(["clickCount"], (data) => {
        const count = (data.clickCount || 0) + 1;
        chrome.storage.local.set({ clickCount: count });
      });
    } else {
      console.log("[M9 AutoStarter] 🟢 Session active or button unavailable");
    }
  }

  // --- Theo dõi im lặng ---
  setInterval(() => {
    const now = Date.now();
    const idle = now - lastActivity;

    if (idle > SILENT_TIMEOUT + SAFE_MARGIN) {
      console.warn("[M9 AutoStarter] 💀 Không thấy hoạt động mạng lâu → reload trang...");
      location.reload();
    } else {
      const left = Math.max(0, SILENT_TIMEOUT - idle);
      console.log(`[M9 AutoStarter] Active: ${Math.round(left / 60000)}m đến lần kiểm tra tiếp`);
    }
  }, CHECK_INTERVAL);

  // --- Tự động click khi trang load ---
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", tryClickStartSession);
  } else {
    tryClickStartSession();
  }
})();
