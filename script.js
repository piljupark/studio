if (window.matchMedia("(min-width: 768px)").matches) {
  window.addEventListener('load', () => {
    gsap.registerPlugin(ScrollTrigger);

    const intro = document.querySelector('.intro-area');
    const curation = document.querySelector('.curation-area');

    // scrollTrigger로 intro fixed 제어
    ScrollTrigger.create({
      trigger: intro,
      start: 'top top',
      end: '+=1000', // 스크롤 길이 조절
      scrub: true,
      onEnter: () => intro.classList.add('fixed'),
      onLeave: () => intro.classList.remove('fixed'),
      onEnterBack: () => intro.classList.add('fixed'),
      onLeaveBack: () => intro.classList.remove('fixed'),
    });

    // intro fade-out + curation fade-in
    gsap.to(intro, {
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: intro,
        start: 'top top',
        end: '+=1000',
        scrub: true
      }
    });

    gsap.to(curation, {
      opacity: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: intro,
        start: 'top top',
        end: '+=1000',
        scrub: true,
        onUpdate: self => {
          if (self.progress > 0) {
            curation.classList.add('visible');
          } else {
            curation.classList.remove('visible');
          }
        }
      }
    });

    const contWrap = document.querySelector(".curation-area .cont-wrap");

    // 실제 이미지 개수 기준으로 계산
    const containerHeight = contWrap.scrollHeight;
    const windowHeight = window.innerHeight;

    // 💡 실제 y 이동 거리: contWrap 전체 높이 + window 높이
    const scrollDistance = containerHeight + windowHeight;

    gsap.set(contWrap, {
      transformOrigin: "center top"
    });

    gsap.to(contWrap, {
      y: -scrollDistance, // 💡 완전히 위로 퇴장
      ease: "none",
      scrollTrigger: {
        trigger: ".curation-area",
        start: "top top",
        end: `+=${scrollDistance}`, // 💡 스크롤도 그만큼 길게
        pin: true,
        scrub: true,
        // markers: true
      }
    });

    const cards = document.querySelectorAll('.original-area .item');

    // 초기 상태 세팅
    cards.forEach((card, i) => {
      const offsetX = (i - 1.5) * 80;
      const offsetY = Math.abs(i - 1.5) * 40;
      const rotation = (i - 1.5) * 20;
      const z = 10 - Math.abs(i - 1.5);

      gsap.set(card, {
        x: offsetX,
        y: offsetY,
        rotate: rotation,
        zIndex: z
      });
    });

    // 타임라인 생성
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".original-area",
        start: "top top",
        end: "+=2000", // 전체 길이 조정
        scrub: true,
        pin: true,
        markers: true
      }
    });

    // 1️⃣ 카드 펼치기 (초반)
    cards.forEach((card, i) => {
      tl.to(card, {
        x: (i - 1.5) * 390,
        y: 0,
        rotate: 0,
        zIndex: 10,
        ease: "power2.out"
      }, 0); // 모두 동시에
    });

    // 2️⃣ 고정 구간 (짧은 딜레이)
    tl.to({}, { duration: 0.5 });

    // 3️⃣ 동시에 좌우 퇴장 (0,1 왼쪽 / 2,3 오른쪽)
    tl.to([cards[0], cards[1]], {
      x: -window.innerWidth - 500,
      opacity: 1,
      ease: "power2.inOut"
    }, "+=0");

    tl.to([cards[2], cards[3]], {
      x: window.innerWidth + 500,
      opacity: 1,
      ease: "power2.inOut"
    }, "<"); // 💡 "<" : 바로 위 애니메이션과 동시에 시작
  });
}


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

    // =============================== Re:catch 모달 ===============================
    // 모든 열기 버튼 가져오기
const openButtons = document.querySelectorAll('.recatch_open');
const recatchModal = document.getElementById('recatchModal');
const recatchModalIframe = document.getElementById('recatchModalIframe');

// 모달 열기 함수
function openRecatchModal() {
  recatchModal.style.display = 'flex'; // flex로 가운데 정렬
}

// 모달 닫기 함수
function closeRecatchModal() {
  if (recatchModal) {
    recatchModal.style.display = 'none';
  }
}

// HTML의 onclick 속성에서도 호출 가능하도록 전역 등록
window.closeRecatchModal = closeRecatchModal;

// 모든 버튼에 클릭 이벤트 연결
openButtons.forEach((btn) => {
  btn.addEventListener('click', openRecatchModal);
});

// ESC 키 누르면 모달 닫기
document.addEventListener('keydown', (event) => {
  const isModalOpen = window.getComputedStyle(recatchModal).display !== 'none';
  if (event.key === 'Escape' && isModalOpen) {
    closeRecatchModal();
  }
});

// 모달 외부 영역 클릭 시 닫기
recatchModal.addEventListener('click', (event) => {
  if (event.target === recatchModal) {
    closeRecatchModal();
  }
});

// Re:catch iframe에서 메시지 수신
window.addEventListener('message', (event) => {
  console.log("확인용 : " + event.data?.type);

  if (
    event.data?.type === 'disqualified' ||
    event.data?.type === 'bookingComplete' ||
    event.data?.type === 'closeModal'
  ) {
    console.log('리캐치 폼 이벤트 발생:', event.data.type);

    const successModal = document.getElementById('recatch-success-modal');
    if (successModal) {
      successModal.style.display = 'block';

      // 3초 후 자동 닫기
      setTimeout(() => {
        successModal.style.display = 'none';
      }, 3000);
    }

    closeRecatchModal(); // 모달 닫기
  }

  if (event.data?.type === 'formReady') {
    console.log('리캐치 폼 로드 준비 완료!');
  }
});

  });