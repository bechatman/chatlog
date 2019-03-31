import { lfm, addAlbumArt } from '../../assets/utilities';

// If there is an artist and album, find the album art.

const albums = document.querySelectorAll('.album');

if (albums) {
  document.body.classList.add('has-albums');
  Array.from(albums).map(item => {
    if (item.dataset.album !== 'false' && item.dataset.artist !== 'false') {
      fetch(lfm('album.search', { album: item.dataset.album }))
        .then(response => response.json())
        .then(
          response =>
            response.results.albummatches.album.filter(
              test => test.artist === item.dataset.artist
            )[0]
        )
        .then(album => {
          if (album) {
            addAlbumArt(
              album,
              item,
              `${item.dataset.caption ? `${item.dataset.caption}<br />` : ''}${
                album.artist
              }, <a href="${album.url}">"${album.name}"</a>/Last.fm`
            );
          }
        })
        .catch(error => console.error(error));
    }
    return item;
  });
}
