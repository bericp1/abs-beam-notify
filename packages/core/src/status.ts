import { EventEmitter } from 'events';
import {
  getCurrentAPSBeamDetails,
  GetCurrentAPSBeamDetailsOptions,
} from './details/index.js';

export class BeamStatusNotFoundError extends Error {
  constructor() {
    super('The beam Operations Status was not found on the status page.');
    Object.setPrototypeOf(this, BeamStatusNotFoundError.prototype);
  }
}

export const DEFAULT_APS_BEAM_STATUS_DETAIL_LABEL = 'Operations Status';

export interface GetBeamStatusFromDetailsOptions {
  statusDetailLabel?: string;
}

export function getBeamStatusFromDetails(
  details: Map<string, string>,
  {
    statusDetailLabel = DEFAULT_APS_BEAM_STATUS_DETAIL_LABEL,
  }: GetBeamStatusFromDetailsOptions = {},
): string {
  const status = details.get(statusDetailLabel);
  if (!status) {
    throw new BeamStatusNotFoundError();
  }
  return status;
}

export type GetCurrentAPSBeamStatusOptions = GetBeamStatusFromDetailsOptions &
GetCurrentAPSBeamDetailsOptions;

export async function getCurrentAPSBeamStatus(
  options: GetCurrentAPSBeamStatusOptions = {},
): Promise<string> {
  const details = await getCurrentAPSBeamDetails(options);
  return getBeamStatusFromDetails(details, options);
}

export const DEFAULT_APS_BEAM_STATUS_EMITTER_INTERVAL = 30000;

export type APSBeamStatusEmitterOptions = {
  interval: number;
} & GetCurrentAPSBeamStatusOptions;

// TODO Generalize to APS beam details emitter
export interface APSBeamStatusEmitter {
  on(
    event: 'statusChanged',
    listener: (oldStatus: string, newStatus: string) => void,
  ): this;
  on(event: 'status', listener: (status: string) => void): this;
  on(event: 'error', listener: (error: Error) => void): this;
}
export class APSBeamStatusEmitter extends EventEmitter {
  #started: boolean = false;

  #status: string | null = null;

  #options: APSBeamStatusEmitterOptions;

  #timeoutHandler: NodeJS.Timer | null = null;

  constructor(
    options: APSBeamStatusEmitterOptions = {
      interval: DEFAULT_APS_BEAM_STATUS_EMITTER_INTERVAL,
    },
  ) {
    super();
    this.#options = options;
  }

  get options() {
    return this.#options;
  }

  start() {
    if (!this.#started) {
      this.#started = true;
      this.#status = null;
      this.#poll();
    }
  }

  stop() {
    if (this.#started) {
      // TODO Abort active HTTP requests
      this.#started = false;
      this.#status = null;
      if (this.#timeoutHandler) {
        clearTimeout(this.#timeoutHandler);
        this.#timeoutHandler = null;
      }
    }
  }

  async #poll() {
    try {
      const oldStatus = this.#status;
      this.#status = await getCurrentAPSBeamStatus();
      if (typeof oldStatus === 'string' && this.#status !== oldStatus) {
        this.#emitStatusChanged(oldStatus, this.#status);
      } else {
        this.#emitStatus(this.#status);
      }
    } catch (error) {
      this.#emitError(error as Error);
    }
    this.#timeoutHandler = setTimeout(() => {
      this.#timeoutHandler = null;
      this.#poll();
    }, this.#options.interval);
  }

  #emitStatusChanged(oldStatus: string, newStatus: string) {
    this.emit('statusChanged', oldStatus, newStatus);
  }

  #emitStatus(status: string) {
    this.emit('status', status);
  }

  #emitError(error: Error) {
    this.emit('error', error);
  }
}

export function createAPSBeamStatusEmitter(
  options: APSBeamStatusEmitterOptions = {
    interval: DEFAULT_APS_BEAM_STATUS_EMITTER_INTERVAL,
  },
): APSBeamStatusEmitter {
  return new APSBeamStatusEmitter(options);
}
