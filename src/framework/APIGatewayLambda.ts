import LambdaFunction from './interfaces/LambdaFunction'
import {
  LambdaContainer,
  Mysql,
  Postgres,
  SlackNotifier,
  Property,
  Environment,
  HttpStatusCode,
  Context,
  APIGatewayProxyResult,
  APIGatewayProxyEvent
} from '../aws-lambda-framework'
import jwtDecode from 'jwt-decode'
import { LambdaError } from './errors/LambdaError'

export abstract class APIGatewayLambda implements LambdaFunction {
  constructor(event: APIGatewayProxyEvent, context: Context) {
    if (LambdaContainer.isBound(Property.EVENT)) {
      LambdaContainer.rebind<APIGatewayProxyEvent>(Property.EVENT).toConstantValue(event)
      LambdaContainer.rebind<Context>(Property.CONTEXT).toConstantValue(context)
      LambdaContainer.rebind(Property.EVENT_BODY).toConstantValue(
        typeof event.body === 'string' ? JSON.parse(event.body) : event.body
      )
      if (event.headers?.Authorization)
        LambdaContainer.rebind<Context>(Property.COGNITO_TOKEN).toConstantValue(
          JSON.parse(JSON.stringify(jwtDecode(event.headers.Authorization)))
        )
    } else {
      LambdaContainer.bind<APIGatewayProxyEvent>(Property.EVENT).toConstantValue(event)
      LambdaContainer.bind<Context>(Property.CONTEXT).toConstantValue(context)
      LambdaContainer.bind(Property.EVENT_BODY).toConstantValue(
        typeof event.body === 'string' ? JSON.parse(event.body) : event.body
      )
      if (event.headers?.Authorization)
        LambdaContainer.bind<Context>(Property.COGNITO_TOKEN).toConstantValue(
          JSON.parse(JSON.stringify(jwtDecode(event.headers.Authorization)))
        )
    }
  }

  abstract async invoke(): Promise<object>

  async handler(): Promise<APIGatewayProxyResult> {
    try {
      return this.buildAPIGatewayResult(HttpStatusCode.Ok, await this.invoke())
    } catch (err) {
      if (!err.event) err = new LambdaError(err.message, err.stack, undefined, err.statusCode)
      if (process.env.NODE_ENV !== Environment.Test) console.error(err)
      await LambdaContainer.get(SlackNotifier).notify(err.errorMessage ?? err)
      return this.buildAPIGatewayResult(err.statusCode ?? HttpStatusCode.InternalServerError, err)
    } finally {
      if (LambdaContainer.isBound(Mysql)) await LambdaContainer.get(Mysql).end()
      if (LambdaContainer.isBound(Postgres)) await LambdaContainer.get(Postgres).end()
    }
  }

  private buildAPIGatewayResult(statusCode: HttpStatusCode, res: object): APIGatewayProxyResult {
    let response: APIGatewayProxyResult = {
      statusCode: statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
        'content-type': 'application/json'
      },
      body: JSON.stringify(res),
      isBase64Encoded: false
    }

    return response
  }
}
