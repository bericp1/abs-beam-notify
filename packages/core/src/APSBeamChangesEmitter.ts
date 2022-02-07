import { EventEmitter } from 'events';
import {
  getCurrentAPSBeamDetails,
  GetCurrentAPSBeamDetailsOptions,
} from './details/index.js';
import { APSBeamDetails } from './details/common.js';
import { diffAPSBeamDetails } from './details/diff.js';

export const DEFAULT_APS_BEAM_CHANGES_EMITTER_INTERVAL = 10000;

export const DEFAULT_APS_BEAM_CHANGES_EMITTER_IGNORE: (keyof APSBeamDetails)[] = ['historyPlotPNGSrc'];

export type APSBeamChangesEmitterOptions = {
  interval: number;
  ignore: (keyof APSBeamDetails)[];
} & GetCurrentAPSBeamDetailsOptions;

export interface APSBeamChangesEmitter {
  on(
    event: 'change',
    listener: (
      oldDetails: APSBeamDetails,
      newDetails: APSBeamDetails,
      changed: (keyof APSBeamDetails)[],
    ) => void,
  ): this;
  on(event: 'details', listener: (details: APSBeamDetails) => void): this;
  on(event: 'error', listener: (error: Error) => void): this;
}
export class APSBeamChangesEmitter extends EventEmitter {
  #started: boolean = false;

  #details: APSBeamDetails | null = null;

  #options: APSBeamChangesEmitterOptions;

  #timeoutHandler: NodeJS.Timer | null = null;

  constructor(options: Partial<APSBeamChangesEmitterOptions> = {}) {
    super();
    this.#options = {
      interval: DEFAULT_APS_BEAM_CHANGES_EMITTER_INTERVAL,
      ignore: DEFAULT_APS_BEAM_CHANGES_EMITTER_IGNORE,
      ...options,
    };
  }

  get options() {
    return this.#options;
  }

  start() {
    if (!this.#started) {
      this.#started = true;
      this.#details = null;
      this.#poll();
    }
  }

  stop() {
    if (this.#started) {
      // TODO Abort active HTTP requests
      this.#started = false;
      this.#details = null;
      if (this.#timeoutHandler) {
        clearTimeout(this.#timeoutHandler);
        this.#timeoutHandler = null;
      }
    }
  }

  async #poll() {
    try {
      const oldDetails = this.#details;
      this.#details = await getCurrentAPSBeamDetails(this.#options);
      const allChangedDetails = oldDetails
        ? diffAPSBeamDetails(oldDetails, this.#details)
        : [];
      const changedDetails = allChangedDetails.filter(
        (detail) => !this.options.ignore.includes(detail),
      );
      if (oldDetails && changedDetails.length) {
        this.#emitChange(oldDetails, this.#details, changedDetails);
      } else {
        this.#emitDetails(this.#details);
      }
    } catch (error) {
      this.#emitError(error as Error);
    }
    this.#timeoutHandler = setTimeout(() => {
      this.#timeoutHandler = null;
      this.#poll();
    }, this.#options.interval);
  }

  #emitChange(
    oldDetails: APSBeamDetails,
    newDetails: APSBeamDetails,
    changed: (keyof APSBeamDetails)[],
  ) {
    this.emit('change', oldDetails, newDetails, changed);
  }

  #emitDetails(details: APSBeamDetails) {
    this.emit('details', details);
  }

  #emitError(error: Error) {
    this.emit('error', error);
  }
}
