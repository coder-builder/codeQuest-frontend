import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import WorldDetailScreen from '../screens/world/WorldDetailScreen';
import LessonScreen from '../screens/lesson/LessonScreen';

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#6200ee',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },

        // ✅ 부드러운 애니메이션 추가
        animation: 'slide_from_right',     // 슬라이드 애니메이션
        animationDuration: 300,           // 300ms (부드럽게)
        gestureEnabled: true,             // 제스처 활성화
        gestureDirection: 'horizontal',   // 좌우 제스처
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="WorldDetail"
        component={WorldDetailScreen}
        options={{
          title: '월드',
          headerShown: true,
        }}
      />
      <Stack.Screen name="Login" component={LoginScreen}
        options={{
          title: '로그인',
          presentation: 'modal', // 모달 스타일로 화면 전환
          animation: 'slide_from_bottom', // 아래에서 위로 슬라이드 애니메이션
        }}
      />
      <Stack.Screen name="Register" component={RegisterScreen}
        options={{
          title: '회원가입',
          presentation: 'modal', // 모달 스타일로 화면 전환
          animation: 'slide_from_bottom', // 아래에서 위로 슬라이드 애니메이션
        }}
      />
      <Stack.Screen
        name="Lesson"
        component={LessonScreen}
        options={({ navigation }) => ({
          headerShown: false,
          animation: 'slide_from_right',
          // 하단 탭바 숨기기
          tabBarStyle: { display: 'none' },
        })}
      />
    </Stack.Navigator>
  );
};

export default HomeStack

const styles = StyleSheet.create({})