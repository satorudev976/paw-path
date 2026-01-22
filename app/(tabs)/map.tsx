import React, { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useLocalSearchParams } from 'expo-router';
import ErrorView from '@/components/ui/error';
import { Skeleton } from '@/components/ui/skeleton';
import { WalkService } from '@/services/walk.service';
import { Walk } from '@/domain/entities/walk';
import { useFocusEffect } from '@react-navigation/native';
import { WEEKDAY_COLORS, applyOpacity } from '@/utils/color'
import { formatDateKey, getWeekStart, getWeekEnd } from '@/utils/date';
import { useUser } from '@/hooks/use-user';
import { useRouteAnimation } from '@/hooks/root-animation';
import { WalkMapService } from '@/services/walk-map.service';

export default function MapScreen() {
  const { user } = useUser();
  const [walks, setWalks] = useState<Walk[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getWeekStart(new Date()));

  // アニメーション関連の状態
  const mapRef = useRef<MapView>(null)
  const {
    animatingWalkId,
    markerPosition,
    startAnimation,
    resetAnimationKey,
  } = useRouteAnimation(mapRef)
 
  // URLパラメータから取得
  const params = useLocalSearchParams();
  const animateWalkIdParam = typeof params.animateWalkId === 'string' ? params.animateWalkId : null;
  const animateDateParam = typeof params.animateDate === 'string' ? params.animateDate : null;
  const timestampParam = typeof params.timestamp === 'string' ? params.timestamp : null;

  // パラメータから週を設定（パラメータが変わるたびに実行）
  useEffect(() => {
    if (animateDateParam) {
      const walkDate = new Date(animateDateParam);
      const walkWeekStart = getWeekStart(walkDate);
      
      // 現在表示中の週と異なる場合のみ変更
      if (currentWeekStart.getTime() !== walkWeekStart.getTime()) {
        console.log('パラメータの日付から週を設定:', walkDate, '→', walkWeekStart);
        setCurrentWeekStart(walkWeekStart);
        resetAnimationKey(); // アニメーションフラグをリセット
      }
    }
  }, [animateDateParam]); // animateDateParamが変わるたびに実行

  useFocusEffect(
    React.useCallback(() => {
      console.log('地図タブにフォーカス - 最新データを取得');
      loadWalks();
    }, [currentWeekStart])
  );
  // データ取得後、アニメーションを開始
  useEffect(() => {
    if (!animateWalkIdParam || walks.length === 0) return

    const walk = walks.find(w => w.walkId === animateWalkIdParam)
    if (!walk) return

    setTimeout(() => {
      startAnimation(
        walk,
        timestampParam || animateWalkIdParam
      )
    }, 500)
  }, [walks, animateWalkIdParam, timestampParam]);


  const loadWalks = async () => {
    setIsLoading(true);
    setError(null);
    
    try {

      if (!user) {
        return;
      }
      
      setWalks([]);
      setIsLoading(false);
  
      const weekEnd = getWeekEnd(currentWeekStart);
      console.log('散歩データ取得:', currentWeekStart, '〜', weekEnd);
  
      const walksData = await WalkService.listByDateRange(
        user.familyId,
        currentWeekStart,
        weekEnd
      );
  
      console.log('取得した散歩数:', walksData.length);
      setWalks(walksData);
    } catch (err: any) {
      console.error('散歩データ取得エラー:', err);
      
      if (err.message?.includes('network')) {
        setError('network');
      } else {
        setError('unknown');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviousWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() - 7);
    setCurrentWeekStart(newStart);
  };

  const handleNextWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() + 7);
    setCurrentWeekStart(newStart);
  };

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
  };

  const getMapRegion = () => {
    if (walks.length === 0) {
      return {
        latitude: 35.6812,
        longitude: 139.7671,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
    }

    let minLat = 90;
    let maxLat = -90;
    let minLng = 180;
    let maxLng = -180;

    walks.forEach((walk) => {
      walk.routePoints.forEach((point) => {
        minLat = Math.min(minLat, point.latitude);
        maxLat = Math.max(maxLat, point.latitude);
        minLng = Math.min(minLng, point.longitude);
        maxLng = Math.max(maxLng, point.longitude);
      });
    });

    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;
    const latDelta = (maxLat - minLat) * 1.5 || 0.01;
    const lngDelta = (maxLng - minLng) * 1.5 || 0.01;

    return {
      latitude: centerLat,
      longitude: centerLng,
      latitudeDelta: Math.max(latDelta, 0.01),
      longitudeDelta: Math.max(lngDelta, 0.01),
    };
  };

  const weekEnd = getWeekEnd(currentWeekStart);
  
  // 同日内でインデックスと色を付与
  const walksForMap = WalkMapService.enrich(walks)

  return (
    <View style={styles.container}>
      {/* 週選択ヘッダー */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePreviousWeek} style={styles.navButton}>
          <Text style={styles.navButtonText}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>
          {formatDate(currentWeekStart)} - {formatDate(weekEnd)}
        </Text>
        <TouchableOpacity onPress={handleNextWeek} style={styles.navButton}>
          <Text style={styles.navButtonText}>▶</Text>
        </TouchableOpacity>
      </View>

      {/* コンテンツ */}
      {error ? (
        <ErrorView
          type={error === 'network' ? 'network' : 'unknown'}
          onRetry={loadWalks}
        />
      ) : isLoading ? (
        <View style={styles.loadingContainer}>
          <View style={styles.mapSkeleton}>
            <Skeleton width="100%" height="100%" />
          </View>
        </View>
      ) : walks.length === 0 ? (
        <ErrorView
          type="empty"
          title="データがありません"
          message="この週の散歩記録がありません"
        />
      ) : (
        <>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={getMapRegion()}
          >
            {walksForMap.map((walk) => {
              const isAnimating = animatingWalkId === walk.walkId;
              const mainStrokeWidth = isAnimating ? 5 : 3;
              const outlineStrokeWidth = isAnimating ? 6 : 4;  // 縁は4px太く（両側2pxずつ見える）

              const coordinates = walk.routePoints.map((point) => ({
                latitude: point.latitude,
                longitude: point.longitude,
              }));

              return (
                <React.Fragment key={walk.walkId}>
                  {/* 黒い縁（下層） */}
                  <Polyline
                    coordinates={coordinates}
                    strokeColor="#000000"
                    strokeWidth={outlineStrokeWidth}
                    lineCap="round"
                    lineJoin="round"
                  />
                  
                  {/* メインの色（上層） */}
                  <Polyline
                    coordinates={coordinates}
                    strokeColor={applyOpacity(walk.color, walk.opacity)}
                    strokeWidth={mainStrokeWidth}
                    lineCap="round"
                    lineJoin="round"
                  />
                </React.Fragment>
              );
            })}

            {/* アニメーション用マーカー */}
            {markerPosition && (
              <Marker
                coordinate={markerPosition}
                anchor={{ x: 0.5, y: 0.5 }}
              >
                <View style={styles.animationMarker}>
                  <View style={styles.animationMarkerInner} />
                </View>
              </Marker>
            )}
          </MapView>

          {/* 曜日カラー */}
          <View style={styles.legend}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.legendRow}>
                {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
                  <View key={index} style={styles.legendItem}>
                    <View
                      style={[
                        styles.legendColor,
                        { backgroundColor: WEEKDAY_COLORS[index] },
                      ]}
                    />
                    <Text style={styles.legendText}>{day}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* アニメーション再生中の表示 */}
          {animatingWalkId && (
            <View style={styles.animationBanner}>
              <Text style={styles.animationBannerText}>🎬 ルートを再生中...</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  navButton: {
    padding: 8,
  },
  navButtonText: {
    fontSize: 24,
    color: '#4A90E2',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  loadingContainer: {
    flex: 1,
    padding: 16,
  },
  mapSkeleton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  legend: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    fontSize: 14,
    color: '#666666',
  },
  animationMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF0000',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  animationMarkerInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  animationBanner: {
    position: 'absolute',
    top: 16,
    left: '50%',
    transform: [{ translateX: -80 }],
    backgroundColor: 'rgba(74, 144, 226, 0.95)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  animationBannerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});