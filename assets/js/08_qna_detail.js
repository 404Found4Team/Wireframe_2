const commentInput = document.getElementById('qna_comment_content');
const commentCountLabel = document.getElementById('commentCountLabel');
const commentList = document.getElementById('commentList');
let commentCount = 3;

document.getElementById('commentSubmitBtn').addEventListener('click', () => {
  const val = commentInput.value.trim();
  if (!val) {
    alert('댓글 내용을 입력해주세요.');
    return;
  }
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

  const item = document.createElement('div');
  item.className = 'qna-comment-item';
  item.innerHTML = `
    <div class="qna-comment-left">
      <div class="qna-comment-avatar"></div>
      <div>
        <span class="qna-comment-author">나</span><span class="qna-comment-date">${dateStr}</span>
        <div class="qna-comment-body"></div>
      </div>
    </div>
    <span class="qna-comment-more">⋮</span>
  `;
  item.querySelector('.qna-comment-body').textContent = val;
  commentList.appendChild(item);

  commentCount += 1;
  commentCountLabel.textContent = `댓글 (${commentCount})`;

  commentInput.value = '';
});
