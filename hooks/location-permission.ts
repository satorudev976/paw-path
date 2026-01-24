import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export function useLocationPermission() {
  const [canGps, setCanGps] = useState(false);

  useEffect(() => {
    initPermission();
  }, []);

  const initPermission = async () => {
    const hasPermission = await hasLocationPermission();
    
    if (!hasPermission) {
      await requestPermission();
    }
  };

  const hasLocationPermission = async (): Promise<boolean> => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      const granted = status === 'granted';
      setCanGps(granted);
      return granted;
    } catch (error) {
      console.error('位置情報権限確認エラー:', error);
      setCanGps(false);
      return false;
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    try {
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      
      if (foregroundStatus !== 'granted') {
        setCanGps(false);
        return false;
      }

      // バックグラウンド権限もリクエスト
      await Location.requestBackgroundPermissionsAsync();
      
      setCanGps(true);
      return true;
    } catch (error) {
      console.error('位置情報権限リクエストエラー:', error);
      setCanGps(false);
      return false;
    }
  };

  return {
    canGps,
    requestPermission,
  };
}