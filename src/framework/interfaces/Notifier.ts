export default interface Notifier {
  notify(message: any, notificationColor?: string): Promise<any>
}
