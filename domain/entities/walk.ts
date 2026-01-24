export type Walk = {
  walkId: string;
  familyId: string;
  startTime: Date;
  endTime: Date;
  durationSec: number; // 秒
  distanceMeter: number; // メートル
  routePoints: RoutePoint[];
  recordedBy: string; // ユーザーID
}

export type RoutePoint = {
  latitude: number;
  longitude: number;
  timestamp: Date;
}

export type CreateWalk = Omit<Walk, 'walkId'>;