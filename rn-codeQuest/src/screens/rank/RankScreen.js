/**
 * ============================================================================
 * 랭킹 메인 스크린
 * ============================================================================
 */

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import MyLeagueTab from '../../components/rank/MyLeagueTab'
import GlobalRankingTab from '../../components/rank/GlobalRankingTab'
import MyHistoryTab from '../../components/rank/MyHistoryTab'
import { SafeAreaView } from 'react-native-safe-area-context'

const RankScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('league');

  const tabs = [
    { key: 'league', label: '내 리그', icon: '🏆' },
    { key: 'global', label: '전체 랭킹', icon: '🌍' },
    { key: 'history', label: '히스토리', icon: '📊' },
  ];

  const renderContent = () => {
    switch (selectedTab) {
      case 'league':
        return <MyLeagueTab />;
      case 'global':
        return <GlobalRankingTab />;
      case 'history':
        return <MyHistoryTab />;
      default:
        return <MyLeagueTab />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>랭킹</Text>
      </View>

      {/* 탭 버튼 */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tabButton,
              selectedTab === tab.key && styles.tabButtonActive,
            ]}
            onPress={() => setSelectedTab(tab.key)}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text
              style={[
                styles.tabLabel,
                selectedTab === tab.key && styles.tabLabelActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 탭 컨텐츠 */}
      <View style={styles.content}>
        {renderContent()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  tabButtonActive: {
    backgroundColor: '#6200ee20',
  },
  tabIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  tabLabelActive: {
    color: '#6200ee',
  },
  content: {
    flex: 1,
  },
});

export default RankScreen