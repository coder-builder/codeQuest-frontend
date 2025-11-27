/**
 * ============================================================================
 * 전체 랭킹 탭 컴포넌트
 * ============================================================================
 */

import { RefreshControl, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import rankingService from '../../services/rank/rankingService';
import { ActivityIndicator, Chip, Searchbar, Surface } from 'react-native-paper';
import { FlatList } from 'react-native-web';
import { Storage } from '../../services/storages';

const GlobalRankingTab = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [rankings, setRankings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [userId, setUserId] = useState(null);

  const TIERS = [
    { value: null, label: '전체', color: '#9E9E9E' },
    { value: 'BRONZE', label: 'Bronze', color: '#CD7F32' },
    { value: 'SILVER', label: 'Silver', color: '#C0C0C0' },
    { value: 'GOLD', label: 'Gold', color: '#FFD700' },
    { value: 'PLATINUM', label: 'Platinum', color: '#E5E4E2' },
    { value: 'DIAMOND', label: 'Diamond', color: '#B9F2FF' },
    { value: 'MASTER', label: 'Master', color: '#FF6B6B' },
    { value: 'LEGEND', label: 'Legend', color: '#8B5CF6' },
  ];

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

  // 랭킹 데이터 불러오기
  const fetchRankings = useCallback(async (reset = false) => {
    try {
      const currentPage = reset ? 0 : page;
      const limit = 50;
      const offset = currentPage * limit;

      let response;
      if (selectedTier) {
        response = await rankingService.getTierRankings(selectedTier, limit, offset);
      } else {
        response = await rankingService.getGlobalRankings(limit, offset);
      }

      if (reset) {
        setRankings(response);
        setPage(0);
      } else {
        setRankings([...rankings, ...response]);
      }

      setHasMore(response.length === limit);
    } catch (err) {
      console.error('랭킹 데이터 로드 실패:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, selectedTier, rankings]);

  useEffect(() => {
    fetchRankings(true);
  }, [selectedTier]);

  // 새로고침
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(0);
    fetchRankings(true);
  }, [fetchRankings]);

  // 더 불러오기
  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(page + 1);
      fetchRankings();
    }
  };

  // 티어 필터링
  const handleTierFilter = (tier) => {
    setSelectedTier(tier);
    setLoading(true);
    setPage(0);
  };

  // 검색된 랭킹 필터링
  const filteredRankings = rankings.filter((item) =>
    item.nickname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 순위 메달 아이콘
  const getRankMedal = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  // 랭킹 아이템 렌더링
  const renderRankingItem = ({ item }) => {
    const isMe = item.user_id === userId;
    const medal = getRankMedal(item.rank);

    return (
      <Surface
        style={[
          styles.rankingCard,
          isMe && styles.myRankingCard,
        ]}
        elevation={isMe ? 2 : 0}
      >
        {/* 순위 */}
        <View style={styles.rankContainer}>
          {medal ? (
            <Text style={styles.medal}>{medal}</Text>
          ) : (
            <Text
              style={[
                styles.rankNumber,
                item.rank <= 10 && styles.topRankNumber,
              ]}
            >
              {item.rank}
            </Text>
          )}
        </View>

        {/* 프로필 */}
        <View style={styles.avatarContainer}>
          {item.profile_image ? (
            <Image
              source={{ uri: item.profile_image }}
              style={styles.avatar}
            />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarPlaceholderText}>
                {item.nickname.substring(0, 2).toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        {/* 유저 정보 */}
        <View style={styles.userInfo}>
          <View style={styles.nicknameRow}>
            <Text style={[styles.nickname, isMe && styles.myNickname]}>
              {item.nickname}
              {isMe && ' (나)'}
            </Text>
          </View>

          {/* 티어 뱃지 */}
          <View style={styles.tierBadge}>
            <Text style={styles.tierIcon}>{item.tier_icon}</Text>
            <Text style={[styles.tierText, { color: item.tier_color }]}>
              {item.tier}
            </Text>
          </View>
        </View>

        {/* EXP */}
        <View style={styles.expContainer}>
          <Text style={styles.expLabel}>Total</Text>
          <Text style={styles.expValue}>{item.total_exp.toLocaleString()}</Text>
          <Text style={styles.expUnit}>XP</Text>
        </View>
      </Surface>
    );
  };

  // 티어 필터 아이템 렌더링
  const renderTierFilter = ({ item }) => (
    <Chip
      selected={selectedTier === item.value}
      onPress={() => handleTierFilter(item.value)}
      style={[
        styles.tierChip,
        selectedTier === item.value && {
          backgroundColor: item.color + '30',
        },
      ]}
      textStyle={{
        color: selectedTier === item.value ? item.color : '#666',
      }}
    >
      {item.label}
    </Chip>
  );

  return (
    <View style={styles.container}>
      {/* 검색바 */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="유저 검색..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>

      {/* 티어 필터 */}
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          data={TIERS}
          keyExtractor={(item) => item.value || 'all'}
          renderItem={renderTierFilter}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
        />
      </View>

      {/* 랭킹 리스트 */}
      {loading && rankings.length === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
          <Text style={styles.loadingText}>랭킹을 불러오는 중...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredRankings}
          renderItem={renderRankingItem}
          keyExtractor={(item) => item.user_id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            hasMore && !loading ? (
              <ActivityIndicator
                size="small"
                color="#6200ee"
                style={styles.footerLoader}
              />
            ) : null
          }
        />
      )}
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
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
    backgroundColor: '#fff',
  },
  searchbar: {
    elevation: 0,
    backgroundColor: '#f5f5f5',
  },
  filterContainer: {
    backgroundColor: '#fff',
    paddingBottom: 12,
  },
  filterList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tierChip: {
    marginRight: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  rankingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  myRankingCard: {
    backgroundColor: '#E8F5E9',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  rankContainer: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
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
  medal: {
    fontSize: 32,
  },
  avatarContainer: {
    marginHorizontal: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#757575',
  },
  userInfo: {
    flex: 1,
  },
  nicknameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  nickname: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  myNickname: {
    color: '#4CAF50',
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  tierIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  tierText: {
    fontSize: 12,
    fontWeight: '600',
  },
  expContainer: {
    alignItems: 'flex-end',
  },
  expLabel: {
    fontSize: 10,
    color: '#999',
    marginBottom: 2,
  },
  expValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  expUnit: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  footerLoader: {
    marginVertical: 16,
  },
});

export default GlobalRankingTab