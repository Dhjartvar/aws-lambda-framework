import { TestLambda } from './TestLambda'
import { testEvent } from '../test/LambdaTestEvent'
import { testContext } from '../test/LambdaTestContext'
import Container from 'typedi'
import { Environment } from '../framework/enums/Environment'
let testLambda: TestLambda

describe('TestLambda', () => {
  beforeAll(() => {
    testLambda = new TestLambda(testEvent, testContext).setEnvironment(Environment.Development)
  })

  it('should have slack-webhook set to test', async () => {
    expect(Container.get('slack-webhook')).toBe(process.env.SLACK_WEBHOOK)
  })

  it('should have environment set to dev', async () => {
    expect(Container.get('environment')).toBe(Environment.Development)
  })

  it('should call the handler and get a response back with status code 200', async () => {
    let res = await testLambda.handler()
    expect(res.statusCode).toBe(200)
  })
})
