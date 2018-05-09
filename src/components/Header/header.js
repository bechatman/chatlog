function throttle(fn, wait) {
  let time = Date.now();
  return function() {
    if (time + wait - Date.now() < 0) {
      fn();
      time = Date.now();
    }
  };
}

function scrolled() {
  const title = document.querySelector('.title');

  if (window.pageYOffset > 0) {
    title.classList.add('scrolled');
  } else {
    title.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', scrolled);
window.addEventListener('DOMContentLoaded', () => {
  const title = document.querySelector('.title a');
  const updatedTitle = title.innerHTML
    .split('')
    .map(item => `<span>${item}</span>`);
  title.innerHTML = updatedTitle.join('');
});
