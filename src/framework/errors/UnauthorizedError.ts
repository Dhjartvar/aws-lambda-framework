import { LambdaError, HttpStatusCode } from '../../aws-lambda-framework'

export class UnauthorizedError extends LambdaError {
  constructor(
    errorMessage: string = 'Unauthorized User. Ensure that user is in the correct cognito user group.',
    stackTrace?: string,
    userMessage: string = 'User is not authorized!',
    statusCode: number = HttpStatusCode.Unauthorized
  ) {
    super(errorMessage, stackTrace, userMessage, statusCode)
  }
}
