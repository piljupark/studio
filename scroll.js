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
      tl.to({}, { duration: 0 });

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

      const feedTimeline = gsap.timeline();

      // 1) 등장
      feedTimeline.to({}, { duration: 0.2 });

      feedTimeline.to(
        txtWrap,
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
        },
        "slideIn"
      );

      feedTimeline.to(
        feedWrap,
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
        },
        "slideIn"
      );

      // 2) 카드 순차 등장
      const CARD_SPACING = 60;

      feedItems.forEach((item, index) => {
        feedTimeline.to(
          item,
          {
            x: CARD_SPACING * index,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            zIndex: index + 1,
          },
          "+=0.6>"
        );
      });

      // 3) 여유
      feedTimeline.to({}, { duration: 0.6 });

      // 4) 퇴장
      // feedTimeline.to(
      //   txtWrap,
      //   {
      //     x: "-100vw",
      //     opacity: 0,
      //     duration: 1,
      //     ease: "power2.in",
      //   },
      //   "exit"
      // );

      // feedTimeline.to(
      //   feedWrap,
      //   {
      //     y: "-100vh",
      //     opacity: 0,
      //     duration: 1,
      //     ease: "power2.in",
      //   },
      //   "exit"
      // );

      // 🔥 핵심 ScrollTrigger 설정
      let feedLocked = false;

      const feedTrigger = ScrollTrigger.create({
        animation: feedTimeline,
        trigger: ".feed-area",
        start: "top top",
        end: "+=4600",
        scrub: 1.2,
        pin: true,
        onUpdate: self => {
          if (self.progress === 1) {
            feedTimeline.pause().progress(1);
          }
        }
      });

      // exp
      const video = document.querySelector(".exp-vid video");

      ScrollTrigger.create({
        trigger: ".exp-vid",
        start: "top top",
        end: "+=1000", // 충분한 pin 길이 (스크롤 막기용)
        pin: false,
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
        pin: false,
        scrub: false,
        markers: false,
        id: "expHrPin",
      });

      // lxp gsap
      let isAutoScrolling = false; // 중복 방지용 플래그

      const tlLXP = gsap.timeline({
        scrollTrigger: {
          trigger: ".lxp-area",
          start: "top top",
          end: "+=2400", // 적당한 길이로 조절
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
          duration: 8,
          delay: 3,
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
          duration: 8,
          delay: 3,
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
          borderRadius: "0px",
          duration: 8,
          delay: 3,
          ease: "power2.inOut",
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

      // out-area
      const outItems = gsap.utils.toArray(".out-item");

      outItems.forEach((item, i) => {
        gsap.set(item, {
          y: window.innerHeight + 100 + i * 50,
          rotation: 0,
        });
      });

      ScrollTrigger.create({
        trigger: ".out-area",
        start: "top top",
        end: "+=1000",
        pin: false,
        scrub: false,
        id: "outPin",
        onEnter: () => {
          const tl = gsap.timeline();

          tl.to({}, { duration: 0.3 });

          const yEnd = -(window.innerHeight / 2 + 300);

          tl.to(
            outItems[0],
            {
              y: yEnd,
              rotation: 15,
              duration: 0.1 * 14,
              ease: "power1.inOut",
            },
            "<"
          );

          tl.to(
            outItems[1],
            {
              y: yEnd - 50,
              rotation: -15,
              duration: 0.2 * 10,
              ease: "power1.inOut",
            },
            "<"
          );

          tl.to(
            outItems[2],
            {
              y: yEnd - 100,
              rotation: 10,
              duration: 0.3 * 10,
              ease: "power1.inOut",
            },
            "<"
          );
        },
      });

      window.addEventListener("load", () => {
        ScrollTrigger.refresh();

        const outTrigger = ScrollTrigger.getById("outPin");
        if (outTrigger && outTrigger.isActive) {
          outTrigger.vars.onEnter();
        }
      });

      // setTimeout(() => {
      //   ScrollTrigger.refresh(true);
      // }, 100); // 지연 로드
    }); // requestAnimationFrame
  }); // DOMContentLoaded
} // matchmedia

