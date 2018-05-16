function hasPosts() {
  const listing = document.querySelector('.listing');
  if (listing) {
    const posts = listing.querySelectorAll('.post');

    if (!posts.length) {
      listing.remove();
    }
  }
}

window.addEventListener('DOMContentLoaded', hasPosts);
