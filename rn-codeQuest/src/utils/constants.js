// API
export let API_BASE_URL = '';
if (__DEV__) {
  // API_BASE_URL = 'http://172.28.192.1:8000/api'; // Kim's Local IP
} else {
  API_BASE_URL = 'https://codequest.co.kr/api';
}

// App dimensions
export const SCREEN_WIDTH = 375;
export const SCREEN_HEIGHT = 812;

// Colors
export const COLORS = {
  PRIMARY: '#007AFF',
  SECONDARY: '#5856D6',
  SUCCESS: '#34C759',
  WARNING: '#FF9500',
  ERROR: '#FF3B30',
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  GRAY: '#8E8E93',
  LIGHT_GRAY: '#F2F2F7',
  DARK_GRAY: '#48484A',
  BACKGROUND: '#F2F2F7',
  TEXT: '#000000',
  TEXT_SECONDARY: '#6D6D80',
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