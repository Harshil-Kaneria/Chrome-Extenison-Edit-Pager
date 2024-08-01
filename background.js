// Functions to activate and deactivate editing
function setEditingMode(isActive) {
  document.body.setAttribute('spellcheck', false);
  document.designMode = isActive ? "on" : "off";
}

// Function to handle script execution
function executeScript(tabId, func, callback) {
  chrome.scripting.executeScript({
    target: { tabId },
    func
  }, callback);
}

// Function to handle screenshot capture and download
function captureAndDownloadScreenshot(tab, callback) {
  chrome.tabs.captureVisibleTab(tab.windowId, { format: 'png' }, (dataUrl) => {
    if (chrome.runtime.lastError || !dataUrl) {
      callback({ success: false, error: 'Failed to capture screenshot.' });
      return;
    }
    const now = new Date().toISOString();
    const sanitizedFilename = `screenshot_${now}.png`.replace(/[\/\\?%*:|"<>]/g, '_');
    chrome.downloads.download({
      url: dataUrl,
      filename: sanitizedFilename,
      saveAs: true
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        callback({ success: false, error: 'Failed to download screenshot.' });
      } else {
        callback({ success: true });
      }
    });
  });
}

// Listen for messages sent to the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "activateEditing" || message.action === "deactivateEditing") {
    const isActive = message.action === "activateEditing"; 
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const tabId = tabs[0].id;
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: setEditingMode,
          args: [isActive]
        }, () => sendResponse({ success: true }));
        return true; // Indicate that sendResponse will be called asynchronously
      } else {
        sendResponse({ success: false, error: 'No active tab found.' });
      }
    });
    return true; // Indicate that sendResponse will be called asynchronously
  } else if (message.action === 'capture') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const tabId = tabs[0].id;
        chrome.tabs.get(tabId, (tab) => {
          if (chrome.runtime.lastError || !tab) {
            sendResponse({ success: false, error: 'Failed to get tab details.' });
            return;
          }
          captureAndDownloadScreenshot(tab, sendResponse);
        });
      } else {
        sendResponse({ success: false, error: 'No active tab found.' });
      }
    });
    return true; // Indicate that sendResponse will be called asynchronously
  } else {
    sendResponse({ success: false, error: 'Unknown action.' });
    return true; // Ensure `sendResponse` is always called asynchronously
  }
});