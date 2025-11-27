import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Card, TextInput, Divider } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import { Alert } from 'react-native';
import { useTheme } from '../../utils/theme';

// Google 로그인 컴포넌트 import
import GoogleLoginButton from '../../components/auth/GoogleLoginButton';

const LoginScreen = ({ navigation }) => {
  const { login, isLoading } = useAuth();
  const { colors, isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 일반 로그인
  const handleLogin = async () => {
    const result = await login(email, password);
    if (result.success) {
      navigation.navigate('Profile');
    } else {
      Alert.alert('실패', '아이디와 비밀번호를 확인하세요.');
    }
  };

  // Google 로그인 성공 시 콜백
  const handleGoogleSuccess = (result) => {
    // 성공 시 추가 로직 (필요하면)
    // AppNavigator가 자동으로 ProfileScreen 렌더링
  };

  // Google 로그인 실패 시 콜백
  const handleGoogleError = (error) => {
    // 에러 처리 (필요하면)
  };

  // Kakao, Naver 로그인 (나중에 구현)
  const handleSocialLogin = async (provider) => {
    Alert.alert('준비 중', `${provider} 로그인은 다음 단계에서 구현할게요!`);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Title
          title="로그인"
          titleStyle={{ color: colors.text }}
        />
        <Card.Content>
          {/* 이메일/비밀번호 입력 */}
          <TextInput
            label="email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            textColor={colors.text}
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
          />
          <TextInput
            label="비밀번호"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry
            style={styles.input}
            textColor={colors.text}
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
          />

          {/* 일반 로그인 버튼 */}
          <Button
            mode="contained"
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading}
            style={styles.button}
            buttonColor={colors.primary}
          >
            로그인
          </Button>

          {/* 구분선 */}
          <View style={styles.dividerContainer}>
            <Divider style={styles.divider} />
            <Text style={[styles.dividerText, { color: colors.textSecondary }]}>또는</Text>
            <Divider style={styles.divider} />
          </View>

          {/* 소셜 로그인 버튼들 */}
          <Text style={[styles.socialTitle, { color: colors.text }]}>소셜 로그인</Text>

          {/* Google 버튼 - 임시 비활성화 (webClientId 설정 필요) */}
          {/* <GoogleLoginButton
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            disabled={isLoading}
          /> */}
          <TouchableOpacity
            style={[styles.socialButton, styles.googleButton]}
            onPress={() => handleSocialLogin('Google')}
            disabled={isLoading}
          >
            <Text style={[styles.socialButtonText]}>
              🔍 Google로 로그인 (준비 중)
            </Text>
          </TouchableOpacity>

          {/* Kakao 버튼 */}
          <TouchableOpacity
            style={[styles.socialButton, styles.kakaoButton]}
            onPress={() => handleSocialLogin('Kakao')}
            disabled={isLoading}
          >
            <Text style={[styles.socialButtonText, styles.kakaoText]}>
              💬 Kakao로 로그인
            </Text>
          </TouchableOpacity>

          {/* Naver 버튼 */}
          <TouchableOpacity
            style={[styles.socialButton, styles.naverButton]}
            onPress={() => handleSocialLogin('Naver')}
            disabled={isLoading}
          >
            <Text style={styles.socialButtonText}>🟢 Naver로 로그인</Text>
          </TouchableOpacity>

          {/* 회원가입 링크 */}
          <View style={styles.registerContainer}>
            <Text style={[styles.registerText, { color: colors.textSecondary }]}>아직 계정이 없으신가요? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={[styles.registerLink, { color: colors.primary }]}>회원가입</Text>
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 400,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 14,
  },
  socialTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  socialButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  googleButton: {
    backgroundColor: '#4285F4',
  },
  kakaoButton: {
    backgroundColor: '#FEE500',
  },
  kakaoText: {
    color: '#3C1E1E',
  },
  naverButton: {
    backgroundColor: '#03C75A',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
  },
  registerLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});