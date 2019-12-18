import { Context, APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda'
import { HttpStatusCode } from '@enums/HttpStatusCode'
import { Environment } from '@enums/Environment'
import LambdaContainer from '@framework/LambdaContainer'
import LambdaFunction from '@interfaces/LambdaFunction'
import SlackNotifier from '@services/SlackNotifier'
import { Property } from '@framework/symbols/Property'
import Aurora from '@services/Aurora'
import Redshift from '@services/Redshift'
require('dotenv').config()

export default abstract class BaseLambda implements LambdaFunction {
  constructor(event: APIGatewayProxyEvent, context: Context) {
    LambdaContainer.bind<APIGatewayProxyEvent>(Property.EVENT).toConstantValue(event)
    LambdaContainer.bind<Context>(Property.CONTEXT).toConstantValue(context)
    let eventBody = typeof event.body === 'string' ? JSON.parse(event.body) : event.body
    LambdaContainer.bind<object>(Property.EVENT_BODY).toConstantValue(eventBody)
    LambdaContainer.bind<string>(Property.REGION).toConstantValue(process.env.REGION ?? 'eu-central-1')
    LambdaContainer.bind<string>(Property.ENVIRONMENT).toConstantValue(process.env.NODE_ENV ?? Environment.Development)
    LambdaContainer.bind<boolean>(Property.LOGGING).toConstantValue(
      process.env.LOGGING ? JSON.parse(process.env.LOGGING) : false
    )
  }

  abstract async invoke(): Promise<any>

  async handler(): Promise<APIGatewayProxyResult> {
    try {
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
