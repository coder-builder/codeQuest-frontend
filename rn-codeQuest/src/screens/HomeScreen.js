// src/screens/home/HomeScreen.js
import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Title, Card, ActivityIndicator, Text } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { ScrollView } from 'react-native-web';

export default function HomeScreen({ navigation }) {
  const { user, logout, isAuthenticated, isLoading } = useAuth();

  // 로딩 중일 때 (자동 로그인 체크 중)
  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={{ marginTop: 16, fontSize: 16 }}>
          로그인 상태 확인 중...
        </Text>
      </View>
    );
  }

  return (
    <>
      {user && isAuthenticated ? (
        <ScrollView contentContainerStyle={styles.container}>
          {/* 로그인된 경우 (여기 부분 작성하면 될것 같습니다. 아래태그부터 수정.) ====================== !! */}
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.title}>CodeQuest에 오신 것을 환영합니다! 🚀</Title>
                  <Title style={styles.subtitle}>
                    안녕하세요, {user.nickname}님!
                  </Title>
                  <Button 
                    mode="contained" 
                    onPress={logout}
                    style={styles.button}
                  >
                    로그아웃
                  </Button>
              </Card.Content>
          </Card>
        </ScrollView>
        ) : (
        // 로그인 안 된 경우
        <View style={styles.container}>
          <Card>
            <Card.Content>
              <Title style={styles.title}>CodeQuest에 오신 것을 환영합니다! 🚀</Title>
              <Button 
                mode="contained" 
                onPress={() => navigation.navigate('Login')}
                style={styles.button}
              >
                로그인
              </Button>
              <Button 
                mode="outlined" 
                onPress={() => navigation.navigate('Register')}
                style={styles.button}
              >
                회원가입
              </Button>
            </Card.Content>
          </Card>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  card: {
    width: '100%',
    padding: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#6200ee',
  },
  button: {
    marginTop: 10,
  },
});