if (window.matchMedia("(min-width: 768px)").matches) {
  window.addEventListener('load', () => {
    gsap.registerPlugin(ScrollTrigger);

    // 페이드 아웃 intro-area
      gsap.to(".intro-area", {
        opacity: 0,
        scrollTrigger: {
          trigger: ".curation-area",
          start: "top bottom", // 스크롤로 .curation-area가 보이기 시작할 때
          end: "top center",   // 중간쯤 왔을 때 완전 사라짐
          scrub: true,
          onLeave: () => {
            document.querySelector('.intro-area')?.classList.add('end');
          }
        }
      });

      // 페이드 인 curation-area
      gsap.to(".curation-area", {
        opacity: 1,
        scrollTrigger: {
          trigger: ".curation-area",
          start: "top bottom",
          end: "top center",
          scrub: true,
          onEnter: () => {
            document.querySelector('.curation-area')?.classList.add('start');
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

    //리캐치 스크립트
    const openButton = document.getElementById('openRecatchFormButton');
    const recatchModal = document.getElementById('recatchModal');
    const recatchModalIframe = document.getElementById('recatchModalIframe');

    // 모달 열기 함수
    function openRecatchModal() {
      recatchModal.style.display = 'flex'; // 'flex'로 변경하여 가운데 정렬
    }

    // 모달 닫기 함수
    function closeRecatchModal() {
      recatchModal.style.display = 'none';
    }

    // 버튼 클릭 시 모달 열기
    if (openButton) {
      openButton.addEventListener('click', openRecatchModal);
    }

    // ESC 키 누르면 모달 닫기 (선택 사항)
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && recatchModal.style.display === 'flex') {
        closeRecatchModal();
      }
    });

    // 모달 외부 클릭 시 닫기 (선택 사항)
    recatchModal.addEventListener('click', (event) => {
      if (event.target === recatchModal) {
        closeRecatchModal();
      }
    });

    // Re:catch 폼에서 메시지 수신 (폼 제출 완료 등)
    window.addEventListener('message', (event) => {
      console.log("확인용 : " + event.data.type);

      if (event.data.type === 'disqualified' || event.data.type === 'bookingComplete' || event.data.type === 'closeModal') {
        console.log('리캐치 폼 이벤트 발생:', event.data.type);

        const modal = document.getElementById('recatch-success-modal');
        if (modal) {
          modal.style.display = 'block';

          // 3초 후 자동 닫기
          setTimeout(() => {
            modal.style.display = 'none';
          }, 3000);
        }
        closeRecatchModal(); // 폼 제출 완료 또는 닫기 이벤트 시 모달 닫기
      }

      // 추가적인 이벤트 처리 (예: formReady)
      if (event.data.type === 'formReady') {
        console.log('리캐치 폼 로드 준비 완료!');
      }
    });

  });