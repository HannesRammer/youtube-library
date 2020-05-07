let youtubeLibryary = {
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


};

$(document).ready(function () {
    console.log("start");


});
console.log("start2");
youtubeLibryary.addStyle();
youtubeLibryary.addCss(`   `);
