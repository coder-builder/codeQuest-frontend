import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button, Text, Card, PaperProvider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

import { AuthProvider } from './src/context/AuthContext';
import HomeStack from './src/navigation/HomeStack';
import AppNavigator from './src/navigation/AppNavigator';


const App = () => {

  return (
    <PaperProvider>
      <AuthProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'HomeTab') {
                  iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'Profile') {
                  iconName = focused ? 'account' : 'account-outline';
                }

                return <Icon name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#6200ee',
              tabBarInactiveTintColor: 'gray',
              headerShown: false,
            })}
          >
            <Tab.Screen 
              name="HomeTab" 
              component={HomeStack}
              options={{ tabBarLabel: '홈' }}
            />

            <Tab.Screen
              name="Profile"
              component={AppNavigator}
              options={{ tabBarLabel: '내 프로필' }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </AuthProvider> 
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginBottom: 16,
  },
  certCard: {
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
  certName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  certInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  button: {
    marginTop: 12,
  },
  resultText: {
    fontSize: 16,
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#6200ee',
    textAlign: 'center',
    marginVertical: 16,
  },
  percentText: {
    fontSize: 20,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  statItem: {
    fontSize: 18,
    marginVertical: 8,
    color: '#333',
  },
});

export default App;
