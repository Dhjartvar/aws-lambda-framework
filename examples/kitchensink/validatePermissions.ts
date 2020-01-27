import { Property, LambdaContainer, CognitoToken, UnauthorizedError } from '../../src/aws-lambda-framework'

export function validatePermissions(whitelistedCognitoGroups: string[]): void {
  const cognitoGroups = LambdaContainer.get<CognitoToken>(Property.COGNITO_TOKEN)['cognito:groups']
  if (cognitoGroups.some(g => whitelistedCognitoGroups.includes(g))) throw new UnauthorizedError()
}
