import { TestInput } from './constants/TestInput'
import {
  BaseLambda,
  LambdaContainer,
  InputValidator,
  Mysql,
  Property,
  LambdaError,
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyResult,
  ValidationError
} from '../../src/aws-lambda-framework'

class TestLambda extends BaseLambda {
  input: TestInput

  constructor(event: APIGatewayProxyEvent, context: Context) {
    super(event, context)
    const request = LambdaContainer.get<TestInput>(Property.EVENT_BODY)
    this.input = new TestInput(request.testString, request.testNumber)
  }

  async invoke(): Promise<any> {
    await this.validateInput()
    const res = await LambdaContainer.get(Mysql).execute({ sql: process.env.MYSQL_TEST_QUERY!, inputs: [1] })
    if (!res.success) throw new LambdaError(res.error.message, res.error.stack)
    return res.result
  }

  private async validateInput() {
    return LambdaContainer.get(InputValidator)
      .validateOrReject(this.input)
      .catch(errors => {
        throw new ValidationError(errors)
      })
  }
}

export function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  return new TestLambda(event, context).useSlack(process.env.SLACK_WEBHOOK!).handler()
}
