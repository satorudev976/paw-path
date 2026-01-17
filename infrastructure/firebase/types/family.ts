export interface Family {
  ownerId: string
  createdAt: Date
  planStatus: 'active' | 'readOnly'
  memberLimit: number
  trialEndAt: Date
  trialUsed: boolean
}
