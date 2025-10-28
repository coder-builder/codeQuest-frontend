import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Button, TextInput, Title } from 'react-native-paper'
import api from '../../services/api';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // 간단 검증
    if (!email || !password || !confirmPassword) {
      Alert.alert('모든 필드를 채워주세요.');
      return;
    }

    if (password !== confirmPassword){
      Alert.alert('비밀번호 불일치', '비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    setLoading(true);

    try {
      // 회원가입 API 호출
      const response = await api.post('/auth/register/', {
        email,
        password,
        password2: confirmPassword,
      });

      Alert.alert('성공', '회원가입이 완료되었습니다. 로그인해주세요.');
      navigation.navigate('Login');
    } catch (error) {
      console.log('회원가입 오류:', error.response?.data?.message);
      Alert.alert('오류', error.response?.data?.error || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Title style={styles.title}>회원가입</Title>

      <TextInput 
        label="이메일"
        value={email}
        onChangeText={setEmail}
        mode="outlined" 
        style={styles.input} 
        keyboardType='email-address'
        autoCapitalize='none'
      />
      
      <TextInput 
        label="비밀번호"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry
        style={styles.input}
      />

      <TextInput 
        label="비밀번호 확인" 
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        mode="outlined" 
        secureTextEntry 
        style={styles.input} />

      <Button 
        mode="contained"
        onPress={handleRegister}
        style={styles.button}
        loading={loading}
        disabled={loading}
      >
        회원가입
      </Button>
    </View>
  )
}

export default RegisterScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
  },
})