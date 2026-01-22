export interface Walk {
  walkId: string;
  familyId: string;
  startTime: Date;
  endTime: Date;
  durationSec: number; // 秒
  distanceMeter: number; // メートル
  routePoints: RoutePoint[];
  recordedBy?: string; // ユーザーID
}

interface RoutePoint {
  latitude: number;
  longitude: number;
  timestamp: Date;
}
