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
  const span = document.querySelector('.title span');

  if (window.pageYOffset > 0) {
    title.classList.add('scrolled');
    span.classList.add('scrolled');
  } else {
    title.classList.remove('scrolled');
    span.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', scrolled);
