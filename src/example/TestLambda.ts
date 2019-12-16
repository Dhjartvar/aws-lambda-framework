import BaseLambda from '../lambda/BaseLambda'
import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda'
import Container from 'typedi'
import Aurora from '@services/Aurora'
import { TestRequestType, TestRequest } from './TestRequest'
import { Environment } from '../container/Environment'
import Validator from '@services/Validator'

export class TestLambda extends BaseLambda {
  request: TestRequest

  constructor(event: APIGatewayProxyEvent, context: Context) {
    super(event, context)
    this.request = Container.get(Validator).validate(this.body!, TestRequestType)
  }

  invoke(): Promise<any> {
    return Container.get(Aurora).execute('SELECT * FROM countries')
  }
}

exports.handler = (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> =>
  new TestLambda(event, context)
    .setEnvironment(Environment.Development)
    .setPooling(false)
    .handler()
