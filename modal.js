document.addEventListener('DOMContentLoaded', () => {

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
        // console.log("확인용 : " + event.data?.type);

        if (
            event.data?.type === 'disqualified' ||
            event.data?.type === 'bookingComplete' ||
            event.data?.type === 'closeModal'
        ) {
            // console.log('리캐치 폼 이벤트 발생:', event.data.type);

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

        // if (event.data?.type === 'formReady') {
        //   console.log('리캐치 폼 로드 준비 완료!');
        // }
    });

});