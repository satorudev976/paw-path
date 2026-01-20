import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RankingView from './records/ranking';
import StatsView from './records/stats';

type Tab = 'stats' | 'ranking';

export default function RecordsScreen() {
  
  const [selectedTab, setSelectedTab] = useState<Tab>('stats');

  return (
    <View style={styles.container}>
      {/* サブタブ */}
      <View style={styles.subTabs}>
        <TouchableOpacity
          style={[styles.subTab, selectedTab === 'stats' && styles.activeSubTab]}
          onPress={() => setSelectedTab('stats')}
        >
          <Text style={[styles.subTabText, selectedTab === 'stats' && styles.activeSubTabText]}>
            統計
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.subTab, selectedTab === 'ranking' && styles.activeSubTab]}
          onPress={() => setSelectedTab('ranking')}
        >
          <Text style={[styles.subTabText, selectedTab === 'ranking' && styles.activeSubTabText]}>
            ランキング
          </Text>
        </TouchableOpacity>
      </View>

      {/* コンテンツ */}
      {selectedTab === 'stats' ? <StatsView /> : <RankingView />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  subTabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  subTab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeSubTab: {
    borderBottomColor: '#4A90E2',
  },
  subTabText: {
    fontSize: 16,
    color: '#999999',
    fontWeight: '500',
  },
  activeSubTabText: {
    color: '#4A90E2',
    fontWeight: 'bold',
  },
});