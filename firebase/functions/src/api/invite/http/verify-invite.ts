import * as functions from "firebase-functions"
import { InviteService } from "../../../service/invite.service"

export const verifyInvite = functions.https.onRequest(
  async (req, res) => {
    const token = req.query.token as string
    if (!token) {
      res.status(400).json({ ok: false })
      return
    }

    const service = new InviteService()
    const ok = await service.verifyInvite(token)

    res.json({ ok })
  }
)
