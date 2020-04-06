import LambdaFunction from './interfaces/LambdaFunction'
import {
  LambdaContainer,
  Mysql,
  Postgres,
  SlackNotifier,
  Property,
  Context,
  SNSEvent,
  SNSMessage
} from '../aws-lambda-framework'
import { tryJSONparse } from './utils/tryJSONparse'

export abstract class SNSLambda implements LambdaFunction {
  constructor(event: SNSEvent, context: Context) {
    if (LambdaContainer.isBound(Property.EVENT))
      LambdaContainer.rebind<SNSEvent>(Property.EVENT).toConstantValue(tryJSONparse(event))
    else LambdaContainer.bind<SNSEvent>(Property.EVENT).toConstantValue(tryJSONparse(event))

    if (LambdaContainer.isBound(Property.EVENT_BODY))
      LambdaContainer.rebind<SNSMessage[]>(Property.EVENT_BODY).toConstantValue(
        event.Records.flatMap(r => JSON.parse(r.Sns.Message))
      )
    else {
      LambdaContainer.bind<SNSMessage[]>(Property.EVENT_BODY).toConstantValue(
        event.Records.flatMap(r => JSON.parse(r.Sns.Message))
      )
    }

    if (LambdaContainer.isBound(Property.CONTEXT))
      LambdaContainer.rebind<Context>(Property.CONTEXT).toConstantValue(context)
    else LambdaContainer.bind<Context>(Property.CONTEXT).toConstantValue(context)
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
