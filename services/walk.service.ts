import { Walk, CreateWalk } from "@/domain/entities/walk";
import { walkRepository } from "@/infrastructure/firebase/repositories/walk.repository";
import { getWeekStart, getWeekEnd, getMonthStart, getMonthEnd} from '@/utils/date';

export const WalkService = {

  async listByDateRange(
    familyId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Walk[]> {
    const walks = await walkRepository.getWalksByDateRange(
      familyId, startDate, endDate
    );
    return walks;
  },

  async listByPeriod(
    familyId: string,
    period: 'week' | 'month'
  ): Promise<Walk[]> {
    const now = new Date();

    const startDate = period === 'week' 
      ? getWeekStart(now)
      : getMonthStart(now);

    const endDate = period === 'week' 
      ? getWeekEnd(now)
      : getMonthEnd(now);

    const walks = await walkRepository.getWalksByDateRange(
      familyId, startDate, endDate
    );
    return walks
  },

  async createWalk(
    walk: CreateWalk
  ): Promise<void> {
    
    await walkRepository.addWalk(walk)
  },

  async delete(walkId: string): Promise<void> {
    await walkRepository.deleteWalk(walkId);
  }
}