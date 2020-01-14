import {
  BaseLambda,
  LambdaContainer,
  Mysql,
  LambdaError,
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyResult
} from '../../src/aws-lambda-framework'

interface Country {
  id: number
  name: string
  locale: string
  countryCode: number
}

class TestLambda extends BaseLambda {
  constructor(event: APIGatewayProxyEvent, context: Context) {
    super(event, context)
  }

  async invoke(): Promise<any> {
    const res = await LambdaContainer.get(Mysql).execute<Country>({ sql: 'select * from countries' })
    if (!res.success) throw new LambdaError(res.error.message, res.error.stack)
    return res.result.rows
  }
}

export function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  return new TestLambda(event, context).useSlack(process.env.SLACK_WEBHOOK!).handler()
}
