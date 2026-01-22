import * as admin from "firebase-admin"
import { db } from "../lib/firebase"
import { Invite } from "../domain/invite"


export class InviteRepository {
  private col = db.collection("invites")

  async create(invite: Invite) {
    await this.col.doc(invite.id).set(invite)
  }

  async find(token: string): Promise<Invite | null> {
    const snap = await this.col.doc(token).get()
    return snap.exists ? (snap.data() as Invite) : null
  }

  async joinByInvite(invite: Invite, userId: string, nickname: string) {
    const inviteRef = this.col.doc(invite.id)
    const userRef = db.collection("users").doc(userId)

    await db.runTransaction(async tx => {
      const snap = await tx.get(inviteRef)
      if (!snap.exists || !snap.data()?.isActive) {
        throw new Error("invalid-invite")
      }

      // 家族参加ユーザーの作成
      tx.set(
        userRef,
        {
          familyId: invite.familyId,
          role: "family",
          nickname,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      )

      // 招待を消費
      tx.update(inviteRef, { isActive: false })
    })
  }
}
