const routes = {
  "/lxp/": "/lxp/pages/dashboard.html",
  "/lxp/management": "/lxp/pages/management.html",
  "/lxp/qualification": "/lxp/pages/qualification.html",
  "/lxp/education": "/lxp/pages/education.html",
};

async function loadPage(pathname) {
  const route = routes[pathname] || routes["/"];
  try {
    const html = await fetch(route, { cache: "no-cache" }).then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.text();
    });

    // partial을 #app에 삽입
    const app = document.querySelector("#app");
    app.innerHTML = html;

    // 스크롤 상단으로
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });

    // nav active 표시 업데이트
    setActiveNav(pathname);

    // 페이지별 초기화 (버튼/모달/애니메이션)
    if (typeof window.initPage === "function") {
      // pathname 기준으로 페이지 이름 전달 (예: "education")
      const pageName = pathname === "/" ? "dashboard" : pathname.replace(/^\//, "");
      window.initPage(pageName);
    }
  } catch (e) {
    document.querySelector("#app").innerHTML = `
      <section class="error">
        <h1>페이지를 불러오지 못했습니다</h1>
        <p>${route} 로드 중 오류가 발생했습니다.</p>
      </section>`;
    console.error(e);
  }
}

function setActiveNav(pathname) {
  const links = document.querySelectorAll('nav a[data-link]');
  links.forEach(a => {
    const href = a.getAttribute("href");
    a.classList.toggle("active", href === pathname || (pathname === "/" && href === "/"));
  });
}

// nav 클릭 가로채기
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[data-link]');
  if (!a) return;
  const url = a.getAttribute("href");
  if (url == null) return;

  e.preventDefault();
  if (location.pathname !== url) {
    history.pushState(null, "", url);
    loadPage(url);
  }
});

// 뒤/앞으로 가기
window.addEventListener("popstate", () => {
  loadPage(location.pathname);
});

// 첫 로드
window.addEventListener("DOMContentLoaded", () => {
  loadPage(location.pathname);
});
