function hasPosts() {
  const listing = document.querySelector('.listing');
  const posts = listing.querySelectorAll('.post');
  if (listing && !posts.length) {
    listing.remove();
  }
}

window.addEventListener('DOMContentLoaded', hasPosts);
