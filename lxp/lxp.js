class LottiUI {
  constructor(x, y) {
    const el = document.createElement("dotlottie-player");
    el.setAttribute("src", "https://lottie.host/824cb754-a11a-4458-bba0-1f5129c3ed76/NuLW5jGi8g.lottie");
    el.setAttribute("background", "transparent");
    el.setAttribute("speed", "1");
    el.setAttribute("loop", "true");
    el.setAttribute("autoplay", "true");
    el.style.position = "fixed";
    el.style.top = `${y ?? window.innerHeight / 2}px`;
    el.style.left = `${x ?? window.innerWidth / 2}px`;
    el.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  }
}

function toggleFullscreen() {
  const doc = document;
  const el = doc.documentElement;
  if (!doc.fullscreenElement) {
    el.requestFullscreen?.().catch(err => alert(`Error: ${err.message}`));
  } else {
    doc.exitFullscreen?.();
  }
}

function closeAllModals(root) {
  root.querySelectorAll(".modal.active").forEach(m => m.classList.remove("active"));
}

function openModalByNumber(root, num) {
  const modal = root.querySelector(`#modal${num}`);
  if (!modal) return;
  modal.classList.add("active");
}

function parseButtonNum(el) {
  const id = el.id || "";
  const m = id.match(/^button(\d+)$/);
  return m ? Number(m[1]) : null;
}

function getButtonsOnPage(root) {
  return Array.from(root.querySelectorAll(".button"))
    .map(el => ({ el, num: parseButtonNum(el) }))
    .filter(x => Number.isInteger(x.num))
    .sort((a, b) => a.num - b.num);
}

function setActiveButtonOpacity(root, activeNum) {
  const buttons = getButtonsOnPage(root);
  for (const { el, num } of buttons) {
    el.style.opacity = num === activeNum ? "1" : "0.4";
  }
}

window.initPage = function initPage(pageName) {
  const root = document.getElementById("app") || document;
  const buttons = getButtonsOnPage(root);
  if (buttons.length) setActiveButtonOpacity(root, buttons[0].num);

  const onButtonClick = (e) => {
    const btn = e.target.closest(".button");
    if (!btn || !root.contains(btn)) return;
    closeAllModals(root);
    const num = parseButtonNum(btn);
    if (!Number.isInteger(num)) return;
    openModalByNumber(root, num);
    if (num === 7) new LottiUI(window.innerWidth / 2, window.innerHeight / 2);
    setActiveButtonOpacity(root, num);
  };
  root.addEventListener("click", onButtonClick);

  root.addEventListener("click", (e) => {
    const modal = e.target.closest(".modal");
    if (!modal || !root.contains(modal)) return;
    if (e.target === modal) modal.classList.remove("active");
  });

  if (!window.__lxpEscBound) {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const scope = document.getElementById("app") || document;
        closeAllModals(scope);
      }
    });
    window.__lxpEscBound = true;
  }

  const fsBtn = root.querySelector('[data-action="toggle-fullscreen"]');
  if (fsBtn) {
    fsBtn.addEventListener("click", (e) => {
      e.preventDefault();
      toggleFullscreen();
    }, { once: true });
  }
};
