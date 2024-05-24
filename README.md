<br>
<br>
<br>

![logo-lettering](https://github.com/DianaKang0123/selleaf/assets/156397873/b5f4c8cd-6d88-4965-9336-ad89f151ba52)
<br>
<br>
<br>

# 머신러닝 웹 적용 프로젝트

<br>
<br>
<br>

<br>

## 제목 기반 내용 추천 시스템

### **👍 목차**

1. 개요
2. 기능 테스트
3. 코사인 유사도 분석
4. 내용 추천 알고리즘의 흐름
5. 기대 효과

<br>

---

<br>

### **1️⃣ 개요**

<br>

글을 작성할 때, 간혹 내용을 어떻게 작성할지 오랜 시간 고민하게 되는 경우가 있습니다.  
그런 분들을 위해 저희 셀리프에서는 **제목을 기반으로 내용을 추천**해주는 기능을 제공합니다.

**유사도 분석을 통한 내용 추천 시스템**을 사용했으며, 노하우 작성 페이지에 우선 적용했습니다.  
사용자가 글의 제목을 입력한 다음 **AI 내용 추천 버튼**을 클릭하면, 입력한 제목과의 유사도가 높은 다른 노하우의 내용들이 화면에 표시됩니다.

단, 이 과정에서 완전히 같은 내용을 가진 게시글이 양산되는, 이른바 **매크로** 행위를 방지하고자  
추천 받은 내용을 수정하지 않는 이상 노하우의 업로드를 방지하는 장치도 마련했습니다.

<br>

---

<br>

### **2️⃣ 기능 테스트**

<br>

#### 실제 서비스에 적용하기 전, 별도의 파일에 기능을 테스트해보았습니다.

- 데이터 크롤링을 통하여 홈페이지 성격에 맞는, 식물 관련 포스트의 제목과 내용을 추출
- 모은 데이터는 csv 파일에 저장
- 실제 서비스에서는 기존 DB의 노하우 게시물 테이블에서 직접 데이터 가져와서 유사도 분석  

<br>

<details>
<summary>Python 코드</summary>

```
        from Tools.scripts.dutree import display
        from urllib.request import urlopen
        from bs4 import BeautifulSoup

        # 제목과 내용을 담을 빈 리스트 하나씩 선언
        title_list = []
        content_list = []

        # 아래의 주소 맨 뒤에 1 ~ 31000까지의 숫자를 넣어, 해당 주소를 데이터 크롤링
        for number in range(1, 31001):
            response = urlopen('https://www.gardening.news/news/articleView.html?idxno='+ str(number))

            # 위에서 크롤링한 정보를 html parser로 해석
            soup = BeautifulSoup(response, 'html.parser')

            # heading 클래스를 가진 h1 태그들 중, 첫 번째 태그 안 텍스트를 가져옴 - 제목
            titles = soup.select('h1', {'class':'heading'})
            if titles:
                title = titles[0].text.strip()
            else:
                title = ''

            # p 태그들 중, 첫 번째 태그 안 텍스트를 가져옴 - 내용
            contents = soup.select('p')
            if contents:
                content = contents[0].text.strip()
            else:
                content = ''

            # 제목과 내용이 둘 다 있고, 내용이 20자 이상일 때만 제목과 내용을 리스트에 추가
            if title != '' and content !='' and len(content) >= 20:
                title_list.append(title)
                content_list.append(content)

            # 만약 중간에 제목, 내용이 6000건 이상이 되면 반복문 탈출
            if len(title_list) >= 6000 and len(content_list) >= 6000:
                break

        # 마지막에는 제목, 내용 리스트 길이 출력
        print(f'제목: {len(title_list)}건')
        print(f'내용: {len(content_list)}건')
```
</details>

---

<br>

### **3️⃣ 코사인 유사도 분석**

#### 코사인 유사도 분석 알고리즘은 다음과 같습니다.

1. 입력한 제목을 recommend-module.js 내 함수의 인자로 받고, fetch를 사용해서 get 방식으로 APIView에 전달

   <details>
   <summary>JavaScript 코드</summary>

   ```
       // 입력한 제목을 바탕으로 AI 추천 내용을 요청하는 모듈
       const recommendService = (() => {
           // 입력받은 제목을 경로에 담아 APIView에 데이터 요청
           const getRecommends = async (title, callback) => {
               const response = await fetch(`/knowhow/content-recommendation/${title}/`,{
                   headers: {'Content-Type': 'application/json;charset=utf-8'}
               });

               // APIView에서 받아온 데이터를 변수에 할당
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
   ```

   </details>

<br>

2. DB에 저장된 모든 노하우 게시글 정보와 작성한 제목을 하나의 리스트에 저장

   <details>
   <summary>Python 코드</summary>

   ```
   # 입력받은 제목과 가장 유사도가 높은 기존 제목 5개의 id를 구해주는 메소드
   def get_similarity_from_title(self, title):
       # tbl_knowhow에서 id랑 knowhow_title만 가져와서 리스트로 변환
       # [(id, 제목), (id, 제목), ...]
       knowhow_title_list = list(Knowhow.objects.values_lis('id', 'knowhow_title'))

       # (None, 입력받은 제목)을 리스트의 맨 뒤에 추가
       new_knowhow = (None, title)
       knowhow_title_list.append(new_knowhow)

   ```

   </details>

<br>

3. TF-IDF Vectorizer를 사용하여 각 제목 간 코사인 유사도 산출

   <details>
   <summary>Python 코드</summary>

   ```
        # TF-IDF Vectorizer 객체 선언
        tfidf_v = TfidfVectorizer()

        # 제목만으로 TF-IDF Vectorizer에 fit
        knowhow_titles = [title for _, title in knowhow_title_list]
        tfidf_metrix = tfidf_v.fit_transform(knowhow_titles)

        # 위에서 fit한 결과의 코사인 유사도 산출
        c_s = cosine_similarity(tfidf_metrix)
   ```

   </details>

> - TF-IDF Vectorizer란?

<br>

4. 입력받은 제목과의 유사도가 가장 높은 상위 5개 노하우의 id값 반환
   <details>
   <summary>Python 코드</summary>

   ```
        # 입력받은 제목과 유사도가 높은 상위 5개의 노하우 슬라이싱
        knowhow_datas = sorted(list(enumerate(c_s[-1])), key=lambda x: x[1], reverse=True)[1:6]

        # (id, 유사도) 중 id만 넣을 빈 리스트 선언
        knowhow_ids = []

        # 가져온 (id, 유사도) 중 id만 리스트에 추가
        for id, _ in knowhow_datas:
            knowhow_ids.append(knowhow_title_list[id][0])

        # id 리스트 반환
        return knowhow_ids

   ```

   </details>

<br>

5. APIView의 get 메소드에서 id값으로 노하우의 내용을 조회하고 반환

   <details>
   <summary> Python 코드</summary>

   ```
   # AI 내용 추천 버튼 누르면 요청되는 API
    def get(self, request, title):
        # id 조회 메소드로 입력한 제목과 유사도가 높은 노하우의 id 값 산출
        similar_kh_ids = self.get_similarity_from_title(title)

        # JS fetch 요청에 반환할 데이터들
        columns = [
            'id',
            'knowhow_content'
        ]

        # 유사도 높은 노하우의 id 값으로 해당 노하우의 내용을 조회
        knowhows = Knowhow.objects.values(*columns).filter(id__in=similar_kh_ids)

        # 요청한 노하우 id와 내용 반환
        return Response(knowhows)

   ```

   </details>

<br>


---

<br>

### **4️⃣ 내용 추천 알고리즘의 흐름**

<br>

#### 내용 추천 알고리즘의 흐름은 다음과 같습니다.

1. 화면에서 제목을 입력하면 제목 입력란 옆 AI 내용 추천 버튼이 활성화 됨

   > - 활성화 전
   >
   > ![스크린샷 2024-05-23 170052](https://github.com/NoviceKim/team-selleaf-server/assets/142701341/e4b4e0e1-477b-4d6f-933f-c9d1233edb51)


   > - 활성화 후
   >
   > ![스크린샷 2024-05-23 170528](https://github.com/NoviceKim/team-selleaf-server/assets/142701341/f15e58a8-b428-48dc-a56a-495b9c0d223d)


2. AI 내용 추천 버튼 클릭 시, JavaScript의 fetch 요청으로 APIView에 데이터 요청

3. APIView에서 위 과정대로 제목의 유사도가 가장 높은 상위 5개 노하우의 내용 반환
 
4. fetch 요청으로 받은 노하우 내용을 화면에 표시
  
    > - 입력한 제목과 유사도가 가장 높은 상위 5개 노하우의 내용이 추천됨
    >
    > ![스크린샷 2024-05-23 171702](https://github.com/NoviceKim/team-selleaf-server/assets/142701341/fde8945d-52df-4ff1-8e05-2ee02eb82e4d)


5. 추천받은 내용을 클릭하면 그대로 내용 입력란에 반영됨


   > - 추천 받은 내용들 중 마음에 드는 것 선택
   >
   > ![스크린샷 2024-05-23 171941](https://github.com/NoviceKim/team-selleaf-server/assets/142701341/cbc0edd2-d851-45b9-a757-51d6ea40f925)
   
   > - 선택한 내용은 내용 입력란에 바로 반영됨
   >
   > ![스크린샷 2024-05-23 172133](https://github.com/NoviceKim/team-selleaf-server/assets/142701341/c143a16b-efc3-4c56-8615-7857797d61cb)

   > - 단, 추천받은 내용을 수정하지 않으면 업로드 불가 (매크로 방지)
   > 
   > ![스크린샷 2024-05-23 172515](https://github.com/NoviceKim/team-selleaf-server/assets/142701341/682159e2-3911-488e-8749-f33f29996f57)


6. 제목 변경 후 다시 AI 내용 추천 버튼 클릭 시, 새로운 제목에 맞는 내용을 다시 추천

---

<br>

### **5️⃣ 기대 효과**

- AI 자동 추천 기능을 적용함에 따라 사용자 경험을 향상시킬 수 있습니다.

- 작성한 제목에 알맞은 제목을 추천해줌으로서, 제목과 내용이 일맥상통하는 양질의 노하우가 늘어날 것으로 예상됩니다.

- 또한, 노하우 작성이 보다 쉬워짐으로서 셀리프 커뮤니티를 활성화 시킬 수 있을 것으로 기대됩니다.
