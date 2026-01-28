import type { AppError } from '@/domain/shared/appError'

export const UserErrorCodes = {
  AlreadyInFamily: 'already-in-family',
  Unknown: 'unknown',
} as const

export type UserErrorCode =
  typeof UserErrorCodes[keyof typeof UserErrorCodes]

export type UserError = AppError<UserErrorCode>