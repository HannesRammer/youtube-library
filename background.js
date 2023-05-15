chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("getHistory request:");
  console.log(request);
  if (request.action === "getHistory") {
    chrome.history.search({ text: "www.youtube.com/watch", maxResults: 1000 }, function(historyItems) {
      sendResponse({ historyItems: historyItems });
    });
    return true; // Indicates that the response will be sent asynchronously
  }
});