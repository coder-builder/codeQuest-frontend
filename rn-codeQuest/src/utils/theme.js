// src/utils/theme.js
import { useColorScheme } from 'react-native';

// 다크모드 컬러
export const darkColors = {
  // 배경
  background: '#1e293b',
  surface: '#334155',
  surfaceVariant: '#475569',

  // 텍스트
  text: '#ffffff',
  textSecondary: '#94a3b8',
  textTertiary: '#64748b',

  // 주요 색상
  primary: '#a855f7',
  primaryLight: '#c084fc',
  secondary: '#ec4899',
  secondaryLight: '#f472b6',

  // 상태 색상
  success: '#22c55e',
  warning: '#fbbf24',
  error: '#ef4444',
  info: '#3b82f6',

  // 그라디언트
  gradient1: ['#ec4899', '#d946ef'],
  gradient2: ['#a855f7', '#c084fc'],

  // 보더
  border: '#334155',
  borderLight: '#475569',

  // 오버레이
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',

  // 버튼
  buttonPrimary: '#a855f7',
  buttonSecondary: '#334155',
  buttonDisabled: '#475569',
};

// 라이트모드 컬러
export const lightColors = {
  // 배경
  background: '#ffffff',
  surface: '#f8fafc',
  surfaceVariant: '#e2e8f0',

  // 텍스트
  text: '#1e293b',
  textSecondary: '#475569',
  textTertiary: '#64748b',

  // 주요 색상
  primary: '#a855f7',
  primaryLight: '#c084fc',
  secondary: '#ec4899',
  secondaryLight: '#f472b6',

  // 상태 색상
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',

  // 그라디언트
  gradient1: ['#ec4899', '#d946ef'],
  gradient2: ['#a855f7', '#c084fc'],

  // 보더
  border: '#e2e8f0',
  borderLight: '#cbd5e1',

  // 오버레이
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',

  // 버튼
  buttonPrimary: '#a855f7',
  buttonSecondary: '#e2e8f0',
  buttonDisabled: '#cbd5e1',
};

// 테마 훅
export const useTheme = () => {
  const colorScheme = useColorScheme();
  // colorScheme이 null이면 'light'를 기본값으로 사용
  const isDark = colorScheme === 'dark';

  return {
    colors: isDark ? darkColors : lightColors,
    isDark,
  };
};

// 다크모드 여부 확인 훅
export const useIsDarkMode = () => {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark';
};
