import { Validator } from 'class-validator/validation/Validator'
import { injectable } from 'inversify'

@injectable()
export class InputValidator extends Validator {}
