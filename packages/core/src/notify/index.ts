import {
  APSBeamDetailsChangeNotificationType,
  APSBeamDetailsChangeNotifier,
} from './common.js';
import {
  createWebhookAPSBeamDetailsChangeNotifier,
  WebhookNotificationConfig,
} from './webhook.js';
import {
  createSlackIncomingWebhookAPSBeamDetailsChangeNotifier,
  SlackIncomingWebhookNotificationConfig,
} from './slack.js';

export type APSBeamDetailsChangeNotificationConfig =
  | WebhookNotificationConfig
  | SlackIncomingWebhookNotificationConfig;

export class InvalidAPSBeamDetailsChangeNotificationConfig extends Error {
  notificationConfig: object | undefined;

  constructor({
    notificationConfig,
  }: {
    notificationConfig?: object | undefined;
  }) {
    super("The provided notification config's type could not be determined.");
    Object.setPrototypeOf(
      this,
      InvalidAPSBeamDetailsChangeNotificationConfig.prototype,
    );
    this.notificationConfig = notificationConfig;
  }
}

export function createAPSBeamStatusNotifier(
  notificationConfig: APSBeamDetailsChangeNotificationConfig,
): APSBeamDetailsChangeNotifier {
  if (
    notificationConfig.type === APSBeamDetailsChangeNotificationType.Webhook
  ) {
    return createWebhookAPSBeamDetailsChangeNotifier(notificationConfig);
  }
  if (
    notificationConfig.type
    === APSBeamDetailsChangeNotificationType.SlackIncomingWebhook
  ) {
    return createSlackIncomingWebhookAPSBeamDetailsChangeNotifier(
      notificationConfig,
    );
  }
  throw new InvalidAPSBeamDetailsChangeNotificationConfig({
    notificationConfig,
  });
}

export function createAPSSBeamStatusNotifierForManyConfigs(
  notificationConfigs: APSBeamDetailsChangeNotificationConfig[],
): APSBeamDetailsChangeNotifier {
  const notifiers = notificationConfigs.map((notificationConfig) => createAPSBeamStatusNotifier(notificationConfig));
  return async (...args) => {
    await Promise.all(notifiers.map((notifier) => notifier(...args)));
  };
}
