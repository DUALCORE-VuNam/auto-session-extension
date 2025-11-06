chrome.runtime.onInstalled.addListener(() => {
  console.log("[Auto Session Starter] Installed and initializing...");
  
  startAutoCheck();
});

function startAutoCheck() {
  console.log("[Auto Session Starter] Auto-check started (every 30s)");
  
  setInterval(() => {
    console.log("[Auto Session Starter] Timer triggered — scanning tabs...");

    chrome.tabs.query({ url: "https://sm.midnight.gd/wizard/mine*" }, (tabs) => {
      if (!tabs || tabs.length === 0) {
        console.log("[Auto Session Starter] ❌ No matching tabs found.");
        return;
      }

  
      for (const tab of tabs) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tab.id },
            files: ["content.js"]
          },
          () => {
            if (chrome.runtime.lastError) {
              console.warn(
                `[Auto Session Starter] ⚠️ Failed to inject into tab ${tab.id}:`,
                chrome.runtime.lastError.message
              );
            } else {
              console.log(
                `[Auto Session Starter] ✅ Script injected into tab ${tab.id}.`
              );
            }
          }
        );
      }
    });
  }, 30000); // 30 giây
}
