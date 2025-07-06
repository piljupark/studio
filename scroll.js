if (window.matchMedia("(min-width: 768px)").matches) {
    window.addEventListener('load', () => {
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);


        let played = false;

        ScrollTrigger.create({
            trigger: ".int-area",
            start: "top top",
            end: "+=1200",
            pin: true,
            scrub: false,
            markers: true,
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
                        opacity: 1,
                        duration: 0.5,
                        ease: "power2.out"
                    });
                }

                // 스크롤 되돌릴 때 되감기
                if (progress < 0.083 && played) {
                    played = false;

                    gsap.to(".visual-inner", {
                        width: "0",
                        height: "0",
                        opacity: 0,
                        duration: 0.5,
                        ease: "power2.out"
                    });
                }
            }
        });


        // curation
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
                scrub: 1.2,
                // markers: true
            }
        });


        // original 
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
                scrub: 1.2,
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



        // brief gsap
        const briefWrap = document.querySelector('.brief-area .cont-wrap');
        const title = document.querySelector('.brief-area .txt-wrap h2');
        const subtitle = document.querySelector('.brief-area .txt-wrap .txt');
        const items = briefWrap.querySelectorAll('.item');
        const wrapHeight = briefWrap.getBoundingClientRect().height;
        const scrollRange = wrapHeight + window.innerHeight * 1.2;
        const speedFactors = [0.6, 1.0, 0.6, 1.2]; // 각 아이템별 속도 조절

        gsap.set([title, subtitle], { fontSize: 0, opacity: 0 });

        gsap.to(title, {
            fontSize: "45px",
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".brief-area",
                start: "top top",
                toggleActions: "play none none reverse", // pin 시작될 때 play
                pin: false // 이 애니메이션 자체에 pin은 안 걸려 있음
            }
        });

        gsap.to(subtitle, {
            fontSize: "16px",
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".brief-area",
                start: "top top",
                toggleActions: "play none none reverse"
            }
        });

        // 컨테이너 전체 이동 (위로)
        gsap.set(briefWrap, {
            y: window.innerHeight
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
                        ease: "power2.out"
                    });
                    gsap.to(subtitle, {
                        height: 0,
                        duration: 0.5,
                        ease: "power2.out"
                    });
                },
                onEnterBack: () => {
                    gsap.to(title, {
                        height: "auto",
                        duration: 0.5,
                        ease: "power2.out"
                    });
                    gsap.to(subtitle, {
                        height: "auto",
                        duration: 0.5,
                        ease: "power2.out"
                    });
                }
            }
        });

        // 각 아이템 개별 속도 설정
        items.forEach((item, i) => {
            const speed = speedFactors[i] || 1; // fallback 값

            gsap.fromTo(item,
                { y: 0 },
                {
                    y: -wrapHeight * speed,
                    ease: "none",
                    scrollTrigger: {
                        trigger: ".brief-area",
                        start: "top top",
                        end: () => `+=${scrollRange}`,
                        scrub: true,
                        // markers: true
                    }
                }
            );
        });

        // feed gsap
        const feedItems = gsap.utils.toArray(".feed-area .item");
        const txtWrap = document.querySelector(".feed-area .txt-wrap");
        const feedWrap = document.querySelector(".feed-area .cont-wrap");

        // 초기 위치 셋팅
        gsap.set(txtWrap, { x: "-100vw", opacity: 0 });
        gsap.set(feedWrap, { x: "100vw", opacity: 0 });

        // 메인 타임라인
        const fl = gsap.timeline({
            scrollTrigger: {
                trigger: ".feed-area",
                start: "top top",
                end: "+=4000",
                scrub: 1.2,
                pin: true,
                markers: true
            }
        });

        // 0~200px 구간: 시간 흘리는 용
        fl.to({}, { duration: 1 }); // 스크롤 구간상 약 200px 해당 (scrub: true이기 때문)

        // 200px 시점에서 txt-wrap / cont-wrap 슬라이드 인 (0.3초)
        fl.to(txtWrap, {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "power2.out"
        }, "slideIn");

        fl.to(feedWrap, {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "power2.out"
        }, "slideIn"); // 타이밍 레이블로 동기화

        // 이후 feedItems 순차 등장
        feedItems.forEach((item, index) => {
            if (index === 0) {
                gsap.set(item, { opacity: 1, zIndex: 1 });
            } else {
                fl.to(item, {
                    opacity: 1,
                    scale: 1,
                    zIndex: index + 1,
                    duration: 1
                }, "+=1"); // 간격 줘서 등장
            }
        });




        // exp
        const video = document.querySelector(".exp-vid video");

        ScrollTrigger.create({
            trigger: ".exp-vid",
            start: "top top",
            end: "+=1000", // 충분한 pin 길이 (스크롤 막기용)
            pin: true,
            scrub: false,
            markers: true // 디버그용
        });

        // 2. 영상 재생 완료 후 자동 스크롤 이동
        video.addEventListener("ended", () => {
            document.querySelector(".exp-hr").scrollIntoView({
                behavior: "smooth"
            });
        });
        

        // lxp gsap
        let isAutoScrolling = false;  // 중복 방지용 플래그

        const tlLXP = gsap.timeline({
        scrollTrigger: {
            trigger: ".lxp-area",
            start: "top top",
            end: "+=2500",  // 적당한 길이로 조절
            scrub: 1.2,
            pin: true,
            markers: true,
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
                }
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
                }
            });
            }
        }
        });
          
          // .left → 왼쪽 바깥으로 나감
          tlLXP.to(".lxp-inner.left", {
            x: "-100%", // 왼쪽 바깥으로 이동
            opacity: 0,
            duration: 1.2,
            ease: "power2.out"
          }, 0);
          
          // .right → 오른쪽 바깥에서 중앙으로 들어옴
          tlLXP.fromTo(".lxp-inner.right", {
            x: "100%", // 오른쪽 바깥에서 시작
            opacity: 0
          }, {
            x: "0%",
            opacity: 1,
            duration: 1.2,
            ease: "power2.out"
          }, 0);

          // 🔥 .right 안의 video는 width 확장
            tlLXP.fromTo(".lxp-inner.right video", {
                width: "40%", // 시작 상태
            }, {
                width: "100%", // 중앙 도달 시 확장
                ease: "power2.out"
            }, 0); // 같은 타이밍에 실행

            // 4️⃣ txt-wrap → opacity: 0 → 1 (영상 중앙 도달 직후)
            tlLXP.fromTo(".lxp-inner.right .txt-wrap", {
                opacity: 0
            }, {
                opacity: 1,
                ease: "power2.out"
            }, ">0.2"); // 🔥 이전 애니메이션 끝난 뒤 0.2초 후에 시작

            // 🔥 4️⃣ 스크롤 500px 더 진행한 뒤 전환
            tlLXP.to(".lxp-inner.right video", {
                width: 0,
                opacity: 0,
                ease: "power2.inOut"
            }, "+=0.3"); // 영상 다 보인 뒤 시작
            
            tlLXP.to(".lxp-inner.right .txt-wrap", {
                opacity: 0,
                ease: "power2.out"
            }, "<"); // 동시에 사라짐
            
            tlLXP.fromTo(".lxp-cont", {
                opacity: 0
            }, {
                opacity: 1,
                ease: "power2.out"
            }, "<+0.1"); // 살짝 딜레이해서 부드럽게 등장


            tlLXP.fromTo(".lxp-cont",
                { opacity: 0 },
                { opacity: 1, duration: 0.6, ease: "power2.out" },
                "<+0.1"
              );
              
              tlLXP.to(".lxp-cont .txt-wrap .sm-ti span:nth-child(1), \
                        .lxp-cont .txt-wrap .ti p:nth-child(1), \
                        .lxp-cont .txt-wrap .txt span:nth-child(1)",
                {
                  opacity: 1,
                  duration: 1,
                  ease: "power2.out",
                  stagger: 0.05
                },
                ">1"
              );


            tlLXP.to([
                ".lxp-cont .txt-wrap .sm-ti span:nth-child(1)",
                ".lxp-cont .txt-wrap .ti p:nth-child(1)",
                ".lxp-cont .txt-wrap .txt span:nth-child(1)"
            ], {
                opacity: 0,
                duration: 0.5,
                ease: "power2.out"
            }, "+=0.2"); // ← 이전 텍스트 등장 후 약간 텀 주고 시작
            
            tlLXP.to(".lxp-cont video", {
                width: "50%",
                height: "500px",
                opacity: 0,
                ease: "power2.inOut",
                duration: 0.7
            }, "<"); // ← 위 텍스트 사라짐과 동시에


            // 🔥 6️⃣ 다음 콘텐츠 등장: item-wrap → opacity 1
            tlLXP.to(".lxp-cont .grid .item-wrap", {
                opacity: 1,
                duration: 0.5,
                ease: "power2.out"
            }, "<"); // ← video 사라진 후 0.5초 뒤
            
            // 🔥 7️⃣ 텍스트 순차 등장: sm-ti2, ti2, txt2
            tlLXP.to([
                ".lxp-cont .txt-wrap .sm-ti span:nth-child(2)",
                ".lxp-cont .txt-wrap .ti p:nth-child(2)",
                ".lxp-cont .txt-wrap .txt span:nth-child(2)"
            ], {
                opacity: 1,
                duration: 0.6,
                ease: "power2.out",
                stagger: 0.2
            }, "+=1"); // ← item-wrap 등장 후 1초 뒤



            
            const outItems = gsap.utils.toArray(".out-item");

