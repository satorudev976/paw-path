import { WalkService } from '@/services/walk.service';
import { UserService } from '@/services/user.service';

export interface UserWalkStatistics {
  userId: string;
  nickname: string;
  count: number;
  totalDistance: number;
  totalDuration: number;
}

export const WalkStatisticsService = {


  async getWalkFamilyRanking(
    familyId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<UserWalkStatistics[]> {
    const walks = await WalkService.listByDateRange(familyId, startDate, endDate);

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
      
      const statistics: UserWalkStatistics[] = Array.from(statsMap.entries()).map(([userId, stats]) => ({
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