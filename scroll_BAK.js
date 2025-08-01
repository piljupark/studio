if (window.matchMedia("(min-width: 768px)").matches) {
  document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // ✅ Lenis 초기화 및 연동 추가
    // const lenis = new Lenis({
    //   duration: 1.5,
    //   wheelMultiplier: 0.5,
    //   easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    // });

    // ScrollTrigger.scrollerProxy(document.body, {
    //   scrollTop(value) {
    //     return arguments.length ? lenis.scrollTo(value) : window.scrollY;
    //   },
    //   getBoundingClientRect() {
    //     return {
    //       top: 0,
    //       left: 0,
    //       width: window.innerWidth,
    //       height: window.innerHeight,
    //     };
    //   },
    //   pinType: document.body.style.transform ? "transform" : "fixed",
    // });

    // lenis.on("scroll", ScrollTrigger.update);

    // function raf(time) {
    //   lenis.raf(time);
    //   requestAnimationFrame(raf);
    // }
    // requestAnimationFrame(raf);

    requestAnimationFrame(() => {
      let played = false;

      ScrollTrigger.create({
        trigger: ".int-area",
        start: "top top",
        end: "+=1200",
        pin: true,
        scrub: false,
        // markers: true,
        id: "pinOnly",
        onUpdate: self => {
          // 스크롤 진행도 계산 (0.0 ~ 1.0)
          const progress = self.progress;

          // 600px 중 100px == 100 / 600 = 약 0.1666
          if (progress >= 0.1 && !played) {
            played = true;

            gsap.to(".visual-inner", {
              width: "90vw",
              height: "calc(100vh - 200px)",
              minHeight: "660px",
              opacity: 1,
              duration: 0.5,
              ease: "power2.out",
            });
          }

          // 스크롤 되돌릴 때 되감기
          if (progress < 0.083 && played) {
            played = false;

            gsap.to(".visual-inner", {
              width: "0",
              height: "0",
              minHeight: "0",
              opacity: 0,
              duration: 0.5,
              ease: "power2.out",
            });
          }
        },
      });

      // original
      const cards = document.querySelectorAll(".original-area .item");
      const container = document.querySelector(".original-area .cont-wrap");

      // 🔹 카드 초기 세팅 (기존 그대로)
      cards.forEach((card, i) => {
        const offsetX = (i - 1.5) * 80;
        const offsetY = Math.abs(i - 1.5) * 40;
        const rotation = (i - 1.5) * 20;
        const z = 10 - Math.abs(i - 1.5);

        gsap.set(card, {
          xPercent: -50,
          yPercent: -50,
          x: offsetX,
          y: offsetY,
          rotate: rotation,
          zIndex: z,
          position: "absolute",
          top: "50%",
          left: "50%",
        });
      });

      // 🔹 .cont-wrap을 아래로 숨김
      gsap.set(container, {
        y: window.innerHeight + 200,
      });

      // 🔹 ScrollTrigger로 .cont-wrap을 위로 올림 (제자리로)
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".original-area",
            start: "top+=80 top",
            end: "+=700", // 200px 안에서 이동 완료
            scrub: 1,
          },
        })
        .to(container, {
          y: 0,
          ease: "power2.out",
        });

      // 타임라인 생성
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".original-area",
          start: "top top",
          end: "+=2400", // 전체 길이 조정
          scrub: 1.2,
          pin: true,
          //markers: true,
        },
      });

      // 🔹 타임라인 초반에 딜레이 추가
      tl.to({}, { duration: 0.3 });

      // 1️⃣ 카드 펼치기 (초반)
      cards.forEach((card, i) => {
        tl.to(
          card,
          {
            x: (i - 1.5) * 330,
            y: 0,
            rotate: 0,
            zIndex: 10,
            ease: "power2.out",
          },
          0
        ); // 모두 동시에
      });

      // 2️⃣ 고정 구간 (짧은 딜레이)
      tl.to({}, { duration: 0.5 });

      // 3️⃣ 동시에 좌우 퇴장 (0,1 왼쪽 / 2,3 오른쪽)
      tl.to(
        [cards[0], cards[1]],
        {
          x: -window.innerWidth - 500,
          opacity: 1,
          ease: "power2.inOut",
        },
        "+=0"
      );

      tl.to(
        [cards[2], cards[3]],
        {
          x: window.innerWidth + 500,
          opacity: 1,
          ease: "power2.inOut",
        },
        "<"
      ); // 💡 "<" : 바로 위 애니메이션과 동시에 시작

      // brief gsap
      const briefWrap = document.querySelector(".brief-area .cont-wrap");
      const title = document.querySelector(".brief-area .txt-wrap h2");
      const subtitle = document.querySelector(".brief-area .txt-wrap .txt");
      const items = briefWrap.querySelectorAll(".item");
      const wrapHeight = briefWrap.getBoundingClientRect().height;
      const startOffset = window.innerHeight + wrapHeight;
      const scrollRange = wrapHeight + 500;
      const speedFactors = [0.6, 1.0, 0.6, 1.2, 1.5]; // 각 아이템별 속도 조절
      const itemMoveDistance = wrapHeight * 0.8;

      gsap.set([title, subtitle], { fontSize: 0, opacity: 0 });

      gsap.to(title, {
        fontSize: "clamp(34px, 5vh, 50px)",
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".brief-area",
          start: "top top",
          toggleActions: "play none none reverse", // pin 시작될 때 play
          pin: false, // 이 애니메이션 자체에 pin은 안 걸려 있음
        },
      });

      gsap.to(subtitle, {
        fontSize: "18px",
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".brief-area",
          start: "top top",
          toggleActions: "play none none reverse",
        },
      });

      // 컨테이너 전체 이동 (위로)
      gsap.set(briefWrap, {
        y: startOffset,
      });

      gsap.to(briefWrap, {
        y: -wrapHeight,
        ease: "none",
        scrollTrigger: {
          trigger: ".brief-area",
          start: "top top",
          end: () => `+=${scrollRange}`,
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
          onLeave: () => {
            gsap.to(title, {
              height: 0,
              duration: 0.5,
              ease: "power2.out",
            });
            gsap.to(subtitle, {
              height: 0,
              duration: 0.5,
              ease: "power2.out",
            });
          },
          onEnterBack: () => {
            gsap.to(title, {
              height: "auto",
              duration: 0.5,
              ease: "power2.out",
            });
            gsap.to(subtitle, {
              height: "auto",
              duration: 0.5,
              ease: "power2.out",
            });
          },
        },
      });

      // 각 아이템 개별 속도 설정
      items.forEach((item, i) => {
        const speed = speedFactors[i] || 1; // fallback 값

        gsap.fromTo(
          item,
          { y: 0 },
          {
            y: -itemMoveDistance * speed,
            ease: "none",
            scrollTrigger: {
              trigger: ".brief-area",
              start: "top+=900 top",
              end: () => `+=${scrollRange}`,
              scrub: 1.2,
              // markers: true
            },
          }
        );
      });

      // feed gsap
      const feedItems = gsap.utils.toArray(".feed-area .item");
      const txtWrap = document.querySelector(".feed-area .txt-wrap");
      const feedWrap = document.querySelector(".feed-area .cont-wrap");

      // 초기 상태
      gsap.set(txtWrap, { x: "-100vw", opacity: 0 });
      gsap.set(feedWrap, { y: "-100vh", opacity: 0 });

      feedItems.forEach(item => {
        gsap.set(item, {
          x: "100vw",
          opacity: 0,
          scale: 1,
          position: "absolute",
          left: 0,
        });
      });

      // 메인 타임라인
      const fl = gsap.timeline({
        scrollTrigger: {
          trigger: ".feed-area",
          start: "top top",
          end: "+=4600", //
          scrub: 1.2,
          pin: true,
          // markers: true,
        },
      });

      // 1) 등장 시퀀스
      fl.to({}, { duration: 0.2 });

      fl.to(
        txtWrap,
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
        },
        "slideIn"
      );

      fl.to(
        feedWrap,
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
        },
        "slideIn"
      );

      // 2) 카드 날아오기 (오른쪽 겹침 + zIndex)
      const CARD_SPACING = 60;

      feedItems.forEach((item, index) => {
        fl.to(
          item,
          {
            x: CARD_SPACING * index,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            zIndex: index + 1,
          },
          `+=0.6`
        );
      });

      // 3) 300px 정도 여유 (스크롤 후 퇴장용)
      fl.to({}, { duration: 0.6 });

      // 4) 퇴장 애니메이션
      fl.to(
        txtWrap,
        {
          x: "-100vw",
          opacity: 0,
          duration: 1,
          ease: "power2.in",
        },
        "exit"
      );

      fl.to(
        feedWrap,
        {
          y: "-100vh",
          opacity: 0,
          duration: 1,
          ease: "power2.in",
        },
        "exit"
      );

      // exp
      const video = document.querySelector(".exp-vid video");

      ScrollTrigger.create({
        trigger: ".exp-vid",
        start: "top top",
        end: "+=1000", // 충분한 pin 길이 (스크롤 막기용)
        pin: true,
        scrub: true,
        //markers: true, // 디버그용
      });

      // 2. 영상 재생 완료 후 자동 스크롤 이동
      video.addEventListener("ended", () => {
        document.querySelector(".exp-hr").scrollIntoView({
          behavior: "smooth",
        });
      });

      ScrollTrigger.create({
        trigger: ".exp-hr",
        start: "top top",
        end: "+=1000", // ✅ 1000px 스크롤 후 pin 해제
        pin: true,
        scrub: false, 
        markers: false, 
        id: "expHrPin"
      });

      // lxp gsap
      let isAutoScrolling = false; // 중복 방지용 플래그

      const tlLXP = gsap.timeline({
        scrollTrigger: {
          trigger: ".lxp-area",
          start: "top top",
          end: "+=4000", // 적당한 길이로 조절
          scrub: 1.2,
          pin: true,
          //markers: true,
          id: "lxpPin",
          onLeave: () => {
            if (isAutoScrolling) return;
            // isAutoScrolling = true; // 막아둠
            // 자동 스크롤 주석 처리하거나 제거
          },
          onEnterBack: () => {
            if (isAutoScrolling) return;
            // isAutoScrolling = true;
            // 자동 스크롤 주석 처리 또는 제거
          },
        },
      });

      // .left → 왼쪽 바깥으로 나감
      tlLXP.to(
        ".lxp-inner.left",
        {
          x: "-100%", // 왼쪽 바깥으로 이동
          opacity: 0,
          duration: 12,
          delay: 10,
          ease: "power2.out",
        },
        0
      );

      // .right → 오른쪽 바깥에서 중앙으로 들어옴
      tlLXP.fromTo(
        ".lxp-inner.right",
        {
          x: "100%", // 오른쪽 바깥에서 시작
          opacity: 0,
        },
        {
          x: "0%",
          opacity: 1,
          duration: 12,
          delay: 10,
          ease: "power2.out",
        },
        "0.3"
      );

      // 🔥 .right 안의 video는 width 확장
      tlLXP.fromTo(
        ".lxp-inner.right video",
        {
          width: "40%", // 시작 상태
        },
        {
          width: "100%", // 중앙 도달 시 확장
          height: "100vh",
          duration: 12,
          delay: 10,
        },
        "0.3"
      ); // 같은 타이밍에 실행

      // 4️⃣ txt-wrap → opacity: 0 → 1 (영상 중앙 도달 직후)
      tlLXP.fromTo(
        ".lxp-inner.right .txt-wrap",
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 12,
          ease: "power2.out",
        },
        ">0.2"
      ); // 🔥 이전 애니메이션 끝난 뒤 0.2초 후에 시작

      // // 🔥 4️⃣ 스크롤 500px 더 진행한 뒤 전환
      // tlLXP.to(
      //   ".lxp-inner.right video",
      //   {
      //     width: 0,
      //     height: "auto",
      //     opacity: 0,
      //     objectFit: "contain",
      //     ease: "power2.inOut",
      //     duration: 12,
      //   },
      //   "+=1"
      // ); // 영상 다 보인 뒤 시작

      // tlLXP.to(
      //   ".lxp-inner.right .txt-wrap",
      //   {
      //     opacity: 0,
      //     duration: 12,
      //     ease: "power2.out",
      //   },
      //   "<"
      // ); // 동시에 사라짐

      // tlLXP.fromTo(
      //   ".lxp-cont",
      //   {
      //     opacity: 0,
      //   },
      //   {
      //     opacity: 1,
      //     duration: 12,
      //     ease: "power2.out",
      //   },
      //   "<+0.1"
      // ); // 살짝 딜레이해서 부드럽게 등장

      // tlLXP.fromTo(
      //   ".lxp-cont",
      //   { opacity: 0 },
      //   { opacity: 1, duration: 12, ease: "power2.out" },
      //   "<+0.1"
      // );

      // // 1️⃣ 첫 번째 텍스트 등장
      // tlLXP.to(
      //   [
      //     ".lxp-cont .txt-wrap .sm-ti span:nth-child(1)",
      //     ".lxp-cont .txt-wrap .ti p:nth-child(1)",
      //     ".lxp-cont .txt-wrap .txt span:nth-child(1)",
      //   ],
      //   {
      //     opacity: 1,
      //     duration: 6,
      //     ease: "power2.out",
      //     stagger: 1,
      //   },
      //   "+=0.3"
      // );

      // // 2️⃣ video 등장
      // tlLXP.to(
      //   ".lxp-cont video",
      //   {
      //     opacity: 1,
      //     duration: 6,
      //     ease: "power2.out",
      //   },
      //   ">0.5" // 텍스트 나오고 살짝 뒤
      // );

      // 3️⃣ 스크롤 500px 후 → video + 첫 번째 텍스트 모두 사라짐
      // tlLXP.to(
      //   [
      //     ".lxp-cont .txt-wrap .sm-ti span:nth-child(1)",
      //     ".lxp-cont .txt-wrap .ti p:nth-child(1)",
      //     ".lxp-cont .txt-wrap .txt span:nth-child(1)",
      //   ],
      //   {
      //     opacity: 0,
      //     duration: 6,
      //     ease: "power2.out",
      //   },
      //   "+=8" // 500px 정도 더 진행
      // );

      // tlLXP.to(
      //   ".lxp-cont video",
      //   {
      //     opacity: 0,
      //     duration: 6,
      //     ease: "power2.out",
      //   },
      //   "<" // 동시에 사라짐
      // );

      // // 4️⃣ 두 번째 텍스트 등장
      // tlLXP.to(
      //   [
      //     ".lxp-cont .txt-wrap .sm-ti span:nth-child(2)",
      //     ".lxp-cont .txt-wrap .ti p:nth-child(2)",
      //     ".lxp-cont .txt-wrap .txt span:nth-child(2)",
      //   ],
      //   {
      //     opacity: 1,
      //     duration: 6,
      //     ease: "power2.out",
      //     stagger: 0.3,
      //   },
      //   "+=1.5" // 사라지고 여유 두고 등장
      // );

      // // 5️⃣ item-wrap 등장
      // // 5️⃣ item-wrap 이미지들이 양쪽에서 날아오게
      // tlLXP.fromTo(
      //   ".item-left",
      //   {
      //     x: "-100%",
      //     opacity: 0,
      //   },
      //   {
      //     x: "0%",
      //     opacity: 1,
      //     duration: 1.5,
      //     ease: "power2.out",
      //   },
      //   "+=0.5" // 두 번째 텍스트 등장 후
      // );

      // tlLXP.fromTo(
      //   ".item-right",
      //   {
      //     x: "100%",
      //     opacity: 0,
      //   },
      //   {
      //     x: "0%",
      //     opacity: 1,
      //     duration: 1.5,
      //     ease: "power2.out",
      //   },
      //   "<" // 동시에 등장
      // );

      // out-area
      const outItems = gsap.utils.toArray(".out-item");

      // 초기 위치 세팅
      // gsap.set(
      //   ".out-area .txt-wrap .sm-ti, .out-area .txt-wrap h3, .out-area .txt-wrap .txt",
      //   { opacity: 0 }
      // );
      outItems.forEach((item, i) => {
        gsap.set(item, {
          y: window.innerHeight + 100 + i * 50,
          rotation: 0,
        });
      });

      // scrollTrigger: pin만 담당 + onEnter에서 애니메이션 자동 실행
      ScrollTrigger.create({
        trigger: ".out-area",
        start: "top top",
        end: "+=1400", // pin 고정 유지 시간
        pin: true,
        scrub: false,
        //markers: true,
        id: "outPin",
        onEnter: () => {
          const tl = gsap.timeline();

          tl.to({}, { duration: 0.3 });

          // 1단계: sm-ti, h3 등장
          tl.to(".out-area .txt-wrap .sm-ti, .txt-wrap h3", {
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "power1.out",
          });

          // 2단계: 1초 후 .txt 등장
          tl.to(
            ".out-area .txt-wrap .txt",
            {
              opacity: 1,
              duration: 0.5,
              stagger: 0.1,
              ease: "power1.out",
            },
            "1"
          );

          // 3단계: 이미지 올라가며 회전
          const yEnd = -(window.innerHeight / 2 + 300);

          tl.to(
            outItems[0],
            {
              y: yEnd,
              rotation: 15,
              duration: 0.6 * 4,
              stagger: 0,
              ease: "power1.inOut",
            },
            "<"
          );

          tl.to(
            outItems[1],
            {
              y: yEnd - 50,
              rotation: -15,
              duration: 0.8 * 4,
              stagger: 0,
              ease: "power1.inOut",
            },
            "<"
          );

          tl.to(
            outItems[2],
            {
              y: yEnd - 100,
              rotation: 10,
              duration: 1.0 * 4,
              stagger: 0,
              ease: "power1.inOut",
            },
            "<"
          );
        },
      });

      // setTimeout(() => {
      //   ScrollTrigger.refresh(true);
      // }, 100); // 지연 로드
    }); // requestAnimationFrame
  }); // DOMContentLoaded
} // matchmedia

