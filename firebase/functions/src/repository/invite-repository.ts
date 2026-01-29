import { db } from '../lib/firebase'
import { Invite } from '../domain/invite'


export class InviteRepository {
  private col = db.collection('invites')

  async find(token: string): Promise<Invite | null> {
    const snap = await this.col.doc(token).get()
    return snap.exists ? (snap.data() as Invite) : null
  }

}