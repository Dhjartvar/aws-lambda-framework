import { APIGatewayProxyEvent } from 'aws-lambda'

export const testEvent: APIGatewayProxyEvent = {
  body: JSON.stringify({
    id: 1,
    testNumber: 5,
    testString: 'a valid string',
    boolean: true
  }),
  httpMethod: 'post',
  isBase64Encoded: false,
  multiValueHeaders: {},
  path: 'test',
  pathParameters: {
    test: 'test'
  },
  queryStringParameters: {
    test: 'test'
  },
  multiValueQueryStringParameters: {
    test: ['test']
  },
  requestContext: {
    accountId: 'test',
    apiId: 'test',
    httpMethod: 'post',
    identity: {
      accessKey: 'test',
      accountId: 'test',
      apiKey: 'test',
      apiKeyId: 'test',
      caller: 'test',
      user: 'test',
      userAgent: 'test',
      userArn: 'test',
      sourceIp: 'test',
      cognitoAuthenticationProvider: 'test',
      cognitoAuthenticationType: 'test',
      cognitoIdentityId: 'test',
      cognitoIdentityPoolId: 'test',
      principalOrgId: 'test'
    },
    authorizer: {},
    protocol: 'test',
    connectedAt: 123,
    connectionId: 'test',
    domainName: 'test',
    domainPrefix: 'test',
    eventType: 'test',
    extendedRequestId: 'test',
    messageDirection: 'test',
    messageId: 'test',
    requestTime: 'test',
    routeKey: 'test',
    requestId: 'test',
    requestTimeEpoch: 123,
    resourceId: 'test',
    stage: 'test',
    path: 'test',
    resourcePath: 'test'
  },
  resource: 'test',
  stageVariables: {
    test: 'test'
  },
  headers: {
    test: 'test'
  }
}
