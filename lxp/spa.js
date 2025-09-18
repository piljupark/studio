// spa.js

// -------------------------
//  라우트 정의
// -------------------------
const routes = {
  "/lxp/": "/lxp/pages/dashboard.html",
  "/lxp/management": "/lxp/pages/management.html",
  "/lxp/qualification": "/lxp/pages/qualification.html",
  "/lxp/education": "/lxp/pages/education.html",
};

// -------------------------
//  간단한 메모리 캐시 & 프리페치
// -------------------------
const routeCache = new Map(); // pathname -> { html, parsed(DocumentFragment), t:number }
const PREFETCH_TIMEOUT = 8000;

// HTML 문자열을 DocumentFragment로 파싱
function parseHTML(html) {
  const tpl = document.createElement("template");
  tpl.innerHTML = html.trim();
  return tpl.content;
}

// 다음 페이지에서 사용할 이미지 미리 네트워크 워밍업
function warmupImages(fragment) {
  const imgs = [...fragment.querySelectorAll("img[src]")];
  for (const img of imgs) {
    const src = img.getAttribute("src");
    if (!src) continue;
    const pre = new Image();
    if (img.hasAttribute("data-hero")) pre.fetchPriority = "high";
    pre.decoding = "async";
    pre.src = src; // 브라우저 캐시에 미리 쌓임
  }
}

// 현재 mount할 fragment의 이미지 우선순위/지연로딩 조정
function upgradeImagePriority(fragment) {
  const imgs = fragment.querySelectorAll("img");
  imgs.forEach((img, idx) => {
    if (img.hasAttribute("data-hero") || idx === 0) {
      img.loading = "eager";
      img.fetchPriority = "high";
      img.decoding = "async";
    } else {
      img.loading = "lazy";
      img.decoding = "async";
    }
  });
}

// 특정 경로 프리페치
async function prefetch(pathname) {
  const route = routes[pathname];
  if (!route || routeCache.has(pathname)) return;

  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), PREFETCH_TIMEOUT);

  try {
    const res = await fetch(route, { cache: "force-cache", signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const parsed = parseHTML(html);
    warmupImages(parsed);
    routeCache.set(pathname, { html, parsed: parsed.cloneNode(true), t: Date.now() });
  } catch {
    // 실패는 조용히 무시 (네트워크 상태에 따라)
  } finally {
    clearTimeout(to);
  }
}

// -------------------------
//  페이지 로드
// -------------------------
async function loadPage(pathname) {
  const route = routes[pathname] || routes["/lxp/"];
  const app = document.querySelector("#app");

  let fragment;

  // 1) 캐시에 있으면 즉시 렌더
  if (routeCache.has(pathname)) {
    fragment = routeCache.get(pathname).parsed.cloneNode(true);
  } else {
    // 2) 없으면 스켈레톤 먼저 보여주고 가져오기
    app.innerHTML = `
      <section class="skeleton" aria-busy="true" aria-live="polite">
        <div class="bar"></div>
        <div class="card"></div>
      </section>
    `;

    try {
      const res = await fetch(route, { cache: "force-cache" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();
      fragment = parseHTML(html);
      warmupImages(fragment);
      routeCache.set(pathname, { html, parsed: fragment.cloneNode(true), t: Date.now() });
    } catch (e) {
      app.innerHTML = `
        <section class="error">
          <h1>페이지를 불러오지 못했습니다</h1>
          <p>${route} 로드 중 오류가 발생했습니다.</p>
        </section>`;
      console.error(e);
      return;
    }
  }

  // 이미지 우선순위 최적화 후 마운트
  upgradeImagePriority(fragment);
  app.replaceChildren(fragment);

  // 스크롤 상단
  window.scrollTo({ top: 0, behavior: "auto" });

  // nav active 처리
  setActiveNav(pathname);

  // 페이지별 초기화
  if (typeof window.initPage === "function") {
    // "/lxp/management" -> "management", "/lxp/" -> "dashboard"
    let pageName = "dashboard";
    if (pathname !== "/lxp/") {
      const parts = pathname.replace(/^\/+/, "").split("/");
      pageName = parts[parts.length - 1] || "dashboard";
    }
    window.initPage(pageName);
  }
}

// -------------------------
//  Nav active 표시
// -------------------------
function setActiveNav(pathname) {
  const links = document.querySelectorAll('nav a[data-link]');
  links.forEach(a => {
    const href = a.getAttribute("href");
    a.classList.toggle("active", href === pathname);
  });
}

// -------------------------
//  이벤트: 라우팅 가로채기
// -------------------------
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[data-link]');
  if (!a) return;
  const url = a.getAttribute("href");
  if (!url) return;

  e.preventDefault();
  if (location.pathname !== url) {
    history.pushState(null, "", url);
    loadPage(url);
  }
});

// hover 시 프리페치
document.addEventListener("mouseover", (e) => {
  const a = e.target.closest('a[data-link]');
  if (!a) return;
  const url = a.getAttribute("href");
  if (url) prefetch(url);
});

// idle 시 전체 후보 프리페치 (지원 브라우저에서만)
window.requestIdleCallback?.(() => {
  Object.keys(routes).forEach(prefetch);
}, { timeout: 2000 });

// 뒤/앞으로 가기
window.addEventListener("popstate", () => {
  loadPage(location.pathname);
});

// 첫 로드
window.addEventListener("DOMContentLoaded", () => {
  loadPage(location.pathname);
});
