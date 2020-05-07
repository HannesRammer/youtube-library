// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
let apiKey = "AIzaSyCZxk6LF_GoVRjnxG1saAxOJrGpPhEj0QU";



window.onload = function() {
  document.querySelector('button').addEventListener('click', function() {
    chrome.identity.getAuthToken({interactive: true}, function(token) {
      let init = {
        method: 'GET',
        async: true,
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        'contentType': 'json'
      };
      getMyPlaylists(init);
    });
  });
};

function getMyPlaylists(init) {
  fetch(
      'https://www.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails&maxResults=25&mine=true&key='+apiKey,
      init)
      .then((response) => response.json())
      .then(function(data) {
        console.log(data);
          let videos = data.items;

      });
}

function getPlaylistVideos(playlist_id) {
  fetch(
      'https://www.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails&maxResults=25&mine=true&key='+apiKey,
      init)
      .then((response) => response.json())
      .then(function(data) {
        console.log(data)
      });
}
