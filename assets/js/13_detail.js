function openReportModal(targetType) {
  const type = targetType === 'comment' ? '댓글' : '게시글';
  document.getElementById('reportTargetChip').textContent = `신고 대상: ${type}`;
  document.getElementById('reportReasonSelect').selectedIndex = 0;
  document.getElementById('reportDetailInput').value = '';
  document.getElementById('reportModalBackdrop').classList.add('open');
}
function closeReportModal() {
  document.getElementById('reportModalBackdrop').classList.remove('open');
}
function submitReportModal() {
  alert('신고가 접수되었습니다. 운영자 확인 후 처리됩니다.');
  closeReportModal();
}

function toggleCommentLike(el) {
  const liked = el.classList.toggle('liked');
  const count = parseInt(el.dataset.count, 10) + (liked ? 1 : -1);
  el.dataset.count = count;
  el.textContent = `♥ 좋아요 ${count}`;
}
