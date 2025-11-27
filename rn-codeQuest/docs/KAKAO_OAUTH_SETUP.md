# Kakao OAuth 설정 가이드 (Android + iOS)

## 🎯 목표
React Native 앱에서 카카오 소셜 로그인을 사용하기 위해 **애플리케이션을 등록**하고 Native App Key, JavaScript Key, Admin Key를 발급받습니다.

### 중요한 특징
- **Google**: Expo Go에서 바로 테스트 가능 (web만 가능) ✅
- **Kakao, Naver**: **네이티브 빌드** 필요 ⚠️
  - Expo Go에서는 작동하지 않음
  - `expo prebuild` 후 네이티브 빌드 필요
  - `@react-native-seoul/kakao-login` 라이브러리 사용

> 💡 하지만 네이버보다는 설정이 간단합니다!

---

## 📝 Step 1: 카카오 개발자 센터 접속

### 1-1. 카카오 개발자 센터 접속
1. **카카오 개발자 센터** 접속
   - 주소: https://developers.kakao.com/
   - 카카오 계정으로 로그인

2. **애플리케이션 추가**
   - 우측 상단 "내 애플리케이션" 클릭
   - "애플리케이션 추가하기" 버튼 클릭

---

## 🔐 Step 2: 애플리케이션 정보 입력

### 2-1. 기본 정보
```
앱 이름: CodeQuest
사업자명: (개인 개발자는 공백 가능)
카테고리: 교육
```

### 2-2. 플랫폼 설정
- 저장 후 왼쪽 메뉴 → "플랫폼" 클릭

---

## 📱 Step 3: Android 플랫폼 설정

### 3-1. Android 플랫폼 추가
1. "Android 플랫폼 등록" 클릭
2. 정보 입력:

**패키지명**:
```
com.anonymous.rncodequest
```
> ⚠️ `app.json`의 `android.package`와 **정확히 일치**해야 합니다!

**마켓 URL** (선택사항):
```
https://play.google.com/store/apps/details?id=com.anonymous.rncodequest
```
> 💡 아직 Play Store에 등록하지 않았다면 비워두어도 됩니다.

**키 해시** (중요!):

#### Expo 개발 환경용 키 해시
```
Xo30Kdwm+BLf6CzEFWGOZqHeDAc=
```
> 💡 이것은 Expo의 기본 개발 키 해시입니다.
> 실제 배포 시에는 본인의 Release 키 해시로 교체해야 합니다!

#### 키 해시 직접 확인하는 방법 (선택)
```powershell
# Windows PowerShell에서
keytool -exportcert -alias androiddebugkey -keystore ~/.android/debug.keystore | openssl sha1 -binary | openssl base64
```

### 3-2. 저장
- "저장" 버튼 클릭

---

## 🍎 Step 4: iOS 플랫폼 설정

### 4-1. iOS 플랫폼 추가
1. "iOS 플랫폼 등록" 클릭
2. 정보 입력:

**번들 ID**:
```
com.anonymous.rncodequest
```
> ⚠️ `app.json`의 `ios.bundleIdentifier`와 **정확히 일치**해야 합니다!

**앱스토어 ID** (선택사항):
```
(App Store 등록 후 입력)
```

### 4-2. 저장
- "저장" 버튼 클릭

---

## 🔑 Step 5: 네이티브 앱 키 확인

### 5-1. 앱 키 확인
1. 왼쪽 메뉴 → "앱 키" 클릭
2. 다음 키들을 확인:

```
네이티브 앱 키: 1234567890abcdef1234567890abcdef
JavaScript 키: abcdef1234567890abcdef1234567890
Admin 키: 1111222233334444555566667777888899990000
```

### 5-2. .env 파일에 저장

프로젝트 루트에 `.env` 파일 생성 또는 추가:

```bash
# .env
EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY=1234567890abcdef1234567890abcdef
EXPO_PUBLIC_KAKAO_JAVASCRIPT_KEY=abcdef1234567890abcdef1234567890
```

> 💡 Expo에서 환경 변수를 읽으려면 `EXPO_PUBLIC_` 접두사가 필요합니다.

