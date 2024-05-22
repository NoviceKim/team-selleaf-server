// 전역 변수 선언
const recommendList = document.querySelector('ul.ai-recommended-list'); // 추천 내용 목록
const textArea = document.querySelector('.content-text-area') // 내용 작성란

const recommendButton = document.querySelector('.content-recommendation'); // AI 내용 추천 버튼(div)
const publishButton = document.querySelector('.publish-btn'); // 발행신청 버튼

// 추천받은 내용 저장할 변수 (기본값 빈 문자열) - 매크로 방지용
let recommendedContent = '';

// li 태그 클릭 이벤트 - 클릭한 내용 textarea에 innerText로 삽입
const addListClickEvent = () => {
    const lists = document.querySelectorAll('.recommended-contents-wrap');

    // 각 리스트에 클릭 이벤트 추가
    lists.forEach((list) => {
        list.addEventListener('click', ()  => {
            // 리스트 내 내용 탐색
            targetText = list.children[0].children[0].children[1].innerText;

            // textarea에 내용 삽입
            textArea.value = targetText;

            // 현재 글자 수를 화면에 적용
            contentCount.innerText = textArea.value.length;

            // 추천 받은 내용을 변수에 저장
            recommendedContent = targetText;

            // 발행 신청 버튼 비활성화
            publishButton.disabled = true;

            // 모든 리스트 삭제
            const aiLists = document.querySelectorAll('.recommended-contents-wrap');

            aiLists.forEach((list) => {
                list.remove();
            });
        });
    });
}

// li 태그 (추천받은 내용) 생성 모듈
const createRecommendedList = (() => {
    const showList = async (knowhows) => {
        // HTML 코드를 담을 빈 문자열
        let text = ``;

        // 리스트 번호 - 1 ~ 5번
        listNum = 0;

        // 각 노하우의 내용이 담긴 li 태그 추가
        for (let knowhow of knowhows) {
            text += `
                <li class="recommended-contents-wrap ${++listNum}">
                  <div class="recommended-contents-container">
                    <div class="recommended-contents-inner">
                      <div class="recommended-content-num">
                        추천 내용 ${listNum}
                      </div>
                      <div class="ai-recommended-content">
                        ${knowhow.knowhow_content}
                      </div>
                    </div>
                  </div>
                  <div class="select-text-wrap">
                    <div class="select-text">선택</div>
                  </div>
                </li>
            `
        }
        // ul 태그 안에 리스트 표시
        recommendList.innerHTML = text;

        // 리스트 클릭 이벤트 추가
        addListClickEvent();
    }

    return {showList: showList}
})();

// 제목 작성 후 버튼 클릭했을 때 발생하는 이벤트
const recommendButtonClickEvent = () => {
    // AI 추천 버튼이 활성화 상태(disabled 클래스 없음)일 때만 이벤트 발생
    if (!recommendButton.classList.contains('disabled')) {
        // 제목 입력 태그에서 현재 입력된 텍스트 가져오기
        const titleInput = document.querySelector('input.title-input');
        const title = titleInput.value;

        // 입력값이 있을 때만 입력한 텍스트로 모듈로 fetch 요청해서 ul 태그 안에 리스트 뿌리기
        if (title) {
            recommendService.getRecommends(title, createRecommendedList.showList);
        }

        // AI 추천 버튼 비활성화
        if (!recommendButton.classList.contains('disabled')) {
            recommendButton.classList.add('disabled');
        }
    }
}

// 페이지 켜지면 AI 추천 버튼 비활성화 - disabled 클래스 없으면 추가
if (!recommendButton.classList.contains('disabled')) {
    recommendButton.classList.add('disabled');
}

// AI 내용 추천 버튼 클릭 시 위 이벤트 발동
recommendButton.addEventListener('click', recommendButtonClickEvent);

// 페이지 열렸을 때 발행 신청 버튼 비활성화
publishButton.disabled = true;

// 발행신청 버튼 활성/비활성 이벤트 - 제목이랑 내용 다 있어야 활성화
document.addEventListener('keyup', () => {
    const title = document.querySelector('input.title-input').value;
    const content = document.querySelector('.content-text-area').value;

    // 제목이랑 내용이 둘 다 있고
    if (title && content) {
        // 내용이 추천 내용과 다르면 발행신청 버튼 활성화
        if (content !== recommendedContent) {
            publishButton.disabled = false;
        }
        else {
            publishButton.disabled = true;
        }
    }
    // 그렇지 않다면 발행신청 버튼 비활성화
    else {
        publishButton.disabled = true;
    }
});
