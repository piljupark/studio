document.addEventListener('DOMContentLoaded', () => {

  const labels = ['', 'KMA Original', 'the brief', 'the feed']

  var swiper = new Swiper(".swiper-o", {
    slidesPerView: "auto",
    spaceBetween: 30,
    centeredSlides: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      renderBullet: function (index, className) {
        return `<span class="${className}">${labels[index]}</span>`;
      },
    },
  });

  // 히치하이커 AI
  const buttons = document.querySelectorAll('.btn-wrap .btn');

  // 각 video 태그 선택
  const videos = document.querySelectorAll('.hr-inner .vid-wrap video');

  // 버튼 클릭 이벤트
  buttons.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      // 버튼 active 처리
      buttons.forEach((b, bIdx) => {
        b.classList.toggle('active', bIdx === idx);
      });

      // video 표시 상태 처리
      videos.forEach((video, vIdx) => {
        if (vIdx === idx) {
          video.style.opacity = '1';
          video.style.pointerEvents = 'auto';
          video.currentTime = 0;  // 처음부터
          video.play();
        } else {
          video.pause();
          video.style.opacity = '0';
          video.style.pointerEvents = 'none';
        }
      });
    });
  });

  // 멤버십 플랜
  const btn1 = document.querySelector('.mem-area .btn1');
  const btn2 = document.querySelector('.mem-area .btn2');
  const actBtn = document.querySelector('.mem-area .act-btn');

  const planWrap1 = document.querySelector('#planWrap1');
  const planWrap2 = document.querySelector('#planWrap2');

  btn1.addEventListener('click', () => {
    actBtn.style.left = '0%';

    // 활성화/비활성화 처리
    planWrap1.style.display = 'block';
    planWrap1.style.display = 'flex';
    planWrap2.style.display = 'none';
  });

  btn2.addEventListener('click', () => {
    actBtn.style.left = '50%';

    planWrap1.style.display = 'none';
    planWrap2.style.display = 'block';
    planWrap2.style.display = 'flex';
  });

  // 하단 배너
  var swiper = new Swiper(".swiperBanner", {
    spaceBetween: 30,
    centeredSlides: true,
    effect: "fade",
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    }
  });

  var swiper2 = new Swiper(".swiper2", {
    spaceBetween: 0,
    slidesPerView: 3,
    freeMode: true,
    watchSlidesProgress: true,
  });
  window.swiper1 = new Swiper(".swiper1", {
    spaceBetween: 10,
    effect: "fade",
    autoplay: {
      delay: 2000, // 4초마다 전환 (원하는 값으로 조절 가능)
      disableOnInteraction: false, // 사용자가 클릭해도 자동재생 유지
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    thumbs: {
      swiper: swiper2,
    },
  });


  // 플로팅
  window.addEventListener("scroll", () => {
    const floatBtns = document.querySelector(".dir-btn-wrap");
    const topBtn = document.querySelector(".top");
    const scrolled = window.scrollY;
  
    if (scrolled > window.innerHeight) {
      floatBtns?.classList.add("active");
      topBtn?.classList.add("active");
    } else {
      floatBtns?.classList.remove("active");
      topBtn?.classList.remove("active");
    }
  });

  // 반응형 리로드
  let lastWidth = window.innerWidth;

  window.addEventListener('resize', () => {
    const currentWidth = window.innerWidth;

    const wasDesktop = lastWidth > 768;
    const isNowMobile = currentWidth <= 768;
    const wasMobile = lastWidth <= 768;
    const isNowDesktop = currentWidth > 768;

    // 상태가 바뀔 때만 reload
    if ((wasDesktop && isNowMobile) || (wasMobile && isNowDesktop)) {
      const scrollY = window.scrollY || window.pageYOffset;
      sessionStorage.setItem("scrollPosition", scrollY);
      location.reload();
    }

    lastWidth = currentWidth;
  });

  window.addEventListener("load", () => {
    const scrollPosition = sessionStorage.getItem("scrollPosition");
    if (scrollPosition) {
      window.scrollTo(0, parseInt(scrollPosition));
      sessionStorage.removeItem("scrollPosition");
    }
  });
});