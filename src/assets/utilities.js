/** ********************
Last.fm API Wrapper
********************** */

export const lfm = (command, options) => {
  if (options) {
    const paramsAll = Object.keys(options).map(
      item => `${item}=${options[item]}`
    );
    const params = `&${paramsAll.join('&')}`;
    return `https://ws.audioscrobbler.com/2.0/?method=${command}&user=bechatman&api_key=25b4be602a0fd2eefc999e4f620f3275${params}&format=json`;
  }
  return `https://ws.audioscrobbler.com/2.0/?method=${command}&user=bechatman&api_key=25b4be602a0fd2eefc999e4f620f3275&format=json`;
};

export const addAlbumArt = (album, element, caption) => {
  if (album && element) {
    const { image } = album;
    const figure = document.createElement('figure');
    figure.innerHTML += `<img src="${
      image[image.length - 1]['#text']
    }" alt="" aria-describedby="copyright" />
    <figcaption id="copyright">${
      caption !== '' ? caption : 'Art provided by Last.fm'
    }</figcaption>`;
    element.append(figure);
  }
};
