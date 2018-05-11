let heroLocation;
function scrolled() {
  const title = document.querySelector('.title');

  if (window.pageYOffset > heroLocation) {
    title.classList.add('scrolled');
  } else {
    title.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', scrolled);
window.addEventListener('DOMContentLoaded', () => {
  heroLocation =
    document.querySelector('.hero').getBoundingClientRect().bottom -
    document.querySelector('body > header').getBoundingClientRect().height;
  console.log(heroLocation);
  const title = document.querySelector('.title a');
  const updatedTitle = title.innerHTML
    .split('')
    .map(item => `<span>${item}</span>`);
  title.innerHTML = updatedTitle.join('');
});
