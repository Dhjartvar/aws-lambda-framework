import { Validator as ClassValidator } from 'class-validator/validation/Validator'
import { injectable } from 'inversify'
import 'reflect-metadata'

@injectable()
export class Validator extends ClassValidator {}
