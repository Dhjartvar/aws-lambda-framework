import { handler } from './TestLambda'
import { testEvent } from './constants/LambdaTestEvent'
import { testContext } from './constants/LambdaTestContext'
import { HttpStatusCode } from '../../src/aws-lambda-framework'

let headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'content-type': 'application/json'
}

describe('TestLambda', () => {
  it('should call the handler and get an APIGatewayResult response back with status code 200', async () => {
    let res = await handler(testEvent, testContext)

    console.log('RES: ', res)

    expect(res.statusCode).toBe(HttpStatusCode.Ok)
    expect(res.headers).toEqual(headers)
    expect(res.isBase64Encoded).toBeFalsy()
  })
})
