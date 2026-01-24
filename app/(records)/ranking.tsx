import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ErrorView from '@/components/ui/error';
import { SkeletonStatCard } from '@/components/ui/skeleton';
import { WalkStatisticsService, WalkRanking } from '@/services/walk-statistics.service';
import { useUser } from '@/hooks/use-user';
import { formatDistance, formatDurationJa } from '@/utils/formatters';

type Period = 'week' | 'month';

export default function RankingView() {
  const { user } = useUser();
  const [rankings, setRankings] = useState<WalkRanking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('week');

  useEffect(() => {
    loadRankings();
  }, [selectedPeriod]);

  const loadRankings = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!user) return null ;
  
      const ranking = await WalkStatisticsService.getFamilyRanking(
        user.familyId,
        selectedPeriod
      )
      setRankings(ranking);
    } catch (err: any) {
      console.error('ランキングデータ取得エラー:', err);
      
      if (err.message?.includes('network')) {
        setError('network');
      } else {
        setError('unknown');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* 期間選択タブ */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, selectedPeriod === 'week' && styles.activeTab]}
          onPress={() => setSelectedPeriod('week')}
        >
          <Text style={[styles.tabText, selectedPeriod === 'week' && styles.activeTabText]}>
            週間
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedPeriod === 'month' && styles.activeTab]}
          onPress={() => setSelectedPeriod('month')}
        >
          <Text style={[styles.tabText, selectedPeriod === 'month' && styles.activeTabText]}>
            月間
          </Text>
        </TouchableOpacity>
      </View>

      {/* 期間表示 */}
      <View style={styles.periodInfo}>
        <Text style={styles.periodText}>
          {selectedPeriod === 'week' ? '過去7日間' : '過去30日間'}
        </Text>
      </View>

      {/* コンテンツ */}
      {error ? (
        <ErrorView
          type={error === 'network' ? 'network' : 'unknown'}
          onRetry={loadRankings}
        />
      ) : isLoading ? (
        <ScrollView style={styles.content}>
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
        </ScrollView>
      ) : rankings.length === 0 ? (
        <ErrorView
          type="empty"
          title="データがありません"
          message="この期間の記録がありません"
        />
      ) : (
        <ScrollView style={styles.content}>
          <Text style={styles.title}>🏆 家族内ランキング</Text>
          
          {rankings.slice(0, 3).map((user, index) => (
            <View
              key={user.userId}
              style={[
                styles.rankCard,
                index === 0 && styles.firstPlace,
                index === 1 && styles.secondPlace,
                index === 2 && styles.thirdPlace,
              ]}
            >
              <View style={styles.rankHeader}>
                <Text style={styles.rankNumber}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                </Text>
                <Text style={styles.userName}>{user.nickname}</Text>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>散歩回数</Text>
                  <Text style={styles.statValue}>{user.count}回</Text>
                </View>

                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>総距離</Text>
                  <Text style={styles.statValue}>{formatDistance(user.totalDistance)} km</Text>
                </View>

                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>総時間</Text>
                  <Text style={styles.statValue}>{formatDurationJa(user.totalDuration)}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#4A90E2',
  },
  tabText: {
    fontSize: 16,
    color: '#666666',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  periodInfo: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  periodText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
    textAlign: 'center',
  },
  rankCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#EEEEEE',
  },
  firstPlace: {
    borderColor: '#FFD700',
    backgroundColor: '#FFFEF0',
  },
  secondPlace: {
    borderColor: '#C0C0C0',
    backgroundColor: '#F8F8F8',
  },
  thirdPlace: {
    borderColor: '#CD7F32',
    backgroundColor: '#FFF8F0',
  },
  rankHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rankNumber: {
    fontSize: 32,
    marginRight: 12,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
});