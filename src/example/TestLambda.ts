import BaseLambda from '../framework/BaseLambda'
import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda'
import Aurora from '@services/Aurora'
import { TestRequestType, TestRequest } from './TestRequest'
import InputValidator from '@services/InputValidator'
import Redshift from '@services/Redshift'
import { Property } from '@framework/symbols/Property'
import LambdaContainer from '@framework/LambdaContainer'

export class TestLambda extends BaseLambda {
  request: TestRequest

  constructor(event: APIGatewayProxyEvent, context: Context) {
    super(event, context)
    this.request = LambdaContainer.get(InputValidator).validate(
      LambdaContainer.get<object>(Property.EVENT_BODY),
      TestRequestType
    )
  }

  async invoke(): Promise<any> {
    throw 'test'
    await LambdaContainer.get(Redshift).execute('SELECT * FROM flydata.countries')
    return LambdaContainer.get(Aurora).execute('SELECT * FROM countries')
  }
}

exports.handler = (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> =>
  new TestLambda(event, context).handler()
