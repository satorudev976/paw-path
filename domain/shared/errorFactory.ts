import type { AppError } from './appError'

export const makeError = <C extends string>(
  code: C,
  opts?: Omit<AppError<C>, 'code'>
): AppError<C> => ({ code, ...(opts ?? {}) })