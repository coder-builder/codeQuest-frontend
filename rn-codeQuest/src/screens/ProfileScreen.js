import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { lightImpact } from '../utils/haptic';
import { useAuth } from '../context/AuthContext';
import { profileAPI } from '../apis/api';

const ProfileScreen = () => {
  const { user, logout } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  // 사용자 통계 로드
  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const statsData = await profileAPI.getMyStats();
      setStats(statsData);
    } catch (err) {
      console.error('통계 로드 실패:', err);
      setError('통계를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 기본값 설정
  const userData = {
    name: user?.username || '사용자',
    email: user?.email || 'user@example.com',
    profileImage: user?.profile_image || '',
    streak: user?.streak_days || 0,
    totalXP: user?.total_xp || 0,
    completedLessons: stats?.total_completed_stages || 0,
    badges: 0,
    weeklyGoal: 5,
    currentWeekDays: 3,
    level: stats?.level || 1,
    rank: 'Beginner',
  };



  return (
   <SafeAreaView style={styles.container}>
    <ScrollView showsVerticalScrollIndicator={false}>
      
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>프로필</Text>
        <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => {
              lightImpact(); // 햅틱 추가
              // 설정 화면으로 이동
            }}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
      </View>

       {/* 프로필 정보 */}
        <View style={styles.profileSection}>
          <Image 
            source={{ uri: userData.profileImage }}
            style={styles.profileImage}
          />
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userEmail}>{userData.email}</Text>
          
          {/* 레벨 & 랭크 */}
          <View style={styles.rankContainer}>
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>{userData.rank}</Text>
            </View>
            <Text style={styles.levelText}>Level {userData.level}</Text>
          </View>
        </View>
        {/* 주요 통계 */}
        <View style={styles.statsContainer}>
          {/* 스트릭 */}
          <View style={[styles.statCard, styles.streakCard]}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statValue}>{userData.streak}</Text>
            <Text style={styles.statLabel}>연속 학습일</Text>
          </View>

          {/* 총 XP */}
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>⭐</Text>
            <Text style={styles.statValue}>{userData.totalXP}</Text>
            <Text style={styles.statLabel}>총 경험치</Text>
          </View>
        </View>

        {/* 학습 현황 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 학습 현황</Text>
          
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>완료한 레슨</Text>
              <Text style={styles.cardValue}>{userData.completedLessons}개</Text>
            </View>
            
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>획득한 배지</Text>
              <Text style={styles.cardValue}>{userData.badges}개</Text>
            </View>
          </View>
        </View>

        {/* 주간 목표 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 주간 목표</Text>
          
          <View style={styles.card}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalText}>
                주 {userData.weeklyGoal}일 학습 목표
              </Text>
              <Text style={styles.goalProgress}>
                {userData.currentWeekDays}/{userData.weeklyGoal}
              </Text>
            </View>
            
            {/* 프로그레스 바 */}
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { width: `${(userData.currentWeekDays / userData.weeklyGoal) * 100}%` }
                ]} 
              />
            </View>

            {/* 요일 표시 */}
            <View style={styles.weekDays}>
              {['월', '화', '수', '목', '금', '토', '일'].map((day, index) => (
                <View 
                  key={day} 
                  style={[
                    styles.dayCircle,
                    index < userData.currentWeekDays && styles.dayCircleActive
                  ]}
                >
                  <Text 
                    style={[
                      styles.dayText,
                      index < userData.currentWeekDays && styles.dayTextActive
                    ]}
                  >
                    {day}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* 배지 섹션 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🏆 배지</Text>
            <TouchableOpacity onPress={() => lightImpact()}>
              <Text style={styles.seeAll}>전체보기</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.badgesContainer}>
            {[
              { emoji: '🔥', name: '연속 7일' },
              { emoji: '⭐', name: '1000 XP' },
              { emoji: '🎯', name: '목표 달성' },
              { emoji: '📚', name: '레슨 마스터' },
            ].map((badge, index) => (
              <TouchableOpacity
                key={index}
                style={styles.badge}
                onPress={() => lightImpact()}
              >
                <Text style={styles.badgeEmoji}>{badge.emoji}</Text>
                <Text style={styles.badgeName}>{badge.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 편집 버튼 */}
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => {
            lightImpact(); //약한 햅틱
            // 프로필 편집 화면으로
          }}
        >
          <Text style={styles.editButtonText}>프로필 편집</Text>
        </TouchableOpacity>
    </ScrollView>
   </SafeAreaView>
  )
}



export default ProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1CB0F6',
  },
  settingsButton: {
    padding: 8,
  },
  settingsIcon: {
    fontSize: 24,
  },
  profileSection: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#1CB0F6',
    marginBottom: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3C3C3C',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#777777',
    marginBottom: 15,
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rankBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  rankText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  levelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1CB0F6',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  streakCard: {
    backgroundColor: '#FFF4E6',
    borderWidth: 2,
    borderColor: '#FF9500',
  },
  statIcon: {
    fontSize: 36,
    marginBottom: 10,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3C3C3C',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#777777',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3C3C3C',
    marginBottom: 15,
  },
  seeAll: {
    fontSize: 14,
    color: '#1CB0F6',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  cardLabel: {
    fontSize: 16,
    color: '#3C3C3C',
  },
  cardValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1CB0F6',
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  goalText: {
    fontSize: 16,
    color: '#3C3C3C',
  },
  goalProgress: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1CB0F6',
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#E5E5E5',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#58CC02',
    borderRadius: 5,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCircleActive: {
    backgroundColor: '#58CC02',
  },
  dayText: {
    fontSize: 14,
    color: '#777777',
    fontWeight: '600',
  },
  dayTextActive: {
    color: '#FFFFFF',
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  badge: {
    width: '22%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 11,
    color: '#777777',
    textAlign: 'center',
  },
  editButton: {
    backgroundColor: '#1CB0F6',
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 15,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#1CB0F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});