// src/screens/home/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Modal } from 'react-native';
import { ActivityIndicator, Text, ProgressBar } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import * as haptic from '../utils/haptic';
import { worldAPI, stageAPI } from '../apis/api';
import { useTheme } from '../utils/theme';

export default function HomeScreen({ navigation }) {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const { colors, isDark } = useTheme();

  // 상태 관리
  const [worlds, setWorlds] = useState([]);
  const [userWorlds, setUserWorlds] = useState([]);
  const [currentStage, setCurrentStage] = useState(null); // 현재 스테이지 정보
  const [units, setUnits] = useState([]); // 유닛 목록 (유닛 → 레슨)
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [showWorldSelector, setShowWorldSelector] = useState(false);

  // 사용자 통계
  const hearts = user?.hearts || 5;
  const streak = user?.streak_days || 0;
  const coins = user?.coins || 0;

  // 마지막 공부한 월드
  const lastStudiedUserWorld = userWorlds.length > 0 ? userWorlds[0] : null;
  const lastStudiedWorld = lastStudiedUserWorld 
    ? worlds.find(w => w.id === lastStudiedUserWorld.world) 
    : null;

  // 월드 + 스테이지 + 유닛 데이터 한 번에 로드
  const loadAllData = async () => {
    if (!isAuthenticated) return;

    try {
      setIsLoadingData(true);
      setError(null);

      // 1. 월드 데이터 먼저 로드
      const [worldsData, userWorldsData] = await Promise.all([
        worldAPI.getWorlds(),
        worldAPI.getUserWorlds(),
      ]);

      setWorlds(worldsData);
      setUserWorlds(userWorldsData);

      // 2. 마지막 공부한 월드의 현재 스테이지 찾기
      if (userWorldsData.length > 0) {
        const lastWorldId = userWorldsData[0].world;
        const lastUserWorld = userWorldsData[0];

        // 스테이지 목록 가져오기
        const stagesData = await worldAPI.getWorldStages(lastWorldId);

        // 현재 학습 중인 스테이지 (완료 스테이지 + 1)
        const currentStageIndex = lastUserWorld.completed_stage;
        const currentStageData = stagesData[currentStageIndex];

        if (currentStageData) {
          setCurrentStage(currentStageData);

          // 3. 현재 스테이지의 유닛 목록 로드
          const unitsData = await stageAPI.getStageUnits(currentStageData.id);
          setUnits(unitsData.units || []); // units 배열만 추출
        }
      }
    } catch (err) {
      console.error('데이터 로드 실패:', err);
      setError(err.response?.data?.message || '데이터를 불러오는데 실패했습니다.');
    } finally {
      setIsLoadingData(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      loadAllData();
    }
  }, [isAuthenticated, user]);

  const onRefresh = () => {
    setRefreshing(true);
    loadAllData();
  };

  const handleStagePress = () => {
    haptic.lightImpact();

    navigation.navigate('WorldDetail', {
      worldId: lastStudiedWorld.id,
      world: lastStudiedWorld,
      userWorld: lastStudiedUserWorld,
    });
  };

  const handleWorldSelectorPress = () => {
    haptic.lightImpact();
    setShowWorldSelector(true);
  };

  const handleWorldSelect = async (world) => {
    haptic.lightImpact();
    setShowWorldSelector(false);

    const userWorld = userWorlds.find(uw => uw.world === world.id);

    if (world.is_locked && (!userWorld || !userWorld.is_unlocked)) {
      alert('이 월드는 아직 잠겨있습니다.');
      return;
    }

    // 선택한 월드로 이동
    navigation.navigate('WorldDetail', {
      worldId: world.id,
      world: world,
      userWorld: userWorld,
    });
  };

  const styles = createStyles(colors, isDark);

  if (isLoading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>로그인 상태 확인 중...</Text>
      </View>
    );
  }

  if (!user || !isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.loginPrompt}>
          <Text style={styles.loginTitle}>CodeQuest에 오신 것을 환영합니다! 🚀</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginButtonText}>로그인</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.registerButtonText}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {lastStudiedWorld ? (
            <TouchableOpacity
              style={styles.currentLanguage}
              onPress={handleWorldSelectorPress}
              activeOpacity={0.7}
            >
              <Text style={styles.languageIcon}>{lastStudiedWorld.icon}</Text>
              <Text style={styles.languageTitle}>{lastStudiedWorld.title}</Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.headerTitle}>CodeQuest</Text>
          )}
        </View>

        <View style={styles.headerRight}>
          <View style={styles.statBadge}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={styles.statValue}>{streak}</Text>
          </View>

          <View style={styles.statBadge}>
            <Text style={styles.statEmoji}>💎</Text>
            <Text style={styles.statValue}>{coins}</Text>
          </View>

          <View style={styles.statBadge}>
            <Text style={styles.statEmoji}>❤️</Text>
            <Text style={styles.statValue}>{hearts}</Text>
          </View>

          <TouchableOpacity onPress={logout} style={styles.profileButton}>
            <Text style={styles.profileEmoji}>👤</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 메인 컨텐츠 */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {isLoadingData ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#a855f7" />
            <Text style={styles.loadingDataText}>로딩 중...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorEmoji}>⚠️</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadAllData}>
              <Text style={styles.retryButtonText}>다시 시도</Text>
            </TouchableOpacity>
          </View>
        ) : lastStudiedWorld && lastStudiedUserWorld && currentStage && units.length > 0 ? (
          <>
            {/* 현재 섹션 배너 */}
            <View style={styles.sectionBanner}>
              <LinearGradient
                colors={['#ec4899', '#d946ef']}
                style={styles.bannerGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.bannerContent}>
                  <View>
                    <Text style={styles.bannerLabel}>
                      {lastStudiedWorld.title.toUpperCase()} • STAGE {lastStudiedUserWorld.completed_stage + 1}
                    </Text>
                    <Text style={styles.bannerTitle}>
                      {currentStage.title}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.bannerIcon}
                    onPress={handleStagePress}
                  >
                    <Text style={styles.bannerIconText}>
                      {lastStudiedWorld.icon || '📚'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>

            {/* 유닛 경로 (듀오링고 스타일: Unit → Lesson) */}
            <View style={styles.unitsPath}>
              {units.map((unit, unitIndex) => (
                <View key={unit.id} style={styles.unitSection}>
                  {/* 유닛 제목 */}
                  <View style={styles.unitHeader}>
                    <Text style={styles.unitTitle}>Unit {unitIndex + 1}</Text>
                    <Text style={styles.unitSubtitle}>{unit.title}</Text>
                  </View>

                  {/* 레슨 목록 */}
                  <View style={styles.lessonsContainer}>
                    {unit.lessons.map((lesson, lessonIndex) => {
                      const isUnlocked = lesson.is_unlocked;
                      const isCompleted = lesson.is_completed || false;

                      // 지그재그 레이아웃
                      const position = lessonIndex % 3; // 0: 중앙, 1: 오른쪽, 2: 왼쪽

                      return (
                        <View key={lesson.id} style={styles.lessonItem}>
                          {/* 연결선 */}
                          {lessonIndex > 0 && (
                            <View style={styles.connectionLine} />
                          )}

                          {/* 레슨 버튼 */}
                          <TouchableOpacity
                            onPress={() => {
                              haptic.lightImpact();
                              if (isUnlocked) {
                                navigation.navigate('Lesson', {
                                  lessonId: lesson.id,
                                  lessonTitle: lesson.title
                                });
                              } else {
                                alert('이전 레슨을 먼저 완료해주세요.');
                              }
                            }}
                            disabled={!isUnlocked}
                            activeOpacity={0.8}
                            style={[
                              styles.lessonButton,
                              position === 0 && styles.lessonCenter,
                              position === 1 && styles.lessonRight,
                              position === 2 && styles.lessonLeft,
                            ]}
                          >
                            <View style={[
                              styles.lessonCircle,
                              isCompleted && styles.lessonCompleted,
                              isUnlocked && !isCompleted && styles.lessonUnlocked,
                              !isUnlocked && styles.lessonLocked,
                            ]}>
                              <Text style={styles.lessonEmoji}>
                                {isCompleted ? '⭐' : !isUnlocked ? '🔒' : '📚'}
                              </Text>
                            </View>

                            {/* 레슨 정보 */}
                            {isUnlocked && !isCompleted && (
                              <View style={styles.lessonInfoBox}>
                                <Text style={styles.lessonInfoTitle}>{lesson.title}</Text>
                                <Text style={styles.lessonInfoMeta}>
                                  {lesson.problem_count || 0}개 문제
                                </Text>
                              </View>
                            )}
                          </TouchableOpacity>

                          {/* 완료된 레슨 하단 별 3개 */}
                          {isCompleted && (
                            <View style={styles.lessonStars}>
                              <Text style={styles.starIcon}>⭐</Text>
                              <Text style={styles.starIcon}>⭐</Text>
                              <Text style={styles.starIcon}>⭐</Text>
                            </View>
                          )}
                        </View>
                      );
                    })}
                  </View>
                </View>
              ))}
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🌍</Text>
            <Text style={styles.emptyTitle}>아직 월드가 없습니다</Text>
            <Text style={styles.emptyDescription}>
              관리자가 월드를 추가하면 여기에 표시됩니다.
            </Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* 월드 선택 모달 */}
      <Modal
        visible={showWorldSelector}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowWorldSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* 모달 헤더 */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>월드 선택</Text>
              <TouchableOpacity
                onPress={() => setShowWorldSelector(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* 월드 목록 */}
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {worlds.map((world) => {
                const userWorld = userWorlds.find(uw => uw.world === world.id);
                const isLocked = world.is_locked && (!userWorld || !userWorld.is_unlocked);
                const isCurrent = lastStudiedWorld?.id === world.id;

                return (
                  <TouchableOpacity
                    key={world.id}
                    style={[
                      styles.worldSelectItem,
                      isCurrent && styles.worldSelectItemCurrent,
                      isLocked && styles.worldSelectItemLocked,
                    ]}
                    onPress={() => handleWorldSelect(world)}
                    disabled={isLocked}
                    activeOpacity={0.7}
                  >
                    <View style={styles.worldSelectLeft}>
                      <Text style={styles.worldSelectIcon}>{world.icon}</Text>
                      <View>
                        <Text style={[
                          styles.worldSelectTitle,
                          isLocked && styles.worldSelectTitleLocked
                        ]}>
                          {world.title}
                        </Text>
                        {userWorld && !isLocked && (
                          <Text style={styles.worldSelectProgress}>
                            {userWorld.completed_stage}/{userWorld.total_stage} 스테이지 완료
                          </Text>
                        )}
                      </View>
                    </View>
                    {isCurrent && (
                      <View style={styles.currentBadge}>
                        <Text style={styles.currentBadgeText}>학습 중</Text>
                      </View>
                    )}
                    {isLocked && (
                      <Text style={styles.worldSelectLockIcon}>🔒</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
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
  loadingScreen: {
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

  // 로그인 프롬프트
  loginPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: colors.text,
  },
  loginButton: {
    width: '100%',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  registerButton: {
    width: '100%',
    backgroundColor: colors.buttonSecondary,
    paddingVertical: 16,
    borderRadius: 16,
  },
  registerButtonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // 헤더
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  currentLanguage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  languageIcon: {
    fontSize: 24,
  },
  languageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  dropdownIcon: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  statEmoji: {
    fontSize: 16,
  },
  statValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
  },
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileEmoji: {
    fontSize: 20,
  },

  // 스크롤뷰
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },

  // 섹션 배너
  sectionBanner: {
    marginBottom: 40,
  },
  bannerGradient: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  bannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
  bannerLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  bannerIcon: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerIconText: {
    fontSize: 24,
  },

  // 유닛 경로
  unitsPath: {
    paddingVertical: 20,
  },
  unitSection: {
    marginBottom: 40,
  },
  unitHeader: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  unitTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  unitSubtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },

  // 레슨 경로
  lessonsContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  lessonItem: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  connectionLine: {
    width: 4,
    height: 40,
    backgroundColor: colors.surfaceVariant,
    marginBottom: 10,
  },
  lessonButton: {
    alignItems: 'center',
  },
  lessonCenter: {
    alignSelf: 'center',
  },
  lessonRight: {
    alignSelf: 'flex-end',
    marginRight: 60,
  },
  lessonLeft: {
    alignSelf: 'flex-start',
    marginLeft: 60,
  },
  lessonCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  lessonUnlocked: {
    backgroundColor: colors.secondary,
    borderWidth: 4,
    borderColor: colors.secondaryLight,
  },
  lessonCompleted: {
    backgroundColor: colors.warning,
  },
  lessonLocked: {
    backgroundColor: colors.surfaceVariant,
  },
  lessonEmoji: {
    fontSize: 40,
  },
  lessonInfoBox: {
    marginTop: 12,
    alignItems: 'center',
  },
  lessonInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  lessonInfoMeta: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  lessonStars: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  starIcon: {
    fontSize: 20,
    opacity: 0.6,
  },

  // 로딩/에러
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  loadingDataText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  errorEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // 빈 상태
  emptyState: {
    paddingVertical: 80,
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  emptyDescription: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  // 모달 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 20,
    color: colors.textSecondary,
  },
  modalContent: {
    padding: 20,
  },

  // 월드 선택 아이템
  worldSelectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  worldSelectItemCurrent: {
    backgroundColor: colors.surfaceVariant,
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  worldSelectItemLocked: {
    opacity: 0.5,
  },
  worldSelectLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  worldSelectIcon: {
    fontSize: 32,
  },
  worldSelectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  worldSelectTitleLocked: {
    color: colors.textSecondary,
  },
  worldSelectProgress: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  worldSelectLockIcon: {
    fontSize: 24,
  },
  currentBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  currentBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
});