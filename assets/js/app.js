// ==========================================================================
// OTT 리뷰 웹사이트 - 화면 초안 공통 인터랙션 (와이어프레임 목업용)
// ==========================================================================

// ---- 로그인/권한 상태 시뮬레이션 (실제 구현 시 인증 상태로 대체) ----
const DEMO_ROLE = localStorage.getItem("demoRole") || "guest"; // guest | user | critic | admin

function applyRoleVisibility() {
  document.querySelectorAll("[data-role-visible]").forEach((el) => {
    const allowed = el.dataset.roleVisible.split(",").map((r) => r.trim());
    el.style.display = allowed.includes(DEMO_ROLE) ? "" : "none";
  });
}

function setDemoRole(role) {
  localStorage.setItem("demoRole", role);
  location.reload();
}

// ---- 오버레이 패널 (챗봇 / 채팅방) ----
function initOverlay(panelId, backdropId, openTriggerIds, closeTriggerIds, bodyClass, toggleOnTrigger) {
  const panel = document.getElementById(panelId);
  const backdrop = document.getElementById(backdropId);
  if (!panel) return;

  const open = () => {
    panel.classList.add("open");
    backdrop && backdrop.classList.add("open");
    if (bodyClass) document.body.classList.add(bodyClass);
  };
  const close = () => {
    panel.classList.remove("open");
    backdrop && backdrop.classList.remove("open");
    if (bodyClass) document.body.classList.remove(bodyClass);
  };

  openTriggerIds.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("click", () => {
      if (toggleOnTrigger && panel.classList.contains("open")) close();
      else open();
    });
  });
  closeTriggerIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", close);
  });
  backdrop && backdrop.addEventListener("click", close);
}

// ---- 탭 전환 공통 ----
function initTabs(tabGroupSelector) {
  document.querySelectorAll(tabGroupSelector).forEach((group) => {
    const buttons = group.querySelectorAll("[data-tab-target]");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetSelector = btn.dataset.tabTarget;
        const tabContainer = btn.closest("[data-tab-panels]");
        const panelGroup = (tabContainer && tabContainer.parentElement) || document;
        const panels = panelGroup.querySelectorAll("[data-tab-panel]");

        buttons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        panels.forEach((p) => {
          p.style.display = p.dataset.tabPanel === targetSelector ? "" : "none";
        });
      });
    });
  });
}

// ---- 퀴즈 인터랙션 (챗봇 패널) ----
function initQuiz() {
  document.querySelectorAll(".quiz-options button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const options = btn.parentElement.querySelectorAll("button");
      const isCorrect = btn.dataset.correct === "true";
      options.forEach((o) => (o.disabled = true));
      btn.classList.add(isCorrect ? "correct" : "wrong");
      if (!isCorrect) {
        const correctBtn = Array.from(options).find((o) => o.dataset.correct === "true");
        correctBtn && correctBtn.classList.add("correct");
      }
    });
  });
}

// ---- 퀴즈 시작 버튼 (챗봇 패널) ----
function initQuizStart() {
  const startBtn = document.getElementById("quizStartBtn");
  const options = document.getElementById("quizOptions");
  if (!startBtn || !options) return;
  startBtn.addEventListener("click", () => {
    options.style.display = "grid";
    startBtn.disabled = true;
  });
}

// ---- 방장(평론가) 퇴장 시 채팅방 삭제 경고 ----
function confirmRoomLeave() {
  const ok = confirm(
    "방장이 퇴장하면 채팅방이 삭제되고 대화 내용이 모두 사라집니다.\n정말 퇴장하시겠습니까?"
  );
  if (ok) {
    alert("채팅방이 삭제되었습니다. (데모)");
  }
}

// ---- 채팅방: 방장(평론가/관리자)의 채팅 내 경고 부여 ----
function giveChatWarning() {
  const name = prompt("경고를 부여할 사용자의 닉네임을 입력하세요.");
  if (!name || !name.trim()) return;
  const messages = document.getElementById("chatroomMessages");
  if (!messages) return;
  const msg = document.createElement("div");
  msg.className = "chat-msg system warning";
  msg.textContent = `⚠ ${name.trim()}님 경고 1회`;
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}

