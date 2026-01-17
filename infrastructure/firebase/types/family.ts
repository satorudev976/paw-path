export interface Family {
  ownerId: string
  createdAt: Date
  planStatus: 'active' | 'readOnly'
  trialEndAt: Date
  trialUsed: boolean
}
