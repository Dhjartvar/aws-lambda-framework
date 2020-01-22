import {
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyResult,
  BaseLambda,
  LambdaError,
  LambdaContainer,
  Validator,
  ValidationError
} from '../../src/aws-lambda-framework'
import { TestInput } from './constants/TestInput'

export default class ValidationErrorLambda extends BaseLambda {
  input: TestInput

  constructor(event: APIGatewayProxyEvent, context: Context) {
    super(event, context)
    this.input = new TestInput('a string that is too long', 5)
  }

  async invoke(): Promise<any> {
    await this.validateInput()
    throw new LambdaError()
  }

  private async validateInput() {
    return LambdaContainer.get(Validator)
      .validateOrReject(this.input)
      .catch(errors => {
        throw new ValidationError(errors)
      })
  }
}

export function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  return new ValidationErrorLambda(event, context).handler()
}
