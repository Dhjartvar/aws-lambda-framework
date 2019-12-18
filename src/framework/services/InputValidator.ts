import { isRight } from 'fp-ts/lib/Either'
import { Type } from 'io-ts'
import { inspect } from 'util'
import Validator from '../interfaces/Validator'
import { injectable } from 'inversify'

@injectable()
export default class InputValidator implements Validator {
  /**
   * Validate objects or JSON strings with io-ts and return them if valid
   * @returns the validated input
   */
  validate<ReturnType, Validator extends Type<ReturnType>>(input: object, type: Validator): ReturnType {
    if (!input) throw `Invalid input: ${input}`
    if (typeof input === 'string') input = this.parseJson(input)

    let validationResult = type.decode(input)

    if (isRight(validationResult)) return validationResult.right
    else throw `Could not parse input: ${inspect(input)}`
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
