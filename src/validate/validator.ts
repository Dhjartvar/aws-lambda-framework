import { isRight } from 'fp-ts/lib/Either'
import * as t from 'io-ts'
import { inspect } from 'util'

function parseJson(input: string): object {
  try {
    return JSON.parse(input)
  } catch (e) {
    console.warn(e)
    throw e
  }
}
/**
 * Validate objects or JSON strings with io-ts and return them if valid
 * @param input
 * @param type
 */
export function validate<ReturnType, Validator extends t.Type<ReturnType>>(
  input: object | string | null,
  type: Validator
): ReturnType {
  if (!input) throw `Invalid input: ${input}`
  if (typeof input === 'string') input = parseJson(input)

  const validationResult = type.decode(input)

  if (isRight(validationResult)) return validationResult.right
  else throw `Could not parse input: ${inspect(input)}`
}
