import { APIGatewayLambda, APIGatewayProxyEvent, Context } from '../../src/aws-lambda-framework'

class BasicAPIGatewayLambda extends APIGatewayLambda {
  constructor(event: APIGatewayProxyEvent, context: Context) {
    super(event, context)
  }

  async invoke(): Promise<object> {
    return {
      userMessage: 'Hello world!'
    }
  }
}

export function handler(event: APIGatewayProxyEvent, context: Context) {
  return new BasicAPIGatewayLambda(event, context)
}
