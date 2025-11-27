import axios from 'axios';
import Constants from 'expo-constants';
import { Alert, Platform } from 'react-native';
import { API_BASE_URL } from '../utils/constants';
import { Storage } from '../services/storages'; // storages/index.js

// 환경별 Base URL 설정
const getBaseURL = () => {
  // 개발 환경에서만 에뮬레이터 특수 처리, 나머지는 모두 API_BASE_URL
  if (__DEV__) {
    if (Platform.OS === 'android' && Constants.isDevice === false) {
      return 'http://10.0.2.2:8000'; // Android 에뮬레이터
    }
    if (Platform.OS === 'ios' && Constants.isDevice === false) {
      return 'http://localhost:8000'; // iOS 시뮬레이터
    }
  }
  
  return API_BASE_URL; // 실제 기기, 프로덕션
};

// API 기본 설정
const baseURL = getBaseURL();

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: 토큰 자동 추가
apiClient.interceptors.request.use(
  async (config) => {
    const token = await Storage.getSecure('AUTH_TOKENS');
    if (token) {
      config.headers.Authorization = `Bearer ${token.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 에러 처리
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('💥 API 응답 에러:', {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url,
      data: error.response?.data
    });
    
    if (error.response?.status === 401) {
      // 인증 만료
      console.log('🚪 인증 만료 - 로그아웃 처리');
      Alert.alert('인증 만료', '다시 로그인해주세요.');
      Storage.clearAllData();
    }
    return Promise.reject(error);
  }
);

// 기본 API 함수들 (GET, POST, PUT, DELETE)
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
  delete: (url) => {
    return apiClient.delete(url);
  },
};


// 예시 API 함수들
export const userAPI = {
  getUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

// 월드 API
export const worldAPI = {
  // 전체 월드 목록 조회
  getWorlds: () => api.get('/api/worlds/'),

  // 사용자별 월드 진행상황 조회
  getUserWorlds: () => api.get('/api/user-worlds/'),

  // 특정 월드 상세 조회
  getWorldDetail: (worldId) => api.get(`/api/worlds/${worldId}/`),

  // 특정 월드의 스테이지 목록 조회
  getWorldStages: (worldId) => api.get(`/api/worlds/${worldId}/stages/`),

  // 월드 잠금 해제
  unlockWorld: (worldId) => api.post(`/api/user-worlds/${worldId}/unlock/`),

  // 사용자의 특정 월드 진행상황 조회
  getUserWorldProgress: (worldId) => api.get(`/api/user-worlds/${worldId}/`),
};

// 스테이지 API
export const stageAPI = {
  // 특정 스테이지 상세 조회
  getStageDetail: (stageId) => api.get(`/api/stages/${stageId}/`),

  // 스테이지의 유닛 목록 조회 (레슨 포함)
  getStageUnits: (stageId) => api.get(`/api/stages/${stageId}/units/`),

  // 사용자의 스테이지 진행상황 조회
  getUserStageProgress: (stageId) => api.get(`/api/user-stage-progress/${stageId}/`),

  // 스테이지 완료 처리
  completeStage: (stageId, data) => api.post(`/api/user-stage-progress/${stageId}/complete/`, data),
};

// 레슨 API
export const lessonAPI = {
  // 레슨 시작
  startLesson: (lessonId) => api.post(`/api/lessons/${lessonId}/start/`),

  // 현재 문제 조회
  getCurrentProblem: (lessonId) => api.get(`/api/lessons/${lessonId}/current-problem/`),

  // 레슨 포기
  abandonLesson: (lessonId) => api.post(`/api/lessons/${lessonId}/abandon/`),
};

// 문제 풀이 API
export const problemAPI = {
  // 문제 제출 (코딩 문제 제외)
  submitAnswer: (problemId, answer) => api.post(`/api/problems/${problemId}/submit/`, { answer }),

  // 문제 건너뛰기 (트라이얼 문제만)
  skipProblem: (problemId) => api.post(`/api/problems/${problemId}/skip/`),

  // Judge0 API를 사용한 코드 실행 (추후 구현)
  executeCode: (problemId, code) => {
    // Judge0 연동은 추후 구현
    return api.post(`/api/problems/${problemId}/execute/`, { code });
  },
};

// 프로필 API
export const profileAPI = {
  // 내 프로필 조회
  getMyProfile: () => api.get('/api/users/me/'),

  // 특정 사용자 프로필 조회
  getUserProfile: (userId) => api.get(`/api/users/${userId}/`),

  // 내 프로필 수정 (PATCH)
  updateMyProfile: (data) => api.put('/api/users/me/', data),

  // 프로필 이미지 업로드
  uploadProfileImage: (formData) => {
    return apiClient.post('/api/users/me/upload-image/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  // 내 학습 통계 조회
  getMyStats: () => api.get('/api/users/me/stats/'),

  // 내 최근 활동 조회
  getMyActivity: () => api.get('/api/users/me/activity/'),

  // 내 업적 조회
  getMyAchievements: () => api.get('/api/users/me/achievements/'),
};

export default api;
