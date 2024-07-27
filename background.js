function activateEditing() {
  document.body.setAttribute('spellcheck', false);
  document.designMode = "on";
}

function deactivateEditing() {
  document.body.setAttribute('spellcheck', false);
  document.designMode = "off";
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (
    message.action === "activateEditing" ||
    message.action === "deactivateEditing"
  ) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const tabId = tabs[0].id;
        if (message.action === "activateEditing") {
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: activateEditing,
          });
        } else if (message.action === "deactivateEditing") {
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: deactivateEditing,
          });
        }
      }
    });
  }
});