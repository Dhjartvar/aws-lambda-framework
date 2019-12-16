import { Service } from 'typedi'
import { isRight } from 'fp-ts/lib/Either'
import * as t from 'io-ts'
import { inspect } from 'util'

@Service()
export default class Validator {
  /**
   * Validate objects or JSON strings with io-ts and return them if valid
   * @returns the validated input
   */
  validate<ReturnType, Validator extends t.Type<ReturnType>>(
    input: object | string | null,
    type: Validator
  ): ReturnType {
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
