import { inviteRepository } from "@/infrastructure/firebase/repositories/invite.repository"

export const InviteService = {
  
  async createInvite(): Promise<string> {
    return await inviteRepository.createInvite()
  },

  async acceptInvite(token: string): Promise<void> {
    await inviteRepository.acceptInvite(token)
  }

}