---

## 🔓 Step 6: 카카오 로그인 활성화

### 6-1. 카카오 로그인 설정
1. 왼쪽 메뉴 → "카카오 로그인" 클릭
2. **활성화 설정** → "ON"으로 변경

> ⚠️ **Redirect URI 등록은 불필요합니다! (웹환경)**
<!-- ```
http://localhost:8081/auth/kakao/callback
```
> 💡 웹 테스트용입니다. 네이티브 앱에서는 사용하지 않습니다. -->
> 
> `@react-native-seoul/kakao-login` 라이브러리는 네이티브 SDK를 사용하므로,
> 웹 기반 Redirect URI 대신 **앱의 URL Scheme**(`rn-codequest://`)을 사용합니다.
> 
> Redirect URI는 Kakao JavaScript SDK를 웹에서 사용할 때만 필요합니다.

### 6-2. 동의 항목 설정
1. 왼쪽 메뉴 → "동의 항목" 클릭
2. 필수 동의 항목 설정:

| 항목 | 설정 | 설명 |
|------|------|------|
| 닉네임 | 필수 동의 | 사용자 이름 |
| 프로필 사진 | 선택 동의 | 프로필 이미지 |
| 카카오계정(이메일) | 필수 동의 | 이메일 주소 |

> ⚠️ "카카오계정(이메일)"은 **비즈니스 앱 전환** 후 사용 가능합니다.
> 개인 개발자는 닉네임과 프로필 사진만 사용할 수 있습니다.

---

## 📦 Step 7: 네이티브 라이브러리 설치

카카오 로그인은 **네이티브 모듈**이 필요합니다.

### 7-1. 라이브러리 설치
```powershell
npm install @react-native-seoul/kakao-login
```

### 7-2. Prebuild (중요!)
```powershell
npx expo prebuild
```

> ⚠️ 이 명령어는 `android/`와 `ios/` 폴더를 생성합니다.
> Expo Go에서는 작동하지 않고, **네이티브 빌드**가 필요합니다!

### 7-3. iOS Pod 설치
```powershell
cd ios
pod install
cd ..
```

---

## ✅ Step 8: app.json 설정

카카오 로그인에 필요한 설정을 `app.json`에 추가합니다.

```json
{
  "expo": {
    "name": "rn-codeQuest",
    "slug": "rn-codeQuest",
    "scheme": "rncodequest",
    "ios": {
      "bundleIdentifier": "com.anonymous.rncodequest",
      "infoPlist": {
        "CFBundleURLTypes": [
          {
            "CFBundleURLSchemes": ["kakao1234567890abcdef1234567890abcdef"]
          }
        ],
        "LSApplicationQueriesSchemes": [
          "kakaokompassauth",
          "kakaolink",
          "kakao1234567890abcdef1234567890abcdef"
        ],
        "KAKAO_APP_KEY": "1234567890abcdef1234567890abcdef"
      }
    },
    "android": {
      "package": "com.anonymous.rncodequest"
    },
    "plugins": [
      [
        "@react-native-seoul/kakao-login",
        {
          "kakaoAppKey": "1234567890abcdef1234567890abcdef",
          "kotlinVersion": "1.6.21"
        }
      ]
    ]
  }
}
```

### 주요 설정 설명

| 설정 | 값 | 설명 |
|------|-----|------|
| `scheme` | `rncodequest` | URL Scheme (딥링크용) |
| `android.package` | `com.anonymous.rncodequest` | Android 패키지명 |
| `ios.bundleIdentifier` | `com.anonymous.rncodequest` | iOS 번들 ID |
| `CFBundleURLSchemes` | `kakao{NATIVE_APP_KEY}` | 카카오 URL Scheme |
| `KAKAO_APP_KEY` | `{NATIVE_APP_KEY}` | 카카오 네이티브 앱 키 |

> ⚠️ `kakao1234567890abcdef...`의 `1234567890abcdef...` 부분을 **본인의 네이티브 앱 키**로 교체하세요!

---

## 🧪 Step 9: 테스트하기

