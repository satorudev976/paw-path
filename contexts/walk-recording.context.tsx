import { createContext, useState, useRef, ReactNode } from 'react';
import { LocationService } from '@/services/location.service';
import { RoutePoint } from '@/domain/entities/walk';
import { WalkService } from '@/services/walk.service';
import { useUser } from '@/hooks/use-user';

type RecordingState = 'idle' | 'recording';

interface WalkRecordingContextValue {
  state: RecordingState;
  route: RoutePoint[];
  distance: number;
  duration: number;
  currentSpeed: number;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
}

export const WalkRecordingContext = createContext<WalkRecordingContextValue | null>(null);

export const WalkRecordingProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();
  const [state, setState] = useState<RecordingState>('idle');
  const [route, setRoute] = useState<RoutePoint[]>([]);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);

  const startTimeRef = useRef<Date | null>(null);
  const intervalRef = useRef<number | null>(null);

  const startRecording = async () => {
    try {
      // 状態リセット
      setRoute([]);
      setDistance(0);
      setDuration(0);
      setCurrentSpeed(0);
      startTimeRef.current = new Date();

      // 位置情報追跡開始
      await LocationService.startLocationTracking((location) => {
        console.log('位置情報取得:', location.latitude, location.longitude);

        setRoute((prevRoute) => {
          const newRoute = [...prevRoute, location];

          // 距離の累積計算
          const totalDistance = LocationService.calculateTotalDistance(newRoute);
          setDistance(totalDistance);

          // 平均速度を計算（GPS誤差を軽減）
          if (newRoute.length >= 2 && startTimeRef.current) {
            const elapsedTime = (new Date().getTime() - startTimeRef.current.getTime()) / 1000;

            if (elapsedTime > 0) {
              const avgSpeedKmh = (totalDistance / elapsedTime) * 3.6;

              // 異常値を除外（歩行速度は通常0-15km/h）
              if (avgSpeedKmh <= 15) {
                setCurrentSpeed(avgSpeedKmh);
              }
            }
          }

          return newRoute;
        });
      });

      // 経過時間カウント開始
      intervalRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000) as unknown as number;

      setState('recording');
    } catch (error) {
      console.error('記録開始エラー:', error);
      throw error;
    }
  };

  const stopRecording = async () => {
    try {
      console.log('記録終了');

      // 位置情報追跡停止
      await LocationService.stopLocationTracking();

      // タイマー停止
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // 状態を idle に戻す
      setState('idle');

      // Firestoreに保存
      try {
        if (user) {
          const startTime = startTimeRef.current || new Date();
          const endTime = new Date();
  
          await WalkService.createWalk({
            familyId: user.familyId,
            startTime: startTime,
            endTime: endTime,
            durationSec: duration,
            distanceMeter: Math.round(distance),
            routePoints: route,
            recordedBy: user.id,
          });
  
          console.log('✅ 散歩を記録しました');
        }

        // 状態リセット
        setRoute([]);
        setDistance(0);
        setDuration(0);
        setCurrentSpeed(0);
        startTimeRef.current = null;
      } catch (error) {
        console.error('保存エラー:', error);
        throw error;
      }
    } catch (error) {
      console.error('記録停止エラー:', error);
      throw error;
    }
  };

  return (
    <WalkRecordingContext.Provider
      value={{
        state,
        route,
        distance,
        duration,
        currentSpeed,
        startRecording,
        stopRecording,
      }}
    >
      {children}
    </WalkRecordingContext.Provider>
  );
};