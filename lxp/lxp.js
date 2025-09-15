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
    if (modal) {
      modal.classList.add('active');
    }
  });
});