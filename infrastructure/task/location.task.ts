import * as TaskManager from 'expo-task-manager';
import { RoutePoint } from '@/domain/entities/walk';
// タスク名を定数としてエクスポート
export const BACKGROUND_LOCATION_TASK_NAME = 'background-location-task';

// コールバック関数を保持
let locationCallback: ((location: RoutePoint) => void) | null = null;

/**
 * 位置情報を受け取るコールバックを設定
 * @param callback 位置情報を受け取るコールバック関数（nullでクリア）
 */
export const setLocationCallback = (
  callback: ((location: RoutePoint) => void) | null
) => {
  locationCallback = callback;
};


TaskManager.defineTask(
  BACKGROUND_LOCATION_TASK_NAME,
  async ({ data, error }: any) => {
    if (error) {
      console.error('バックグラウンド位置情報エラー:', error);
      return;
    }

    if (data) {
      const { locations } = data;
      console.log(`🌍 位置情報取得（BG含む）: ${locations.length}個`);

      if (!locationCallback) {
        return;
      }

      // ローカル変数に保存（forEach内でのnullチェックを避けるため）
      const callback = locationCallback;

      // 各位置情報をコールバックに渡す
      locations.forEach((location: any) => {
        const point: RoutePoint = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          timestamp: new Date(location.timestamp),
        };
        callback(point);
      });
    }
  }
);