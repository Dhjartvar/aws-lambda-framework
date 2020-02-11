import {
  Context,
  DynamoDBStreamsLambda,
  DynamoDBStreamEvent,
  LambdaContainer,
  Postgres
} from '../../src/aws-lambda-framework'

export default class DynamoDBLambda extends DynamoDBStreamsLambda {
  constructor(event: DynamoDBStreamEvent, context: Context) {
    super(event, context)
  }

  async invoke(): Promise<void> {
    await LambdaContainer.get(Postgres).execute({
      sql: process.env.POSTGRES_TEST_QUERY!,
      inputs: [1]
    })
  }
}

export function handler(event: DynamoDBStreamEvent, context: Context): Promise<void> {
  return new DynamoDBLambda(event, context).handler()
}
