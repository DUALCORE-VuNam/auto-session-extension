(() => {
  console.log("[Auto Session Starter] content script loaded:", window.location.href);

  const MIN_CLICK_INTERVAL = 30 * 1000;
  let lastClicked = 0;


  function findAndClickStartSession() {
    try {
   
      const buttons = Array.from(document.querySelectorAll("button"));
      for (const btn of buttons) {
        const text = (btn.textContent || "").trim().toLowerCase();
        if (text === "start session") {
          const now = Date.now();
          if (now - lastClicked < MIN_CLICK_INTERVAL) {
            console.log("[Auto Session Starter] Đã click gần đây, bỏ qua.");
            return { clicked: false, reason: "debounced" };
          }
     
          const isDisabled = btn.disabled || btn.getAttribute("aria-disabled") === "true";

          if (isDisabled) {
            console.log("[Auto Session Starter] Nút bị disabled, không click.");
            return { clicked: false, reason: "disabled" };
          }

          btn.click();
          lastClicked = now;
          console.log("[Auto Session Starter] ✅ Auto-clicked Start session!");
          return { clicked: true };
        }
      }
      return { clicked: false, reason: "not_found" };
    } catch (e) {
      console.error("[Auto Session Starter] error in findAndClickStartSession:", e);
      return { clicked: false, reason: "error", error: String(e) };
    }
  }


  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg && msg.type === "CHECK_AND_CLICK") {
      const result = findAndClickStartSession();
      sendResponse?.(result);
    }
  });


  const observer = new MutationObserver((mutations) => {
 
    for (const m of mutations) {
      if (m.addedNodes && m.addedNodes.length) {
  
        findAndClickStartSession();
        break;
      }
    }
  });

  observer.observe(document.documentElement || document.body, {
    childList: true,
    subtree: true
  });


  setTimeout(() => {
    findAndClickStartSession();
  }, 2000);
})();
