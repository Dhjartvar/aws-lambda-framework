import { TestLambda } from './TestLambda'
import { testEvent } from '../test/LambdaTestEvent'
import { testContext } from '../test/LambdaTestContext'
import Container from 'typedi'
import { Environment } from '../container/Environment'
import Aurora from '../services/Aurora'

let testLambda: TestLambda

describe('TestLambda', () => {
  beforeAll(() => {
    testLambda = new TestLambda(testEvent, testContext)
      .setEnvironment(Environment.Development)
      .setPooling(false)
      .setSlackWebhook('test')
  })

  it('should have set pooling to false', async () => {
    expect(Container.get('pooling')).toBeFalsy()
  })

  it('should have slack-webhook set to test', async () => {
    expect(Container.get('slack-webhook')).toBe('test')
  })

  it('should have environment set to dev', async () => {
    expect(Container.get('environment')).toBe('dev')
  })

  it('WIP', async () => {
    try {
      let res = await testLambda.handler()
      console.log('RES: ', res)
    } catch (err) {
      console.error(err)
    }
  })
})
