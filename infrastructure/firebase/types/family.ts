export interface Family {
  createdAt: Date
  planStatus: 'active' | 'readOnly'
  trialEndAt: Date
  trialUsed: boolean
}
