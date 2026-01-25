import * as functions from "firebase-functions"
import { InviteService } from "../../../service/invite.service"

export const createInvite = functions.https.onCall(
  async (_, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError("unauthenticated", "認証が必要です")
    }

    const service = new InviteService(context.auth.uid)
    return await service.createInvite()
  }
)