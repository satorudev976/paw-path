import { CloudFunction } from "../function/functions.client";

export const inviteRepository = {

  async createInvite(): Promise<string> {
    const result = await CloudFunction.call("createInvite", {})
    return result.inviteId
  },

  async acceptInvite(token: string): Promise<void> {
    await CloudFunction.call("acceptInvite", { token })
  }

};
