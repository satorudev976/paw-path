import { InviteRepository } from "../repository/invite-repository"
import { UserRepository } from "../repository/user-repository"
import { randomUUID } from "crypto"

export class InviteService {
  private inviteRepo = new InviteRepository()
  private userRepo = new UserRepository()

  constructor(private userId?: string) {}

  async createInvite() {
    if (!this.userId) throw new Error("unauthenticated")

    const user = await this.userRepo.find(this.userId)
    if (user?.role !== 'owner') throw new Error("permission-denied")

    const inviteId = randomUUID()
    const now = new Date()

    await this.inviteRepo.create({
      token: inviteId,
      familyId: user.familyId,
      createdBy: this.userId,
      createdAt: now,
      expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000), // 1日
      isActive: true,
    })

    return { inviteId }
  }

  async verifyInvite(token: string): Promise<boolean> {
    const invite = await this.inviteRepo.find(token)
    if (!invite) return false
    if (!invite.isActive) return false
    if (invite.expiresAt < new Date()) return false
    return true
  }

  async acceptInvite(token: string, nickname: string) {
    if (!this.userId) throw new Error("unauthenticated")

    const invite = await this.inviteRepo.find(token)
    if (!invite) throw new Error("not-found")

    await this.inviteRepo.joinByInvite(invite, this.userId, nickname)
  }
}
