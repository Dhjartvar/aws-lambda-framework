import Container from 'typedi'
import SlackNotifier from './SlackNotifier'
import { Environment } from '../container/Environment'
import { testContext } from '../test/LambdaTestContext'

describe('SlackNotifier', () => {
  beforeEach(() => {
    Container.set('context', testContext)
    Container.set('environment', Environment.Development)
    Container.set('slack-webhook', process.env.SLACK_WEBHOOK)
    Container.set(SlackNotifier, new SlackNotifier(Container.get('slack-webhook'), Container.get('context')))
  })

  it('should resolve as undefined since environment is not set to Production ', async () => {
    expect(Container.get(SlackNotifier).notify('test')).resolves.toBeUndefined()
  })

  it('should send a message the slack channel specified by the slack webhook', async () => {
    Container.set('environment', Environment.Production)
    expect(Container.get(SlackNotifier).notify('test')).resolves.toBeUndefined()
  })
})
