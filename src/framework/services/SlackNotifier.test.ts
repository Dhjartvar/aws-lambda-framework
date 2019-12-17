import Container from 'typedi'
import SlackNotifier from './SlackNotifier'
import { Environment } from '../enums/Environment'
import { testContext } from '../../test/LambdaTestContext'
require('dotenv').config()

describe('SlackNotifier', () => {
  beforeAll(() => {
    Container.set('environment', Environment.Development)
    Container.set('context', testContext)
    Container.set('slack-webhook', process.env.SLACK_WEBHOOK)
  })

  it('should resolve as undefined since environment is not set to Production ', async () => {
    expect(Container.get(SlackNotifier).notify('test')).resolves.toBeUndefined()
  })

  it('should send a message the slack channel specified by the slack webhook', async () => {
    Container.set('environment', Environment.Production)
    expect(Container.get(SlackNotifier).notify('test')).resolves.toBeDefined()
  })
})
