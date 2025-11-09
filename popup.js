// popup.js
const statusEl = document.getElementById("status");
const clickCountEl = document.getElementById("clickCount");
const pauseBtn = document.getElementById("pause");
const resumeBtn = document.getElementById("resume");
const refreshBtn = document.getElementById("refresh");

function updateUI() {
  chrome.storage.local.get(["isPaused", "clickCount"], (data) => {
    const isPaused = data.isPaused || false;
    const clickCount = data.clickCount || 0;

    statusEl.textContent = isPaused ? "⏸ Đang tạm dừng" : "🟢 Đang chạy";
    clickCountEl.textContent = clickCount;

    pauseBtn.style.display = isPaused ? "none" : "block";
    resumeBtn.style.display = isPaused ? "block" : "none";
  });
}

// Pause
pauseBtn.addEventListener("click", () => {
  chrome.storage.local.set({ isPaused: true }, updateUI);
});

// Resume
resumeBtn.addEventListener("click", () => {
  chrome.storage.local.set({ isPaused: false }, updateUI);
});

// Manual refresh
refreshBtn.addEventListener("click", () => {
  chrome.tabs.query({ url: "https://sm.midnight.gd/wizard/mine*" }, (tabs) => {
    for (const tab of tabs) chrome.tabs.reload(tab.id);
  });
});

updateUI();
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local") updateUI();
});
