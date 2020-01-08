import { handler } from './ValidationErrorLambda'
import { testEvent } from './constants/LambdaTestEvent'
import { testContext } from './constants/LambdaTestContext'
import { HttpStatusCode } from '../../src/aws-lambda-framework'

let headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'content-type': 'application/json'
}
describe('ValidationErrorLambda', () => {
  it('should call the handler, throw an error and return an APIGatewayResult with status code 500', async () => {
    let res = await handler(testEvent, testContext)

    expect(res.statusCode).toBe(HttpStatusCode.BadRequest)
    expect(res.headers).toEqual(headers)
    expect(res.isBase64Encoded).toBeFalsy()
  })
})
