import {
  createAPSBeamStatusEmitter,
  createAPSBeamStatusNotifier,
  APSBeamNotificationChannel,
} from '@aps-beam-notify/core';
import signale from 'signale';

signale.config({
  displayDate: true,
  displayTimestamp: true,
});

// TODO Advanced CLI arg parsing
export async function run() {
  const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!slackWebhookUrl) {
    throw new Error(
      'Please provide a slack webhook URL via the SLACK_WEBHOOK_URL environment variable.',
    );
  }
  const notify = createAPSBeamStatusNotifier({
    type: APSBeamNotificationChannel.SlackIncomingWebhook,
    url: slackWebhookUrl,
  });
  const emitter = createAPSBeamStatusEmitter();
  signale.start('Initializing beam status notifier...');
  emitter.on('error', (error) => {
    signale.error(
      'An error occurred fetching the beam status. Will try again next time.',
      error,
    );
  });
  emitter.once('status', (initialStatus) => {
    signale.success(
      `Initial beam status is "${initialStatus}".`
        + ` Checking every ${emitter.options.interval / 1000} seconds.`
        + ' Will send a slack notification when it changes.',
    );
    emitter.on('status', (status) => {
      signale.note(`Status is still "${status}"`);
    });
    emitter.on('statusChanged', (oldStatus, newStatus) => {
      signale.success(
        `Status changed from "${oldStatus}" to "${newStatus}". Sending notification...`,
      );
      notify(oldStatus, newStatus)
        .then(() => {
          signale.success('Notification sent successfully!');
        })
        .catch((error: Error) => {
          signale.error('Failed to send notification', error);
        });
    });
  });
  emitter.start();
}
