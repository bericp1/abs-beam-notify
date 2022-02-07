import { formatListInEnglish } from '../english.js';
import { APSBeamDetails, APS_BEAM_DETAIL_LABELS } from '../details/common.js';
import {
  APSBeamDetailsChangeNotificationType,
  APSBeamDetailsChangeNotifier,
} from './common.js';
import {
  createWebhookAPSBeamDetailsChangeNotifier,
  WebhookNotificationBuildRequestOptions,
  WebhookNotificationConfig,
} from './webhook.js';

export interface SlackIncomingWebhookNotificationConfig
  extends Omit<WebhookNotificationConfig, 'buildRequestOptions' | 'type'> {
  type: APSBeamDetailsChangeNotificationType.SlackIncomingWebhook;
  url: string;
}

export function buildHeadingForSlackNotification({
  watchingChangedDetails,
}: {
  watchingChangedDetails: (keyof APSBeamDetails)[];
}) {
  if (
    watchingChangedDetails.length === 1
    || watchingChangedDetails.length === 2
  ) {
    const labels = watchingChangedDetails.map(
      (detail) => APS_BEAM_DETAIL_LABELS[detail],
    );
    const list = formatListInEnglish(labels);
    return `Change in APS Storage Ring ${list}`;
  }
  return 'Change in APS Storage Ring details';
}

export function buildSlackSectionsForAPSBeamDetailChanges({
  oldDetails,
  newDetails,
  changedDetails,
}: {
  oldDetails: APSBeamDetails;
  newDetails: APSBeamDetails;
  changedDetails: (keyof APSBeamDetails)[];
}): object[] {
  return changedDetails.map((detail) => ({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `*${APS_BEAM_DETAIL_LABELS[detail]}* changed from \`${oldDetails[detail]}\` to \`${newDetails[detail]}\``,
    },
  }));
}

export const defaultBuildSlackIncomingWebhookRequestOptions: WebhookNotificationBuildRequestOptions = ({
  oldDetails, newDetails, changedDetails, watchingChangedDetails,
}) => {
  const heading = buildHeadingForSlackNotification({
    watchingChangedDetails,
  });
  const mainChangesSections = buildSlackSectionsForAPSBeamDetailChanges({
    oldDetails,
    newDetails,
    changedDetails: watchingChangedDetails,
  });

  const notWatchingChangedDetails = changedDetails.filter(
    (detail) => !watchingChangedDetails.includes(detail),
  );
  const secondaryChangesSectionsAndHeading = !notWatchingChangedDetails.length
    ? []
    : [
      {
        type: 'header',
        text: { type: 'plain_text', text: 'Other changes' },
      },
      ...buildSlackSectionsForAPSBeamDetailChanges({
        oldDetails,
        newDetails,
        changedDetails: notWatchingChangedDetails,
      }),
    ];

  const unchangedDetails = (
    Object.keys(oldDetails) as (keyof APSBeamDetails)[]
  ).filter(
    (detail) => !changedDetails.includes(detail)
        && detail !== 'historyPlotPNGSrc'
        && newDetails[detail],
  );

  const unchangedSectionsAndHeading = !unchangedDetails.length
    ? []
    : [
      {
        type: 'header',
        text: { type: 'plain_text', text: 'Everything else' },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `- ${unchangedDetails
            .map(
              (detail) => `*${APS_BEAM_DETAIL_LABELS[detail]}* is \`${newDetails[detail]}\``,
            )
            .join('\n- ')}`,
        },
      },
    ];

  const imageBlocks = newDetails.historyPlotPNGSrc
    ? [
      {
        type: 'image',
        title: {
          type: 'plain_text',
          text: 'Snapshot of APS Storage Ring history',
        },
        image_url: newDetails.historyPlotPNGSrc,
        alt_text:
              'A plot depciting the prevoius 24 hours of the status of the APS Storage Ring.',
      },
    ]
    : [];

  return {
    method: 'post',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      blocks: [
        { type: 'header', text: { type: 'plain_text', text: heading } },
        ...mainChangesSections,
        ...secondaryChangesSectionsAndHeading,
        ...unchangedSectionsAndHeading,
        ...imageBlocks,
      ],
    }),
  };
};

export function createSlackIncomingWebhookAPSBeamDetailsChangeNotifier(
  notificationConfig: SlackIncomingWebhookNotificationConfig,
): APSBeamDetailsChangeNotifier {
  return createWebhookAPSBeamDetailsChangeNotifier({
    ...notificationConfig,
    type: APSBeamDetailsChangeNotificationType.Webhook,
    buildRequestOptions: defaultBuildSlackIncomingWebhookRequestOptions,
  });
}
