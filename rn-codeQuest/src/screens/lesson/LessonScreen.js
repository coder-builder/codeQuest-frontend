// src/screens/lesson/LessonScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { ActivityIndicator, Text, ProgressBar } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../utils/theme';
import { lessonAPI, problemAPI } from '../../apis/api';
import * as haptic from '../../utils/haptic';
import ProblemRenderer from './components/ProblemRenderer';

export default function LessonScreen({ route, navigation }) {
  const { lessonId, lessonTitle } = route.params;
  const { colors, isDark } = useTheme();

  // 상태 관리
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(null);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [hint, setHint] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultData, setResultData] = useState(null);

  // 하단 탭바 숨기기
  useEffect(() => {
    const parent = navigation.getParent();
    if (parent) {
      parent.setOptions({
        tabBarStyle: { display: 'none' }
      });
    }

    // 컴포넌트 언마운트 시 탭바 다시 표시
    return () => {
      if (parent) {
        parent.setOptions({
          tabBarStyle: { display: 'flex' }
        });
      }
    };
  }, [navigation]);

  // 레슨 시작
  useEffect(() => {
    startLesson();
  }, []);

  const startLesson = async () => {
    try {
      setIsLoading(true);
      console.log('=== 레슨 시작 ===');
      console.log('레슨 ID:', lessonId);

      const data = await lessonAPI.startLesson(lessonId);

      console.log('초기 진행률:', data.progress);
      console.log('첫 번째 문제:', data.current_problem?.id);

      setProgress(data.progress);
      setCurrentProblem(data.current_problem);
      setHint('');
      setAttemptCount(0);
    } catch (error) {
      console.error('레슨 시작 실패:', error);
      Alert.alert('오류', '레슨을 시작할 수 없습니다.', [
        { text: '확인', onPress: () => navigation.goBack() }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // 답안 제출
  const handleSubmit = async (answer) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      haptic.lightImpact();

      console.log('=== 답안 제출 ===');
      console.log('문제 ID:', currentProblem.id);
      console.log('제출 답안:', answer);

      const result = await problemAPI.submitAnswer(currentProblem.id, answer);

      console.log('=== 제출 결과 ===');
      console.log('정답 여부:', result.is_correct);
      console.log('다음 액션:', result.next_action);
      console.log('진행률:', result.progress);

      setResultData(result);
      setShowResultModal(true);
      setAttemptCount(result.attempt_count || 0);

      // 진행률 업데이트 (서버에서 제공하는 경우)
      if (result.progress) {
        console.log('진행률 업데이트:', result.progress);
        setProgress(result.progress);
      } else {
        console.log('⚠️ 서버에서 진행률 데이터 없음');
        // 서버에서 진행률 없으면 수동으로 증가 (레슨 완료가 아닐 때만)
        if (result.is_correct && progress && result.next_action !== 'lesson_complete') {
          const newProgress = {
            ...progress,
            current_problem_index: progress.current_problem_index + 1
          };
          console.log('클라이언트에서 진행률 계산:', newProgress);
          setProgress(newProgress);
        }
      }

      if (!result.is_correct) {
        setHint(result.hint || '');
        setShowHint(true);
      } else {
        // 정답인 경우 힌트 초기화
        setHint('');
        setShowHint(false);
      }

      // 다음 액션 처리
      if (result.next_action === 'retry') {
        // 즉시 재시도 (오답 - 같은 문제 다시 풀기)
        setTimeout(() => {
          setShowResultModal(false);
          // 현재 문제 유지, 힌트는 표시 상태 유지
        }, 2000);
      } else if (result.next_action === 'next_problem') {
        // 다음 문제로 이동 (정답 또는 트라이얼 문제 오답)
        setTimeout(() => {
          setShowResultModal(false);
          if (result.current_problem) {
            setCurrentProblem(result.current_problem);
            // 진행률은 이미 위에서 업데이트됨
            setHint('');
            setShowHint(false);
            setAttemptCount(0);
          }
        }, 2000);
      } else if (result.next_action === 'round_complete') {
        // 라운드 완료
        setTimeout(() => {
          setShowResultModal(false);
          showRoundCompleteModal(result);
        }, 2000);
      } else if (result.next_action === 'lesson_complete') {
        // 레슨 완료
        setTimeout(() => {
          setShowResultModal(false);
          showLessonCompleteModal(result);
        }, 2000);
      }
    } catch (error) {
      console.error('답안 제출 실패:', error);
      Alert.alert('오류', '답안 제출에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 문제 건너뛰기 (트라이얼 문제만)
  const handleSkip = async () => {
    try {
      haptic.lightImpact();
      const result = await problemAPI.skipProblem(currentProblem.id);

      if (result.current_problem) {
        setCurrentProblem(result.current_problem);
        setHint('');
        setShowHint(false);
        setAttemptCount(0);
      }
    } catch (error) {
      console.error('문제 건너뛰기 실패:', error);
      Alert.alert('오류', '문제를 건너뛸 수 없습니다.');
    }
  };

  // 라운드 완료 모달
  const showRoundCompleteModal = (result) => {
    Alert.alert(
      '라운드 완료! 🎉',
      `${result.message}\n\n틀린 문제: ${result.failed_problems_count || 0}개`,
      [
        {
          text: '다음 라운드',
          onPress: () => {
            setCurrentProblem(result.current_problem);
            setProgress(result.progress);
            setHint('');
            setShowHint(false);
            setAttemptCount(0);
          }
        }
      ]
    );
  };

  // 레슨 완료 모달
  const showLessonCompleteModal = (result) => {
    console.log('=== 레슨 완료 ===');
    console.log('결과 데이터:', result);

    haptic.successFeedback();

    const message = result.message || '축하합니다! 레슨을 완료했습니다!';
    const expReward = result.exp_reward || result.exp || 0;
    const coinReward = result.coin_reward || result.coins || 0;
    const totalProblems = result.total_problems_solved || progress?.total_problems || 0;
    const correctProblems = result.correct_problems || totalProblems;
    const accuracy = totalProblems > 0 ? Math.round((correctProblems / totalProblems) * 100) : 100;

    Alert.alert(
      '레슨 완료! 🎊',
      `${message}\n\n` +
      `정답률: ${accuracy}% (${correctProblems}/${totalProblems})\n` +
      `획득 경험치: ${expReward} XP\n` +
      `획득 코인: ${coinReward} 코인`,
      [
        {
          text: '확인',
          onPress: () => {
            console.log('레슨 완료 후 홈으로 이동');
            navigation.goBack();
          }
        }
      ],
      { cancelable: false }
    );
  };

  // 레슨 포기
  const handleAbandonLesson = () => {
    console.log('=== X 버튼 클릭 ===');
    haptic.warningFeedback();
    Alert.alert(
      '레슨 종료',
      '나가게 되면 레슨이 종료됩니다.\n진행 상황은 저장되지 않습니다.\n\n정말 나가시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '나가기',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('레슨 포기 API 호출');
              await lessonAPI.abandonLesson(lessonId);
              navigation.goBack();
            } catch (error) {
              console.error('레슨 포기 실패:', error);
              navigation.goBack();
            }
          }
        }
      ]
    );
  };

  const styles = createStyles(colors, isDark);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>문제를 불러오는 중...</Text>
      </View>
    );
  }

  if (!currentProblem) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>문제를 불러올 수 없습니다.</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>돌아가기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleAbandonLesson} style={styles.backButton}>
          <Text style={styles.backButtonText}>✕</Text>
        </TouchableOpacity>

        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {progress ? `${progress.current_problem_index + 1} / ${progress.total_problems}` : '- / -'}
          </Text>
          <ProgressBar
            progress={progress ? (progress.current_problem_index + 1) / progress.total_problems : 0}
            color={colors.primary}
            style={styles.progressBar}
          />
        </View>

        <View style={styles.headerRight}>
          <Text style={styles.roundText}>Round {progress?.current_round}</Text>
        </View>
      </View>

      {/* 문제 영역 */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 문제 제목 */}
        <View style={styles.problemHeader}>
          <Text style={styles.problemTitle}>{currentProblem.title}</Text>
          {currentProblem.description && (
            <Text style={styles.problemDescription}>{currentProblem.description}</Text>
          )}
        </View>

        {/* 힌트 표시 */}
        {showHint && hint && (
          <View style={styles.hintContainer}>
            <Text style={styles.hintIcon}>💡</Text>
            <Text style={styles.hintText}>{hint}</Text>
          </View>
        )}

        {/* 문제 렌더러 */}
        <ProblemRenderer
          problem={currentProblem}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          colors={colors}
        />

        {/* 건너뛰기 버튼 (트라이얼 문제만) */}
        {currentProblem.is_trial && (
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>건너뛰기</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* 결과 모달 */}
      <Modal
        visible={showResultModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.resultModal,
            resultData?.is_correct ? styles.resultModalCorrect : styles.resultModalWrong
          ]}>
            <Text style={styles.resultEmoji}>
              {resultData?.is_correct ? '🎉' : '😅'}
            </Text>
            <Text style={styles.resultTitle}>
              {resultData?.is_correct ? '정답입니다!' : '오답입니다'}
            </Text>
            <Text style={styles.resultMessage}>{resultData?.message}</Text>
            {resultData?.explanation && (
              <Text style={styles.resultExplanation}>{resultData.explanation}</Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const createStyles = (colors, isDark) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: colors.error,
    marginBottom: 20,
  },

  // 헤더
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: colors.textSecondary,
  },
  progressContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  progressText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surface,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  roundText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },

  // 스크롤뷰
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },

  // 문제 헤더
  problemHeader: {
    marginBottom: 24,
  },
  problemTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  problemDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },

  // 힌트
  hintContainer: {
    flexDirection: 'row',
    backgroundColor: colors.info + '20',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.info,
  },
  hintIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  hintText: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },

  // 버튼
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipButton: {
    marginTop: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    color: colors.textSecondary,
    fontSize: 15,
  },

  // 결과 모달
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultModal: {
    width: '80%',
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
  },
  resultModalCorrect: {
    backgroundColor: colors.success + '20',
    borderWidth: 2,
    borderColor: colors.success,
  },
  resultModalWrong: {
    backgroundColor: colors.error + '20',
    borderWidth: 2,
    borderColor: colors.error,
  },
  resultEmoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  resultMessage: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  resultExplanation: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
