import { err, ok, type Result } from '@/domain/shared/result'
import { makeError } from '@/domain/shared/errorFactory'
import { NicknameError, NicknameErrorCodes } from '@/domain/profile/nickname.errors';

export const UserProfileService = {
  validateNickname(nickname: string): Result<void, NicknameError> {
    if (!nickname) {
      return err(makeError(NicknameErrorCodes.TooShort))
    }

    if (nickname.length > 20) {
      return err(makeError(NicknameErrorCodes.TooLong))
    }

    return ok(undefined)
  }
}