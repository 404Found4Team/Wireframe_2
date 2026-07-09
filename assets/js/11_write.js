const DRAFT_KEY = 'youflex_write_drafts';

function getDrafts() {
  try {
    return JSON.parse(localStorage.getItem(DRAFT_KEY)) || [];
  } catch {
    return [];
  }
}
function setDrafts(drafts) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(drafts));
}

// ===== 별점 클릭 처리(웅조) ===============
		let stars  = document.querySelectorAll(".rating-input span");
		let ratingInput = document.querySelector("input[name='postRating']");
		
		console.log(stars);
		console.log(ratingInput);
		
		// 별 표시 업데이트 - rating 개수만큼 active(노란색), 나머지는 비활성화
		function updateStars(rating){
			stars.forEach(function(s, i){
				if(i < rating){
					s.classList.add("active");
				} else{
					s.classList.remove("active");
				}
			});
		}
		
		stars.forEach(function(star, index){
			// 클릭 이벤트 - 별점 확정 + hidden필드 값 변경
			star.addEventListener("click", function(){
				ratingInput.value = index + 1;
				updateStars(index + 1);
				console.log(ratingInput);
			});
			
			// 마우스 올릴때 - 미리보기(해당 별까지 노란색으로 표시)
			star.addEventListener("mouseover", function(){
				updateStars(index + 1);
			});
			
			// 마우스 나갈때 - 현재 확정된 별점으로 유지
		 	star.addEventListener("mouseout", function(){
				updateStars(parseInt(ratingInput.value));
			});
		});

// ===== 사진 업로드 미리보기 수정(웅조)===== 
		// [1] 파일 선택칸과 미리보기 이미지를 가져온다
		const imgInput = document.getElementById('imgInput');    // <input type="file">
		const imgPreview = document.getElementById('imgPreview');  // 미리보기 <img>

		// [2] 파일을 선택하면(change) 그 사진을 화면에 미리 보여준다
		imgInput.addEventListener('change', function () {
			const file = imgInput.files[0];               // 선택한 파일 (없으면 undefined)
			if (!file) return;

			const reader = new FileReader();              // 파일을 화면에 쓸 수 있는 형태로 읽는 도구
			reader.onload = function (e) {
				imgPreview.src = e.target.result;         // 읽어들인 이미지를 미리보기에 넣음
				imgPreview.style.display = 'block';       // 숨겨둔 미리보기를 보이게 함
			};
			reader.readAsDataURL(file);                   // 파일 읽기 시작
		});

function renderDraftList() {
  const drafts = getDrafts();
  const listEl = document.getElementById('draftList');
  const emptyMsg = document.getElementById('draftEmptyMsg');
  listEl.innerHTML = '';
  if (drafts.length === 0) {
    emptyMsg.style.display = '';
    return;
  }
  emptyMsg.style.display = 'none';
  drafts.slice().reverse().forEach((draft) => {
    const item = document.createElement('div');
    item.className = 'draft-item';

    const infoEl = document.createElement('div');
    infoEl.className = 'draft-info';
    const titleEl = document.createElement('div');
    titleEl.className = 'draft-title';
    titleEl.textContent = draft.title || '(제목 없음)';
    const timeEl = document.createElement('div');
    timeEl.className = 'draft-time';
    timeEl.textContent = draft.savedAt;
    infoEl.appendChild(titleEl);
    infoEl.appendChild(timeEl);

    const actionsEl = document.createElement('div');
    actionsEl.className = 'draft-actions';
    const loadBtn = document.createElement('button');
    loadBtn.type = 'button';
    loadBtn.className = 'btn btn-sm';
    loadBtn.textContent = '불러오기';
    loadBtn.addEventListener('click', () => loadDraft(draft.id));
    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'btn btn-sm btn-danger';
    deleteBtn.textContent = '삭제';
    deleteBtn.addEventListener('click', () => deleteDraft(draft.id));
    actionsEl.appendChild(loadBtn);
    actionsEl.appendChild(deleteBtn);

    item.appendChild(infoEl);
    item.appendChild(actionsEl);
    listEl.appendChild(item);
  });
}

function loadDraft(id) {
  const draft = getDrafts().find((d) => d.id === id);
  if (!draft) return;
  document.getElementById('genre_category_id').value = draft.category;
  document.getElementById('review_platform').value = draft.platform;
  document.getElementById('review_title').value = draft.title;
  document.getElementById('review_content').value = draft.body;
  document.getElementById('review_related').value = draft.related;
  alert('임시저장된 글을 불러왔습니다.');
}

function deleteDraft(id) {
  if (!confirm('이 임시저장 글을 삭제하시겠습니까?')) return;
  setDrafts(getDrafts().filter((d) => d.id !== id));
  renderDraftList();
}

document.getElementById('draftBtn').addEventListener('click', () => {
  const now = new Date();
  // Date 사용은 데모 목적의 UI 표시용
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const timeStr = `${hh}:${mm}`;

  const drafts = getDrafts();
  drafts.push({
    id: Date.now(),
    title: document.getElementById('review_title').value.trim(),
    category: document.getElementById('genre_category_id').value,
    platform: document.getElementById('review_platform').value,
    body: document.getElementById('review_content').value,
    related: document.getElementById('review_related').value,
    savedAt: timeStr,
  });
  setDrafts(drafts);
  renderDraftList();

  const hint = document.getElementById('autosaveHint');
  hint.textContent = `임시저장됨 (${timeStr})`;
  hint.classList.add('saved');
});

renderDraftList();

document.getElementById('submitBtn').addEventListener('click', () => {
  if (!document.getElementById('review_title').value.trim()) {
    alert('제목을 입력해주세요.');
    return;
  }
  alert('게시글이 등록되었습니다. (데모)');
  location.href = '13_detail.html';
});
