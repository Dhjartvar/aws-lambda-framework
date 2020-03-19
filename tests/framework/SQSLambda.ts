import {
  Context,
  SQSLambda as Lambda,
  DynamoDBStreamEvent,
  LambdaContainer,
  Mysql,
  SQSEvent
} from '../../src/aws-lambda-framework'

export default class SQSLambda extends Lambda {
  constructor(event: SQSEvent, context: Context) {
    super(event, context)
  }

  async invoke(): Promise<void> {
    await LambdaContainer.get(Mysql).execute({
      sql: `SELECT
      *
    FROM
      maillog
    LIMIT 5`
    })
  }
}

export function handler(event: SQSEvent, context: Context): Promise<void> {
  return new SQSLambda(event, context).handler()
}
