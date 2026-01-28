export type AppError<C extends string> = {
  code: C
  cause?: unknown
  meta?: Record<string, unknown>
}