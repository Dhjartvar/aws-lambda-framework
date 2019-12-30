import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda'
import { BaseLambda } from '../../src/aws-lambda-framework'

export default class FailingLambda extends BaseLambda {
  constructor(event: APIGatewayProxyEvent, context: Context) {
    super(event, context)
  }

  async invoke(): Promise<any> {
    throw Error('hallo')
  }
}

export function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  return new FailingLambda(event, context).handler()
}
