export type Family = {
  id: string
  createdAt: Date
  planStatus: 'active' | 'readOnly'
  trialEndAt: Date
  trialUsed: boolean
}
