function getTabId() { ... }
function getUserColor() { ... }

function changeBackgroundColor() {
  document.body.style.backgroundColor = getUserColor();
}

chrome.scripting
    .executeScript({
      target : {tabId : getTabId()},
      func : changeBackgroundColor,
    })
    .then(() => console.log("injected a function"));