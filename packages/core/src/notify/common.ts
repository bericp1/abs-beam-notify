export type APSBeamStatusNotifier = (
  oldStatus: string,
  newStatus: string,
) => Promise<void>;

export enum APSBeamNotificationChannel {
  SlackIncomingWebhook = 'SlackIncomingWebhook',
}
