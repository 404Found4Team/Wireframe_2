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

// ==========================================================================
// 챗봇 퀴즈: DB에서 객관식 1문제 + OX 1문제를 뽑아 출제, 하루 3번 제한
// (실제 구현 시 questionBank는 서버 DB 조회 결과로 대체)
// ==========================================================================
const QNA_QUIZ_DAILY_LIMIT = 3;
const QNA_QUIZ_QUESTION_BANK = {
  mc: [
    { question: '「오징어게임」은 어느 플랫폼의 오리지널 시리즈일까요?', options: ['디즈니플러스', '넷플릭스', '티빙', '웨이브'], answerIndex: 1 },
    { question: '다음 중 국내 OTT 플랫폼이 아닌 것은?', options: ['티빙', '웨이브', '쿠팡플레이', 'HBO'], answerIndex: 3 },
    { question: '「무빙」은 어느 플랫폼에서 방영되었을까요?', options: ['디즈니플러스', '넷플릭스', '티빙', '왓챠'], answerIndex: 0 },
  ],
  ox: [
    { question: '티빙(TVING)은 CJ ENM이 운영하는 국내 OTT 서비스이다.', answer: true },
    { question: '디즈니플러스는 국내 오리지널 콘텐츠를 전혀 제작하지 않는다.', answer: false },
    { question: '넷플릭스는 광고 요금제를 제공한 적이 없다.', answer: false },
  ],
};

function qnaQuizTodayKey() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function qnaQuizAttemptsLeft() {
  const today = qnaQuizTodayKey();
  if (localStorage.getItem('qnaQuizDate') !== today) {
    localStorage.setItem('qnaQuizDate', today);
    localStorage.setItem('qnaQuizAttemptsLeft', String(QNA_QUIZ_DAILY_LIMIT));
  }
  return Number(localStorage.getItem('qnaQuizAttemptsLeft') || QNA_QUIZ_DAILY_LIMIT);
}

function qnaQuizUseAttempt() {
  const left = Math.max(0, qnaQuizAttemptsLeft() - 1);
  localStorage.setItem('qnaQuizAttemptsLeft', String(left));
  return left;
}

function qnaQuizPickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function initQnaChatbotQuiz() {
  const startBtn = document.getElementById('qnaQuizStartBtn');
  const countLabel = document.getElementById('qnaQuizCount');
  const playBox = document.getElementById('qnaQuizPlay');
  const progressLabel = document.getElementById('qnaQuizProgress');
  const questionLabel = document.getElementById('qnaQuizQuestion');
  const optionsBox = document.getElementById('qnaQuizOptions');
  const nextBtn = document.getElementById('qnaQuizNextBtn');
  const resultBox = document.getElementById('qnaQuizResult');
  if (!startBtn) return;

  let questions = [];
  let step = 0;
  let correctCount = 0;

  function renderCount() {
    const left = qnaQuizAttemptsLeft();
    countLabel.textContent = `🎯 오늘 남은 퀴즈 횟수: ${left}/${QNA_QUIZ_DAILY_LIMIT}`;
    startBtn.disabled = left <= 0;
    startBtn.textContent = left <= 0 ? '오늘 퀴즈를 모두 사용했어요' : '퀴즈 시작';
  }

  function renderQuestion() {
    const q = questions[step];
    progressLabel.textContent = `문제 ${step + 1}/${questions.length} · ${q.type === 'mc' ? '객관식' : 'OX'}`;
    questionLabel.textContent = q.question;
    optionsBox.innerHTML = '';
    nextBtn.style.display = 'none';

    const choices = q.type === 'mc'
      ? q.options.map((label, i) => ({ label, correct: i === q.answerIndex }))
      : [{ label: 'O', correct: q.answer === true }, { label: 'X', correct: q.answer === false }];

    choices.forEach((choice) => {
      const btn = document.createElement('button');
      btn.textContent = choice.label;
      btn.dataset.correct = String(choice.correct);
      btn.addEventListener('click', () => {
        Array.from(optionsBox.children).forEach((b) => (b.disabled = true));
        if (choice.correct) {
          btn.classList.add('correct');
          correctCount += 1;
        } else {
          btn.classList.add('wrong');
          const correctBtn = Array.from(optionsBox.children).find((b) => b.dataset.correct === 'true');
          if (correctBtn) correctBtn.classList.add('correct');
        }
        if (step < questions.length - 1) {
          nextBtn.style.display = 'inline-block';
        } else {
          finishQuiz();
        }
      });
      optionsBox.appendChild(btn);
    });
  }

  function finishQuiz() {
    const left = qnaQuizUseAttempt();
    playBox.style.display = 'none';
    resultBox.style.display = 'block';
    resultBox.textContent = `✅ 2문제 중 ${correctCount}문제를 맞히셨어요! (오늘 남은 횟수 ${left}/${QNA_QUIZ_DAILY_LIMIT})`;
    renderCount();
  }

  startBtn.addEventListener('click', () => {
    if (qnaQuizAttemptsLeft() <= 0) return;
    questions = [
      Object.assign({ type: 'mc' }, qnaQuizPickRandom(QNA_QUIZ_QUESTION_BANK.mc)),
      Object.assign({ type: 'ox' }, qnaQuizPickRandom(QNA_QUIZ_QUESTION_BANK.ox)),
    ];
    step = 0;
    correctCount = 0;
    resultBox.style.display = 'none';
    playBox.style.display = 'block';
    renderQuestion();
  });

  nextBtn.addEventListener('click', () => {
    step += 1;
    renderQuestion();
  });

  renderCount();
}

initQnaChatbotQuiz();
