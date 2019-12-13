import Container, { Inject, Service } from 'typedi'
import BaseNotifier from 'lambda-slack-notifier'
import { Context } from 'aws-lambda'
import { SlackNotificationColor } from 'lambda-slack-notifier/dist/SlackNotificationColor'
import { IncomingWebhookResult } from '@slack/webhook'
import { Environment } from 'src/storage/Environment'

@Service()
export default class SlackNotifier extends BaseNotifier {
  constructor(@Inject('slack-webhook') webhook: string, @Inject('context') context: Context) {
    super(webhook, context)
  }

  /**
   * Override notify function to only notify when in production
   * @param message
   * @param color
   */
  notify(message: unknown, color?: SlackNotificationColor | string): Promise<IncomingWebhookResult | void> {
    if (Container.get('environment') !== Environment.Production) return super.notify(String(message), color)
    else return Promise.resolve()
  }
}
