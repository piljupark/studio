const buttons = document.querySelectorAll('.button');
const modals = document.querySelectorAll('.modal');

buttons.forEach((btn) => {
  btn.addEventListener('click', () => {
    // 모든 모달 닫기
    modals.forEach((m) => m.classList.remove('active'));

    // 버튼 id에서 숫자 추출
    const num = btn.id.replace('button', '');
    const modal = document.querySelector(`#modal${num}`);

    // 해당 모달 열기
    modal.classList.add('active');

    if (num === "7") {
      const x = window.innerWidth / 2;
      const y = window.innerHeight / 2;
      new LottiUI(x, y);
    }
  });
});


// LottiUI 클래스 추가
class LottiUI {
  constructor(x, y) {
    const div = document.createElement("dotlottie-player");
    div.setAttribute("src", "https://lottie.host/824cb754-a11a-4458-bba0-1f5129c3ed76/NuLW5jGi8g.lottie");
    div.setAttribute("background", "transparent");
    div.setAttribute("speed", "1");
    div.setAttribute("loop", true);
    div.setAttribute("autoplay", true);
    div.style.cssText = `top:${y}px; left:${x}px;`;

    document.body.append(div);

    setTimeout(() => {
      div.remove();
    }, 3000);
  }
}