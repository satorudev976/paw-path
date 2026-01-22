import { db } from "../lib/firebase"
import { User } from "../domain/user"


export class UserRepository {
  private col = db.collection("users")

  async find(userId: string): Promise<User | null> {
    const snap = await this.col.doc(userId).get()
    return snap.exists ? (snap.data() as User) : null
  }

}
