if (window.matchMedia("(min-width: 768px)").matches) {
    window.addEventListener('load', () => {
        gsap.registerPlugin(ScrollTrigger);


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
                scrub: true,
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
                scrub: true,
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

        const fl = gsap.timeline({
            scrollTrigger: {
                trigger: ".feed-area",
                start: "top top",
                end: "+=4000", // 스크롤 길이 조절
                scrub: true,
                pin: true,
                markers: true
            }
        });

        feedItems.forEach((item, index) => {
            if (index === 0) {
                // item1은 기본 상태 유지 (opacity: 1로 보이게)
                gsap.set(item, { opacity: 1, zIndex: 1 });
            } else {
                fl.to(item, {
                    opacity: 1,
                    scale: 1,
                    zIndex: index + 1,
                    duration: 1
                }, "+=1"); // 간격 벌려서 하나씩 등장
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

    }); // load
} // matchmedia