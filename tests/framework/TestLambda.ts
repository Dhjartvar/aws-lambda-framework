import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda'
import { TestRequestType, TestRequest } from './constants/TestRequest'
import { BaseLambda, LambdaContainer, InputValidator, Aurora, Redshift, Property } from '../../src/aws-lambda-framework'

class TestLambda extends BaseLambda {
  request: TestRequest

  constructor(event: APIGatewayProxyEvent, context: Context) {
    super(event, context)
    this.request = LambdaContainer.get(InputValidator).validate(
      LambdaContainer.get<object>(Property.EVENT_BODY),
      TestRequestType
    )
  }

  async invoke(): Promise<any> {
    await LambdaContainer.get(Aurora).execute(process.env.AURORA_TEST_QUERY!, [1])
    return LambdaContainer.get(Redshift).execute(process.env.REDSHIFT_TEST_QUERY!, [1])
  }
}

export function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  return new TestLambda(event, context).useSlack(process.env.SLACK_WEBHOOK!).handler()
}
