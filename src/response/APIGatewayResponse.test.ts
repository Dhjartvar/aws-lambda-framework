import APIGatewayResponse from './APIGatewayResponse'
import { HttpStatusCode } from './HttpStatusCode'
import { APIGatewayProxyResult } from 'aws-lambda'

describe('SaveProductActivity', () => {

  it('should return a properly formatted APIGatewayProxyResult', async () => {
    let message = 'Succesfully built an APIGatewayProxyResult'
    let headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'content-type': 'application/json'
    }
    let res: APIGatewayProxyResult = APIGatewayResponse.build(HttpStatusCode.Ok, message)

    expect(res.statusCode).toBe(HttpStatusCode.Ok)
    expect(res.headers).toEqual(headers)
    expect(res.body).toEqual(message)
    expect(res.isBase64Encoded).toBeFalsy()
  }, 900000)
})
