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
import { tryJSONparse } from './utils/tryJSONparse'

export abstract class APIGatewayLambda implements LambdaFunction {
  constructor(event: APIGatewayProxyEvent, context: Context) {
    if (LambdaContainer.isBound(Property.EVENT)) {
      LambdaContainer.rebind<APIGatewayProxyEvent>(Property.EVENT).toConstantValue(tryJSONparse(event))
      LambdaContainer.rebind<Context>(Property.CONTEXT).toConstantValue(context)
      if (event.body) LambdaContainer.rebind(Property.EVENT_BODY).toConstantValue(tryJSONparse(event.body))
      if (event.headers?.Authorization)
        LambdaContainer.rebind<Context>(Property.COGNITO_TOKEN).toConstantValue(
          JSON.parse(JSON.stringify(jwtDecode(event.headers.Authorization)))
        )
    } else {
      LambdaContainer.bind<APIGatewayProxyEvent>(Property.EVENT).toConstantValue(tryJSONparse(event))
      LambdaContainer.bind<Context>(Property.CONTEXT).toConstantValue(context)
      if (event.body) LambdaContainer.bind(Property.EVENT_BODY).toConstantValue(tryJSONparse(event.body))
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
      console.error(err)
      await LambdaContainer.get(SlackNotifier).notify(err.errorMessage ?? err)
      return this.buildAPIGatewayResult(err.statusCode ?? HttpStatusCode.InternalServerError, err)
    } finally {
      for (const mysql of LambdaContainer.getAll(Mysql)) await mysql.end()
      for (const pg of LambdaContainer.getAll(Postgres)) await pg.end()
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
