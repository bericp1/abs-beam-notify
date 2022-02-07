import {
  APSBeamDetails,
  APSBeamDetailsChangeNotificationType,
  APSBeamDetailsChangeNotifierManager,
} from '@aps-beam-notify/core';
import signale from 'signale';

signale.config({
  displayDate: true,
  displayTimestamp: true,
});

// TODO Advanced CLI arg parsing
export async function run() {
  const rawSlackWebhookUrl = `${process.env.SLACK_WEBHOOK_URL || ''}`.trim();
  const slackWebhookUrls = rawSlackWebhookUrl
    .split(',')
    .map((url) => url.trim());
  if (!slackWebhookUrls.length) {
    throw new Error(
      'Please provide a slack webhook URL (or multiple, comma separated) via the SLACK_WEBHOOK_URL environment variable.',
    );
  }
  const manager = new APSBeamDetailsChangeNotifierManager({
    watching: ['operationStatus'],
    notificationConfigs: slackWebhookUrls.map((url) => ({
      type: APSBeamDetailsChangeNotificationType.SlackIncomingWebhook,
      url,
    })),
    onNotificationSendStarted: ({ oldDetails, newDetails }) => {
      signale.info(
        `Status changed from "${oldDetails.operationStatus}" to "${newDetails.operationStatus}". Sending notification(s)...`,
      );
    },
    onNotificationSendCompleted: () => {
      signale.success('Notifications sent successfully!');
    },
    onNotificationSendFailed: (error) => {
      signale.error('Failed to send notification.', error);
    },
  });
  signale.start('Initializing beam status notifier...');
  manager.on('error', (error) => {
    signale.error(
      'An error occurred fetching the beam status. Will try again next time.',
      error,
    );
  });
  manager.once('details', (initialDetails: APSBeamDetails) => {
    signale.success(
      `Initial beam status is "${initialDetails.operationStatus}".`
        + ` Checking every ${manager.options.interval / 1000} seconds.`
        + ' Will send a slack notification when it changes.',
    );
    manager.on('details', (details: APSBeamDetails) => {
      signale.note(`Status is still "${details.operationStatus}"`);
    });
  });
  manager.start();
}
