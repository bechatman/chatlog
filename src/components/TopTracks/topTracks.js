import { lfm } from '../../assets/utilities';

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

const topTracksSection = document.querySelector('.top-tracks');

if (topTracksSection) {
  fetch(lfm('user.getTopAlbums', { period: '1month', limit: 6 }))
    .then(response => response.json())
    .then(results => {
      loadAlbums(results.topalbums.album);
    });
}
