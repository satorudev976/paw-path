export interface Family {
  familyId: string
  ownerId: string
  createdAt: Date
  planStatus: 'active' | 'readOnly'
  memberLimit: number
  trialEndAt: Date
  trialUsed: boolean
}
