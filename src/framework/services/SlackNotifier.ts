import BaseNotifier from 'lambda-slack-notifier'
import { SlackNotificationColor } from 'lambda-slack-notifier/dist/SlackNotificationColor'
import { IncomingWebhookResult } from '@slack/webhook'
import { Environment } from '../enums/Environment'
import Notifier from '../interfaces/Notifier'
import { injectable, inject } from 'inversify'
import Container from '../LambdaContainer'
import { Property } from '../symbols/Property'
import { Context } from 'aws-lambda'

@injectable()
export default class SlackNotifier extends BaseNotifier implements Notifier {
  constructor(@inject(Property.CONTEXT) context: Context) {
    super(process.env.SLACK_WEBHOOK!, context)
  }

  /**
   * Override notify function to only notify when in production
   */
  notify(message: unknown, color?: SlackNotificationColor | string): Promise<IncomingWebhookResult | void> {
    if (Container.get(Property.ENVIRONMENT) !== Environment.Production || !this.webhookUrl) return Promise.resolve()
    else return super.notify(message, color)
  }
}
