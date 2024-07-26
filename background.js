chrome.action.onClicked.addListener((tab) => {
    alert('hii')
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['content.js']
    });
});