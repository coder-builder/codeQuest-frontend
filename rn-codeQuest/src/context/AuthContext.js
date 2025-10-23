// ===================================
// Context API : 전역 상태 관리
// ===================================

import { createContext, useContext, useEffect, useState } from "react";
import { userAPI } from "../apis/apiClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 1. Context 생성
const AuthContext = createContext();

// 2. Provider 컴포넌트 생성
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 앱 시작 시 자동 로그인 체크
  useEffect(() => {
    checkAutoLogin();
  }, []);

  const checkAutoLogin = async () => {
    try {
      // 자동 로그인 로직 구현 (AsyncStorage에서 토큰 확인)
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        // 토큰이 있으면 사용자 정보 가져오기 (로그인 상태)
        const userInfo = await userAPI.getUsers();
        setUser(userInfo);
        setIsAuthenticated(true);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("자동 로그인 실패:", error);
    } finally {
      setIsLoading(false); // 로딩 완료
    }
  };

  const login = (username, password) => {
    // 로그인 로직 구현
    userAPI.login({ username, password })
      .then((res) => {
        setUser(res.user);
        setIsAuthenticated(true);
      })
      .catch((error) => {
        console.error("로그인 실패:", error);
      });
  };

  const logout = () => {
    // 로그아웃 로직 구현
    setUser(null);
    setIsAuthenticated(false);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoggedIn, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Context 사용
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthContext 태그 내부에서 useAuth를 사용해주세요.");
  }
  return context;
};