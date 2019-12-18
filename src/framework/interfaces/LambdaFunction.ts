import { APIGatewayProxyResult } from 'aws-lambda'

export default interface LambdaFunction {
  handler(): Promise<APIGatewayProxyResult>
}
