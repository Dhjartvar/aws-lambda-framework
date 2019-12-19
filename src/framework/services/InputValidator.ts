import { isRight } from 'fp-ts/lib/Either'
import { Type } from 'io-ts'
import { injectable } from 'inversify'
import Validator from '@framework/interfaces/Validator'
import { INVALID_INPUT_ERROR } from '@framework/constants/Errors'

@injectable()
export default class InputValidator implements Validator {
  /**
   * Validate objects or JSON strings with io-ts and return them if valid
   * @returns the validated input
   */
  validate<ReturnType, Validator extends Type<ReturnType>>(input: object, type: Validator): ReturnType {
    if (!input) throw INVALID_INPUT_ERROR(input, type)
    if (typeof input === 'string') input = this.parseJson(input)

    let validationResult = type.decode(input)

    if (isRight(validationResult)) return validationResult.right
    else throw INVALID_INPUT_ERROR(input, type)
  }

  private parseJson(input: string): object {
    try {
      return JSON.parse(input)
    } catch (e) {
      console.warn(e)
      throw e
    }
  }
}
