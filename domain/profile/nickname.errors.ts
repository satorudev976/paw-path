import type { AppError } from '@/domain/shared/appError'

export const NicknameErrorCodes = {
  TooShort: 'nickname-too-short',
  TooLong: 'nickname-too-long',
} as const

export type NicknameErrorCode =
  typeof NicknameErrorCodes[keyof typeof NicknameErrorCodes]

export type NicknameError = AppError<NicknameErrorCode>