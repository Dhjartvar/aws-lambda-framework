import LambdaFunction from './interfaces/LambdaFunction'
import {
  LambdaContainer,
  Mysql,
  Postgres,
  SlackNotifier,
  Property,
  HttpStatusCode,
  Context,
  APIGatewayProxyResult,
  APIGatewayProxyEvent
} from '../aws-lambda-framework'
import jwtDecode from 'jwt-decode'
import { tryJSONparse } from './utils/tryJSONparse'

export abstract class APIGatewayLambda implements LambdaFunction {
  #graphql = false

  constructor(event: APIGatewayProxyEvent, context: Context) {
    if (!this.#graphql && ['/graphql', '/graphiql', '/playground'].includes(event.path)) this.#graphql = true

    if (LambdaContainer.isBound(Property.EVENT))
      LambdaContainer.rebind<APIGatewayProxyEvent>(Property.EVENT).toConstantValue(tryJSONparse(event))
    else LambdaContainer.bind<APIGatewayProxyEvent>(Property.EVENT).toConstantValue(tryJSONparse(event))
    
    if (LambdaContainer.isBound(Property.CONTEXT))
      LambdaContainer.rebind<Context>(Property.CONTEXT).toConstantValue(context)
    else LambdaContainer.bind<Context>(Property.CONTEXT).toConstantValue(context)

    if (LambdaContainer.isBound(Property.EVENT_BODY) && event.body)
      LambdaContainer.rebind(Property.EVENT_BODY).toConstantValue(tryJSONparse(event.body))
    else if (event.body) LambdaContainer.bind(Property.EVENT_BODY).toConstantValue(tryJSONparse(event.body))

    if (LambdaContainer.isBound(Property.COGNITO_TOKEN) && event.headers?.Authorization)
      LambdaContainer.rebind<Context>(Property.COGNITO_TOKEN).toConstantValue(
        JSON.parse(JSON.stringify(jwtDecode(event.headers.Authorization)))
      )
    else if (event.headers?.Authorization)
      LambdaContainer.bind<Context>(Property.COGNITO_TOKEN).toConstantValue(
        JSON.parse(JSON.stringify(jwtDecode(event.headers.Authorization)))
      )
  }

  abstract async invoke(): Promise<object>

  async handler(): Promise<APIGatewayProxyResult | any> {
    if (LambdaContainer.get<any>(Property.EVENT).source === 'serverless-plugin-warmup') return 'Warmup'
    try {
      if (this.#graphql) return this.invoke()
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
