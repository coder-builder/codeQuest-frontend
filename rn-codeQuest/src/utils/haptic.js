import * as Haptics from 'expo-haptics';

// 가벼운 탭 (버튼 클릭)
export const lightImpact = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

// 중간 탭 (선택, 스위치)
export const mediumImpact = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
};

// 강한 탭 (중요한 액션)
export const heavyImpact = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
};

// 성공 피드백
export const successFeedback = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};

// 경고 피드백
export const warningFeedback = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
};

// 에러 피드백
export const errorFeedback = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
};

// 선택 변경 피드백 (휠, 슬라이더)
export const selectionFeedback = () => {
  Haptics.selectionAsync();
};

export default {
  lightImpact,
  mediumImpact,
  heavyImpact,
  successFeedback,
  warningFeedback,
  errorFeedback,
  selectionFeedback,
};