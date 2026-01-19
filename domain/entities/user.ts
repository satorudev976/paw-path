export type User = {
  id: string
  familyId: string
  role: 'owner' | 'member'
  nickname: string
  createdAt: Date
}