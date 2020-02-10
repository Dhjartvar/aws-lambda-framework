import { Context, DynamoDBStreamsLambda, DynamoDBStreamEvent } from '../../src/aws-lambda-framework'

class BasicDynamoDBStreamsLambda extends DynamoDBStreamsLambda {
  constructor(event: DynamoDBStreamEvent, context: Context) {
    super(event, context)
  }

  async invoke(): Promise<void> {
    console.log('Hello world!')
  }
}

export function handler(event: DynamoDBStreamEvent, context: Context) {
  return new BasicDynamoDBStreamsLambda(event, context)
}
