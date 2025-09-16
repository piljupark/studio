// lxp.js

// ---------- Lottie UI ----------
class LottiUI {
  constructor(x, y) {
    const el = document.createElement("dotlottie-player");
    el.setAttribute("src", "https://lottie.host/824cb754-a11a-4458-bba0-1f5129c3ed76/NuLW5jGi8g.lottie");
    el.setAttribute("background", "transparent");
    el.setAttribute("speed", "1");
    el.setAttribute("loop", "true");
    el.setAttribute("autoplay", "true");

    // 화면 중앙 고정 표시
    el.style.position = "fixed";
    el.style.top = `${y ?? window.innerHeight / 2}px`;
    el.style.left = `${x ?? window.innerWidth / 2}px`;
    el.style.transform = "translate(-50%, -50%)";
    el.style.width = "220px";
    el.style.height = "220px";
    el.style.pointerEvents = "none";
    el.style.zIndex = "9999";

    document.body.appendChild(el);

    setTimeout(() => el.remove(), 3000);
  }
}

// ---------- Fullscreen ----------
function toggleFullscreen() {
  const doc = document;
  const el = doc.documentElement;

  if (!doc.fullscreenElement) {
    el.requestFullscreen?.().catch(err => alert(`Error: ${err.message}`));
  } else {
    doc.exitFullscreen?.();
  }
}

// ---------- 모달 헬퍼 ----------
function closeAllModals(root) {
  root.querySelectorAll(".modal.active").forEach(m => m.classList.remove("active"));
}

function openModalByNumber(root, num) {
  const modal = root.querySelector(`#modal${num}`);
  if (!modal) return;
  modal.classList.add("active");
}

// ---------- 초기화 진입점 (SPA에서 라우팅 후 호출) ----------
window.initPage = function initPage(pageName) {
  const root = document.getElementById("app") || document;

  // 1) 버튼 클릭 → 같은 페이지(.main) 안 모달 매칭해서 열기
  //    (#app가 매번 갈아끼워지므로 root에 바인딩하면 중복리스너 없음)
  root.addEventListener("click", onButtonClick);

  function onButtonClick(e) {
    const btn = e.target.closest(".button");
    if (!btn || !root.contains(btn)) return;

    // 같은 root 내 모든 모달 닫기
    closeAllModals(root);

    // 버튼 id에서 숫자 추출
    const id = btn.id || "";
    const num = id.replace("button", "");
    if (!num) return;

    // 해당 모달 열기
    openModalByNumber(root, num);

    // CLEAR 버튼(= button7)일 때 Lottie 띄우기
    if (num === "7") {
      new LottiUI(window.innerWidth / 2, window.innerHeight / 2);
    }
  }

  // 2) 모달 바깥 영역 클릭 시 닫기 (모달 요소 자체를 backdrop로 사용한다고 가정)
  root.addEventListener("click", (e) => {
    const modal = e.target.closest(".modal");
    if (!modal || !root.contains(modal)) return;
    // 모달 내부 컨텐츠가 별도 래퍼라면, 배경 클릭만 닫고 싶을 때 이렇게:
    if (e.target === modal) modal.classList.remove("active");
  });

  // 3) ESC 로 닫기 (전역은 한 번만 바인딩)
  if (!window.__lxpEscBound) {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const scope = document.getElementById("app") || document;
        closeAllModals(scope);
      }
    });
    window.__lxpEscBound = true;
  }

  // 4) 전체화면 버튼 (data-action="toggle-fullscreen")
  const fsBtn = root.querySelector('[data-action="toggle-fullscreen"]');
  if (fsBtn) {
    fsBtn.addEventListener("click", (e) => {
      e.preventDefault();
      toggleFullscreen();
    }, { once: true }); // 동일 버튼 중복 바인딩 방지
  }
};
