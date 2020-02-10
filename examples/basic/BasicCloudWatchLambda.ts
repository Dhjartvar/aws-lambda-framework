import { Context, CloudWatchLambda, CloudWatchLogsEvent } from '../../src/aws-lambda-framework'

class BasicDynamoDBStreamsLambda extends CloudWatchLambda {
  constructor(event: CloudWatchLogsEvent, context: Context) {
    super(event, context)
  }

  async invoke(): Promise<void> {
    console.log('Hello world!')
  }
}

export function handler(event: CloudWatchLogsEvent, context: Context) {
  return new BasicDynamoDBStreamsLambda(event, context)
}
