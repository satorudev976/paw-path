import { Walk } from "@/domain/entities/walk";
import { walkRepository } from "@/infrastructure/firebase/repositories/walk.repository";

export const WalkService = {

  async listByDateRange(
    familyId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Walk[]> {
    const walks = await walkRepository.getWalksByDateRange(
      familyId, startDate, endDate
    );
    return walks
  },

  async delete(walkId: string): Promise<void> {
    await walkRepository.deleteWalk(walkId);
  }
}