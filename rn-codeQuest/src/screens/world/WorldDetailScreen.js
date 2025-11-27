// src/screens/world/WorldDetailScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Dimensions } from 'react-native';
import { Text, ProgressBar, ActivityIndicator } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import * as haptic from '../../utils/haptic';
import { worldAPI, stageAPI } from '../../apis/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function WorldDetailScreen({ route, navigation }) {
  const { worldId, world: initialWorld, userWorld: initialUserWorld } = route.params;
  const { user } = useAuth();

  // 상태 관리
  const [world, setWorld] = useState(initialWorld);
  const [userWorld, setUserWorld] = useState(initialUserWorld);
  const [stages, setStages] = useState([]);
  const [userStageProgress, setUserStageProgress] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // 데이터 로드
  const loadStagesData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [stagesData, userWorldData] = await Promise.all([
        worldAPI.getWorldStages(worldId),
        worldAPI.getUserWorldProgress(worldId),
      ]);

      setStages(stagesData);
      setUserWorld(userWorldData);

      // 사용자의 스테이지 진행상황도 가져오기
      const progressPromises = stagesData.map(stage =>
        stageAPI.getUserStageProgress(stage.id).catch(() => null)
      );
      const progressData = await Promise.all(progressPromises);
      setUserStageProgress(progressData.filter(p => p !== null));

    } catch (err) {
      console.error('스테이지 데이터 로드 실패:', err);
      setError(err.response?.data?.message || '데이터를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStagesData();
  }, [worldId]);

  // 새로고침
  const onRefresh = () => {
    setRefreshing(true);
    loadStagesData();
  };

  // 스테이지 클릭 핸들러
  const handleStagePress = (stage, canAccess) => {
    haptic.lightImpact();

    if (!canAccess) {
      alert('이전 스테이지를 먼저 완료해주세요.');
      return;
    }

    alert(`${stage.title} 시작!\n(레슨 화면 구현 필요)`);
  };

  // 헤더 설정
  useEffect(() => {
    navigation.setOptions({
      title: world?.title || '월드',
      headerStyle: {
        backgroundColor: '#1f2937',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    });
  }, [navigation, world]);

  // 스테이지 아이콘 선택
  const getStageIcon = (index, isCompleted, isActive) => {
    const icons = ['⭐', '🎧', '📖', '🎯', '🏆', '💎', '🔥', '✨', '🎨', '🎭'];
    return icons[index % icons.length];
  };

  // 스테이지를 지그재그로 배치하기 위한 위치 계산
  const getStagePosition = (index) => {
    const isEven = index % 2 === 0;
    const yOffset = index * 140; // 세로 간격

    return {
      left: isEven ? SCREEN_WIDTH * 0.25 : SCREEN_WIDTH * 0.6,
      top: yOffset,
    };
  };

  if (isLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#a855f7" />
        <Text style={styles.loadingText}>스테이지 로딩 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 상단 헤더 정보 */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.sectionTitle}>
            {world?.title} {world?.icon}
          </Text>
        </View>

        {userWorld && (
          <View style={styles.progressContainer}>
            <ProgressBar
              progress={userWorld.progress_percentage / 100}
              color="#a855f7"
              style={styles.progressBar}
            />
            <Text style={styles.progressText}>
              {userWorld.completed_stage}/{userWorld.total_stage} 완료 ({userWorld.progress_percentage}%)
            </Text>
          </View>
        )}
      </View>

      {/* 스테이지 경로 */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.pathContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorEmoji}>⚠️</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadStagesData}>
              <Text style={styles.retryButtonText}>다시 시도</Text>
            </TouchableOpacity>
          </View>
        ) : stages.length > 0 ? (
          <View style={styles.stagesPath}>
            {stages.map((stage, index) => {
              const stageProgress = userStageProgress.find(p => p.stage === stage.id);
              const isCompleted = stageProgress?.is_completed || false;

              // 이전 스테이지 확인
              const prevStage = stages[index - 1];
              const prevProgress = prevStage
                ? userStageProgress.find(p => p.stage === prevStage.id)
                : null;
              const canAccess = stage.order === 1 || (prevProgress && prevProgress.is_completed);
              const isActive = canAccess && !isCompleted;

              const position = getStagePosition(index);
              const icon = getStageIcon(index, isCompleted, isActive);

              return (
                <View key={stage.id} style={[styles.stageWrapper, { top: position.top }]}>
                  {/* 연결선 */}
                  {index > 0 && (
                    <View style={[
                      styles.pathLine,
                      { height: 140 },
                      !canAccess && styles.pathLineLocked
                    ]} />
                  )}

                  {/* 스테이지 버튼 */}
                  <TouchableOpacity
                    style={[
                      styles.stageButton,
                      { left: position.left },
                      isCompleted && styles.stageButtonCompleted,
                      isActive && styles.stageButtonActive,
                      !canAccess && styles.stageButtonLocked,
                    ]}
                    onPress={() => handleStagePress(stage, canAccess)}
                    activeOpacity={0.8}
                    disabled={!canAccess}
                  >
                    <LinearGradient
                      colors={
                        isCompleted
                          ? ['#fbbf24', '#f59e0b']
                          : isActive
                          ? ['#a855f7', '#9333ea']
                          : ['#4b5563', '#374151']
                      }
                      style={styles.stageGradient}
                    >
                      <Text style={styles.stageIcon}>{icon}</Text>
                      {isCompleted && (
                        <View style={styles.completedBadge}>
                          <Text style={styles.completedBadgeText}>✓</Text>
                        </View>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>

                  {/* 스테이지 정보 */}
                  <View style={[
                    styles.stageInfo,
                    { left: position.left > SCREEN_WIDTH / 2 ? 20 : SCREEN_WIDTH * 0.65 }
                  ]}>
                    <Text style={styles.stageOrder}>Stage {stage.order}</Text>
                    <Text style={styles.stageTitle}>{stage.title}</Text>
                  </View>
                </View>
              );
            })}

            {/* 여백 추가 */}
            <View style={{ height: 100 }} />
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📚</Text>
            <Text style={styles.emptyTitle}>아직 스테이지가 없습니다</Text>
            <Text style={styles.emptyDescription}>
              관리자가 스테이지를 추가하면 여기에 표시됩니다.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#9ca3af',
  },

  // 헤더
  header: {
    backgroundColor: '#1f2937',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  progressContainer: {
    gap: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#374151',
  },
  progressText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'right',
  },

  // 스크롤뷰
  scrollView: {
    flex: 1,
  },
  pathContainer: {
    paddingTop: 40,
    paddingBottom: 40,
    minHeight: '100%',
  },

  // 스테이지 경로
  stagesPath: {
    position: 'relative',
    width: '100%',
    paddingHorizontal: 20,
  },
  stageWrapper: {
    position: 'absolute',
    width: '100%',
  },

  // 연결선
  pathLine: {
    position: 'absolute',
    left: '50%',
    width: 6,
    backgroundColor: '#4b5563',
    borderRadius: 3,
    transform: [{ translateX: -3 }],
    zIndex: 0,
  },
  pathLineLocked: {
    backgroundColor: '#374151',
  },

  // 스테이지 버튼
  stageButton: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    transform: [{ translateX: -40 }],
    zIndex: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  stageButtonCompleted: {
    shadowColor: '#fbbf24',
    shadowOpacity: 0.5,
  },
  stageButtonActive: {
    shadowColor: '#a855f7',
    shadowOpacity: 0.6,
  },
  stageButtonLocked: {
    opacity: 0.5,
  },
  stageGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#1f2937',
  },
  stageIcon: {
    fontSize: 36,
  },
  completedBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#1f2937',
  },
  completedBadgeText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },

  // 스테이지 정보
  stageInfo: {
    position: 'absolute',
    top: 20,
    width: 120,
  },
  stageOrder: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '600',
    marginBottom: 4,
  },
  stageTitle: {
    fontSize: 15,
    color: '#fff',
    fontWeight: 'bold',
  },

  // 에러 상태
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  errorEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 30,
  },
  retryButton: {
    backgroundColor: '#a855f7',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // 빈 상태
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 15,
    color: '#9ca3af',
    textAlign: 'center',
  },
});
