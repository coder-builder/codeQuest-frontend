import React from 'react';
import { Text, TouchableOpacity, Alert, StyleSheet, Platform } from 'react-native';
import Constants from 'expo-constants';
import { login } from '@react-native-seoul/kakao-login';
import { useAuth } from '../../context/AuthContext';

const KakaoLoginButton = ({ disabled = false }) => {
  const { socialLogin, isLoading } = useAuth();

  // Kakao 로그인 처리
  const handleKakaoLogin = async () => {
    // 1. 웹 환경 체크
    if (Platform.OS === 'web') {
      alert('Kakao 로그인은 모바일 앱에서만 사용 가능합니다.\n\nKakao 로그인은 Expo Go에서 작동하지 않습니다.\n\nEAS Build로 빌드된 APK를 설치해주세요.');
      return;
    }
    // 2. Expo Go 환경 체크
    if (Constants.appOwnership === 'expo') {
      Alert.alert(
        '알림',
        'Kakao 로그인은 Expo Go에서 작동하지 않습니다.\n\nEAS Build로 빌드된 APK를 설치해주세요.'
      );
      return;
    }

    try {
      console.log('🚀 카카오 로그인 시작');
      
      // 카카오 로그인 SDK 호출
      const result = await login();

      // 백엔드로 Access Token 전송
      const authResult = await socialLogin('kakao', result.accessToken);

      if (authResult.success) {
        Alert.alert('환영합니다!', `${authResult.user.nickname}님`);
      } else {
        console.error('❌ 카카오 로그인 실패:', authResult.error);
        Alert.alert('로그인 실패', authResult.error || 'Kakao 로그인에 실패했습니다.');
      }
    } catch (error) {
      // 사용자가 취소한 경우
      if (error.code === 'E_CANCELLED') {
        return;
      }

      console.error('💥 카카오 로그인 에러:', error);
      Alert.alert('로그인 실패', 'Kakao 로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <TouchableOpacity
      style={[styles.KakaoButton, disabled && styles.disabled]}
      onPress={handleKakaoLogin}
      disabled={disabled || isLoading}
    >
      <Text style={styles.KakaoText}>💬 Kakao로 로그인</Text>
    </TouchableOpacity>
  );
};

export default KakaoLoginButton;

const styles = StyleSheet.create({
  KakaoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE500',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  KakaoText: {
    color: '#3C1E1E',
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});