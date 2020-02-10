import { APIGatewayProxyResult } from 'aws-lambda'

export default interface LambdaFunction {
  invoke(): Promise<object | void>
  handler(): Promise<APIGatewayProxyResult | void>
}