//
if (window.matchMedia("(max-width: 767px)").matches) {
  window.addEventListener("load", () => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // int
    let played = false;

    ScrollTrigger.create({
      trigger: ".int-area",
      start: "top top",
      end: "+=800", // 모바일에서는 스크롤 길이 줄임
      pin: true,
      scrub: false,
      //markers: true,
      id: "pinOnlyMobile",
      onUpdate: self => {
        const progress = self.progress;

        if (progress >= 0.1 && !played) {
          played = true;

          gsap.to(".visual-inner", {
            width: "90vw",
            height: "60vh", // 모바일에 맞게 비율 조정
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
          });
        }

        if (progress < 0.083 && played) {
          played = false;

          gsap.to(".visual-inner", {
            width: "0",
            height: "0",
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
          });
        }
      },
    });

    // intro
    const intro = document.querySelector(".intro-area");
    const curation = document.querySelector(".curation-area");

    let locked = false;

    // 아래로 → intro → curation
    ScrollTrigger.create({
      trigger: intro,
      start: "bottom bottom",
      end: "bottom top",
      onEnter: () => {
        if (!locked) {
          locked = true;
          gsap.to(window, {
            scrollTo: {
              y: curation,
              offsetY: 0,
            },
            duration: 1,
            ease: "power2.out",
            onComplete: () => {
              // 일정 시간 뒤에 다시 스크롤 허용
              setTimeout(() => (locked = false), 100);
            },
          });
        }
      },
      //markers: false,
    });

    // 위로 → curation → intro (★ 수정된 부분)
    ScrollTrigger.create({
      trigger: curation,
      start: "top top", // 뷰포트의 top과 curation의 top이 닿을 때
      end: "bottom top", // 아래서 올라올 때를 잡기 위함
      onLeaveBack: () => {
        if (!locked) {
          locked = true;
          gsap.to(window, {
            scrollTo: {
              y: intro,
              offsetY: 0,
            },
            duration: 1,
            ease: "power2.out",
            onComplete: () => setTimeout(() => (locked = false), 100),
          });
        }
      },
      //markers: false,
      immediateRender: false, // ★ 중요: 스크롤 방향 이벤트 초기화 방지
    });

    // original
    const items = gsap.utils.toArray(".original-area .item");

    // 전체 스크롤 길이 = 아이템 수 * 400px
    const scrollLength = items.length * 400;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".original-area",
        start: "top top",
        end: `+=${scrollLength}`,
        pin: true,
        scrub: 1.2,
        //markers: false,
      },
    });

    // 각 아이템을 400px 간격으로 순차 등장
    items.forEach((item, i) => {
      tl.fromTo(
        item,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
        i * 0.4 // 400px 기준으로 분배 (스크롤 400px = 타임라인 0.4초)
      );
    });

    // brief
    const briefItems = gsap.utils.toArray(".brief-area .item");

    const briefScrollLength = briefItems.length * 400;

    const tlBrief = gsap.timeline({
      scrollTrigger: {
        trigger: ".brief-area",
        start: "top top",
        end: `+=${briefScrollLength}`,
        pin: true,
        scrub: 1.2,
        //markers: false,
      },
    });

    briefItems.forEach((item, i) => {
      tlBrief.fromTo(
        item,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        },
        i * 0.4 // 400px 당 한 개씩 등장
      );
    });

    //feed
    const feedCont = document.querySelector(".feed-area .cont-wrap");
    const feedItems = gsap.utils.toArray(".feed-area .item");

    // 전체 스크롤할 거리 계산 (가로 스크롤 길이 + 추가 스크롤 600px)
    const scrollWidth = feedCont.scrollWidth - window.innerWidth;
    const extraScroll = 800;

    gsap.to(feedCont, {
      x: () => `-${scrollWidth}px`,
      ease: "none",
      scrollTrigger: {
        trigger: ".feed-area",
        start: "top top",
        end: () => `+=${scrollWidth + extraScroll}`,
        pin: true,
        scrub: 1.2,
        anticipatePin: 1,
        //markers: false,
      },
    });

    // 실제 가로 이동
    tl.to(feedCont, {
      x: -scrollWidth,
      ease: "none",
      duration: scrollWidth / 500, // 비례로 조절
    });

    // 빈 공간 유지용 더미 애니메이션
    tl.to(
      {},
      {
        duration: extraScroll / 500, // 비례로 맞춤
      }
    );

    // exp
    const scrollDistance = 500; // 전체 스크롤 거리
    const totalSteps = 3;
    const buttons = document.querySelectorAll(".btn-wrap .btn");
    const videos = document.querySelectorAll(".vid-wrap video");

    let fixed = false;

    const fixFinalState = () => {
      fixed = true;

      // btn3만 active
      buttons.forEach((btn, i) => {
        btn.classList.toggle("active", i === 2);
        btn.classList.toggle("dimmed", i !== 2);
      });

      // video3만 보여주기
      videos.forEach((vid, i) => {
        gsap.set(vid, { opacity: i === 2 ? 1 : 0 });
      });

      // btn-wrap 위치 유지
      gsap.set(".btn-wrap", { x: -60 });
    };

    ScrollTrigger.create({
      trigger: ".exp-hr",
      start: "top top",
      end: "+=500",
      scrub: true,
      pin: true,
      markers: true,

      onUpdate: self => {
        if (fixed) return;

        const progress = self.progress; // 0~1
        const index = Math.min(
          Math.floor(progress * totalSteps),
          totalSteps - 1
        ); // 0, 1, 2
        const offsetX = index === 2 ? 60 : 0;

        // 버튼 이동
        gsap.to(".btn-wrap", {
          x: -offsetX,
          duration: 0.4,
          ease: "power2.out",
        });

        // 버튼 상태
        buttons.forEach((btn, i) => {
          btn.classList.toggle("active", i === index);
          btn.classList.toggle("dimmed", i !== index);
        });

        // 비디오 상태
        videos.forEach((vid, i) => {
          gsap.to(vid, {
            opacity: i === index ? 1 : 0,
            duration: 0.4,
            ease: "power2.out",
          });
        });

        // 마지막에 고정
        if (index === 2 && progress >= 0.99) {
          fixFinalState();
        }
      },

      onLeave: () => {
        if (!fixed) fixFinalState();
      },

      onScrubComplete: () => {
        const scroll = ScrollTrigger.getById("expHR");
        if (!fixed && scroll && scroll.progress >= 0.99) {
          fixFinalState();
        }
      },

      id: "expHR",
    });

    // lxp

    let isAutoScrolling = false; // 중복 방지용 플래그

    const tlLXP = gsap.timeline({
      scrollTrigger: {
        trigger: ".lxp-area",
        start: "top top",
        end: "+=2500", // 적당한 길이로 조절
        scrub: 1.2,
        pin: true,
        //markers: true,
        id: "lxpPin",
        onLeave: () => {
          if (isAutoScrolling) return;
          isAutoScrolling = true;
          gsap.to(window, {
            scrollTo: ".out-area",
            duration: 0.8,
            ease: "power2.inOut",
            onComplete: () => {
              isAutoScrolling = false;
            },
          });
        },
        onEnterBack: () => {
          if (isAutoScrolling) return;
          isAutoScrolling = true;
          gsap.to(window, {
            scrollTo: ".lxp-area",
            duration: 0.8,
            ease: "power2.inOut",
            onComplete: () => {
              isAutoScrolling = false;
            },
          });
        },
      },
    });

    // .left → 왼쪽 바깥으로 나감
    tlLXP.to(
      ".lxp-inner.left",
      {
        x: "-100%", // 왼쪽 바깥으로 이동
        opacity: 0,
        duration: 1.2,
        ease: "power2.out",
      },
      0
    );

    // .right → 오른쪽 바깥에서 중앙으로 들어옴
    tlLXP.fromTo(
      ".lxp-inner.right",
      {
        x: "100%", // 오른쪽 바깥에서 시작
        opacity: 0,
      },
      {
        x: "0%",
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
      },
      0
    );

    // 🔥 .right 안의 video는 width 확장
    tlLXP.fromTo(
      ".lxp-inner.right video",
      {
        width: "40%", // 시작 상태
        height: "auto",
      },
      {
        width: "100%", // 중앙 도달 시 확장
        height: "100vh",
        ease: "power2.out",
      },
      0
    ); // 같은 타이밍에 실행

    // 4️⃣ txt-wrap → opacity: 0 → 1 (영상 중앙 도달 직후)
    tlLXP.fromTo(
      ".lxp-inner.right .txt-wrap",
      {
        opacity: 0,
      },
      {
        opacity: 1,
        ease: "power2.out",
      },
      ">0.2"
    ); // 🔥 이전 애니메이션 끝난 뒤 0.2초 후에 시작
  });
}
