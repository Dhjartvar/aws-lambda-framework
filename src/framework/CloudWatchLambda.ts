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
import { CloudWatchLogsEvent } from 'aws-lambda'

export abstract class CloudWatchLambda implements LambdaFunction {
  constructor(event: CloudWatchLogsEvent, context: Context) {
    if (LambdaContainer.isBound(Property.EVENT)) {
      LambdaContainer.rebind<CloudWatchLogsEvent>(Property.EVENT).toConstantValue(event)
      LambdaContainer.rebind<Context>(Property.CONTEXT).toConstantValue(context)
    } else {
      LambdaContainer.bind<CloudWatchLogsEvent>(Property.EVENT).toConstantValue(event)
      LambdaContainer.bind<Context>(Property.CONTEXT).toConstantValue(context)
    }
  }

  abstract async invoke(): Promise<void>

  async handler(): Promise<void> {
    try {
      await this.invoke()
    } catch (err) {
      if (!err.isLambdaError) err = new LambdaError(err.message, err.stack, undefined, err.statusCode)
      if (process.env.NODE_ENV !== Environment.Test) console.error(err)
      await LambdaContainer.get(SlackNotifier).notify(err.errorMessage ?? err)
    } finally {
      if (LambdaContainer.isBound(Mysql)) await LambdaContainer.get(Mysql).end()
      if (LambdaContainer.isBound(Postgres)) await LambdaContainer.get(Postgres).end()
    }
  }
}
