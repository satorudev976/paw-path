export type User = {
  id: string
  familyId: string
  role: 'owner' | 'member'
  createdAt: Date
}