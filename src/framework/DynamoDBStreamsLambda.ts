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
import { LambdaError } from './errors/LambdaError'
import { DynamoDBStreamEvent } from 'aws-lambda'

export abstract class DynamoDBStreamsLambda implements LambdaFunction {
  constructor(event: DynamoDBStreamEvent, context: Context) {
    if (LambdaContainer.isBound(Property.EVENT)) {
      LambdaContainer.rebind<DynamoDBStreamEvent>(Property.EVENT).toConstantValue(event)
      LambdaContainer.rebind<Context>(Property.CONTEXT).toConstantValue(context)
    } else {
      LambdaContainer.bind<DynamoDBStreamEvent>(Property.EVENT).toConstantValue(event)
      LambdaContainer.bind<Context>(Property.CONTEXT).toConstantValue(context)
    }
  }

  abstract async invoke(): Promise<void>

  async handler(): Promise<void> {
    try {
      return this.invoke()
    } catch (err) {
      err = new LambdaError(err.message, err.stack, err.userMessage, err.statusCode)
      if (process.env.NODE_ENV !== Environment.Test) console.error(err)
      await LambdaContainer.get(SlackNotifier).notify(err.errorMessage ?? err)
    } finally {
      if (LambdaContainer.isBound(Mysql)) await LambdaContainer.get(Mysql).end()
      if (LambdaContainer.isBound(Postgres)) await LambdaContainer.get(Postgres).end()
    }
  }
}
