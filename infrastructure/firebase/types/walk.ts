import { Timestamp } from 'firebase/firestore';

export interface Walk {
  familyId: string
  recordedBy: string
  startTime: Timestamp
  endTime: Timestamp
  durationSec: number
  distanceMeter: number
  routePoints: RoutePoint[]
}

interface RoutePoint {
  latitude: number;        // 緯度
  longitude: number;        // 経度
  timestamp: number;  // Unix timestamp (ms)
}