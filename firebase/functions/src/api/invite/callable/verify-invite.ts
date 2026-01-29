import * as functions from "firebase-functions"
import { InviteService } from "../../../service/invite.service"

export const verifyInvite = functions.region('asia-northeast1').https.onCall(
  async (data, _) => {
    const token =
      typeof data?.token === "string" ? data.token.trim() : ""

    if (!token) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "token is required"
      )
    }

    const service = new InviteService()
    return await service.verifyInvite(token)
  }
)