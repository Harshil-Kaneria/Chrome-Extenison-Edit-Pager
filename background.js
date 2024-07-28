function activateEditing() {
  document.body.setAttribute('spellcheck', false);
  document.designMode = "on";
}

function deactivateEditing() {
  document.body.setAttribute('spellcheck', false);
  document.designMode = "off";
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "activateEditing" || message.action === "deactivateEditing") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const tabId = tabs[0].id;
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: message.action==="activateEditing"?activateEditing:deactivateEditing,
        });
      }
    });
  }else if(message.action === 'capture') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const tabId = tabs[0].id;
        chrome.tabs.get(tabId, (tab) => {
          if (chrome.runtime.lastError || !tab) {
            console.error("Error: Invalid tab ID or tab has been closed.");
            sendResponse({ success: false, error: chrome.runtime.lastError ? chrome.runtime.lastError.message : "Tab not found" });
            return;
          }
          chrome.tabs.captureVisibleTab(tab.windowId, { format: 'png' }, (dataUrl) => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError);
              sendResponse({ success: false, error: chrome.runtime.lastError.message });
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
                console.error(chrome.runtime.lastError);
                sendResponse({ success: false, error: chrome.runtime.lastError.message });
              } else {
                sendResponse({ success: true });
              }
            });
          });
        });
      }
    });
    return true;
  }
});