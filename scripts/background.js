import Search from "/scripts/Search.js";

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    const current_search = Search.fromChromeEvent(tabId, changeInfo, tab);
    if (current_search === undefined) return;
    chrome.storage.local.get({ searchLogs: [] }, (data) => {
      data.searchLogs.push(current_search.to_object());
      console.log("Debugging, here's the data to be added to storage:");
      console.log(data);
      chrome.storage.local.set(data);
    });
  }
});
