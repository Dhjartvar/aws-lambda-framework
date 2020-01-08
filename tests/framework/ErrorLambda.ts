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
    const res = await LambdaContainer.get(Mysql).execute({ sql: 'bad sql' })
    if (!res.success) throw new LambdaError(res.error.message, res.error.stack)
  }
}

export function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  return new ErrorLambda(event, context).handler()
}
