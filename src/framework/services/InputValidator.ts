import { Validator } from 'class-validator/validation/Validator'
import { injectable } from 'inversify'
import 'reflect-metadata'

@injectable()
export class InputValidator extends Validator {}
