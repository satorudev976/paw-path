import type { AppError } from '@/domain/shared/appError'

export const UserDeleteErrorCodes = {
  OwnerHasMembers: 'owner-has-members',
  Unknown: 'unknown',
} as const

export type UserDeleteErrorCode =
  typeof UserDeleteErrorCodes[keyof typeof UserDeleteErrorCodes]

export type UserDeleteError = AppError<UserDeleteErrorCode>