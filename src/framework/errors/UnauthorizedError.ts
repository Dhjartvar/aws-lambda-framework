import { HttpStatusCode } from '../enums/HttpStatusCode'
import { LambdaError } from './LambdaError'

export class UnauthorizedError extends LambdaError {
  constructor(
    errorMessage: string = 'Unauthorized User. Ensure that user is in the correct cognito user group.',
    userMessage: string = 'User is not authorized!',
    statusCode: number = HttpStatusCode.Unauthorized
  ) {
    super(errorMessage, userMessage, statusCode)
  }
}
