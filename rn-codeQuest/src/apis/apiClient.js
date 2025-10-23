import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

// API 기본 설정
const baseURL = API_BASE_URL;

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: baseURL,
  timeout: 10000, // 10초 타임아웃 설정
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request 인터셉터: 요청 전에 토큰 추가 등 작업 수행
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
); 

// Response 인터셉터: 응답 데이터 가공 등 에러 처리
apiClient.interceptors.response.use(
  (res) => {
    return res.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // 인증 만료
      Alert.alert('인증 만료', '다시 로그인해주세요.');
      AsyncStorage.removeItem('authToken');
    }
    return Promise.reject(error);
  }
);

// 기본 API 함수들
export const api = {
  // GET 요청
  get: (url, params = {}) => {
    return apiClient.get(url, { params });
  },

  // POST 요청
  post: (url, data = {}) => {
    return apiClient.post(url, data);
  },

  // PUT 요청
  put: (url, data = {}) => {
    return apiClient.put(url, data);
  },

  // DELETE 요청
  delete: (url, data = {}) => {
    return apiClient.delete(url, { data });
  },
};

// API Custom 함수들 (예시)
export const userAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export default apiClient;