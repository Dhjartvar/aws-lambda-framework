import LambdaFunction from './interfaces/LambdaFunction'
import { LambdaContainer, Mysql, Postgres, SlackNotifier, Property, Context, SQSEvent } from '../aws-lambda-framework'
import { tryJSONparse } from './utils/tryJSONparse'

export abstract class SQSLambda implements LambdaFunction {
  constructor(event: SQSEvent, context: Context) {
    if (LambdaContainer.isBound(Property.EVENT))
      LambdaContainer.rebind<SQSEvent>(Property.EVENT).toConstantValue(tryJSONparse(event))
    else LambdaContainer.bind<SQSEvent>(Property.EVENT).toConstantValue(tryJSONparse(event))

    if (LambdaContainer.isBound(Property.EVENT_BODY))
      LambdaContainer.rebind(Property.EVENT_BODY).toConstantValue(event.Records.flatMap(r => JSON.parse(r.body)))
    else LambdaContainer.bind(Property.EVENT_BODY).toConstantValue(event.Records.flatMap(r => JSON.parse(r.body)))

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
