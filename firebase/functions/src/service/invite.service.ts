import { InviteRepository } from "../repository/invite-repository"
import { Timestamp } from 'firebase-admin/firestore'

type VerifyResult =
  | { valid: true }
  | { valid: false; reason: 'notFound' | 'inactive' | 'expired' }

export class InviteService {
  private inviteRepo = new InviteRepository()

  async verifyInvite(token: string): Promise<VerifyResult> {
    const invite = await this.inviteRepo.find(token)
    if (!invite) return { valid: false, reason: 'notFound' }
    if (!invite.isActive) return { valid: false, reason: 'inactive' }
  
    const expiresAt =
      invite.expiresAt instanceof Timestamp
        ? invite.expiresAt.toMillis()
        : new Date(invite.expiresAt).getTime()
  
    if (expiresAt < Date.now()) return { valid: false, reason: 'expired' }
  
    return { valid: true }
  }

}