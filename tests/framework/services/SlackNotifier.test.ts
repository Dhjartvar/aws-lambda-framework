import SlackNotifier from '../../../src/framework/services/SlackNotifier'
import { testContext } from '../constants/LambdaTestContext'
import { Property } from '../../../src/framework/symbols/Property'
import LambdaContainer from '../../../src/framework/LambdaContainer'
import { Context } from 'aws-lambda'
import { Environment } from '../../../src/framework/enums/Environment'

describe('SlackNotifier', () => {
  beforeAll(() => {
    LambdaContainer.bind<Context>(Property.CONTEXT).toConstantValue(testContext)
  })

  it('should resolve as undefined since environment is not set to Production ', async () => {
    expect(LambdaContainer.get(SlackNotifier).notify('test')).resolves.toBeUndefined()
  })

  it('should send a message the slack channel specified by the slack webhook', async () => {
    LambdaContainer.rebind<string>(Property.ENVIRONMENT).toConstantValue(Environment.Production)
    expect(LambdaContainer.get(SlackNotifier).notify('test')).resolves.toBeDefined()
  })
})
