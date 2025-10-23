### apis/apiClient.js
# 기본 API 사용법
GET : get(url, params); // params 생략가능 
POST : post(url, data); // data 생략가능 (생략하면 빈 객체로 전달)
PUT : put(url, data);  // data 생략가능 (생략하면 빈 객체로 전달)
DELETE : delete(url, data); // data 생략가능

# 커스텀 API 사용법
apiClient.js 내의 Custom API 예시 참고하여 apis 내 새 파일 생성해서 사용할 api 만들어서 사용하면 편리할 것 같음.
새 파일 생성해서 하는 이유는 merge 충돌 최소화하기 위함.

# Request 인터셉터
GET, POST, PUT, DELETE 요청시 AsyncStorage 에 authToken이 존재하면 자동으로 header에 추가해서 서버에 전달됨.

# Response 인터셉터
response.data 추출

### context/AuthContext.js
회원처리 전역 관리