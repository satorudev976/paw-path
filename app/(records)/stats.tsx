import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Walk } from '@/domain/entities/walk';
import ErrorView from '@/components/ui/error';
import { SkeletonStatCard } from '@/components/ui/skeleton';
import Toast from '@/components/ui/toast';
import { useToast } from '@/hooks/toast';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { WalkService } from '@/services/walk.service';
import { useUser } from '@/hooks/use-user';
import { formatDistance, formatDuration } from '@/utils/formatters';
import { WalkStats } from '@/services/walk-statistics.service';
import { WalkStatisticsService } from '@/services/walk-statistics.service';

type Period = 'week' | 'month';

export default function StatsView() {
  const { user } = useUser();
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('week');
  const [walks, setWalks] = useState<Walk[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast, showToast, hideToast } = useToast();
  const router = useRouter();
  const [stats, setStats] = useState<WalkStats>({
    count: 0,
    totalDistance: 0,
    avgDistance: 0,
    avgDuration: 0,
  });

  // Swipeableの参照を保持（開いているスワイプを閉じるため）
  const swipeableRefs = React.useRef<Map<string, Swipeable>>(new Map());

  useFocusEffect(
    React.useCallback(() => {
      console.log('記録タブにフォーカス - 最新データを取得');
      loadStats();
    }, [selectedPeriod])
  );

  const loadStats = async () => {
    setIsLoading(true);
    setError(null);
    
    try {

      if (!user) return ;
      const walks = await WalkService.listByPeriod(
        user.familyId,
        selectedPeriod
      )
      setWalks(walks);
  
      const stats = await WalkStatisticsService.getStatisicsByFamily(
        user.familyId,
        selectedPeriod
      )
      setStats(stats)
    } catch (err: any) {
      console.error('統計データ取得エラー:', err);
      
      if (err.message?.includes('network')) {
        setError('network');
      } else {
        setError('unknown');
      }
      showToast('データの取得に失敗しました', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalkPress = (walk: Walk) => {
    // 全てのスワイプを閉じる
    swipeableRefs.current.forEach((ref) => ref?.close());
    
    router.push({
      pathname: '/(tabs)/map',
      params: {
        animateWalkId: walk.walkId,
        animateDate: walk.startTime.toISOString(),
        timestamp: Date.now().toString(),
      },
    });
  };

  // ✅ 散歩履歴削除機能
  const handleDeleteWalk = (walk: Walk) => {
    const dateStr = `${walk.startTime.getMonth() + 1}/${walk.startTime.getDate()}`;
    const timeStr = `${walk.startTime.getHours().toString().padStart(2, '0')}:${walk.startTime.getMinutes().toString().padStart(2, '0')}`;
    
    Alert.alert(
      '散歩記録を削除',
      `${dateStr} ${timeStr}の記録を削除しますか？\nこの操作は取り消せません。`,
      [
        { 
          text: 'キャンセル', 
          style: 'cancel',
          onPress: () => {
            // スワイプを閉じる
            swipeableRefs.current.get(walk.walkId)?.close();
          }
        },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('散歩記録削除:', walk.walkId);
              
              await WalkService.delete(walk.walkId);
              // 統計を再計算
              //calculateStats(updatedWalks);
              
              showToast('記録を削除しました', 'success');
            } catch (error) {
              console.error('削除エラー:', error);
              showToast('削除に失敗しました', 'error');
            }
          }
        }
      ]
    );
  };

  // ✅ スワイプ時の右側のアクション（削除ボタン）
  const renderRightActions = (
    walk: Walk,
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.deleteAction, { transform: [{ scale }] }]}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteWalk(walk)}
        >
          <Ionicons name="trash-outline" size={24} color="#FFFFFF" />
          <Text style={styles.deleteText}>削除</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
          onRetry={loadStats}
        />
      ) : isLoading ? (
        <ScrollView style={styles.statsContainer}>
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
        </ScrollView>
      ) : walks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🐾</Text>
          <Text style={styles.emptyText}>まだ散歩の記録がありません</Text>
          <Text style={styles.emptySubText}>散歩を記録して統計を見てみましょう！</Text>
        </View>
      ) : (
        <ScrollView style={styles.statsContainer}>
          {/* 散歩回数 */}
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🚶</Text>
            <Text style={styles.statLabel}>散歩回数</Text>
            <Text style={styles.statValue}>{stats.count}回</Text>
          </View>

          {/* 総距離 */}
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📏</Text>
            <Text style={styles.statLabel}>総距離</Text>
            <Text style={styles.statValue}>{formatDistance(stats.totalDistance)}km</Text>
          </View>

          {/* 平均距離 */}
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📊</Text>
            <Text style={styles.statLabel}>平均距離</Text>
            <Text style={styles.statValue}>{formatDistance(stats.avgDistance)}km</Text>
          </View>

          {/* 平均所要時間 */}
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>⏱️</Text>
            <Text style={styles.statLabel}>平均所要時間</Text>
            <Text style={styles.statValue}>{formatDuration(stats.avgDuration)}</Text>
          </View>

          {/* 散歩履歴 */}
          <View style={styles.historySection}>
            <Text style={styles.historyTitle}>散歩履歴</Text>
            {walks.map((walk) => (
              <Swipeable
                key={walk.walkId}
                ref={(ref) => {
                  if (ref) {
                    swipeableRefs.current.set(walk.walkId, ref);
                  }
                }}
                renderRightActions={(progress, dragX) => 
                  renderRightActions(walk, progress, dragX)
                }
                overshootRight={false}
                rightThreshold={40}
              >
                <TouchableOpacity
                  style={styles.historyItem}
                  onPress={() => handleWalkPress(walk)}
                  activeOpacity={0.7}
                >
                  <View style={styles.historyInfo}>
                    <Text style={styles.historyDate}>
                      {walk.startTime.getMonth() + 1}/{walk.startTime.getDate()} ({['日', '月', '火', '水', '木', '金', '土'][walk.startTime.getDay()]})
                    </Text>
                    <Text style={styles.historyTime}>
                      {walk.startTime.getHours().toString().padStart(2, '0')}:
                      {walk.startTime.getMinutes().toString().padStart(2, '0')}
                    </Text>
                  </View>
                  <View style={styles.historyStats}>
                    <Text style={styles.historyDistance}>{formatDistance(walk.distanceMeter)}km</Text>
                    <Text style={styles.historyDuration}>{formatDuration(walk.durationSec)}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color="#CCCCCC" />
                </TouchableOpacity>
              </Swipeable>
            ))}
          </View>
        </ScrollView>
      )}

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4A90E2',
  },
  tabText: {
    fontSize: 16,
    color: '#999999',
  },
  activeTabText: {
    color: '#4A90E2',
    fontWeight: '600',
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
  statsContainer: {
    flex: 1,
    padding: 16,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#999999',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
  },
  historySection: {
    marginTop: 24,
    marginBottom: 24,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  historyInfo: {
    flex: 1,
  },
  historyDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  historyTime: {
    fontSize: 14,
    color: '#999999',
  },
  historyStats: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  historyDistance: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A90E2',
    marginBottom: 4,
  },
  historyDuration: {
    fontSize: 14,
    color: '#999999',
  },
  // ✅ スワイプ削除アクションのスタイル
  deleteAction: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    marginBottom: 12,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  deleteText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999999',
  },
});