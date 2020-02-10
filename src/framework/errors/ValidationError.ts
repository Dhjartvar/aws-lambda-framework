import { LambdaError, HttpStatusCode } from '../../aws-lambda-framework'

export class ValidationError extends LambdaError {
  validationErrors: any[]
  constructor(
    validationErrors: any[],
    errorMessage = 'Invalid input. Check validationErrors property for more information.',
    stackTrace?: string,
    userMessage = 'Invalid input!',
    statusCode = HttpStatusCode.BadRequest
  ) {
    super(errorMessage, stackTrace, userMessage, statusCode)
    this.validationErrors = validationErrors
  }
}
