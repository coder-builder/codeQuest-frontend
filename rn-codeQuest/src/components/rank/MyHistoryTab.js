/**
 * ============================================================================
 * 내 랭킹 히스토리 탭 컴포넌트
 * ============================================================================
 */

import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import rankingService from '../../services/rank/rankingService';
import { ActivityIndicator, Card, Divider } from 'react-native-paper';

const MyHistoryTab = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [history, setHistory] = useState([]);

  // 히스토리 데이터 불러오기
  const fetchHistory = useCallback(async () => {
    try {
      const response = await rankingService.getMyRankingHistory(20);
      setHistory(response);
    } catch (err) {
      console.error('히스토리 데이터 로드 실패:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // 새로고침
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchHistory();
  }, [fetchHistory]);

  // 결과 칩 컴포넌트
  const ResultChip = ({ result }) => {
    const getResultConfig = () => {
      switch (result) {
        case 'PROMOTED':
          return {
            label: '승급',
            color: '#4CAF50',
            icon: '⬆️',
          };
        case 'DEMOTED':
          return {
            label: '강등',
            color: '#F44336',
            icon: '⬇️',
          };
        default:
          return {
            label: '유지',
            color: '#2196F3',
            icon: '➡️',
          };
      }
    }

    const config = getResultConfig();
    return (
      <Chip
        mode="flat"
        textStyle={{ color: config.color, fontSize: 12, fontWeight: '600' }}
        style={[styles.resultChip, { backgroundColor: config.color + '20' }]}
        icon={() => <Text style={styles.chipIcon}>{config.icon}</Text>}
      >
        {config.label}
      </Chip>
    );
  };

  // 순위 배지
  const RankBadge = ({ rank }) => {
    let badgeStyle = styles.normalRankBadge;
    let textStyle = styles.normalRankText;

    if (rank <= 3) {
      badgeStyle = styles.topRankBadge;
      textStyle = styles.topRankText;
    } else if (rank <= 10) {
      badgeStyle = styles.promotionRankBadge;
      textStyle = styles.promotionRankText;
    }

    return (
      <View style={[styles.rankBadge, badgeStyle]}>
        <Text style={textStyle}>{rank}위</Text>
      </View>
    );
  };

  // 히스토리 아이템 렌더링
  const renderHistoryItem = ({ item, index }) => {
    const isRecent = index === 0;

    return(
      <Card style={[styles.historyCard, isRecent && styles.recentCard]}>
        <Card.Content>
          {/* 헤더 */}
          <View style={styles.cardHeader}>
            <View style={styles.weekInfo}>
              <Text style={styles.weekText}>
                Week {item.week_start} ~ {item.week_end}
              </Text>
              {isRecent && (
                <Chip
                  mode="flat"
                  compact
                  textStyle={{ fontSize: 10, color: '#6200ee' }}
                  style={styles.recentChip}
                >
                  최근
                </Chip>
              )}
            </View>

            <View style={styles.tierBadge}>
              <Text style={styles.tierIcon}>{item.tier_icon}</Text>
              <Text style={styles.tierText}>{item.tier}</Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* 결과 정보 */}
          <View style={styles.resultContainer}>
            <View style={styles.resultLeft}>
              <RankBadge rank={item.final_rank} />
              <ResultChip result={item.result} />
            </View>

            <View style={styles.resultRight}>
              <View style={styles.expRow}>
                <Text style={styles.expLabel}>Total EXP</Text>
                <Text style={styles.expValue}>
                  {item.final_exp.toLocaleString()} XP
                </Text>
              </View>
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* 상세 정보 */}
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>💻 코딩 문제</Text>
              <Text style={styles.detailValue}>
                {item.final_coding_exp || 0} XP
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>📝 자격증 문제</Text>
              <Text style={styles.detailValue}>
                {item.final_cert_exp || 0} XP
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>🪙 보상 코인</Text>
              <Text style={styles.rewardValue}>
                {item.reward_coins.toLocaleString()} Coins
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>히스토리를 불러오는 중...</Text>
      </View>
    );
  }

  if (history.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyIcon}>📊</Text>
        <Text style={styles.emptyText}>아직 랭킹 히스토리가 없습니다</Text>
        <Text style={styles.emptySubText}>
          문제를 풀고 리그에 참가해보세요!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 통계 요약 카드 */}
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Text style={styles.summaryTitle}>전체 통계</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{history.length}</Text>
              <Text style={styles.summaryLabel}>참가 주차</Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {history.filter((h) => h.result === 'PROMOTED').length}
              </Text>
              <Text style={styles.summaryLabel}>승급</Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {history.filter((h) => h.final_rank <= 10).length}
              </Text>
              <Text style={styles.summaryLabel}>Top 10</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* 히스토리 리스트 */}
      <FlatList
        data={history}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.recorded_at}
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
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  summaryCard: {
    margin: 16,
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  historyCard: {
    marginBottom: 12,
  },
  recentCard: {
    borderWidth: 2,
    borderColor: '#6200ee',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  weekInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weekText: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  recentChip: {
    height: 20,
    backgroundColor: '#6200ee20',
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
  },
  tierIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  tierText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  divider: {
    marginVertical: 12,
  },
  resultContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rankBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  normalRankBadge: {
    backgroundColor: '#f5f5f5',
  },
  promotionRankBadge: {
    backgroundColor: '#4CAF5020',
  },
  topRankBadge: {
    backgroundColor: '#FF6F0020',
  },
  normalRankText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  promotionRankText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  topRankText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6F00',
  },
  resultChip: {
    height: 28,
  },
  chipIcon: {
    fontSize: 14,
  },
  resultRight: {
    alignItems: 'flex-end',
  },
  expRow: {
    alignItems: 'flex-end',
  },
  expLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  expValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  detailsContainer: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  rewardValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFB300',
  },
});

export default MyHistoryTab;