// ---- 채팅방: 실시간 채팅 입력/전송 & 방 개설(최대 인원) ----
function initChatroomChat() {
  const messages = document.getElementById("chatroomMessages");
  const input = document.getElementById("chat_message_content");
  const sendBtn = document.getElementById("chatroomSendBtn");
  if (messages && input && sendBtn) {
    const send = () => {
      const text = input.value.trim();
      if (!text) return;
      const msg = document.createElement("div");
      msg.className = "chat-msg me";
      msg.innerHTML = '<div class="avatar"></div><div class="bubble"></div>';
      msg.querySelector(".bubble").textContent = text;
      messages.appendChild(msg);
      input.value = "";
      messages.scrollTop = messages.scrollHeight;

      setTimeout(() => {
        const reply = document.createElement("div");
        reply.className = "chat-msg";
        reply.innerHTML = '<div class="avatar"></div><div class="bubble"></div>';
        reply.querySelector(".bubble").textContent = "ㅋㅋㅋ 저도 그렇게 생각해요";
        messages.appendChild(reply);
        messages.scrollTop = messages.scrollHeight;
      }, 900);
    };
    sendBtn.addEventListener("click", send);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") send();
    });
  }

  const roomNameInput = document.getElementById("chatroom_title");
  const maxUserInput = document.getElementById("chatroom_max_member");
  const createBtn = document.getElementById("chatroomCreateBtn");
  if (roomNameInput && maxUserInput && createBtn) {
    createBtn.addEventListener("click", () => {
      const name = roomNameInput.value.trim();
      const maxUsers = Number(maxUserInput.value);
      if (!name) {
        alert("방 이름을 입력해주세요.");
        return;
      }
      if (!maxUsers || maxUsers < 2) {
        alert("최대 인원은 2명 이상으로 입력해주세요.");
        return;
      }
      alert(`채팅방이 개설되었습니다. (데모)\n방 이름: ${name}\n최대 인원: ${maxUsers}명`);
      roomNameInput.value = "";
      maxUserInput.value = "30";
    });
  }
}

// ---- 취향/장르 선택 칩 (회원가입 / 마이페이지 공용) ----
function initGenreChips() {
  document.querySelectorAll(".genre-chip").forEach((chip) => {
    chip.addEventListener("click", () => chip.classList.toggle("selected"));
  });
}

// ---- 드롭다운 메뉴 (마이페이지 등) ----
function initDropdowns() {
  document.querySelectorAll("[data-dropdown-trigger]").forEach((trigger) => {
    const menu = document.getElementById(trigger.dataset.dropdownTrigger);
    if (!menu) return;
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      menu.classList.toggle("open");
    });
  });
  document.addEventListener("click", () => {
    document.querySelectorAll(".dropdown-menu.open").forEach((m) => m.classList.remove("open"));
  });
}

// ---- 히어로 배너 슬라이더 (점 인디케이터 전환) ----
function initHeroSlider() {
  const slider = document.querySelector(".hero-slider");
  const slides = document.querySelectorAll(".hero-slide-content");
  const dots = document.querySelectorAll(".hero-dots span");
  if (!slider || !slides.length) return;

// 배너 3초 마다 자동으로 바뀜 -나영-
  const AUTO_PLAY_MS = 3000;
  let index = 0;
  let timerId = null;
console.log(slides.length);

  function showSlide(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach((s, n) => s.classList.toggle("active", n === index));
    dots.forEach((d, n) => d.classList.toggle("active", n === index));
  }

  function next() { showSlide(index + 1); }
  function prev() { showSlide(index - 1); }

  function startAutoPlay() {
    stopAutoPlay();
    timerId = setInterval(next, AUTO_PLAY_MS);
  }
  function stopAutoPlay() {
    if (timerId) clearInterval(timerId);
    timerId = null;
  }

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => { showSlide(i); startAutoPlay(); });
  });

  const prevBtn = document.getElementById("heroPrev");
  const nextBtn = document.getElementById("heroNext");
  if (prevBtn) prevBtn.addEventListener("click", () => { prev(); startAutoPlay(); });
  if (nextBtn) nextBtn.addEventListener("click", () => { next(); startAutoPlay(); });

  slider.addEventListener("mouseenter", stopAutoPlay);
  slider.addEventListener("mouseleave", startAutoPlay);

  showSlide(0);
  startAutoPlay();
}

// ---- 상단 카테고리 네비게이션: 현재 보고 있는 페이지/카테고리에 맞는 탭만 빨간색으로 강조 ----
function initCategoryNav() {
  const nav = document.querySelector(".category-nav");
  if (!nav) return;

  const isListPage = location.pathname.split("/").pop() === "04_list.html";
  const current = isListPage
    ? new URLSearchParams(location.search).get("cat") || "all"
    : document.body.dataset.navCurrent || "";

  nav.querySelectorAll("a[data-nav]").forEach((a) => {
    a.classList.toggle("active", a.dataset.nav === current);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  applyRoleVisibility();
  initDropdowns();
  initHeroSlider();
  initCategoryNav();

  initOverlay("chatbotPanel", "chatbotBackdrop", ["chatbotFab"], ["chatbotClose"], null, true);
  initOverlay("chatroomPanel", "chatroomBackdrop", ["chatroomTrigger"], ["chatroomClose"], "chatroom-open");
  initOverlay("notificationPanel", "notificationBackdrop", ["notificationTrigger"], ["notificationClose"], "notification-open");

  initTabs(".panel-tabs");
  initTabs(".mypage-tabs");
  initTabs(".admin-nav");
  initTabs(".platform-tabs");
  initTabs(".notice-tabs");

  initQuiz();
  initQuizStart();
  initChatroomChat();
  initGenreChips();

  const roleSwitcher = document.getElementById("demoRoleSwitcher");
  if (roleSwitcher) {
    roleSwitcher.value = DEMO_ROLE;
    roleSwitcher.addEventListener("change", (e) => setDemoRole(e.target.value));
  }
});
