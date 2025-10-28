// 모바일 환경용 보안 저장소 어댑터
// Keychain : 민감한 정보 저장에 사용
// MMKV    : 일반 정보 저장에 사용

let Keychain, mmkv;

try {
  Keychain = require('react-native-keychain');
} catch (error) {
  console.warn('Keychain 모듈 없음');
}

try {
  const { MMKV } = require('react-native-mmkv');
  mmkv = new MMKV();  // 기본 인스턴스 생성
} catch (error) {
  console.warn('MMKV 모듈 없음');
}

export default class MobileAdapter {
  // ===== 보안 저장소 =====
  
  async setSecure(key, data) {
    if (!Keychain) {  // undefined 체크
      throw new Error('Keychain을 사용할 수 없습니다');
    }
    
    await Keychain.setInternetCredentials(key, 'data', JSON.stringify(data));
  }

  async getSecure(key) {
    if (!Keychain) return null;  // 안전한 처리
    
    try {
      const credentials = await Keychain.getInternetCredentials(key);
      return credentials ? JSON.parse(credentials.password) : null;

    } catch (error) {
      console.error(`Keychain 조회 실패: ${key}`, error);
      return null;
    }
  }

  async removeSecure(key) {
    if (!Keychain) return;
    
    try {
      await Keychain.resetInternetCredentials(key);
    } catch (error) {
      console.error(`Keychain 삭제 실패: ${key}`, error);
    }
  }

  // ===== 일반 저장소 =====
  
  setData(key, value) {
    if (!mmkv) {  // ✅ undefined 체크
      console.warn('MMKV 사용 불가');
      return;
    }
    
    const processedValue = typeof value === 'object' 
      ? JSON.stringify(value) 
      : value;
    
    mmkv.set(key, processedValue);
  }

  getData(key, defaultValue = null) {
    if (!mmkv) return defaultValue;  // ✅ 안전한 처리
    
    try {
      const value = mmkv.getString(key);
      if (!value) return defaultValue;

      try {
        return JSON.parse(value);
      } catch {
        return value;
      }

    } catch (error) {
      console.error(`MMKV 조회 실패: ${key}`, error);
      return defaultValue;
    }
  }

  removeData(key) {
    if (!mmkv) return;
    
    try {
      mmkv.delete(key);

    } catch (error) {
      console.error(`MMKV 삭제 실패: ${key}`, error);
    }
  }
}