### 9-1. Android에서 테스트
```powershell
npx expo run:android
```

### 9-2. iOS에서 테스트
```powershell
npx expo run:ios
```

> ⚠️ **Expo Go에서는 작동하지 않습니다!**
> 반드시 네이티브 빌드로 실행해야 합니다.

### 9-3. 로그인 플로우 확인

1. 앱 실행 → 로그인 화면
2. "Kakao로 로그인" 버튼 클릭
3. **카카오톡 앱이 설치되어 있으면**: 카카오톡으로 전환 → 간편 로그인
4. **카카오톡 앱이 없으면**: 웹 브라우저에서 카카오 로그인 페이지 열림
5. 로그인 성공 → 앱으로 돌아옴
6. 백엔드로 토큰 전송 → JWT 토큰 수신 → 로그인 완료

---

## 🐛 문제 해결

### 1️⃣ "앱 등록이 잘못되었습니다" 에러
**원인**: 패키지명/Bundle ID 불일치
**해결**:
- 카카오 개발자 센터의 패키지명 확인
- `app.json`의 `android.package` 확인
- 두 값이 **정확히 일치**하는지 확인

### 2️⃣ "키 해시가 유효하지 않습니다" (Android)
**원인**: 키 해시 불일치
**해결**:
- 카카오 개발자 센터에 `Xo30Kdwm+BLf6CzEFWGOZqHeDAc=` 등록
- 또는 실제 키 해시 확인 후 등록

### 3️⃣ "카카오톡으로 이동할 수 없습니다" (iOS)
**원인**: URL Scheme 설정 누락
**해결**:
- `app.json`의 `CFBundleURLSchemes` 확인
- `kakao{NATIVE_APP_KEY}` 형식이 정확한지 확인
- `LSApplicationQueriesSchemes`에 카카오 관련 scheme 포함되었는지 확인

### 4️⃣ "Native App Key가 유효하지 않습니다"
**원인**: 환경 변수 로딩 실패 또는 잘못된 키
**해결**:
- `.env` 파일이 프로젝트 루트에 있는지 확인
- `EXPO_PUBLIC_` 접두사가 있는지 확인
- 카카오 개발자 센터에서 네이티브 앱 키 재확인
- Metro 번들러 재시작

### 5️⃣ Expo Go에서 작동하지 않음
**원인**: 카카오 로그인은 네이티브 모듈 필요
**해결**:
- Expo Go 사용 불가 ❌
- `npx expo run:android` 또는 `npx expo run:ios` 사용 ✅

---

## 🔒 보안 주의사항

### Native App Key vs Admin Key

| 키 종류 | 공개 가능? | 용도 |
|---------|-----------|------|
| Native App Key | ✅ 공개 OK | 앱에서 카카오 SDK 초기화 |
| JavaScript Key | ✅ 공개 OK | 웹에서 카카오 SDK 초기화 |
| Admin Key | ❌ 절대 비공개! | 서버에서 관리자 API 호출 |

### .gitignore 확인
```gitignore
# .gitignore
.env
.env.local
.env.*.local

# Admin Key가 포함된 파일은 절대 커밋 금지!
```

---

## 📊 Google vs Kakao vs Naver 비교

| 특징 | Google | Kakao | Naver |
|------|--------|-------|-------|
| **웹 브라우저 테스트** | ✅ | ❌ | ❌ |
| **Expo Go 지원** | ❌ (IP 주소 문제) | ❌ | ❌ |
| **네이티브 빌드 필요** | ✅ 권장 | ✅ 필수 | ✅ 필수 |
| **설정 복잡도** | 중간 | 쉬움 | 어려움 |
| **앱 설치 시 간편 로그인** | ❌ | ✅ (카카오톡) | ✅ (네이버 앱) |
| **이메일 제공** | ✅ 필수 | ⚠️ 선택 | ✅ 필수 |

> 💡 **현실적인 개발 흐름**:
> - Google: 웹에서 먼저 테스트 → 네이티브 빌드로 모바일 테스트
> - Kakao/Naver: 처음부터 네이티브 빌드 필요
> 
> **카카오의 장점**: 한국에서 카카오톡 사용률이 높아 간편 로그인 경험이 좋음! 🎉

