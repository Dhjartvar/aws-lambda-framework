import { TestLambda } from './TestLambda'
import { testEvent } from '../utilities/LambdaTestEvent'
import { testContext } from '../utilities/LambdaTestContext'
import { HttpStatusCode } from '../framework/enums/HttpStatusCode'

let headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'content-type': 'application/json'
}

describe('TestLambda', () => {
  it('should call the handler and get an APIGatewayResult response back with status code 200', async () => {
    let testLambda = new TestLambda(testEvent, testContext)
    let res = await testLambda.handler()
    // console.log('RES: ', res)
    expect(res.statusCode).toBe(HttpStatusCode.Ok)
    expect(res.headers).toEqual(headers)
    expect(res.isBase64Encoded).toBeFalsy()
  })
})
