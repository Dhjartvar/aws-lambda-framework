import { isRight } from 'fp-ts/lib/Either'
import { Type } from 'io-ts'
import { injectable } from 'inversify'
import Validator from '@framework/interfaces/Validator'

@injectable()
export class InputValidator implements Validator {
  /**
   * Validate objects or JSON strings with io-ts and return them if valid
   * @returns the validated input
   */
  validate<ReturnType, Validator extends Type<ReturnType>>(input: object | string, type: Validator): ReturnType {
    if (typeof input === 'string') input = this.parseJson(input)

    let validationResult = type.decode(input)

    if (isRight(validationResult)) return validationResult.right
    else throw Error(`Received invalid input ${JSON.stringify(input)} expected to receive type ${type.name}`)
  }

  private parseJson(input: string): object {
    try {
      return JSON.parse(input)
    } catch (err) {
      throw Error(err)
    }
  }
}
