/**
 * ============================================================================
 * 내 리그 랭킹 탭 컴포넌트
 * ============================================================================
 */

import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import api from '../../apis/api';
import rankingService from '../../services/rank/rankingService';
import { Storage } from '../../services/storages';
import { ActivityIndicator, Card, ProgressBar, Surface } from 'react-native-paper';

const MyLeagueTab = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [leagueData, setLeagueData] = useState(null);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  // 유저 정보 가져오기
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const userInfo = await Storage.getData('USER_INFO');
        if (userInfo) {
          setUserId(userInfo.user_id);
        }
      } catch (err) {
        console.error('유저 정보 로드 실패:', err);
      }
    };
    getUserInfo();
  }, []);

  // 리그 데이터 불러오기
  const fetchLeagueData = useCallback(async () => {
    try {
      const response = await rankingService.getMyLeagueRanking();

      if(response.success){
        setLeagueData(response);
        setError(null);
      } else {
        setError(response.message);
      }
    } catch (err) {
      console.error('리그 데이터 로드 실패:', err);
      setError('리그 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLeagueData();
  }, [fetchLeagueData]);

  // 새로고침
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchLeagueData();
  }, [fetchLeagueData]);

  // 티어 아이콘 컴포넌트
  const TierIcon = ( tier, icon, color ) => (
    <View style={[styles.tierBadge, {backgroundColor: color + '20'}]}>
      <Text style={styles.tierIconText}>{icon}</Text>
      <Text style={[styles.tierText, { color: color }]}>{tier}</Text>
    </View>
  );

  // 순위 변동 아이콘
  const RankChangeIcon = ({ change }) => {
    if (change > 0){
      return <Text style={styles.rankUp}>▲ {change}</Text>
    } else if (change <0){
      return <Text style={styles.rankDown}>▼ {Math.abs(change)}</Text>
    }
  }

  // 상태 칩 컴포넌트
  const StatusChip = ({ status }) => {
    const getStatusConfig = () => {
      switch (status) {
        case 'PROMOTION':
          return { label: '승급권', color: '#4CAF50'};
        case 'DEMOTION':
          return { label: '강등권', color: '#F44336'};
        default:
          return { label: '안전권', color: '#9E9E9E'};
      }
    };

    const config = getStatusConfig();
    return (
      <Chip
        mode="flat"
        textStyle={{ color: config.color, fontSize: 12}}
        style={[styles.statusChip, { backgroundColor: config.color + '20'}]}
      >
        {config.label}
      </Chip>
    );
  };

  // 참가자 아이템 렌더링
  const renderParticipant = ({ item }) => {
    const isMe = item.user_id === userId;

    return (
      <Surface
        style={[
          styles.participantCard,
          isMe && styles.myParticipantCard,
        ]}
        elevation={isMe ? 2 : 0}
      >
        {/* 순위 */}
        <View style={styles.participantRank}>
          <Text style={[
            styles.rankNumber,
            item.current_rank <= 3 && styles.topRankNumber,
          ]}>
            {item.current_rank}
          </Text>
          <RankChangeIcon change={item.rank_change}/>
        </View>

        {/* 프로필 이미지 */}
        <View style={styles.avatarContainer}>
          {item.profile_image ? (
            <Image 
              source={{ uri: item.profile_image }}
              style={styles.avatar}
            />
          ) : (
            <View style={[styles.avatar, style.avatarPlaceholder]}>
              <Text style={styles.avatarPlaceholderText}>
                {item.nickname.substring(0, 2).toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        {/* 유저 정보 */}
        <View style={styles.participantInfo}>
          <Text style={[styles.nickname, isMe && styles.myNickname]}>
            {item.nickname}
            {isMe && ' (나)'}
          </Text>
          <View style={styles.expContainer}>
            <Text style={styles.expText}>
              코딩: {item.coding_exp} XP
            </Text>
            <Text style={styles.expDivider}>|</Text>
            <Text style={styles.expText}>
              자격증: {item.cert_exp} XP
            </Text>
          </View>
        </View>

        {/* EXP 및 상태 */}
        <View style={styles.participantRight}>
          <Text style={styles.totalExp}>{item.weekly_exp} XP</Text>
          <StatusChip status={item.status} />
        </View>
      </Surface>
    );
  };

  // 로딩 중
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color='#6200ee' />
        <Text style={styles.loadingText}>리그 정보를 불러오는 중 ...</Text>
      </View>
    );
  }

  // 에러 또는 데이터 없음
  if (error || !leagueData?.success) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorIcon}>😢</Text>
        <Text style={styles.errorText}>
          {error || '아직 이번 주 리그에 참가하지 않았습니다.'}
        </Text>
        <Text style={styles.errorSubText}>
          문제를 풀면 자동으로 리그에 참가됩니다!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 리그 정보 헤더 */}
      <Card style={styles.headerCard}>
        <Card.Content>
          <View style={styles.headerTop}>
            <TierIcon
              tier={leagueData.tier}
              icon={leagueData.tier_info?.icon}
              color={leagueData.tier_info?.color}
            />
            <View style={styles.headerRight}>
              <Text style={styles.daysRemaining}>
                {leagueData.days_remaining}일 남음
              </Text>
              <Text style={styles.weekPeriod}>
                {leagueData.week_start} ~ {leagueData.week_end}
              </Text>
            </View>
          </View>

          {/* 내 순위 정보 */}
          <View style={styles.myRankContainer}>
            <View style={styles.myRankRow}>
              <Text style={styles.myRankLabel}>내 순위</Text>
              <View style={styles.myRankValue}>
                <Text style={styles.myRankNumber}>{leagueData.my_rank}위</Text>
                <RankChangeIcon change={leagueData.rank_change} />
              </View>
            </View>
            
            <View style={styles.myRankRow}>
              <Text style={styles.myRankLabel}>주간 EXP</Text>
              <Text style={styles.myExpNumber}>{leagueData.my_exp}</Text>
            </View>

            <StatusChip status={leagueData.my_status} />
          </View>

          {/* 진행률 바 */}
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              참가자: {leagueData.total_participants}명
            </Text>
            <ProgressBar 
              progress={leagueData.total_participants / 50}
              color='#6200ee'
              style={styles.progressBar}
            />
          </View>
        </Card.Content>
      </Card>

      {/* 승급/강등 구간 표시 */}
      <View style={styles.zoneIndicator}>
        <View style={[styles.zoneItem, { backgroundColor: '#4CAF5020'}]}>
          <Text style={[styles.zoneText, { color: '#4CAF50' }]}>
            승급권 (1-10위)
          </Text>
        </View>
        <View style={[styles.zoneItem, { backgroundColor: '#9E9E9E20'}]}>
          <Text style={[styles.zoneText, { color: '9E9E9E' }]}>
            안전권 (11-40위)
          </Text>
        </View>
        <View style={[styles.zoneItem, { backgroundColor: '#F4433620'}]}>
          <Text style={[styles.zoneText, { color: '#F44336'}]}>
            강등권 (41-50위)
          </Text>
        </View>
      </View>

      {/* 참가자 리스트 */}
      <FlatList
        data={leagueData.rankings}
        renderItem={renderParticipant}
        keyExtractor={(item) => item.user_id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  errorIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  headerCard: {
    margin: 16,
    marginBottom: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tierIconText: {
    fontSize: 24,
    marginRight: 8,
  },
  tierText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  daysRemaining: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  weekPeriod: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  myRankContainer: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  myRankRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  myRankLabel: {
    fontSize: 14,
    color: '#666',
  },
  myRankValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  myRankNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  myExpNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  progressContainer: {
    marginTop: 12,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  zoneIndicator: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 8,
    gap: 8,
  },
  zoneItem: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  zoneText: {
    fontSize: 10,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  participantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  myParticipantCard: {
    backgroundColor: '#E8F5E9',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  participantRank: {
    width: 50,
    alignItems: 'center',
  },
  rankNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  topRankNumber: {
    fontSize: 20,
    color: '#FF6F00',
  },
  rankUp: {
    fontSize: 10,
    color: '#4CAF50',
    marginTop: 2,
  },
  rankDown: {
    fontSize: 10,
    color: '#F44336',
    marginTop: 2,
  },
  rankSame: {
    fontSize: 10,
    color: '#9E9E9E',
    marginTop: 2,
  },
  avatarContainer: {
    marginHorizontal: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#757575',
  },
  participantInfo: {
    flex: 1,
  },
  nickname: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  myNickname: {
    color: '#4CAF50',
  },
  expContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expText: {
    fontSize: 12,
    color: '#666',
  },
  expDivider: {
    marginHorizontal: 8,
    color: '#ccc',
  },
  participantRight: {
    alignItems: 'flex-end',
  },
  totalExp: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 4,
  },
  statusChip: {
    height: 24,
  },
});

export default MyLeagueTab;