import {
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyResult,
  APIGatewayLambda,
  LambdaContainer,
  Mysql
} from '../../src/aws-lambda-framework'

export default class ErrorLambda extends APIGatewayLambda {
  constructor(event: APIGatewayProxyEvent, context: Context) {
    super(event, context)
  }

  async invoke(): Promise<object> {
    return LambdaContainer.get(Mysql).execute({ sql: 'bad sql' })
  }
}

export function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  return new ErrorLambda(event, context).handler()
}
