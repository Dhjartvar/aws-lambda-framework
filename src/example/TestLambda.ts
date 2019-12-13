import Lambda from 'src/lambda/Lambda'
import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda'
import Container from 'typedi'
import Aurora from 'src/services/Aurora'
import { validate } from 'src/validate/validator'
import { RequestType, Request } from 'src/example/Request'

class TestLambda extends Lambda {
  constructor(event: APIGatewayProxyEvent, context: Context) {
    super(event, context)
    Container.set('request', validate(this.body!, RequestType))
  }

  invoke(): Promise<any> {
    return Container.get(Aurora).execute('SELECT * FROM somewhere')
  }
}

exports.handler = (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> =>
  new TestLambda(event, context)
    .setEnvironment('dev')
    .setPooling(false)
    .handler()
