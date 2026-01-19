export interface Walk {
  walkId: string;
  familyCode: string;
  startTime: Date;
  endTime: Date;
  duration: number; // 秒
  distance: number; // メートル
  route: RoutePoint[];
  recordedBy?: string; // ユーザーID
}

interface RoutePoint {
  latitude: number;
  longitude: number;
  timestamp: Date;
}
