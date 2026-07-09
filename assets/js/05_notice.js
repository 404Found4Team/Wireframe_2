document.addEventListener('DOMContentLoaded', () => {
  if (location.hash === '#qna') {
    document.querySelector('.notice-tabs button[data-tab-target="qna"]').click();

    // 상단 공통 네비게이션 바도 "Q&A" 쪽이 빨갛게 강조되도록 갱신
    // (플랫폼 탭처럼 body의 data-nav-current는 "notice"로 고정돼 있어서 그대로 두면 항상 공지사항만 강조됨)
    document.querySelectorAll('.category-nav a[data-nav]').forEach((a) => {
      a.classList.toggle('active', a.dataset.nav === 'qna');
    });
  }
});
