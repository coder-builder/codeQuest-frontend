import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Card, TextInput } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext.js'
import { useState } from 'react';
import { Alert } from 'react-native';
import api from '../../services/api.js';

const LoginScreen = () => {
  const { login, isLoading, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // 비동기 작업 시뮬레이션
    const result = await login(email, password);
    if (result.success) {
      // 홈탭으로 자동 이동
      navigation.navigate('Home');
    } else {
      console.log('아이디와 비밀번호를 확인하세요.');
      Alert.alert('실패', '아이디와 비밀번호를 확인하세요.');
    }
  };

  return (
    <View style={styles.screen}>
      <Card style={styles.card}>
        <Card.Title title="로그인" />
        <Card.Content>
          <TextInput
            label="email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="비밀번호"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />
          <Button
            mode="contained" 
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading}
            style={styles.button}
          >
            로그인
          </Button>
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
    backgroundColor: '#f5f5f5',
  },
  card: {
    width: '100%',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
});