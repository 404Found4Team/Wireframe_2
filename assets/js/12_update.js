document.getElementById('submitBtn').addEventListener('click', () => {
  if (!document.getElementById('review_title').value.trim()) {
    alert('제목을 입력해주세요.');
    return;
  }
  alert('게시글이 수정되었습니다. (데모)');
  location.href = '13_detail.html';
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