import Container, { Inject, Service } from 'typedi'
import BaseNotifier from 'lambda-slack-notifier'
import { SlackNotificationColor } from 'lambda-slack-notifier/dist/SlackNotificationColor'
import { IncomingWebhookResult } from '@slack/webhook'
import { Environment } from '../enums/Environment'
import Notifier from '../interfaces/Notifier'

@Service()
export default class SlackNotifier extends BaseNotifier implements Notifier {
  constructor() {
    Container.set('slack-webhook', process.env.SLACK_WEBHOOK)
    super(Container.get('slack-webhook'), Container.get('context'))
  }

  /**
   * Override notify function to only notify when in production
   */
  notify(message: unknown, color?: SlackNotificationColor | string): Promise<IncomingWebhookResult | void> {
    if (Container.get('environment') !== Environment.Production || !this.webhookUrl) return Promise.resolve()
    else return super.notify(message, color)
  }

  configure(webhook: string) {
    Container.set('slack-webhook', webhook)
  }
}
