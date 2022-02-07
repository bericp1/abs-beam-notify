import { APSBeamDetails } from '../details/common.js';

export type APSBeamDetailsChangeNotifier = (data: {
  oldDetails: APSBeamDetails;
  newDetails: APSBeamDetails;
  changedDetails: (keyof APSBeamDetails)[];
  watchingChangedDetails: (keyof APSBeamDetails)[];
}) => Promise<void>;

export enum APSBeamDetailsChangeNotificationType {
  Webhook = 'Webhook',
  SlackIncomingWebhook = 'SlackIncomingWebhook',
}

export interface BaseAPSBeamDetailsNotificationConfig {}
