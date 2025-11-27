# Mock 모드 사용 가이드

백엔드 없이 프론트엔드만 테스트하는 방법입니다.

---

## 🎯 Mock 모드란?

실제 Django 백엔드 없이 **가짜 데이터**를 사용하여 프론트엔드를 테스트할 수 있는 모드입니다.

---

## 🚀 사용 방법

### 1. Mock 모드 활성화

[constants.js](rn-codeQuest/src/utils/constants.js:5) 파일에서 설정 변경:

```javascript
// ⚠️ Mock 모드 설정 (백엔드 없이 테스트할 때 true로 변경)
export const USE_MOCK_DATA = true; // ← false를 true로 변경
```

### 2. 앱 실행

```bash
cd rn-codeQuest
npm install
npm start
```

### 3. 테스트

이제 백엔드 없이도 앱이 정상 작동합니다!

---

## 📊 Mock 데이터 내용

### 월드 목록
- 🐍 **Python** - 파이썬 프로그래밍 배우기 (잠금 해제됨)
- 📜 **JavaScript** - 자바스크립트 마스터하기 (잠금 해제됨)
- ☕ **Java** - 자바로 시작하는 객체지향 (잠겨있음 🔒)

### Python 월드 진행상황
- 전체 스테이지: 10개
- 완료한 스테이지: 3개
- 진행률: 30%

### JavaScript 월드 진행상황
- 전체 스테이지: 8개
- 완료한 스테이지: 0개
- 진행률: 0%

### Python 스테이지 목록
1. ✅ 변수와 자료형 (완료)
2. ✅ 조건문 (완료)
3. ✅ 반복문 (완료)

### JavaScript 스테이지 목록
1. 변수 선언
2. 🔒 함수 (잠김 - 이전 스테이지 미완료)

---

## 🔧 Mock 데이터 수정

더 많은 테스트 데이터가 필요하면 [mockData.js](rn-codeQuest/src/apis/mockData.js)를 수정하세요.

### 월드 추가
```javascript
export const mockWorlds = [
  // ... 기존 월드
  {
    id: 4,
    title: "C++",
    description: "C++ 마스터하기",
    icon: "⚡",
    is_locked: false,
    created_at: "2024-01-01T00:00:00Z"
  }
];
```

### 스테이지 추가
```javascript
export const mockStages = {
  1: [ /* Python 스테이지 */ ],
  2: [ /* JavaScript 스테이지 */ ],
  4: [ // C++ 스테이지 추가
    {
      id: 10,
      world: 4,
      title: "포인터",
      description: "C++ 포인터 기초",
      order: 1
    }
  ]
};
```

---

## ⚠️ 주의사항

### Mock 모드에서는:
- ✅ 화면 UI 확인 가능
- ✅ 네비게이션 동작 확인 가능
- ✅ 로딩/에러 상태 확인 가능
- ❌ 실제 데이터 저장 불가
- ❌ 로그인 기능 동작 안 함
- ❌ 진행상황 업데이트 안 됨

### 백엔드 연결 시:
Mock 모드를 끄고 실제 API를 사용하세요:

```javascript
export const USE_MOCK_DATA = false; // ← true를 false로 변경
```

---

## 🧪 테스트 시나리오

### 1. 월드 목록 확인
- [x] 3개 월드 표시
- [x] Python 30% 진행률
- [x] JavaScript 0% 진행률
- [x] Java 잠금 🔒

### 2. Python 월드 클릭
- [x] WorldDetailScreen 이동
- [x] 월드 정보 표시
- [x] 3개 스테이지 표시
- [x] 3개 완료 ✅

### 3. JavaScript 월드 클릭
- [x] 2개 스테이지 표시
- [x] 첫 번째는 접근 가능
- [x] 두 번째는 잠김 🔒

### 4. Java 월드 클릭
- [x] "이 월드는 아직 잠겨있습니다" 알림

---

## 🔄 실제 백엔드로 전환

### 1. Mock 모드 끄기
```javascript
export const USE_MOCK_DATA = false;
```

### 2. Django 백엔드 실행
```bash
python manage.py runserver 0.0.0.0:8000
```

### 3. 테스트 데이터 생성
Django Admin에서:
- World 생성
- Stage 생성
- UserWorld 생성 (로그인한 사용자용)

### 4. 앱 재시작
```bash
npm start
```

---

## 📁 관련 파일

| 파일 | 용도 |
|------|------|
| [constants.js](rn-codeQuest/src/utils/constants.js) | Mock 모드 설정 |
| [mockData.js](rn-codeQuest/src/apis/mockData.js) | Mock 데이터 정의 |
| [api.js](rn-codeQuest/src/apis/api.js) | API 함수 (Mock/실제 자동 전환) |

---

## 💡 팁

### UI 개발 시
Mock 모드를 사용하면 백엔드 개발을 기다리지 않고 프론트엔드를 먼저 완성할 수 있습니다.

### 백엔드 연동 테스트 시
Mock 모드를 끄고 실제 API로 전환하세요.

### 에러 테스트
mockData.js에서 빈 배열로 설정하여 빈 상태 UI를 테스트할 수 있습니다:
```javascript
export const mockWorlds = []; // 빈 상태 테스트
```

---

**작성일**: 2024-11-18
**버전**: 1.0.0
