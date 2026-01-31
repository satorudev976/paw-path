import { getFunctions, httpsCallable } from "firebase/functions"

const functions = getFunctions(undefined, 'asia-northeast1')

export const CloudFunction = {
  async call(name: string, payload: any) {
    const callable = httpsCallable(functions, name)
    const result = await callable(payload)
    return result.data as any
  }
}