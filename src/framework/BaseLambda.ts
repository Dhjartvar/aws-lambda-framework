import { Context, APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda'
import { HttpStatusCode } from '@framework/enums/HttpStatusCode'
import LambdaContainer from '@framework/LambdaContainer'
import LambdaFunction from '@framework/interfaces/LambdaFunction'
import SlackNotifier from '@framework/services/SlackNotifier'
import { Property } from '@framework/symbols/Property'
import Aurora from '@framework/services/Aurora'
import Redshift from '@framework/services/Redshift'
import AWS from 'aws-sdk'

export default abstract class BaseLambda implements LambdaFunction {
  constructor(event: APIGatewayProxyEvent, context: Context) {
    LambdaContainer.bind<APIGatewayProxyEvent>(Property.EVENT).toConstantValue(event)
    LambdaContainer.bind<Context>(Property.CONTEXT).toConstantValue(context)
    LambdaContainer.bind<object>(Property.EVENT_BODY).toConstantValue(
      typeof event.body === 'string' ? JSON.parse(event.body) : event.body
    )
  }

  abstract async invoke(): Promise<any>

  async handler(): Promise<APIGatewayProxyResult> {
    try {
      let test = new AWS.DynamoDB.DocumentClient()
      return this.APIGatewayResponse(HttpStatusCode.Ok, await this.invoke())
    } catch (e) {
      console.error(e)
      await LambdaContainer.get(SlackNotifier).notify(e.message ?? e)
      return this.APIGatewayResponse(e.statusCode ?? HttpStatusCode.InternalServerError, e.message ?? e)
    } finally {
      if (LambdaContainer.isBound(Aurora)) await LambdaContainer.get(Aurora).end()
      if (LambdaContainer.isBound(Redshift)) await LambdaContainer.get(Redshift).end()
    }
  }

  private APIGatewayResponse(statusCode: HttpStatusCode, message: string | object) {
    let response: APIGatewayProxyResult = {
      statusCode: statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
        'content-type': 'application/json'
      },
      body: typeof message === 'string' ? message : JSON.stringify(message),
      isBase64Encoded: false
    }

    return response
  }
}
