import {
  Context,
  CloudWatchLambda as Lambda,
  CloudWatchLogsEvent,
  LambdaContainer,
  Postgres
} from '../../src/aws-lambda-framework'

export default class CloudWatchLambda extends Lambda {
  constructor(event: CloudWatchLogsEvent, context: Context) {
    super(event, context)
  }

  async invoke(): Promise<void> {
    await LambdaContainer.get(Postgres).execute({
      sql: process.env.POSTGRES_TEST_QUERY!,
      inputs: [1]
    })
  }
}

export function handler(event: CloudWatchLogsEvent, context: Context): Promise<void> {
  return new CloudWatchLambda(event, context).handler()
}
