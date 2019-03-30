const lfm = (command, options) => {
  if (options) {
    const paramsAll = Object.keys(options).map(
      item => `${item}=${options[item]}`
    );
    const params = `&${paramsAll.join('&')}`;
    return `https://ws.audioscrobbler.com/2.0/?method=${command}&user=bechatman&api_key=25b4be602a0fd2eefc999e4f620f3275${params}&format=json`;
  }
  return `https://ws.audioscrobbler.com/2.0/?method=${command}&user=bechatman&api_key=25b4be602a0fd2eefc999e4f620f3275&format=json`;
};

function loadAlbums(albums) {
  const albumListing = document.querySelector('.albums');
  albums.forEach(item => {
    const { name, artist, image } = item;
    const template = `
      <li><img src="${image[image.length - 1]['#text']}" alt="">
      <a href="${artist.url}" class="overlay">
        <span class="artist">${artist.name}</span>
        <span class="album">${name}</span>
      </a>
    </li>`;
    albumListing.innerHTML += template;
    setTimeout(() => {
      document.querySelector('.albums').classList.add('active');
    }, 500);
  });
}

function addAlbumArt(album, element) {
  if (album && element) {
    const { image } = album;
    const figure = document.createElement('figure');
    figure.innerHTML += `<img src="${
      image[image.length - 1]['#text']
    }" alt="Album Cover" aria-describedby="copyright" />
    <figcaption id="copyright">Art provided by Last.fm</figcaption>`;
    figure.classList.add('albumArt');
    element.prepend(figure);
  }
}

const topTracksSection = document.querySelector('.top-tracks');

if (topTracksSection) {
  fetch(lfm('user.getTopAlbums', { period: '1month', limit: 6 }))
    .then(response => response.json())
    .then(results => {
      loadAlbums(results.topalbums.album);
    });
}

// If there is an artist and album, find the album art.

const blogPost = document.querySelector('.blogPost .container');

if (
  blogPost &&
  blogPost.dataset.album !== 'false' &&
  blogPost.dataset.artist !== 'false'
) {
  fetch(lfm('album.search', { album: blogPost.dataset.album }))
    .then(response => response.json())
    .then(response => response.results.albummatches.album)
    .then(results =>
      results.filter(
        album =>
          album.artist === blogPost.dataset.artist &&
          album.name === blogPost.dataset.album
      )
    )
    .then(album => addAlbumArt(album[0], blogPost));
}
