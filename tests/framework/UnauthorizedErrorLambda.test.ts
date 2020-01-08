import { handler } from './UnauthorizedErrorLambda'
import { testEvent } from './constants/LambdaTestEvent'
import { testContext } from './constants/LambdaTestContext'
import { HttpStatusCode, LambdaContainer, Property, CognitoToken } from '../../src/aws-lambda-framework'

let headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'content-type': 'application/json'
}

let mockToken: CognitoToken = {
  'cognito:username': 'test',
  aud: 'test',
  auth_time: 123,
  email: 'test',
  email_verified: false,
  exp: 123,
  given_name: 'test',
  iat: 123,
  iss: 'test',
  sub: 'test',
  token_use: 'test',
  'cognito:groups': ['Users']
}

describe('UnauthorizedErrorLambda', () => {
  beforeAll(() => {
    // LambdaContainer.rebind(Property.COGNITO_TOKEN).toConstantValue(mockToken)
  })
  it('should call the handler, throw an error and return an APIGatewayResult with status code 500', async () => {
    let res = await handler(testEvent, testContext)

    expect(res.statusCode).toBe(HttpStatusCode.Unauthorized)
    expect(res.headers).toEqual(headers)
    expect(res.isBase64Encoded).toBeFalsy()
  })
})
