import * as functions from "firebase-functions"
import { InviteService } from "../../../service/invite.service"

export const verifyInvite = functions.https.onCall(
  async (token, _) => {

    const service = new InviteService()
    return await service.verifyInvite(token)
  }
)