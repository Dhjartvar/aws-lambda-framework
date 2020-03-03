import LambdaFunction from './interfaces/LambdaFunction'
import {
  LambdaContainer,
  Mysql,
  Postgres,
  SlackNotifier,
  Property,
  Environment,
  Context,
  SQSEvent
} from '../aws-lambda-framework'

export abstract class SQSLambda implements LambdaFunction {
  constructor(event: SQSEvent, context: Context) {
    if (LambdaContainer.isBound(Property.EVENT)) {
      LambdaContainer.rebind<SQSEvent>(Property.EVENT).toConstantValue(event)
      LambdaContainer.rebind<Context>(Property.CONTEXT).toConstantValue(context)
    } else {
      LambdaContainer.bind<SQSEvent>(Property.EVENT).toConstantValue(event)
      LambdaContainer.bind<Context>(Property.CONTEXT).toConstantValue(context)
    }
  }

  abstract async invoke(): Promise<void>

  async handler(): Promise<void> {
    try {
      return this.invoke()
    } catch (err) {
      if (process.env.NODE_ENV !== Environment.Test) console.error(err)
      await LambdaContainer.get(SlackNotifier).notify(err.errorMessage ?? err)
    } finally {
      if (LambdaContainer.isBound(Mysql)) await LambdaContainer.get(Mysql).end()
      if (LambdaContainer.isBound(Postgres)) await LambdaContainer.get(Postgres).end()
    }
  }
}
