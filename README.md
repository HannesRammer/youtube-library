# youtube-library

Manage played youtube songs like songs google play music 

1. add listener to chrome media player to store played songs and videos artist name, url, title, duration, played time, etc.
2. store all info in the browser storage
3. create a popup to show a table like list similar to a music player library for all songs and videos
4. add a search box to search in the library
5. scan the last 1000 played songs via api to get the info and store it in the browser storage if not exist, if exists increase play time
// 1. Add listener to chrome media player to store played songs and videos artist name, url, title, duration, played time, etc.
chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
    if (request.type === 'media') {
        const mediaInfo = {
            artist: request.artist,
            url: request.url,
            title: request.title,
            duration: request.duration,
            playedTime: request.playedTime
        };
        // 2. Store all info in the browser storage
        chrome.storage.local.get('mediaLibrary', function(result) {
            const mediaLibrary = result.mediaLibrary || [];
            mediaLibrary.push(mediaInfo);
            chrome.storage.local.set({ mediaLibrary });
        });
    }
});

// 3. Create a popup to show a table like list similar to a music player library for all songs and videos
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.windows.create({
        url: chrome.runtime.getURL('popup.html'),
        type: 'popup',
        width: 800,
        height: 600
    });
});

// 4. Add a search box to search in the library
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === 'search') {
        chrome.storage.local.get('mediaLibrary', function(result) {
            const mediaLibrary = result.mediaLibrary || [];
            const filteredLibrary = mediaLibrary.filter(function(mediaInfo) {
                return mediaInfo.title.toLowerCase().includes(request.query.toLowerCase()) ||
                    mediaInfo.artist.toLowerCase().includes(request.query.toLowerCase());
            });
            sendResponse(filteredLibrary);
        });
        return true;
    }
});

// 5. Scan the last 1000 played songs via api to get the info and store it in the browser storage if not exist, if exists increase play time
chrome.runtime.onInstalled.addListener(function() {
    chrome.history.search({ text: '', maxResults: 1000 }, function(historyItems) {
        const mediaUrls = historyItems.filter(function(historyItem) {
            return historyItem.url.includes('youtube.com/watch');
        }).map(function(historyItem) {
            return historyItem.url;
        });
        chrome.storage.local.get('mediaLibrary', function(result) {
            const mediaLibrary = result.mediaLibrary || [];
            mediaUrls.forEach(function(mediaUrl) {
                const mediaInfo = mediaLibrary.find(function(mediaInfo) {
                    return mediaInfo.url === mediaUrl;
                });
                if (mediaInfo) {
                    mediaInfo.playedTime += 1;
                } else {
                    // Use the YouTube API to get the media info
                    // ...
                    mediaLibrary.push(mediaInfo);
                }
            });
            chrome.storage.local.set({ mediaLibrary });
        });
    });
});

