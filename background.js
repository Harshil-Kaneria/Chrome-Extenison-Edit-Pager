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
          func: message.action === "activateEditing" ? activateEditing : deactivateEditing,
        }, () => {
          sendResponse({ success: true });
        });
        return true;
      } else {
        sendResponse({ success: false, error: 'No active tab found.' });
      }
    });
    return true;
  }else if(message.action === 'capture') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const tabId = tabs[0].id;
        chrome.tabs.get(tabId, (tab) => {
          if (chrome.runtime.lastError || !tab) {
            sendResponse({ success: false });
            return;
          }
          chrome.tabs.captureVisibleTab(tab.windowId, { format: 'png' }, (dataUrl) => {
            if (chrome.runtime.lastError || !dataUrl) {
              sendResponse({ success: false });
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
                sendResponse({ success: false });
              } else {
                sendResponse({ success: true });
              }
            });
          });
        });
      } else {
        sendResponse({ success: false });
      }
    });
    return true;
  }
});