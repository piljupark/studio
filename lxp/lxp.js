const LOTTIE_SRC = "https://lottie.host/824cb754-a11a-4458-bba0-1f5129c3ed76/NuLW5jGi8g.lottie";

const LottieManager = (() => {
  let el = null, hideTimer = null;

  function ensure() {
    if (el) return el;
    el = document.createElement("dotlottie-player");
    el.setAttribute("src", LOTTIE_SRC);
    el.setAttribute("background", "transparent");
    el.setAttribute("speed", "1");
    el.setAttribute("loop", "true");
    el.setAttribute("autoplay", "false");
    el.style.position = "fixed";
    el.style.top = "50%";
    el.style.left = "50%";
    el.style.transform = "translate(-50%, -50%)";
    el.style.display = "none";
    document.body.appendChild(el);
    return el;
  }

  function show(durationMs = 2000) {
    const p = ensure();
    try { p.stop?.(); p.seek?.(0); } catch {}
    p.style.display = "block";
    p.play?.();
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(hide, durationMs);
  }

  function hide() {
    if (!el) return;
    try { el.stop?.(); } catch {}
    el.style.display = "none";
  }

  function prewarm() { ensure(); }

  return { show, hide, prewarm };
})();

function toggleFullscreen() {
  const doc = document;
  const el = doc.documentElement;
  if (!doc.fullscreenElement) el.requestFullscreen?.().catch(()=>{});
  else doc.exitFullscreen?.();
}

function closeAllModals(root) {
  root.querySelectorAll(".modal.active").forEach(m => m.classList.remove("active"));
}

function openModalByNumber(root, num) {
  const modal = root.querySelector(`#modal${num}`);
  if (modal) modal.classList.add("active");
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
  LottieManager.prewarm();

  const buttons = getButtonsOnPage(root);
  if (buttons.length) setActiveButtonOpacity(root, buttons[0].num);

  if (!root.__lxpButtonBound) {
    root.addEventListener("click", (e) => {
      const btn = e.target.closest(".button");
      if (!btn || !root.contains(btn)) return;
      closeAllModals(root);
      const num = parseButtonNum(btn);
      if (!Number.isInteger(num)) return;
      openModalByNumber(root, num);
      if (num === 7) LottieManager.show(2000);
      setActiveButtonOpacity(root, num);
    });
    root.__lxpButtonBound = true;
  }

  if (!root.__lxpModalBound) {
    root.addEventListener("click", (e) => {
      const modal = e.target.closest(".modal");
      if (!modal || !root.contains(modal)) return;
      if (e.target === modal) modal.classList.remove("active");
    });
    root.__lxpModalBound = true;
  }

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
  if (fsBtn && !fsBtn.__lxpFsBound) {
    fsBtn.addEventListener("click", (e) => {
      e.preventDefault();
      toggleFullscreen();
    });
    fsBtn.__lxpFsBound = true;
  }
};
