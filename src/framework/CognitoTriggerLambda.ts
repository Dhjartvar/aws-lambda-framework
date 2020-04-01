import LambdaFunction from './interfaces/LambdaFunction'
import { LambdaContainer, Mysql, Postgres, SlackNotifier, Property, Context } from '../aws-lambda-framework'
import { tryJSONparse } from './utils/tryJSONparse'
import { CognitoUserPoolTriggerEvent } from 'aws-lambda'

export abstract class CognitoTriggerLambda implements LambdaFunction {
  constructor(event: CognitoUserPoolTriggerEvent, context: Context) {
    if (LambdaContainer.isBound(Property.EVENT))
      LambdaContainer.rebind<CognitoUserPoolTriggerEvent>(Property.EVENT).toConstantValue(tryJSONparse(event))
    else LambdaContainer.bind<CognitoUserPoolTriggerEvent>(Property.EVENT).toConstantValue(tryJSONparse(event))

    if (LambdaContainer.isBound(Property.CONTEXT))
      LambdaContainer.rebind<Context>(Property.CONTEXT).toConstantValue(context)
    else LambdaContainer.bind<Context>(Property.CONTEXT).toConstantValue(context)
  }

  abstract async invoke(): Promise<CognitoUserPoolTriggerEvent>

  async handler(): Promise<CognitoUserPoolTriggerEvent> {
    try {
      await this.invoke()
      return LambdaContainer.get(Property.EVENT)
    } catch (err) {
      console.error(err)
      await LambdaContainer.get(SlackNotifier).notify(err.errorMessage ?? err)
      return LambdaContainer.get(Property.EVENT)
    } finally {
      for (const mysql of LambdaContainer.getAll(Mysql)) await mysql.end()
      for (const pg of LambdaContainer.getAll(Postgres)) await pg.end()
    }
  }
}
