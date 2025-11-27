# CodeQuest Frontend - 테스트 가이드

## 📋 목차
1. [개발 환경 설정](#개발-환경-설정)
2. [앱 실행 방법](#앱-실행-방법)
3. [기능 테스트 가이드](#기능-테스트-가이드)
4. [API 엔드포인트 확인](#api-엔드포인트-확인)
5. [문제 해결](#문제-해결)

---

## 🛠 개발 환경 설정

### 1. 사전 준비
```bash
# Node.js 및 npm 설치 확인
node --version  # v18 이상 권장
npm --version

# 프로젝트 디렉토리로 이동
cd rn-codeQuest

# 의존성 설치
npm install
```

### 2. 환경 변수 설정

`rn-codeQuest/src/utils/constants.js` 파일에서 백엔드 URL 설정:

```javascript
export const API_BASE_URL = 'http://YOUR_BACKEND_URL:8000';
// 예: 'http://192.168.0.10:8000' (로컬 네트워크)
// 예: 'https://api.codequest.com' (프로덕션)
```

> **주의**:
> - Android 에뮬레이터: `http://10.0.2.2:8000`
> - iOS 시뮬레이터: `http://localhost:8000`
> - 실제 기기: 로컬 네트워크 IP 사용 (예: `http://192.168.0.10:8000`)

---

## 🚀 앱 실행 방법

### Expo 개발 서버 시작
```bash
cd rn-codeQuest
npm start
# 또는
npx expo start
```

### 플랫폼별 실행

#### iOS (Mac만 가능)
```bash
npm run ios
# 또는
npx expo run:ios
```

#### Android
```bash
npm run android
# 또는
npx expo run:android
```

#### 웹 브라우저
```bash
npm run web
# 또는
npx expo start --web
```

### Expo Go 앱으로 테스트
1. 스마트폰에 **Expo Go** 앱 설치
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. `npm start` 실행 후 나오는 QR 코드 스캔
3. 앱이 자동으로 로드됨

---

## 🧪 기능 테스트 가이드

### 1. 로그인 테스트

#### 준비사항
- 백엔드 서버가 실행 중이어야 함
- 테스트 계정이 생성되어 있어야 함

#### 테스트 절차
1. 앱 시작 → "로그인" 버튼 클릭
2. 소셜 로그인 중 하나 선택 (Google, Kakao, Naver 등)
3. 로그인 성공 시 HomeScreen으로 이동 확인

#### 예상 결과
- ✅ 사용자 정보 표시 (닉네임, 코인, XP)
- ✅ 월드 목록 로딩
- ✅ 스트릭 정보 표시

---

### 2. 월드(World) 기능 테스트

#### 2.1 월드 목록 확인

**테스트 시나리오**
1. HomeScreen에서 "코딩 언어 월드" 섹션 확인
2. 월드 목록이 표시되는지 확인

**예상 화면**
```
🌍 코딩 언어 월드                    3개
┌────────────────────────────────────┐
│ 🐍  Python                         │
│     파이썬 프로그래밍 배우기        │
│     스테이지: 0/10           0%    │
└────────────────────────────────────┘
┌────────────────────────────────────┐
│ 📜  JavaScript                     │
│     자바스크립트 마스터하기         │
│     스테이지: 0/8            0%    │
└────────────────────────────────────┘
```

#### 2.2 월드 클릭 테스트

**테스트 절차**
1. 잠금 해제된 월드 클릭
2. 월드 상세 화면(WorldDetailScreen)으로 이동 확인
3. 스테이지 목록 확인

**예상 화면**
```
┌─────────────────────────────────────┐
│            🐍                       │
│         Python                      │
│    파이썬 프로그래밍 배우기          │
│                                     │
│    진행률                            │
│    0/10 스테이지                    │
│    ████░░░░░░░  0%                  │
└─────────────────────────────────────┘

스테이지 목록
┌────────────────────────────────────┐
│ ① Stage 1: 변수와 자료형            │
│    파이썬의 기본 변수 타입 학습      │
└────────────────────────────────────┘
┌────────────────────────────────────┐
│ 🔒 Stage 2: 조건문                 │
│    if, elif, else 문법 학습         │
└────────────────────────────────────┘
```

#### 2.3 잠금 상태 테스트

**테스트 절차**
1. 잠긴 월드(🔒) 클릭
2. "이 월드는 아직 잠겨있습니다" 알림 확인
3. 잠긴 스테이지 클릭
4. "이전 스테이지를 먼저 완료해주세요" 알림 확인

---

### 3. 스테이지(Stage) 기능 테스트

#### 3.1 스테이지 목록 확인

**확인 사항**
- [ ] 스테이지가 순서대로 표시됨
- [ ] 첫 번째 스테이지는 항상 잠금 해제 상태
- [ ] 완료된 스테이지는 ✓ 표시와 "완료" 배지
- [ ] 잠긴 스테이지는 🔒 표시

#### 3.2 스테이지 진행 로직

**테스트 시나리오**
1. Stage 1 클릭 → 접근 가능
2. Stage 2 클릭 (Stage 1 미완료 시) → 접근 불가 알림
3. Stage 1 완료 후 Stage 2 클릭 → 접근 가능

---

### 4. 새로고침(Pull to Refresh) 테스트

**테스트 절차**
1. HomeScreen에서 화면을 아래로 당김
2. 로딩 인디케이터 표시 확인
3. 데이터 새로고침 확인
4. WorldDetailScreen에서도 동일하게 테스트

---

## 🔌 API 엔드포인트 확인

### 필요한 Django 백엔드 API

#### 1. 월드 관련 API
```
GET  /api/worlds/                           # 전체 월드 목록
GET  /api/worlds/{worldId}/                 # 특정 월드 상세
GET  /api/worlds/{worldId}/stages/          # 월드의 스테이지 목록
GET  /api/user-worlds/                      # 사용자별 월드 진행상황
GET  /api/user-worlds/{worldId}/            # 사용자의 특정 월드 진행상황
POST /api/user-worlds/{worldId}/unlock/     # 월드 잠금 해제
```

#### 2. 스테이지 관련 API
```
GET  /api/stages/{stageId}/                      # 스테이지 상세
GET  /api/user-stage-progress/{stageId}/         # 사용자의 스테이지 진행상황
POST /api/user-stage-progress/{stageId}/complete/ # 스테이지 완료 처리
```

### API 응답 예시

#### GET /api/worlds/
```json
[
  {
    "id": 1,
    "title": "Python",
    "description": "파이썬 프로그래밍 배우기",
    "icon": "🐍",
    "is_locked": false,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

#### GET /api/user-worlds/
```json
[
  {
    "id": 1,
    "user": "user-uuid",
    "world": 1,
    "is_unlocked": true,
    "completed_stage": 3,
    "total_stage": 10,
    "progress_percentage": 30,
    "last_studied_at": "2024-01-10T10:30:00Z"
  }
]
```

#### GET /api/worlds/{worldId}/stages/
```json
[
  {
    "id": 1,
    "world": 1,
    "title": "변수와 자료형",
    "description": "파이썬의 기본 변수 타입 학습",
    "order": 1,
    "created_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": 2,
    "world": 1,
    "title": "조건문",
    "description": "if, elif, else 문법 학습",
    "order": 2,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

---

## ❗ 문제 해결

### 1. 앱이 실행되지 않을 때

```bash
# 캐시 삭제
npm start -- --clear

# node_modules 재설치
rm -rf node_modules
npm install

# Metro Bundler 재시작
npx expo start -c
```

### 2. API 연결 실패

**증상**: "데이터를 불러오는데 실패했습니다" 에러

**해결 방법**:
1. 백엔드 서버가 실행 중인지 확인
   ```bash
   # Django 서버 실행 확인
   python manage.py runserver 0.0.0.0:8000
   ```

2. `constants.js`의 API_BASE_URL 확인
   ```javascript
   // rn-codeQuest/src/utils/constants.js
   export const API_BASE_URL = 'http://YOUR_IP:8000';
   ```

3. 네트워크 연결 확인
   - 에뮬레이터와 백엔드가 같은 네트워크에 있는지 확인
   - 방화벽 설정 확인

4. API 응답 확인
   ```bash
   # 브라우저나 Postman으로 테스트
   curl http://YOUR_IP:8000/api/worlds/
   ```

### 3. 로그인 실패

**확인 사항**:
- [ ] 소셜 로그인 설정이 백엔드에 올바르게 되어 있는지
- [ ] 인증 토큰이 올바르게 저장되는지
- [ ] AuthContext가 제대로 동작하는지

**디버깅**:
```javascript
// src/context/AuthContext.js
console.log('로그인 성공:', user);
console.log('토큰:', tokens);
```

### 4. 월드/스테이지가 표시되지 않을 때

**확인 사항**:
1. Django Admin에서 World, Stage 데이터가 있는지 확인
2. UserWorld 데이터가 생성되어 있는지 확인
3. API가 올바른 데이터를 반환하는지 확인

**디버깅**:
```javascript
// HomeScreen.js
console.log('Worlds:', worlds);
console.log('UserWorlds:', userWorlds);

// WorldDetailScreen.js
console.log('Stages:', stages);
console.log('UserStageProgress:', userStageProgress);
```

### 5. 개발자 도구 사용

**React Native Debugger 설치** (권장)
```bash
# Mac
brew install --cask react-native-debugger

# Windows
# https://github.com/jhen0409/react-native-debugger/releases
```

**사용법**:
1. React Native Debugger 실행
2. 앱에서 Dev Menu 열기
   - iOS: Cmd + D
   - Android: Cmd + M (Mac) / Ctrl + M (Windows)
3. "Debug" 선택

---

## 📝 테스트 체크리스트

### 기본 기능
- [ ] 앱이 정상적으로 시작됨
- [ ] 로그인 화면이 표시됨
- [ ] 로그인이 정상 작동함
- [ ] 로그아웃이 정상 작동함

### 홈 화면
- [ ] 사용자 정보 표시 (코인, XP, 스트릭)
- [ ] 월드 목록 로딩
- [ ] 월드 목록 표시
- [ ] 새로고침 기능 동작
- [ ] 빈 상태 처리 (월드가 없을 때)
- [ ] 에러 상태 처리

### 월드 상세 화면
- [ ] 월드 정보 표시 (아이콘, 제목, 설명)
- [ ] 진행률 표시
- [ ] 스테이지 목록 로딩
- [ ] 스테이지 목록 표시
- [ ] 잠금 상태 표시
- [ ] 완료 상태 표시
- [ ] 새로고침 기능 동작
- [ ] 뒤로가기 버튼 동작

### 스테이지 접근 제어
- [ ] 첫 번째 스테이지는 항상 접근 가능
- [ ] 이전 스테이지 미완료 시 접근 불가
- [ ] 잠긴 스테이지 클릭 시 알림 표시
- [ ] 완료된 스테이지 표시

---

## 🎯 모델 구조 이해

### World (월드)
```python
- title: 코딩 언어 이름 (예: "Python", "JavaScript")
- description: 월드 설명
- icon: 이모지 아이콘
- is_locked: 잠금 여부
```

### UserWorld (사용자별 월드 진행상황)
```python
- user: 사용자 FK
- world: 월드 FK
- is_unlocked: 잠금 해제 여부
- completed_stage: 완료한 스테이지 수
- progress_percentage: 진행률 (%)
- last_studied_at: 마지막 공부 시간
```

### Stage (스테이지)
```python
- world: 월드 FK
- title: 스테이지 제목
- description: 스테이지 설명
- order: 순서 (1, 2, 3, ...)
```

### UserStageProgress (사용자별 스테이지 진행상황)
```python
- user: 사용자 FK
- stage: 스테이지 FK
- is_completed: 완료 여부
- completed_at: 완료 일시
```

---

## 📞 추가 지원

문제가 계속 발생하면:
1. Console 로그 확인
2. Network 탭에서 API 요청/응답 확인
3. Django 서버 로그 확인
4. GitHub Issues에 문제 보고

---

**작성일**: 2024-11-18
**버전**: 1.0.0
