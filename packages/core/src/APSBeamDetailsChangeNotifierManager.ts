import { APSBeamDetails } from './details/common.js';
import {
  APSBeamChangesEmitter,
  APSBeamChangesEmitterOptions,
} from './APSBeamChangesEmitter.js';
import {
  APSBeamDetailsChangeNotificationConfig,
  createAPSSBeamStatusNotifierForManyConfigs,
} from './notify/index.js';
import { APSBeamDetailsChangeNotifier } from './notify/common.js';

export interface APSBeamDetailsChangeNotifierManagerOptions {
  watching: (keyof APSBeamDetails)[];
  notificationConfigs: APSBeamDetailsChangeNotificationConfig[];
  emitterOptions?: Partial<APSBeamChangesEmitterOptions>;
  onNotificationSendStarted?: (data: {
    oldDetails: APSBeamDetails;
    newDetails: APSBeamDetails;
    changedDetails: (keyof APSBeamDetails)[];
  }) => void;
  onNotificationSendCompleted?: (data: {
    oldDetails: APSBeamDetails;
    newDetails: APSBeamDetails;
    changedDetails: (keyof APSBeamDetails)[];
  }) => void;
  onNotificationSendFailed?: (
    error: Error,
    data: {
      oldDetails: APSBeamDetails;
      newDetails: APSBeamDetails;
      changedDetails: (keyof APSBeamDetails)[];
    },
  ) => void;
}

export class APSBeamDetailsChangeNotifierManager extends APSBeamChangesEmitter {
  #notifierOptions: APSBeamDetailsChangeNotifierManagerOptions;

  sendNotifications: APSBeamDetailsChangeNotifier;

  constructor(options: APSBeamDetailsChangeNotifierManagerOptions) {
    super(options.emitterOptions || {});
    this.#notifierOptions = options;
    this.sendNotifications = createAPSSBeamStatusNotifierForManyConfigs(
      options.notificationConfigs,
    );
    this.on(
      'change',
      (
        oldDetails: APSBeamDetails,
        newDetails: APSBeamDetails,
        changedDetails: (keyof APSBeamDetails)[],
      ) => {
        const watchingChangedDetails = changedDetails.filter((detail) => this.#notifierOptions.watching.includes(detail));
        if (watchingChangedDetails.length > 0) {
          // TODO store promise for cancellation or awaiting of some sort somewhere maybe? Like a flush?
          this.#notifierOptions.onNotificationSendStarted?.({
            oldDetails,
            newDetails,
            changedDetails,
          });
          this.sendNotifications({
            oldDetails,
            newDetails,
            changedDetails,
            watchingChangedDetails,
          })
            .then(() => {
              this.#notifierOptions.onNotificationSendCompleted?.({
                oldDetails,
                newDetails,
                changedDetails,
              });
            })
            .catch((error) => {
              this.#notifierOptions.onNotificationSendFailed?.(error, {
                oldDetails,
                newDetails,
                changedDetails,
              });
            });
        }
      },
    );
  }

  get notifierOptions() {
    return this.#notifierOptions;
  }
}
