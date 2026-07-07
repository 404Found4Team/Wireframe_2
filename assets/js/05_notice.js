document.addEventListener('DOMContentLoaded', () => {
  if (location.hash === '#qna') {
    document.querySelector('.notice-tabs button[data-tab-target="qna"]').click();
  }
});
