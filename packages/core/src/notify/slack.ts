import fetch from 'node-fetch';
import { APSBeamStatusNotifier, APSBeamNotificationChannel } from './common.js';

export const DEFAULT_SLACK_INCOMING_WEBHOOK_NOTIFICATION_TEMPLATE = `
  APS Beam Operations Status changes from "$oldStatus" to "$newStatus"
`.trim();

export interface SlackIncomingWebhookNotificationConfig {
  type: APSBeamNotificationChannel.SlackIncomingWebhook;
  url: string;
  template?: string;
}

export function createNotifierForIncomingSlackWebhook(
  notificationConfig: SlackIncomingWebhookNotificationConfig,
): APSBeamStatusNotifier {
  const {
    url,
    template = DEFAULT_SLACK_INCOMING_WEBHOOK_NOTIFICATION_TEMPLATE,
  } = notificationConfig;
  return async (oldStatus, newStatus) => {
    const text = template
      .replace(/\$oldStatus/g, oldStatus)
      .replace(/\$newStatus/g, newStatus);
    await fetch(url, {
      method: 'post',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ text }),
    });
  };
}
