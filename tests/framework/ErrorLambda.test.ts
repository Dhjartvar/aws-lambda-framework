import { handler } from './ErrorLambda'
import { testEvent } from './constants/LambdaTestEvent'
import { testContext } from './constants/LambdaTestContext'
import {
  HttpStatusCode,
  LambdaContainer,
  APIGatewayProxyEvent,
  Property,
  Context
} from '../../src/aws-lambda-framework'

let headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'content-type': 'application/json'
}

describe('ErrorLambda', () => {
  beforeAll(() => {
    LambdaContainer.bind<APIGatewayProxyEvent>(Property.EVENT).toConstantValue(testEvent)
    LambdaContainer.bind<Context>(Property.CONTEXT).toConstantValue(testContext)
    LambdaContainer.bind(Property.EVENT_BODY).toConstantValue(
      typeof testEvent.body === 'string' ? JSON.parse(testEvent.body) : testEvent.body
    )
    if (testEvent.headers?.Authorization)
      LambdaContainer.bind<Context>(Property.COGNITO_TOKEN).toConstantValue(
        JSON.parse(JSON.stringify(testEvent.headers.Authorization))
      )
  })

  it('should call the handler, throw an error and return an APIGatewayResult with status code 500', async () => {
    let res = await handler(testEvent, testContext)

    expect(res.statusCode).toBe(HttpStatusCode.InternalServerError)
    expect(res.headers).toEqual(headers)
    expect(res.isBase64Encoded).toBeFalsy()
  })
})
