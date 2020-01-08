import { LambdaError, HttpStatusCode } from '../../aws-lambda-framework'

export class ValidationError extends LambdaError {
  validationErrors: any[]
  constructor(
    validationErrors: any[],
    errorMessage: string = 'Invalid input. Check validationErrors property for more information.',
    stackTrace?: string,
    userMessage: string = 'Invalid input!',
    statusCode: number = HttpStatusCode.BadRequest
  ) {
    super(errorMessage, stackTrace, userMessage, statusCode)
    this.validationErrors = validationErrors
  }
}
