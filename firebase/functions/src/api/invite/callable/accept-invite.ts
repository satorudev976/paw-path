import * as functions from "firebase-functions"
import { InviteService } from "../../../service/invite.service"

export const acceptInvite = functions.https.onCall(
  async ({ token }, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError("unauthenticated", "認証が必要です")
    }

    const service = new InviteService(context.auth.uid)
    await service.acceptInvite(token)
  }
)
