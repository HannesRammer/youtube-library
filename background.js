// background.js

// Ein Ereignis-Listener, der auf das Installieren oder Aktualisieren der Erweiterung wartet
chrome.runtime.onInstalled.addListener(function() {

    // Erstellen oder Aktualisieren eines Kontextmenüs zum Öffnen eines YouTube-Videos in einem neuen Tab
    chrome.contextMenus.create({
        "id": "open-youtube-video",
        "title": "YouTube-Video in neuem Tab öffnen",
        "contexts": ["link"],
        "targetUrlPatterns": ["*://www.youtube.com/watch?v=*"]
    });

    // Ein Ereignis-Listener, der auf das Klicken des Kontextmenüs wartet
    chrome.contextMenus.onClicked.addListener(function(info, tab) {
        if (info.menuItemId === "open-youtube-video") {
            // Öffnen Sie das ausgewählte YouTube-Video in einem neuen Tab
            chrome.tabs.create({ url: info.linkUrl });
        }
    });

    // Erstellen oder Aktualisieren einer Symbolleiste-Schaltfläche zum Anzeigen der Video-Liste im Popup-Fenster
    chrome.browserAction.setPopup({ popup: "popup.html" });
});

// Ein Ereignis-Listener, der auf eine Nachricht vom Popup-Fenster oder vom Inhalts-Script wartet
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    // Überprüfen, ob die Nachricht eine Anforderung zum Abrufen der Video-Liste ist
    if (request.message === "getVideoList") {

        // Rufen Sie die Liste der zuletzt wiedergegebenen Videos von der YouTube-API ab
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=10&key=YOUR_API_KEY_HERE", true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                var videos = response.items.map(function(item) {
                    return {
                        id: item.id,
                        title: item.snippet.title,
                        thumbnail: item.snippet.thumbnails.default.url
                    };
                });
                sendResponse({ videos: videos });
            }
        };
        xhr.send();

        // Rückgabe von true, um zu signalisieren, dass die Antwort asynchron gesendet wird
        return true;
    }

    // Überprüfen, ob die Nachricht eine Anforderung zum Öffnen eines bestimmten Videos ist
    if (request.message === "openVideo") {

        // Suchen Sie das Video-Element auf der Seite und klicken Sie darauf, um das Video zu öffnen
        var videoElement = document.querySelector('a[href="/watch?v=' + request.videoId + '"]');
        if (videoElement) {
            videoElement.click();
            sendResponse({ success: true });
        } else {
            sendResponse({ success: false });
        }

        // Rückgabe von true, um zu signalisieren, dass die Antwort asynchron gesendet wird
        return true;
    }
});

// Ein Ereignis-Listener, der auf das Aktualisieren des Browserfenstertabs wartet und die Browseraktionsschaltfläche aktualisiert
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === "complete" && tab.active) {
// Aktualisieren Sie die Browseraktionsschaltfläche, um die Anzahl der geöffneten Tabs anzuzeigen
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            var count = tabs.length;
            chrome.browserAction.setBadgeText({ text: count > 0 ? count.toString() : "" });
        });
    }
});
