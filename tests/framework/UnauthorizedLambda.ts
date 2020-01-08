import {
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyResult,
  BaseLambda,
  CognitoToken,
  Property,
  LambdaContainer,
  UnauthorizedError
} from '../../src/aws-lambda-framework'
import { Result } from './types/Result'

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

export default class FailingLambda extends BaseLambda {
  constructor(event: APIGatewayProxyEvent, context: Context) {
    super(event, context)
  }

  async invoke(): Promise<any> {
    this.validatePermissions()
    return 'If this code is reached, user has valid permissions!'
  }

  private validatePermissions(): void {
    let cognitoGroups = mockToken['cognito:groups'] //LambdaContainer.get<CognitoToken>(Property.COGNITO_TOKEN)['cognito:groups']
    if (!cognitoGroups || !cognitoGroups.some(g => ['Superusers', 'Developers'].includes(g)))
      throw new UnauthorizedError()
  }
}

export function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  return new FailingLambda(event, context).handler()
}
