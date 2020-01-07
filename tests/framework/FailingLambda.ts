import {
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyResult,
  BaseLambda,
  LambdaError
} from '../../src/aws-lambda-framework'

export default class FailingLambda extends BaseLambda {
  constructor(event: APIGatewayProxyEvent, context: Context) {
    super(event, context)
  }

  async invoke(): Promise<any> {
    throw new LambdaError()
  }
}

export function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  return new FailingLambda(event, context).handler()
}
