import { WalkService } from '@/services/walk.service';
import { UserService } from '@/services/user.service';

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

  async getStatisicsByFamily(
    familyId: string,
    period: 'week' | 'month'
  ): Promise<WalkStats> {

    const walks = await WalkService.listByPeriod(familyId, period);

    if (walks.length === 0) {
      return {
        count: 0,
        totalDistance: 0,
        avgDistance: 0,
        avgDuration: 0,
      }
    }

    const totalDistance = walks.reduce((sum, walk) => sum + walk.distanceMeter, 0);
    const totalDuration = walks.reduce((sum, walk) => sum + walk.durationSec, 0);

    return {
      count: walks.length,
      totalDistance: totalDistance,
      avgDistance: totalDistance / walks.length,
      avgDuration: totalDuration / walks.length,
    }
  },


  async getFamilyRanking(
    familyId: string,
    period: 'week' | 'month'
  ): Promise<WalkRanking[]> {
    const walks = await WalkService.listByPeriod(familyId, period);

    const users = await UserService.getFamilyUsers(familyId);
    const userMap = new Map(users.map(u => [u.id, u.nickname]));

    const statsMap = new Map<string, { count: number; totalDistance: number; totalDuration: number }>()
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
    
    const statistics: WalkRanking[] = Array.from(statsMap.entries()).map(([userId, stats]) => ({
      userId,
      nickname: userMap.get(userId) || '不明',
      count: stats.count,
      totalDistance: stats.totalDistance,
      totalDuration: stats.totalDuration,
    }));
    
    // 総距離でソート
    statistics.sort((a, b) => b.totalDistance - a.totalDistance);
    return statistics
  }
}