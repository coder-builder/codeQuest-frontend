import { Platform } from 'react-native';
import Constants from 'expo-constants';

// API Base URL
const getApiBaseUrl = () => {
  if (!__DEV__) {
    // 프로덕션
    return 'https://api.codequest.com';
  }

  if (Platform.OS === 'web') {
    // 웹은 localhost
    return 'http://localhost:8000';
  }

  // 모바일 개발 환경 - 동적 IP
  const hostUri = Constants.expoConfig?.hostUri;
  const ip = hostUri?.split(':')[0]; // "10.199.106.165:8081" → "10.199.106.165"
  return `http://${ip}:8000`;
};
export const API_BASE_URL = getApiBaseUrl();


// App dimensions
export const SCREEN_WIDTH = 375;
export const SCREEN_HEIGHT = 812;

// Colors
export const COLORS = {
  PRIMARY: "#007AFF",
  SECONDARY: "#5856D6",
  SUCCESS: "#34C759",
  WARNING: "#FF9500",
  ERROR: "#FF3B30",
  WHITE: "#FFFFFF",
  BLACK: "#000000",
  GRAY: "#8E8E93",
  LIGHT_GRAY: "#F2F2F7",
  DARK_GRAY: "#48484A",
  BACKGROUND: "#F2F2F7",
  TEXT: "#000000",
  TEXT_SECONDARY: "#6D6D80",
};

// Spacing
export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  XXL: 48,
};

// Font sizes
export const FONT_SIZES = {
  XS: 12,
  SM: 14,
  MD: 16,
  LG: 18,
  XL: 20,
  XXL: 24,
  XXXL: 32,
};
