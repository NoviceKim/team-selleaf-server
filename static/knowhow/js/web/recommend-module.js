// AI 내용 추천 서비스 요청 모듈
// 다른 파일에서 getRecommends.메소드명 형식으로 사용할 수 있도록 모듈화
const recommendService = (() => {
    // 제목 기반으로 추천받을 내용 요청하는 모듈 - 노하우 게시글 id와 내용
    const getRecommends = async (title, callback) => {
        const response = await fetch(`/knowhow/content-recommendation/${title}/`,{
            headers: {'Content-Type': 'application/json;charset=utf-8'}
        });

        const knowhows = await response.json();

        // 콜백 함수를 인자로 받았다면, 콜백 함수에 받아온 데이터의 처리를 넘김
        if (callback) {
            return callback(knowhows);
        }

        // 콜백 함수를 따로 받지 않았다면, 받아온 id와 내용만 반환
        return knowhows;
    }

    // 객체형태로 반환 - recommendService.getRecommends() 형태로 사용 가능
    return {getRecommends: getRecommends}
})();