---

## 🎉 완료!

이제 카카오 소셜 로그인 설정이 완료되었습니다!

### 다음 단계
1. KakaoLoginButton 컴포넌트 생성
2. 카카오 로그인 API 연동
3. 백엔드 토큰 전송 로직 구현
4. 실제 디바이스에서 테스트

---

## 📚 참고 자료

- [카카오 개발자 센터](https://developers.kakao.com/)
- [카카오 로그인 REST API 가이드](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api)
- [@react-native-seoul/kakao-login](https://github.com/react-native-seoul/kakao-login)
- [Expo Prebuild 가이드](https://docs.expo.dev/workflow/prebuild/)

---

## 💡 OAuth 로그인 처리 로직 이해하기

### 전체 플로우 (카카오 예시)

```
사용자                앱                  카카오 서버          우리 백엔드
  |                  |                     |                    |
  | 1. 로그인 버튼 클릭 |                     |                    |
  |----------------->|                     |                    |
  |                  | 2. 카카오 로그인 요청 |                    |
  |                  |-------------------->|                    |
  |                  |                     |                    |
  |                  | 3. 로그인 화면 표시  |                    |
  |                  |<--------------------|                    |
  |                  |                     |                    |
  | 4. 카카오 계정 로그인                   |                    |
  |------------------------------------>|                    |
  |                  |                     |                    |
  |                  | 5. Access Token 발급 |                    |
  |                  |<--------------------|                    |
  |                  |                     |                    |
  |                  | 6. Access Token 전송 |                    |
  |                  |------------------------------------>|
  |                  |                     |                    |
  |                  |                7. JWT 토큰 발급         |
  |                  |<------------------------------------|
  |                  |                     |                    |
  | 8. 로그인 완료     |                     |                    |
  |<-----------------|                     |                    |
```

### 상세 단계별 설명

#### 1️⃣ 사용자가 "Kakao로 로그인" 버튼 클릭
```javascript
// LoginScreen.js
<TouchableOpacity onPress={() => handleKakaoLogin()}>
  <Text>💬 Kakao로 로그인</Text>
</TouchableOpacity>
```

#### 2️⃣ 앱이 카카오 로그인 SDK 호출
```javascript
// KakaoLogin 라이브러리 사용
import { login } from '@react-native-seoul/kakao-login';

const handleKakaoLogin = async () => {
  const result = await login();
  // result에 accessToken 포함
};
```

#### 3️⃣ 카카오톡 앱 또는 웹 브라우저에서 로그인
- **카카오톡 앱 설치 O**: 카카오톡으로 자동 전환 → 간편 로그인
- **카카오톡 앱 설치 X**: 웹 브라우저에서 카카오 계정 ID/PW 입력

#### 4️⃣ 사용자가 카카오 계정으로 로그인
- 카카오 ID와 비밀번호 입력
- 또는 카카오톡 앱에서 생체인증으로 간편 로그인
- 앱 권한 동의 (닉네임, 프로필 사진, 이메일 등)

#### 5️⃣ 카카오가 Access Token 발급
```javascript
// 카카오 로그인 성공 시 받는 정보
{
  accessToken: "ynRdSBs-xG...FMo9dAo9c_xr",  // 카카오 Access Token
  refreshToken: "B3EFJvM...qAaQKKKF0",       // 카카오 Refresh Token
  accessTokenExpiresAt: "2024-01-01T12:00:00",
  refreshTokenExpiresAt: "2024-02-01T12:00:00",
  scopes: ["profile", "account_email"]
}
```

#### 6️⃣ 앱이 Access Token을 우리 백엔드로 전송
```javascript
// src/apis/socialLogin.js
export const loginWithKakao = async (kakaoAccessToken) => {
  const deviceInfo = await DeviceInfoService.getDeviceInfo();
  
  const response = await api.post('/auth/social/login/', {
    provider: 'kakao',
    access_token: kakaoAccessToken,  // 카카오에서 받은 토큰
    device_id: deviceInfo.deviceId,
    device_name: deviceInfo.deviceName,
  });
  
  return response;
};
```

#### 7️⃣ 백엔드가 카카오 토큰 검증 후 JWT 발급
```python
# Django 백엔드 (예시)
# 1. 카카오 Access Token으로 사용자 정보 조회
kakao_user_info = requests.get(
    'https://kapi.kakao.com/v2/user/me',
    headers={'Authorization': f'Bearer {access_token}'}
).json()

# 2. 우리 DB에서 사용자 찾기 또는 생성
kakao_account = kakao_user_info['kakao_account']
user, created = User.objects.get_or_create(
    # 이메일이 없을 수 있음 (비즈니스 앱 아닌 경우)
    social_id=f"kakao_{kakao_user_info['id']}",
    defaults={
        'nickname': kakao_account.get('profile', {}).get('nickname'),
        'email': kakao_account.get('email'),  # 없을 수 있음
        'profile_image': kakao_account.get('profile', {}).get('profile_image_url')
    }
)

# 3. JWT 토큰 생성
jwt_token = create_jwt_token(user)

# 4. 응답
return {
    'access': jwt_token,
    'refresh': refresh_token,
    'user': user_data
}
```

#### 8️⃣ 앱이 JWT 토큰 저장 및 로그인 완료
```javascript
// AuthContext.js
const socialLogin = async (provider, token) => {
  const result = await loginWithKakao(token);
  
  if (result.success) {
    // JWT 토큰 저장
    await Storage.setSecure('AUTH_TOKENS', {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
    
    // 사용자 정보 저장
    await Storage.setUserInfo(result.user);
    
    // 상태 업데이트
    setUser(result.user);
    setIsAuthenticated(true);
  }
};
```

---

### 핵심 개념 이해

#### Access Token vs JWT Token

| 구분 | Access Token (카카오) | JWT Token (우리 백엔드) |
|------|----------------------|------------------------|
| 발급자 | 카카오 서버 | 우리 Django 백엔드 |
| 용도 | 카카오 API 호출용 | 우리 API 호출용 |
| 유효기간 | 카카오가 정함 (보통 2시간) | 우리가 정함 (예: 7일) |
| 저장 위치 | 백엔드로 즉시 전송 (저장 X) | 앱에 안전하게 저장 |

#### 왜 카카오 토큰을 우리 백엔드로 보내나요?

1. **보안**: 사용자가 정말 카카오로 로그인했는지 백엔드에서 검증
2. **사용자 정보**: 카카오 토큰으로 사용자 프로필 조회
3. **통일성**: 모든 로그인 방식(일반/Google/Kakao/Naver)에 대해 동일한 JWT 토큰 사용
4. **권한 관리**: 우리 서비스의 권한을 JWT 토큰에 포함
5. **이메일 처리**: 카카오는 이메일을 제공하지 않을 수 있으므로, 백엔드에서 대체 식별자 사용

---

### 코드로 보는 전체 흐름

```javascript
// KakaoLoginButton.js 전체 흐름

import { login } from '@react-native-seoul/kakao-login';

const handleKakaoLogin = async () => {
  try {
    // 1. 카카오 로그인 SDK 호출
    console.log('1️⃣ 카카오 로그인 시작');
    const result = await login();
    
    // 2. Access Token 받음
    console.log('2️⃣ 카카오 Access Token:', result.accessToken);
    
    // 3. 백엔드로 토큰 전송
    const authResult = await socialLogin('kakao', result.accessToken);
    console.log('3️⃣ 백엔드 응답:', authResult);
    
    if (authResult.success) {
      // 4. JWT 토큰 저장
      console.log('4️⃣ JWT 토큰:', authResult.accessToken);
      console.log('5️⃣ 사용자 정보:', authResult.user);
      console.log('6️⃣ 로그인 완료!');
      
      Alert.alert('환영합니다!', `${authResult.user.nickname}님`);
    }
  } catch (error) {
    console.error('❌ 카카오 로그인 에러:', error);
    Alert.alert('로그인 실패', error.message);
  }
};
```

---

### 카카오톡 간편 로그인 플로우

```
카카오톡 앱 설치되어 있는 경우:

1. "Kakao로 로그인" 버튼 클릭
   ↓
2. 카카오톡 앱으로 자동 전환
   ↓
3. "로그인" 버튼 한 번만 클릭 (또는 생체인증)
   ↓
4. 앱으로 자동 복귀
   ↓
5. 로그인 완료! 🎉

총 소요 시간: 약 3초! ⚡
```

---

### 디버깅 팁

#### 각 단계별 로그 확인
```javascript
const handleKakaoLogin = async () => {
  console.log('1️⃣ 카카오 로그인 시작');
  
  const result = await login();
  console.log('2️⃣ 카카오 로그인 결과:', {
    accessToken: result.accessToken.substring(0, 20) + '...',
    refreshToken: result.refreshToken ? 'O' : 'X',
    scopes: result.scopes
  });
  
  const authResult = await socialLogin('kakao', result.accessToken);
  console.log('3️⃣ 백엔드 응답:', {
    success: authResult.success,
    user: authResult.user?.nickname
  });
  
  if (authResult.success) {
    console.log('4️⃣ 로그인 완료!');
  }
};
```

#### 자주 발생하는 에러와 해결

**1. "카카오톡이 설치되어 있지 않습니다"**
```
원인: 카카오톡 앱 미설치 (정상)
동작: 자동으로 웹 브라우저로 대체
해결: 에러 아님, 정상 동작
```

**2. "앱 등록이 잘못되었습니다"**
```
원인: 패키지명 또는 Bundle ID 불일치
해결: 카카오 개발자 센터와 app.json 확인
```

**3. "키 해시가 일치하지 않습니다" (Android)**
```
원인: 개발용 키 해시 미등록
해결: Xo30Kdwm+BLf6CzEFWGOZqHeDAc= 등록
```

**4. "동의 항목 설정이 필요합니다"**
```
원인: 카카오 개발자 센터에서 동의 항목 미설정
해결: "동의 항목" 메뉴에서 필수 항목 설정
```

---

### 보안 모범 사례

#### 1. Native App Key는 공개해도 괜찮습니다
```javascript
// ✅ OK: Native App Key는 공개 정보
const appKey = "1234567890abcdef1234567890abcdef";
```

#### 2. 하지만 환경 변수 사용 권장
```javascript
// ✅ 더 좋음: .env 파일 사용
const appKey = process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY;
```

#### 3. Admin Key는 절대 노출 금지!
```javascript
// ❌ 절대 하지 마세요!
const adminKey = "1111222233334444..."; // 서버에서만 사용!
```

#### 4. Access Token은 즉시 백엔드로 전송
```javascript
// ✅ OK: 받자마자 백엔드로 전송
const { accessToken } = await login();
await socialLogin('kakao', accessToken);

// ❌ NO: 앱에 저장하지 마세요
await Storage.set('kakao_token', accessToken); // 이렇게 하지 마세요!
```

---

### 카카오 특수 사항

#### 이메일이 없을 수 있음!
```javascript
// 백엔드에서 처리 예시
if (!kakao_account.email) {
  // 이메일 대신 카카오 ID로 사용자 식별
  user_identifier = f"kakao_{kakao_user_info['id']}"
  
  // 또는 이메일 입력 요청
  return { error: 'email_required', kakao_id: kakao_user_info['id'] }
}
```

#### 비즈니스 앱 전환
```
개인 앱: 이메일 수집 불가
비즈니스 앱: 이메일 수집 가능

비즈니스 앱으로 전환하려면:
1. 카카오 개발자 센터 → "비즈니스" 메뉴
2. 사업자 정보 입력 (사업자 등록증 필요)
3. 심사 완료 후 이메일 동의 항목 활성화
```

---

이제 카카오 OAuth의 모든 것을 이해하셨을 겁니다! 🎓
카카오톡 간편 로그인은 한국 사용자에게 최고의 경험을 제공합니다! 💬
