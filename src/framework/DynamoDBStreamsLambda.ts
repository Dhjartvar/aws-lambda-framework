import LambdaFunction from './interfaces/LambdaFunction'
import {
  LambdaContainer,
  Mysql,
  Postgres,
  SlackNotifier,
  Property,
  Environment,
  Context
} from '../aws-lambda-framework'
import { DynamoDBStreamEvent } from 'aws-lambda'
import { tryJSONparse } from './utils/tryJSONparse'

export abstract class DynamoDBStreamsLambda implements LambdaFunction {
  constructor(event: DynamoDBStreamEvent, context: Context) {
    if (LambdaContainer.isBound(Property.EVENT)) {
      LambdaContainer.rebind<DynamoDBStreamEvent>(Property.EVENT).toConstantValue(tryJSONparse(event))
      LambdaContainer.rebind<Context>(Property.CONTEXT).toConstantValue(context)
    } else {
      LambdaContainer.bind<DynamoDBStreamEvent>(Property.EVENT).toConstantValue(tryJSONparse(event))
      LambdaContainer.bind<Context>(Property.CONTEXT).toConstantValue(context)
    }
  }

  abstract async invoke(): Promise<void>

  async handler(): Promise<void> {
    try {
      await this.invoke()
    } catch (err) {
      console.error(err)
      await LambdaContainer.get(SlackNotifier).notify(err.errorMessage ?? err)
    } finally {
      for (const mysql of LambdaContainer.getAll(Mysql)) await mysql.end()
      for (const pg of LambdaContainer.getAll(Postgres)) await pg.end()
    }
  }
}
