import {
  APIGatewayLambda,
  LambdaContainer,
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyResult,
  Mysql,
  LambdaError,
  SlackNotifier
} from '../../src/aws-lambda-framework'

interface Country {
  id: number
  name: string
  locale: string
  countryCode: number
}

class TestLambda extends APIGatewayLambda {
  constructor(event: APIGatewayProxyEvent, context: Context) {
    super(event, context)
  }

  async invoke(): Promise<object> {
    try {
      await LambdaContainer.get(SlackNotifier).notify('TEST')
      const res = await LambdaContainer.get(Mysql).execute<Country>({
        sql: process.env.MYSQL_TEST_QUERY!,
        inputs: [1]
      })

      return {
        userMessage: 'Successfully tested Lambda!',
        data: res.rows
      }
    } catch (err) {
      throw new LambdaError(err.message, err.stack, 'Failed to Test Lambda!')
    }
  }
}

export function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  return new TestLambda(event, context).handler()
}
