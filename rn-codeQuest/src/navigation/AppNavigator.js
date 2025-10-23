import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useAuth } from '../context/AuthContext';
import { ActivityIndicator } from 'react-native-paper';

import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  // AuthContext에서 상태 가져오기
  const { isLoggedIn, isLoading } = useAuth();

  // 1. 로딩 중 (토큰 체크 중)
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 2. 로그인 상태에 따른 네비게이터 분기
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        // 로그인 상태일 때
        <Stack.Screen name="Profile" component={ProfileScreen} />
      ) : (
        // 비로그인 상태일 때
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  )
}

export default AppNavigator

const styles = StyleSheet.create({})