import { Context, SQSLambda, SQSEvent, Property, LambdaContainer } from '../../src/aws-lambda-framework'

class BasicSQSLambda extends SQSLambda {
  private event = LambdaContainer.get<SQSEvent>(Property.EVENT)

  constructor(event: SQSEvent, context: Context) {
    super(event, context)
  }

  async invoke(): Promise<void> {
    console.log('Check out these SQS Records: ', this.event.Records)
  }
}

export function handler(event: SQSEvent, context: Context) {
  return new BasicSQSLambda(event, context)
}
