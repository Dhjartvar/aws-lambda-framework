import { HttpStatusCode } from '../enums/HttpStatusCode'
import { LambdaError } from './LambdaError'

export class ValidationError extends LambdaError {
  validationErrors: any[]
  constructor(
    validationErrors: any[],
    errorMessage: string = 'Invalid input. Check validationErrors property for more information.',
    userMessage: string = 'Invalid input!',
    statusCode: number = HttpStatusCode.BadRequest
  ) {
    super(errorMessage, userMessage, statusCode)
    this.validationErrors = validationErrors
  }
}
