import {
  BaseLambda,
  LambdaContainer,
  Mysql,
  LambdaError,
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyResult
} from '../../src/aws-lambda-framework'

class TestLambda extends BaseLambda {
  constructor(event: APIGatewayProxyEvent, context: Context) {
    super(event, context)
  }

  async invoke(): Promise<any> {
    const res = await LambdaContainer.get(Mysql).execute({ sql: process.env.MYSQL_TEST_QUERY!, inputs: [1] })
    if (!res.success) throw new LambdaError(res.error.message, res.error.stack)
    return res.result
  }
}

export function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  return new TestLambda(event, context).useSlack(process.env.SLACK_WEBHOOK!).handler()
}
