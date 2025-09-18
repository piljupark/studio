// 원페이지 해시 라우팅 + 섹션 표시/숨김 + active nav + 페이지 초기화

const PAGES = ["dashboard", "management", "qualification", "education"];

function showPage(page) {
  const app = document.getElementById("app");
  const sections = app.querySelectorAll('section.main[data-page]');
  sections.forEach(sec => {
    const on = sec.dataset.page === page;
    sec.hidden = !on;
    if (on) {
      // 화면 전환 시 상단으로
      window.scrollTo({ top: 0, behavior: "auto" });
      // 페이지별 버튼/모달 바인딩
      if (typeof window.initPage === "function") {
        window.initPage(page);
      }
      // 첫 번째 보이는 이미지 우선 로딩 힌트
      const firstImg = sec.querySelector("img");
      if (firstImg) {
        firstImg.loading = "eager";
        firstImg.fetchPriority = "high";
        firstImg.decoding = "async";
      }
    }
  });

  // nav active
  const links = document.querySelectorAll('nav a[data-link]');
  links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${page}`));
}

function currentPageFromHash() {
  const hash = location.hash.replace(/^#/, "");
  return PAGES.includes(hash) ? hash : "dashboard";
}

function handleHashChange() {
  showPage(currentPageFromHash());
}

// nav 클릭 시 해시만 바꾸면 됩니다(기본 동작 사용)
window.addEventListener("hashchange", handleHashChange);
window.addEventListener("DOMContentLoaded", () => {
  // 초기 진입
  if (!location.hash) location.hash = "#dashboard";
  handleHashChange();

  // 마우스오버 시 다음 섹션 이미지 미리 워밍업(체감 전환 더 빠르게)
  document.addEventListener("mouseover", (e) => {
    const a = e.target.closest('a[data-link]');
    if (!a) return;
    const target = a.getAttribute("href")?.replace(/^#/, "");
    if (!PAGES.includes(target)) return;
    const sec = document.querySelector(`section[data-page="${target}"]`);
    if (!sec) return;
    sec.querySelectorAll('img[src]').forEach(img => {
      const preload = new Image();
      preload.decoding = "async";
      preload.src = img.getAttribute('src');
    });
  });
});
