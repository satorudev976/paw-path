import type { AppError } from '@/domain/shared/appError'

export const InviteErrorCodes = {
  InvalidToken: 'invite-invalid-token',
  Expired: 'invite-expired',
  AlreadyUsed: 'invite-already-used',
  Unknown: 'unknown',
} as const

export type InviteErrorCode =
  typeof InviteErrorCodes[keyof typeof InviteErrorCodes]

export type InviteError = AppError<InviteErrorCode>