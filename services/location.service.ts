import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import {
  setLocationCallback,
  BACKGROUND_LOCATION_TASK_NAME,
} from '@/infrastructure/task/location.task';

export interface LocationPoint {
  latitude: number;
  longitude: number;
  timestamp: Date;
  accuracy?: number;
}

export const LocationService = {
  /**
   * バックグラウンド位置情報追跡を開始
   * @param callback 位置情報を受け取るコールバック関数
   */
  startLocationTracking: async (
    callback: (location: LocationPoint) => void
  ): Promise<void> => {
    try {
      // コールバックを設定
      setLocationCallback(callback);

      // 既にタスクが登録されているか確認
      const isRegistered = await TaskManager.isTaskRegisteredAsync(
        BACKGROUND_LOCATION_TASK_NAME
      );

      if (isRegistered) {
        console.log('⚠️ タスクは既に登録済み。一旦停止します');
        await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK_NAME);
      }

      console.log('散歩記録開始 - 位置情報追跡を開始します');

      // バックグラウンドでも動作する位置情報追跡を開始
      await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000, // 5秒ごと
        distanceInterval: 10, // 10m移動ごと
        deferredUpdatesInterval: 5000,
        activityType: Location.ActivityType.Fitness, // フィットネス活動として最適化
        pausesUpdatesAutomatically: true,
        showsBackgroundLocationIndicator: true, // iOSでバックグラウンド使用中を明示
        foregroundService: {
          notificationTitle: '散歩記録中',
          notificationBody: '位置情報を記録しています',
        },
      });

      console.log('位置情報追跡を開始しました');
    } catch (error) {
      console.error('位置情報監視エラー:', error);
      setLocationCallback(null);
      throw error;
    }
  },

  /**
   * 位置情報追跡を停止
   */
  stopLocationTracking: async (): Promise<void> => {
    try {
      console.log('🛑 位置情報追跡を停止します');

      // タスクが登録されているか確認
      const isRegistered = await TaskManager.isTaskRegisteredAsync(
        BACKGROUND_LOCATION_TASK_NAME
      );

      if (isRegistered) {
        await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK_NAME);
      }

      // コールバックをクリア
      setLocationCallback(null);

      console.log('位置情報追跡を停止しました');
    } catch (error) {
      console.error('位置情報追跡停止エラー:', error);
      throw error;
    }
  },

  async getCurrentLocation(): Promise<LocationPoint | null> {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
  
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        timestamp: new Date(location.timestamp),
        accuracy: location.coords.accuracy || undefined,
      };
    } catch (error) {
      console.error('現在位置取得エラー:', error);
      return null;
    }
  },

  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371e3; // 地球の半径(メートル)
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return R * c;
  },

  calculateTotalDistance(route: LocationPoint[]): number {
    if (route.length < 2) return 0;
  
    let totalDistance = 0;
    for (let i = 1; i < route.length; i++) {
      const distance = this.calculateDistance(
        route[i - 1].latitude,
        route[i - 1].longitude,
        route[i].latitude,
        route[i].longitude
      );
      totalDistance += distance;
    }
  
    return totalDistance;
  }
  
}