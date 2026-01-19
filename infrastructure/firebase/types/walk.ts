import { Timestamp } from 'firebase/firestore';

export interface Walk {
  familyId: string
  recordedBy: string
  startTime: Timestamp
  endTime: Timestamp
  durationSec: number
  distanceMeter: number
  routePoints: RoutePoint[]
  createdAt: Timestamp
}

interface RoutePoint {
  lat: number;        // 緯度
  lng: number;        // 経度
  timestamp: number;  // Unix timestamp (ms)
}