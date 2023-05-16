
function createMediaTag(){


const mediaTag = document.getElementsByTagName('audio')[0] || document.getElementsByTagName('video')[0];

// Add event listener to the video element
mediaTag.addEventListener('play', function () {
  console.log('Video is playing');
  setTimeout(function () {
    // Get the video information
    const titleElement = document.querySelector('.ytd-video-primary-info-renderer h1.title yt-formatted-string');
    const artistElement = document.querySelector('.ytd-video-primary-info-renderer #owner-name a');
    const video = document.querySelector('video');
    const src = video.getAttribute('src');

    const thumbnail = document.querySelector('link[rel="image_src"]');
    const thumbnailUrl = thumbnail.getAttribute('href');
    // const title = titleElement ? titleElement.textContent : '';
    // const artist = artistElement ? artistElement.textContent : '';
    extractMediaInfo(titleElement.textContent, window.location.href, 1,mediaTag.duration,src,thumbnailUrl);
  }, 5000);
});
}


function createSearchTag(){
  const searchInput = document.querySelector('#search-input');
  

  
searchInput.addEventListener("change", handleInputChange);

  
}

function handleInputChange(event) {
  // Code to be executed when the input field changes
  // You can access the input field value using event.target.value
  var inputValue = event.target.value;
 
  const searchTerm = inputValue.toLowerCase();
  const songsTable = document.querySelector('.songs-table');
    const rows = songsTable.querySelectorAll('tr');

    rows.forEach(row => {
      const artist = row.querySelector('.artist').textContent.toLowerCase();
      const title = row.querySelector('.title').textContent.toLowerCase();

      if (artist.includes(searchTerm) || title.includes(searchTerm)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  // Call the desired function or perform any required actions
  // ...
}


function createMusicLibraryButton() {
  // Create a new button element to show the music library modal
  const button = document.createElement('button');
  button.textContent = 'Show Music Library';
  button.id = 'music-library-button';
  button.style.position = 'absolute';
  button.style.top = '10px';
  button.style.right = '10px';
  button.style.zIndex = '9999';
  button.className = 'style-scope ytd-app';

  // Add an event listener to the button to show the music library modal when clicked
  button.addEventListener('click', function () {
    // Create a new div element to hold the music library table

    const modalDiv = document.getElementById('music-library-modal');

    // Check if the modal dialog exists
    if (modalDiv) {
      // If the modal dialog exists, do something
      console.log('Music library modal dialog found!');
      modalDiv.style.display = modalDiv.style.display === 'none' ? 'block' : 'none';
    } else {
      // If the modal dialog does not exist, do something else
      console.log('Music library modal dialog not found!');

      createMusicLibraryTable();
      // Load the music library table HTML into the div element

      // Add the modal div to the YouTube page

    }

  });


  //document.addEventListener('DOMContentLoaded', function () {
  // Add the button to the content area
setTimeout(function () {
  const contentArea = document.querySelector('#content');
  contentArea.appendChild(button);
}, 2000);
}
//});


function extractMediaInfo(titleElement, videoUrl, visitCount,duration,src,thumbnailUrl) {
  const songParts = titleElement.split('-');
  // Trim whitespace from the artist and title parts
  const artist = songParts.length > 1 ? songParts[1].trim() : songParts[0].trim();
  const title = songParts[0].trim();
  const url = "https://www.youtube.com/watch?v=" + videoUrl.match(/(?:v=)([\w-]+)/)[1];

  console.log('Title:', title, 'Artist:', artist, 'Duration:', duration);

  // Get the existing played songs from local storage
  let playedSongs = JSON.parse(localStorage.getItem('playedSongs')) || [];
  console.log('Played songs:', playedSongs);

  // Check if the video is already in the played songs list
  const existingSong = playedSongs.find(function (song) {
    return song.title === title && song.artist === artist && song.url === url;
  });

  // If the video is already in the played songs list, increment the played times
  if (existingSong) {
    existingSong.playedTimes++;
    existingSong.duration = duration;
    existingSong.thumbnailUrl = thumbnailUrl;
    if(src!==""){
        existingSong.src = src;
    }
    console.log('Video already played. Incrementing played times:', existingSong.playedTimes);
  } else {
    // If the video is not in the played songs list, add it to the list
    playedSongs.push({ title, artist, url, duration, playedTimes: visitCount,src,thumbnailUrl });
    console.log('Video not played before. Adding to played songs:', playedSongs);
  }

  // Save the updated played songs list to local storage
  localStorage.setItem('playedSongs', JSON.stringify(playedSongs));
  console.log('Updated played songs:', playedSongs);
}

function createMusicLibraryTable() {

  const modalDiv = document.createElement('div');
  modalDiv.id = 'music-library-modal';
  modalDiv.style.display = 'block';
  // Create the songs table
  const table = document.createElement('table');
  table.classList.add('songs-table');

  // Create the table header
  const thead = document.createElement('thead');
  const tr = document.createElement('tr');
  const th7 = createTableHeader('Thumb', 6, table);
  const th1 = createTableHeader('Artist', 0, table);

  const th2 = createTableHeader('Title', 1, table);
  const th3 = createTableHeader('Duration', 2, table);
  const th4 = createTableHeader('Played Times', 3, table);
  const th5 = createTableHeader('Rating', 4, table);
  const th6 = createTableHeader('URL', 5, table);

  // Append the table header elements to the table row
  tr.appendChild(th7);
  tr.appendChild(th1);
  tr.appendChild(th2);
  tr.appendChild(th3);
  tr.appendChild(th4);
  tr.appendChild(th5);
  tr.appendChild(th6);

  const searchContainer = document.createElement('div');
  searchContainer.classList.add('search-container');
  
  const searchInput = document.createElement('input');
  searchInput.setAttribute('type', 'text');
  searchInput.setAttribute('placeholder', 'Search by artist or title');
  searchInput.setAttribute('id', 'search-input');
  
  searchContainer.appendChild(searchInput);
  modalDiv.appendChild(searchContainer);
  // Append the table row to the table header
  thead.appendChild(tr);

  // Create the table body
  const tbody = document.createElement('tbody');
  tbody.id = 'table-body';

  // Create the error message element
  const error = document.createElement('div');
  error.id = 'error';

  // Create the fetch buttons
  const fetchLocalStorageBtn = createFetchButton('Fetch from Local Storage', 'fetch-local-storage');
  const fetchApiBtn = createFetchButton('Fetch by API', 'fetch-api');
  const fetchHistoryBtn = createFetchButton('Fetch by History', 'fetch-history');


  // Attach event listeners to the fetch buttons
  fetchLocalStorageBtn.addEventListener('click', function () {
    console.log('Button clicked');
    fetchPlayedSongsFromLocalStorage().then(function (songs) { displaySongs(songs); }).catch(function (error) { displayError(error); });

  });

  fetchApiBtn.addEventListener('click', function () {
    fetchPlayedSongsByApi()
      .then(function (playedSongs) {
        console.log(playedSongs);
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  fetchHistoryBtn.addEventListener('click', function () {
    fetchPlayedSongsByHistory().then(
      function (songs) { displaySongs(songs); }).catch(
        function (error) { displayError(error); });
  });
  // Append the elements to the modal dialog
  table.appendChild(thead);
  table.appendChild(tbody);
  modalDiv.appendChild(table);
  modalDiv.appendChild(error);
  modalDiv.appendChild(fetchLocalStorageBtn);
  modalDiv.appendChild(fetchApiBtn);
  modalDiv.appendChild(fetchHistoryBtn);
  document.body.appendChild(modalDiv);
  fetchPlayedSongsFromLocalStorage().then(function (songs) { displaySongs(songs); }).catch(function (error) { displayError(error); });
}

// Helper function to create a table header element
function createTableHeader(text, index, table) {
  const th = document.createElement('th');
  th.textContent = text + ' \u2195';
  th.onclick = () => sortTable(table, index, 1);
  return th;
}

// Helper function to create a fetch button element
function createFetchButton(text, id) {
  const btn = document.createElement('button');
  btn.textContent = text;
  btn.id = id;
  return btn;
}


// Fetch played songs via YouTube Data API and store in browser's storage
function fetchPlayedSongsFromLocalStorage() {
  console.log('Fetching played songs from local storage...');
  return new Promise(function (resolve, reject) {

    let playedSongs = JSON.parse(localStorage.getItem('playedSongs')) || [];
    if (playedSongs && playedSongs.length > 0) {
      console.log('Played songs fetched from local storage:', playedSongs);
      resolve(playedSongs);
    } else {
      console.log('No played songs found in local storage.');
      reject('No played songs found in local storage');
    }

  })
    .catch(function (error) {
      console.log('An error occurred while fetching the list of played songs:', error);
      displayError('An error occurred while fetching the list of played songs.');
      displayError(error);
    });
}

function fetchPlayedSongsByApi() {
  const apiKey = 'AIzaSyCZxk6LF_GoVRjnxG1saAxOJrGpPhEj0QU';
  //const playlistId = 'PLFgquLnL59alW3xmYiWRaoz0oM3H17Lth';

  {YOUR_API_KEY}
  const url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&mine=true&key=${apiKey}`;
  return fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //const playedSongs = [];
      data.items.forEach(function (item) {
        const title = item.snippet.title;

        extractMediaInfo(htmltitle, item.snippet.url, item.visitCount,0,"","");
        // const artist = item.snippet.videoOwnerChannelTitle;
        // const duration = item.snippet.duration;
        // const existingSong = playedSongs.find(function (song) {
        //   return song.title === title && song.artist === artist;
        // });
        // if (existingSong) {
        //   existingSong.playedTimes++;
        // } else {
        //   playedSongs.push({ title, artist, duration, playedTimes: 1 });
        // }
      });
     // chrome.storage.local.set({ playedSongs: playedSongs });
      return playedSongs;
    });
}

function fetchPlayedSongsByHistory() {
  return new Promise(function (resolve, reject) {

    chrome.runtime.sendMessage({ action: "getHistory" }, function (response) {
      // Handle the response from the background script
      
      const historyItems = response.historyItems;
      for (let i = 0; i < historyItems.length; i++) {
        const item = historyItems[i];
        // Extract song title, artist and duration from YouTube video page title
        const htmltitle = item.title.replace(/^\([^()]+\)\s*/, "").split(' - YouTube')[0];
        extractMediaInfo(htmltitle, item.url, item.visitCount,0,"","");
      }
    
      
      console.log("getHistory response:");
      console.log(response.historyItems);
    });
    resolve(playedSongs);
  });
}

function displaySongs(songs) {

  const tableBody = document.getElementById('table-body');
  tableBody.textContent = '';
  songs.forEach(function (song) {
    const row = document.createElement('tr');
    const artistCell = document.createElement('td');
    const titleCell = document.createElement('td');
    const durationCell = document.createElement('td');
    const playedTimesCell = document.createElement('td');
    const ratingCell = document.createElement('td');
    const urlCell = document.createElement('td');
    const thumbnailCell = document.createElement('td');
    const thumbnail = document.createElement('img');
    thumbnail.width = 150;
    thumbnail.src = song.thumbnailUrl;
    thumbnailCell.appendChild(thumbnail);
    
    artistCell.textContent = song.artist;

    // if (song.src && song.src !== '') {
    //   const video = document.querySelector('video');
    //   video.src = song.src;
    //   video.play();

    //   titleCell.addEventListener('click', function () {
    //     if (song.src && song.src !== '') {
    //       const video = document.querySelector('video');
    //       video.src = song.src;
    //       video.play();
    //     }
    //      //   const videoId = song.url.match(/(?:v=)([\w-]+)/)[1];
    //     //  const player = document.querySelector('.html5-video-player');
    //     //  const video = document.querySelector('video');
    //     // const src = video.getAttribute('src');
         
    //   });
    //   titleCell.textContent = song.title;
    // }else{
      titleCell.innerHTML = "<a href='" + song.url + "' target='_blank' >" + song.title + "</a>";
  //  }
    
    durationCell.textContent = song.duration;
    playedTimesCell.textContent = song.playedTimes;
    ratingCell.textContent = song.rating;
    urlCell.textContent = song.url;
    row.appendChild(thumbnailCell);
    row.appendChild(titleCell);
    row.appendChild(artistCell);
    row.appendChild(durationCell);
    row.appendChild(playedTimesCell);
    row.appendChild(ratingCell);
    row.appendChild(urlCell);
    tableBody.appendChild(row);

      // Add click event listener to title cell
   
  });

  // Add placeholder row to table if no songs exist
  if (songs.length === 0) {
    const row = tableBody.insertRow();
    const cell = row.insertCell();
    cell.colSpan = 6; // Increase colspan to 6 for new cell
    cell.style.textAlign = 'center';
    cell.textContent = 'No songs to display';
    row.appendChild(cell);
  }

}

// Display error message
function displayError(message) {
  const errorDiv = document.getElementById('error');
  errorDiv.textContent = message;
  errorDiv.style.color = 'red';
  errorDiv.style.fontWeight = 'bold';
  errorDiv.style.marginTop = '10px';
}

// Fill media library view
function fillMediaLibrary() {
  const mediaLibrary = document.createElement('div');
  mediaLibrary.classList.add('media-library');

  // Add header to media library
  const header = document.createElement('h2');
  header.textContent = 'Media Library';
  mediaLibrary.appendChild(header);

  // Add table container to media library
  const tableContainer = document.createElement('div');
  tableContainer.id = 'table-container';
  mediaLibrary.appendChild(tableContainer);

  // Add media library to DOM
  const container = document.getElementById('container');
  container.textContent = '';
  container.appendChild(mediaLibrary);

  // Fetch and display songs
  //fetchPlayedSongsFromLocalStorage().then(function(songs) { displaySongs(songs); }).catch(function(error) { displayError(error); });  
}
// Call fillMediaLibrary function on page load
//window.addEventListener('load', fillMediaLibrary);

// Sort table by column index
function sortTable(table, column, direction) {
  const rows = Array.from(table.rows);
  const headerRow = rows.shift();
  const sortType = headerRow.cells[column].textContent.toLowerCase() === 'duration' ? 'time' : 'string';
  rows.sort((a, b) => {
    const aValue = a.cells[column].textContent;
    const bValue = b.cells[column].textContent;
    if (sortType === 'time') {
      return direction * (convertTimeToSeconds(aValue) - convertTimeToSeconds(bValue));
    } else {
      return direction * aValue.localeCompare(bValue);
    }
  });
  rows.unshift(headerRow);
  rows.forEach(row => table.appendChild(row));
}

// Convert time string to seconds
function convertTimeToSeconds(timeString) {
  const [minutes, seconds] = timeString.split(':').map(Number);
  return minutes * 60 + seconds;
}

window.addEventListener('load', createMusicLibraryButton);
window.addEventListener('load', createMediaTag);

window.addEventListener('load', createSearchTag);
