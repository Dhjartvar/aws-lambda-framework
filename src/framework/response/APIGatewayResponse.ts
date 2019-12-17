import { APIGatewayProxyResult } from 'aws-lambda'
import { HttpStatusCode } from '../enums/HttpStatusCode'

export default abstract class APIGatewayResponse {
  static build(statusCode: HttpStatusCode, message: string | object) {
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