// ========================== 모바일
if (window.matchMedia("(max-width: 767px)").matches) {
  window.addEventListener("load", () => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // int
    let played = false;

    ScrollTrigger.create({
      trigger: ".int-area",
      start: "top top",
      end: "+=1200",
      pin: true,
      scrub: false,
      id: "pinOnly",
      onUpdate: self => {
        const progress = self.progress;

        if (progress >= 0.1 && !played) {
          played = true;

          console.log("start animation");

          // int .inner 숨기기
          gsap.to(".int", {
            background:
              "linear-gradient(to right, rgba(94, 252, 232, 0), rgba(115, 110, 254, 0))",
            duration: 0.5,
            ease: "power2.out",
            onStart: () => {
              console.log("int .inner opacity 0");
            },
          });

          gsap.to(".int .inner", {
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
            onStart: () => {
              console.log("int .inner opacity 0");
            },
          });

          // visual-inner 애니메이션
          gsap.to(".visual-inner", {
            width: "90vw",
            height: "70vh",
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
          });
        }

        if (progress < 0.083 && played) {
          played = false;

          console.log("reset animation");

          gsap.to(".int", {
            background:
              "linear-gradient(to right, rgba(94, 252, 232, 1), rgba(115, 110, 254, 1)",
            duration: 0.5,
            ease: "power2.out",
            onStart: () => {
              console.log("int .inner opacity 0");
            },
          });

          // int .inner 다시 보이기
          gsap.to(".int .inner", {
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
            onStart: () => {
              console.log("int .inner opacity 1");
            },
          });

          // visual-inner 되감기
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
    const items = gsap.utils.toArray(".original-area .item");

    const tl = gsap.timeline({
      paused: true, // 👉 처음엔 멈춰 있다가 수동으로 재생
    });

    // 순차 등장
    items.forEach((item, i) => {
      tl.fromTo(
        item,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        },
        i * 0.2
      );
    });

    // ScrollTrigger로 섹션 진입 감지 후 1초 뒤 실행
    ScrollTrigger.create({
      trigger: ".original-area",
      start: "top 80%",
      once: true,
      // markers: true,
      onEnter: () => {
        setTimeout(() => {
          tl.play();
        }, 500); // ✅ 1초(1000ms) 후 재생
      },
    });

    // brief
    const briefItems = gsap.utils.toArray(".brief-area .item");
    const container = document.querySelector(".brief-area .items-wrap");

    const itemHeight = 400;
    const visibleCount = 3; // ✅ 세 번째 아이템까지만 pin 유지
    const totalScroll = visibleCount * itemHeight;

    // 초기 위치
    gsap.set(container, { y: 0 });

    // pin 구간 동안만 컨테이너 움직임
    gsap.to(container, {
      y: () => -(visibleCount - 1) * itemHeight * 0.6, // 3개까지만 이동
      ease: "none",
      scrollTrigger: {
        id: "briefScroll",
        trigger: ".brief-area",
        start: "top top",
        end: `+=${totalScroll}`,
        scrub: 1.2,
        pin: false,
        // markers: true,
      },
    });

    // ✨ 아이템 등장 애니메이션 (전체)
    briefItems.forEach((item, i) => {
      gsap.fromTo(
        item,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          duration: 0.3,
          scrollTrigger: {
            trigger: item,
            start: "top center",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    //feed
    const feedCont = document.querySelector(".feed-area .cont-wrap");

    const startPadding = 300;
    const endPadding = 500;
    const fakeEndPadding = 150; // ← 마지막에 밀어주는 거리 (공백 효과)

    const scrollWidth = feedCont.scrollWidth - window.innerWidth;

    gsap.to(feedCont, {
      x: () => `-${scrollWidth + fakeEndPadding}px`, // ✅ 살짝 더 밀어줌
      ease: "none",
      scrollTrigger: {
        trigger: ".feed-area",
        start: "top top",
        end: () =>
          `+=${scrollWidth + startPadding + endPadding + fakeEndPadding}`, // ✅ 스크롤 길이도 보정
        pin: true,
        scrub: 0.4,
        anticipatePin: 1,
        // markers: true,
      },
    });

    // exp
    const scrollDistance = 500;
    const totalSteps = 3;
    const buttons = document.querySelectorAll(".btn-wrap .btn");
    const videos = document.querySelectorAll(".vid-wrap video");

    let fixed = false;

    const fixFinalState = () => {
      if (fixed) return;
      fixed = true;

      // 마지막 상태 버튼
      buttons.forEach((btn, i) => {
        btn.classList.toggle("active", i === 2);
        btn.classList.toggle("dimmed", i !== 2);
      });

      // 마지막 영상
      videos.forEach((vid, i) => {
        gsap.set(vid, { opacity: i === 2 ? 1 : 0 });
      });

      // 위치 고정
      gsap.set(".btn-wrap", { x: -60 });
    };

    // ScrollTrigger.create({
    //   trigger: ".exp-hr",
    //   start: "top top",
    //   end: "+=500",
    //   scrub: true,
    //   pin: true,
    //   id: "expHR",

    //   onUpdate: self => {
    //     if (fixed) return; // 고정 이후는 무시

    //     const progress = self.progress;
    //     const index = Math.min(
    //       Math.floor(progress * totalSteps),
    //       totalSteps - 1
    //     );
    //     const offsetX = index === 2 ? 60 : 0;

    //     // 버튼 애니메이션
    //     gsap.to(".btn-wrap", {
    //       x: -offsetX,
    //       duration: 0.4,
    //       ease: "power2.out",
    //     });

    //     // 버튼 상태
    //     buttons.forEach((btn, i) => {
    //       btn.classList.toggle("active", i === index);
    //       btn.classList.toggle("dimmed", i !== index);
    //     });

    //     // 비디오 상태
    //     videos.forEach((vid, i) => {
    //       gsap.to(vid, {
    //         opacity: i === index ? 1 : 0,
    //         duration: 0.4,
    //         ease: "power2.out",
    //       });
    //     });

    //     // 마지막 지점 도달 시 고정
    //     if (index === 2 && progress >= 0.99) {
    //       fixFinalState();
    //     }
    //   },

    //   onLeave: () => {
    //     fixFinalState(); // 하단 넘겼을 때 강제 고정
    //   },

    //   onEnterBack: () => {
    //     if (fixed) {
    //       fixFinalState(); // 위로 다시 돌아와도 고정 상태 유지
    //     }
    //   },

    //   onScrubComplete: () => {
    //     const scroll = ScrollTrigger.getById("expHR");
    //     if (!fixed && scroll && scroll.progress >= 0.99) {
    //       fixFinalState();
    //     }
    //   },
    // });

    ScrollTrigger.create({
      trigger: ".swiper1",
      start: "top 90%", // 화면 아래 90% 지점에 도달하면 시작
      end: "bottom top", // swiper가 화면 위로 완전히 벗어나면 끝
      onEnter: () => {
        window.swiper1?.autoplay?.start();
      },
      onLeaveBack: () => {
        window.swiper1?.autoplay?.stop();
      },
      onLeave: () => {
        window.swiper1?.autoplay?.stop();
      },
    });

    // lxp
    const tlLXP = gsap.timeline();
    let scrollTriggerInstance;

    tlLXP.to(
      ".lxp-inner.left",
      {
        x: "-100%",
        opacity: 0,
        duration: 1.2,
        ease: "power2.out",
      },
      0
    );

    tlLXP.fromTo(
      ".lxp-inner.right",
      {
        x: "100%",
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

    tlLXP.fromTo(
      ".lxp-inner.right video",
      {
        width: "40%",
        height: "auto",
        borderRadius: "0",
      },
      {
        width: "100%",
        height: "100vh",
        ease: "power2.out",
      },
      0
    );

    tlLXP.fromTo(
      ".lxp-inner.right .txt-wrap",
      {
        opacity: 0,
      },
      {
        opacity: 1,
        ease: "power2.out",
        duration: 1.2,
      },
      ">0.2"
    );

    // 👉 마지막 애니메이션보다 약간 일찍 pin 해제되게
    ScrollTrigger.create({
      animation: tlLXP,
      trigger: ".lxp-area",
      start: "top top",
      end: () => `+=${(tlLXP.duration() - 1.2) * 1000}`, // ✅ 마지막 애니메이션 길이만큼 일찍 해제
      scrub: false,
      pin: false,
      id: "lxpPin",
      onUpdate: self => {
        // 스크롤을 올릴 때
        if (self.direction === -1 && scrollTriggerInstance) {
          scrollTriggerInstance.disable(false); // pin 해제
        }

        // 다시 내릴 때 활성화
        if (self.direction === 1 && scrollTriggerInstance) {
          scrollTriggerInstance.enable();
        }
      },
      onToggle: self => {
        scrollTriggerInstance = self.scrollTrigger || scrollTriggerInstance;
      },
      // markers: true,

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
    });
  });
}
