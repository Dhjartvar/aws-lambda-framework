import { testContext } from '../constants/LambdaTestContext'
import { Context } from 'aws-lambda'
import { LambdaContainer, SlackNotifier, Property, Environment } from '../../../src/aws-lambda-framework'

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
