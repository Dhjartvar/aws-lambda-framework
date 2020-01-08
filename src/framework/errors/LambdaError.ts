import { LambdaContainer, APIGatewayProxyEvent, Property, Context, HttpStatusCode } from '../../aws-lambda-framework'

export class LambdaError extends Error {
  statusCode: number
  context: Context = LambdaContainer.get<Context>(Property.CONTEXT)
  event: APIGatewayProxyEvent = LambdaContainer.get<APIGatewayProxyEvent>(Property.EVENT)
  errorMessage: string
  stackTrace?: string = this.stack
  userMessage: string
  constructor(
    errorMessage: string = `Lambda function ${LambdaContainer.get<Context>(Property.CONTEXT).functionName} failed.`,
    stackTrace?: string,
    userMessage: string = `Failed to run ${LambdaContainer.get<Context>(Property.CONTEXT).functionName}!`,
    statusCode: number = HttpStatusCode.InternalServerError
  ) {
    super(errorMessage)
    this.errorMessage = errorMessage
    if (stackTrace) this.stackTrace = stackTrace
    this.userMessage = userMessage
    this.statusCode = statusCode
  }
}