// 초기 위치 세팅
gsap.set(".out-area .txt-wrap .sm-ti, .out-area .txt-wrap h3, .out-area .txt-wrap .txt", { opacity: 0 });
outItems.forEach((item, i) => {
  gsap.set(item, {
    y: window.innerHeight + 100 + i * 50,
    rotation: 0
  });
});

// scrollTrigger: pin만 담당 + onEnter에서 애니메이션 자동 실행
ScrollTrigger.create({
  trigger: ".out-area",
  start: "top top",
  end: "+=2000",  // pin 고정 유지 시간
  pin: true,
  scrub: false,
  markers: true,
  id: "outPin",
  onEnter: () => {
    const tl = gsap.timeline();

    // 1단계: sm-ti, h3 등장
    tl.to(".out-area .txt-wrap .sm-ti, .txt-wrap h3", {
      opacity: 1,
      duration: 0.5,
      stagger: 0.1,
      ease: "power1.out"
    });

    // 2단계: 1초 후 .txt 등장
    tl.to(".out-area .txt-wrap .txt", {
      opacity: 1,
      duration: 0.5,
      ease: "power1.out"
    }, "+=1");

    // 3단계: 이미지 올라가며 회전
    const yEnd = - (window.innerHeight / 2 + 300);

    tl.to(outItems[0], {
      y: yEnd,
      rotation: 15,
      duration: 2,
      ease: "power1.inOut"
    }, "+=0.2");

    tl.to(outItems[1], {
      y: yEnd - 50,
      rotation: -15,
      duration: 2.2,
      ease: "power1.inOut"
    }, "<");

    tl.to(outItems[2], {
      y: yEnd - 100,
      rotation: 10,
      duration: 2.4,
      ease: "power1.inOut"
    }, "<");
  }
});



    }); // load
} // matchmedia