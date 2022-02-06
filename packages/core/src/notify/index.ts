import { APSBeamNotificationChannel, APSBeamStatusNotifier } from './common.js';
import {
  createNotifierForIncomingSlackWebhook,
  SlackIncomingWebhookNotificationConfig,
} from './slack.js';

export type NotificationConfig = SlackIncomingWebhookNotificationConfig;

export class UnknownNotificationTypeError extends Error {
  type: string;

  constructor({ type }: { type: string }) {
    super('The provided type of notification is unknown.');
    Object.setPrototypeOf(this, UnknownNotificationTypeError.prototype);
    this.type = type;
  }
}

export function createAPSBeamStatusNotifier(
  notificationConfig: NotificationConfig,
): APSBeamStatusNotifier {
  if (
    notificationConfig.type === APSBeamNotificationChannel.SlackIncomingWebhook
  ) {
    return createNotifierForIncomingSlackWebhook(notificationConfig);
  }
  throw new UnknownNotificationTypeError({ type: notificationConfig.type });
}

export function createAPSSBeamStatusNotifierForManyConfigs(
  notificationConfigs: NotificationConfig[],
): APSBeamStatusNotifier {
  const notifiers = notificationConfigs.map((notificationConfig) => createAPSBeamStatusNotifier(notificationConfig));
  return async (oldStatus, newStatus) => {
    await Promise.all(
      notifiers.map((notifier) => notifier(oldStatus, newStatus)),
    );
  };
}
