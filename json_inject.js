let youtubeLibrary = {
    videos: [],
    currentLocation:"",
    addCss: function (css) {
        let head = document.getElementsByTagName('head')[0];
        let s = document.createElement('style');
        s.setAttribute('type', 'text/css');
        if (s.styleSheet) {   // IE
            s.styleSheet.cssText = css;
        } else {                // the world
            s.appendChild(document.createTextNode(css));
        }
        head.appendChild(s);
    },

    addStyle: function () {
        let head = document.getElementsByTagName('head')[0];
        let s = document.createElement('script');
        s.setAttribute('src', 'https://kit.fontawesome.com/a076d05399.js');
        // the world


        head.appendChild(s);
    },

    storeVideos: function () {
        chrome.storage.sync.set({'videos': youtubeLibrary.videos}, function () {
            // Notify that we saved.
            console.log('videos updated');
        });

    },
    loadVideos: function () {
        chrome.storage.sync.get('videos', function (value) {
            if (value.videos === undefined) {
                youtubeLibrary.videos = [];
            } else {
                youtubeLibrary.videos = value.videos;
            }
            console.log('videos loaded');
        });

    },
    initiateView: function () {
        console.log('initiate view');

        youtubeLibrary.loadVideos();


    },
    checkLocationHasChanged: function () {
        if (youtubeLibrary.currentLocation != location.href ){
            youtubeLibrary.currentLocation = location.href;
            youtubeLibrary.getVideoInfoFromPage();
        }



    },
    getVideoInfoFromPage:function(){
        console.log('get video info from page');
    }

};

$(document).ready(function () {
    console.log("start");

    youtubeLibrary.initiateView();
    setInterval(youtubeLibrary.checkLocationHasChanged,3000);




});
console.log("start2");
youtubeLibrary.addStyle();
youtubeLibrary.addCss(`   `);
