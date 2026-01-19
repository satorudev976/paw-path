export type User = {
  id: string
  familyId: string
  role: 'owner' | 'family'
  nickname: string
  createdAt: Date
}