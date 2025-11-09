// background.js
// Mục đích: Giữ worker thức, inject content.js định kỳ, cho phép pause/resume qua popup

const CHECK_INTERVAL = 30 * 1000;  // 30s kiểm tra
const KEEP_ALIVE_INTERVAL = 25 * 1000; // ping giữ worker thức

console.log("[M9 AutoStarter] Background active.");

// Ping nhẹ để tránh worker sleep
function keepAlive() {
  chrome.runtime.getPlatformInfo(() => {
    console.log("[M9 AutoStarter] keepAlive ping", new Date().toLocaleTimeString());
  });
}

// Gửi script vào tab M9 để đảm bảo content chạy
function injectContent() {
  chrome.storage.local.get(["isPaused"], (data) => {
    if (data.isPaused) {
      console.log("[M9 AutoStarter] Paused.");
      return;
    }

    chrome.tabs.query({ url: "https://sm.midnight.gd/wizard/mine*" }, (tabs) => {
      for (const tab of tabs) {
        chrome.scripting.executeScript(
          { target: { tabId: tab.id }, files: ["content.js"] },
          () => {
            if (chrome.runtime.lastError) {
              console.warn("Injection failed:", chrome.runtime.lastError.message);
            } else {
              console.log("[M9 AutoStarter] Injected into tab", tab.id);
            }
          }
        );
      }
    });
  });
}

setInterval(keepAlive, KEEP_ALIVE_INTERVAL);
setInterval(injectContent, CHECK_INTERVAL);
keepAlive();
injectContent();
