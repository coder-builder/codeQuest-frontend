// 웹, 모바일 환경에 따라 다른 스토리지 어댑터를 사용하도록 설정
// 웹 : localStorage (개발 편의성 위해)
// 모바일 : MMKV + Keychain (MMKV: 빠른 일반 저장소, Keychain: 보안 저장소)
// AsyncStorage는 느리고, 보안 저장소 기능이 부족하여 대체

import { Platform } from "react-native";
import WebAdapter from "./adapters/web";
import MobileAdapter from "./adapters/mobile";
import { StorageKeys } from "./types";

class StorageManager {
  // 접속 환경에 따른 어댑터 선택
  constructor() { 
    this.adapter = Platform.OS === 'web'
      ? new WebAdapter()
      : new MobileAdapter();

    this.keys = StorageKeys;
  }

  // ================ 범용 메서드 ================== //

  // 보안 데이터용
  async setSecure(key,data) {
    return this.adapter.setSecure(key, data);
  }
  async getSecure(key) {
    return this.adapter.getSecure(key);
  }
  async removeSecure(key) {
    return this.adapter.removeSecure(key);
  }

  // 일반 데이터용
  setData(key, value) {
    return this.adapter.setData(key, value);
  }
  getData(key, defaultValue = null) {
    return this.adapter.getData(key, defaultValue);
  }
  removeData(key) {
    return this.adapter.removeData(key);
  }


  // ================ 특화 메서드 ================== //

  // 보안 저장소 메서드 (토큰 등 민감 정보) : 현재 상태 약간 이상함...
  async setAuthTokens(accessToken, refreshToken = null) {
    const tokenData = {
      accessToken,
      timestamp: Date.now()
    };
    
    // refreshToken이 있을 때만 추가
    if (refreshToken) {
      tokenData.refreshToken = refreshToken;
    }
    
    await this.adapter.setSecure(this.keys.AUTH_TOKENS, tokenData);
  }

  // 토큰 스토리지 저장소 에서 조회
  async getAuthTokens() {
    const tokens = await this.adapter.getSecure(this.keys.AUTH_TOKENS);
    
    if (!tokens) return null;
    
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken || null,  // 안전한 접근
      timestamp: tokens.timestamp
    };
  }

  // accessToken만 업데이트
  async updateAccessToken(accessToken) {
    const tokens = await this.getAuthTokens();
    if (tokens) {
      tokens.accessToken = accessToken;
      tokens.timestamp = Date.now();

      await this.adapter.setSecure(this.keys.AUTH_TOKENS, tokens);
    } else {
      console.warn('기존 토큰이 없어 토큰을 업데이트할 수 없습니다.');
    }
  }

  // 토큰 스토리지 저장소 에서 삭제 
  async removeAuthTokens() {
    await this.adapter.removeSecure(this.keys.AUTH_TOKENS);
  }


  // 일반 저장소 메서드 (사용자 정보, 설정 등)
  setUserInfo(userinfo) {
    this.adapter.setData(this.keys.USER_INFO, userinfo);
  }

  getUserInfo() {
    return this.adapter.getData(this.keys.USER_INFO, null);
  }

  removeUserInfo() {
    this.adapter.removeData(this.keys.USER_INFO);
  }

  // 스토리지 초기화
  async clearAllData() {
    await this.removeAuthTokens();
    await this.removeUserInfo();
  }
}

export default Storage = new StorageManager();