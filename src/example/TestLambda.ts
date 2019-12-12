import Lambda from 'src/lambda/Lambda'
import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda'
import Container from 'typedi'
import AuroraStore from 'src/storage/AuroraStore'

class TestLambda extends Lambda {
  constructor(event: APIGatewayProxyEvent, context: Context) {
    super(event, context)
  }

  invoke(): Promise<any> {
    return Container.get(AuroraStore).execute('SELECT * FROM somewhere')
  }
}

exports.handler = (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> =>
  new TestLambda(event, context)
    .setEnvironment('dev')
    .setPooling(false)
    .handler()
