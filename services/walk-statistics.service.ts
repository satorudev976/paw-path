import { Walk } from '@/domain/entities/walk';
import { User } from '@/domain/entities/user';

export interface WalkRanking {
  userId: string;
  nickname: string;
  count: number; // 散歩回数
  totalDistance: number; // 散歩距離
  totalDuration: number; // 散歩時間
}

export interface WalkStats {
  count: number;
  totalDistance: number;
  avgDistance: number;
  avgDuration: number;
}

export const WalkStatisticsService = {

  /**
   * 散歩データから統計を計算
   */
  calculateStats(walks: Walk[]): WalkStats {
    if (walks.length === 0) {
      return {
        count: 0,
        totalDistance: 0,
        avgDistance: 0,
        avgDuration: 0,
      };
    }

    const totalDistance = walks.reduce((sum, walk) => sum + walk.distanceMeter, 0);
    const totalDuration = walks.reduce((sum, walk) => sum + walk.durationSec, 0);

    return {
      count: walks.length,
      totalDistance: totalDistance,
      avgDistance: totalDistance / walks.length,
      avgDuration: totalDuration / walks.length,
    };
  },


    /**
   * 散歩データと家族ユーザーからランキングを計算
   */
  calculateRanking(walks: Walk[], users: User[]): WalkRanking[] {
    const userMap = new Map(users.map(u => [u.id, u.nickname]));

    const statsMap = new Map<string, { count: number; totalDistance: number; totalDuration: number }>();
    
    walks.forEach((walk) => {
      const userId = walk.recordedBy || 'unknown';
      
      const current = statsMap.get(userId) || {
        count: 0,
        totalDistance: 0,
        totalDuration: 0,
      };
      
      current.count++;
      current.totalDistance += walk.distanceMeter;
      current.totalDuration += walk.durationSec;
      
      statsMap.set(userId, current);
    });
    
    const rankings: WalkRanking[] = Array.from(statsMap.entries()).map(([userId, stats]) => ({
      userId,
      nickname: userMap.get(userId) || '不明',
      count: stats.count,
      totalDistance: stats.totalDistance,
      totalDuration: stats.totalDuration,
    }));
    
    // 総距離でソート
    rankings.sort((a, b) => b.totalDistance - a.totalDistance);
    return rankings;
  },
}