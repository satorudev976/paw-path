import { InviteRepository } from "../repository/invite-repository"

export class InviteService {
  private inviteRepo = new InviteRepository()

  async verifyInvite(token: string): Promise<boolean> {
    const invite = await this.inviteRepo.find(token)
    if (!invite) return false
    if (!invite.isActive) return false
    if (invite.expiresAt < new Date()) return false
    return true
  }

}