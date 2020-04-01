import { APIGatewayProxyResult, CognitoUserPoolEvent } from 'aws-lambda'

export default interface LambdaFunction {
  invoke(): Promise<object | void>
  handler(): Promise<APIGatewayProxyResult | void | CognitoUserPoolEvent>
}
