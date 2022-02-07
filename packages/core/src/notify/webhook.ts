import fetch, { RequestInit } from 'node-fetch';
import { RequestError } from '../RequestError.js';
import { APSBeamDetails } from '../details/common.js';
import {
  APSBeamDetailsChangeNotifier,
  APSBeamDetailsChangeNotificationType,
  BaseAPSBeamDetailsNotificationConfig,
} from './common.js';

export type WebhookNotificationBuildRequestOptions = (data: {
  oldDetails: APSBeamDetails;
  newDetails: APSBeamDetails;
  changedDetails: (keyof APSBeamDetails)[];
  watchingChangedDetails: (keyof APSBeamDetails)[];
}) => Partial<RequestInit>;

export const defaultBuildWebhookRequestOptions: WebhookNotificationBuildRequestOptions = ({
  oldDetails, newDetails, changedDetails, watchingChangedDetails,
}) => ({
  method: 'post',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({
    oldDetails,
    newDetails,
    changedDetails,
    watchingChangedDetails,
  }),
});

export interface WebhookNotificationConfig
  extends BaseAPSBeamDetailsNotificationConfig {
  type: APSBeamDetailsChangeNotificationType.Webhook;
  url: string;
  buildRequestOptions?: WebhookNotificationBuildRequestOptions;
}

export function createWebhookAPSBeamDetailsChangeNotifier(
  notificationConfig: WebhookNotificationConfig,
): APSBeamDetailsChangeNotifier {
  const { url, buildRequestOptions = defaultBuildWebhookRequestOptions } = notificationConfig;
  return async ({
    oldDetails,
    newDetails,
    changedDetails,
    watchingChangedDetails,
  }) => {
    const response = await fetch(
      url,
      buildRequestOptions({
        oldDetails,
        newDetails,
        changedDetails,
        watchingChangedDetails,
      }),
    );
    if (!response.ok) {
      throw new RequestError({ response });
    }
  };
}
