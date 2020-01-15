import {
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyResult,
  BaseLambda,
  LambdaError,
  LambdaContainer,
  Mysql
} from '../../src/aws-lambda-framework'

export default class ErrorLambda extends BaseLambda {
  constructor(event: APIGatewayProxyEvent, context: Context) {
    super(event, context)
  }

  async invoke(): Promise<any> {
    await LambdaContainer.get(Mysql).execute({ sql: 'bad sql' })
  }
}

export function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  return new ErrorLambda(event, context).handler()
}
