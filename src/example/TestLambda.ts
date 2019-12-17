import BaseLambda from '../framework/BaseLambda'
import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda'
import Container from 'typedi'
import Aurora from '@services/Aurora'
import { TestRequestType, TestRequest } from './TestRequest'
import Validator from '@services/InputValidator'
import Redshift from '@services/Redshift'

export class TestLambda extends BaseLambda {
  request: TestRequest

  constructor(event: APIGatewayProxyEvent, context: Context) {
    super(event, context)
    this.request = Container.get(Validator).validate(this.body!, TestRequestType)
  }

  async invoke(): Promise<any> {
    await Container.get(Redshift).execute('SELECT * FROM flydata.countries')
    return Container.get(Aurora).execute('SELECT * FROM countries')
  }
}

exports.handler = (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> =>
  new TestLambda(event, context).handler()
