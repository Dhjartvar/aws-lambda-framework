import { Type } from 'io-ts'

export default interface Validator {
  validate<ReturnType, Validator extends Type<ReturnType>>(input: object, type: Validator): ReturnType
}
