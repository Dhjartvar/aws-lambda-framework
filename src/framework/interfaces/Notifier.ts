import { SlackNotificationColor } from 'lambda-slack-notifier/dist/SlackNotificationColor'

export default interface Notifier {
  notify(message: any, notificationColor?: string | SlackNotificationColor): Promise<any>
}
