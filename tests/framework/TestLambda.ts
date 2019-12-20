import BaseLambda from '../../src/framework/BaseLambda'
import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda'
import { TestRequestType, TestRequest } from './constants/TestRequest'
import InputValidator from '../../src/framework/services/InputValidator'
import { Property } from '../../src/framework/symbols/Property'
import LambdaContainer from '../../src/framework/LambdaContainer'
import DynamoDB from '../../src/framework/services/DynamoDB'

export default class TestLambda extends BaseLambda {
  request: TestRequest

  constructor(event: APIGatewayProxyEvent, context: Context) {
    super(event, context)
    this.request = LambdaContainer.get(InputValidator).validate(
      LambdaContainer.get<object>(Property.EVENT_BODY),
      TestRequestType
    )
  }

  async invoke(): Promise<any> {
    return LambdaContainer.get(DynamoDB)
      .scan({ TableName: process.env.DYNAMODB_TEST_TABLE! })
      .promise()
  }
}

exports.handler = (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> =>
  new TestLambda(event, context).handler()
