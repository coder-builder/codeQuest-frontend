import axios from 'axios';
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { Alert } from 'react-native';
import Storage from '../services/storages'; // storages/index.js
import { DeviceInfoService } from '../services/DeviceInfo';

// ===================================
// Context API : 전역 상태 관리
// ===================================

// 1. Context 생성
const AuthContext = createContext(); // 방송국 생성

// 2. Provider 컴포넌트 // 송출 역할
export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deviceInfo, setDeviceInfo] = useState(null);

  // ===================================
  // 앱 시작 시 자동 로그인 체크
  // ===================================
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // 디바이스 정보 가져오기
      const deviceInfo = await DeviceInfoService.getDeviceInfo();
      setDeviceInfo(deviceInfo);
      console.log('디바이스 정보 설정 완료:', deviceInfo);

      // 디바이스 정보 로딩 후 자동 로그인 체크
      await checkAutoLogin();
      console.log('자동 로그인 체크 완료');

    } catch (error) {
      console.error('초기화 중 오류 발생:', error);
    } finally {
      setIsLoading(false);
      console.log('초기화 완료, 로딩 상태 해제');
    }  
  };

  const checkAutoLogin = async () => {
    try {
      console.log('🔄 자동 로그인 체크 시작...');

      const tokens = await Storage.getSecure('AUTH_TOKENS');
      const token = tokens?.accessToken;

      const userInfo = await Storage.getUserInfo();

      console.log('📦 저장된 데이터 확인:', {
        hasToken: !!token,
        hasUserInfo: !!userInfo
      });

      if (token && userInfo) {
        try {
          
          console.log('✅ 자동 로그인 성공:', userInfo.nickname);
          
          // 상태 복원
          setUser(userInfo);
          setIsAuthenticated(true);
          
          return true;
        } catch (parseError) {
          // 파싱 실패 시 저장된 데이터 삭제
          await clearStoredData();
        }
      } 
      
      return false;
    } catch (error) {
      // 에러 시 저장된 데이터 정리
      await clearStoredData();
      return false;
    } finally {
      setIsLoading(false); // 자동 로그인 체크 완료
    }
  };

  // 저장된 데이터 정리 함수
  const clearStoredData = async () => {
    try {
      await Storage.clearAllData();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('저장된 데이터 정리 실패:', error);
    }
  };

  const login = async (email, password) => {
    setIsLoading(true);
    
    // if(!deviceInfo) {
    //   throw new Error('디바이스 정보를 가져오는 중입니다.');
    // }

    try {
      console.log('🚀 로그인 시작');

      const response = await api.post('/auth/login/', {
        email,
        password,
        device_id: deviceInfo?.deviceId,
        device_name: deviceInfo?.deviceName,
      });

      const {access, user: userData} = response;

      if (access && userData) {
        // 토큰과 사용자 정보 저장
        await Storage.setSecure('AUTH_TOKENS', { accessToken: access });
        await Storage.setUserInfo(userData);

        // 상태 업데이트
        setUser(userData);
        setIsAuthenticated(true);

        Alert.alert('로그인 성공', `환영합니다, ${userData.nickname}님!`);

        return { success: true, user: userData };

      } else {
        return { success: false, error: '로그인 응답 형식 오류' };
      }
      
    } catch (error) {
      console.error('💥 에러 발생 지점:', error.message);
      return { success: false, error: error.response?.data?.error || '로그인 실패' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Storage에서 데이터 삭제
      await Storage.clearAllData();
      
      // 상태 초기화
      setUser(null);
      setIsAuthenticated(false);
      
      
    } catch (error) {
      console.error('❌ 로그아웃 실패:', error);
      // 에러가 나도 상태는 초기화
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // 사용자 정보 새로고침 함수 (추가)
  const refreshUserData = async () => {
    try {
      const userInfo = await Storage.getUserInfo();

      if (userInfo) {
        setUser(userInfo);
        setIsAuthenticated(true);
        return userInfo;
      }
      return null;
    } catch (error) {
      return null;
    }
  };


  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, checkAutoLogin, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Custom Hook: Context 사용 간소화
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('AuthContext 태그 내부에서만 useAuth를 사용할 수 있습니다.');
  }
  return context;
};