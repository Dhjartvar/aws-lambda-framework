import { LambdaContainer, APIGatewayProxyEvent, Property, Context } from '../../aws-lambda-framework'
import { HttpStatusCode } from '@framework/enums/HttpStatusCode'

export class LambdaError extends Error {
  statusCode: number
  context: Context = LambdaContainer.get<Context>(Property.CONTEXT)
  event: APIGatewayProxyEvent = LambdaContainer.get<APIGatewayProxyEvent>(Property.EVENT)
  errorMessage: string
  stackTrace?: string = this.stack
  userMessage: string
  constructor(
    errorMessage: string = `Lambda function ${LambdaContainer.get<Context>(Property.CONTEXT).functionName} failed.`,
    userMessage: string = `Failed to run ${LambdaContainer.get<Context>(Property.CONTEXT).functionName}!`,
    statusCode: number = HttpStatusCode.InternalServerError
  ) {
    super(errorMessage)
    this.errorMessage = errorMessage
    this.userMessage = userMessage
    this.statusCode = statusCode
  }
}
