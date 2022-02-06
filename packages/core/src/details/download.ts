import { setTimeout, clearTimeout } from 'timers';
import fetch, { AbortError } from 'node-fetch';

export const DEFAULT_APS_URL = 'https://www3.aps.anl.gov/aod/blops/status/srStatus.html';

export const DEFAULT_ASP_TIMEOUT = 10000;

export class APSTimeoutError extends Error {
  constructor() {
    super('Timed out while trying to reach the APS status beam status page.');
    Object.setPrototypeOf(this, APSTimeoutError.prototype);
  }
}

export interface APSStatusPageDownloadOptions {
  timeout?: number;
  url?: string;
}

export async function downloadAPSStatusPageAsHTML({
  timeout = DEFAULT_ASP_TIMEOUT,
  url = DEFAULT_APS_URL,
}: APSStatusPageDownloadOptions = {}): Promise<string> {
  const abortController = new AbortController();
  const abortTimeoutHandle = setTimeout(() => {
    abortController.abort();
  }, timeout);
  try {
    const resp = await fetch(url, {
      method: 'get',
      signal: abortController.signal,
    });
    return await resp.text();
  } catch (error) {
    if (error instanceof AbortError) {
      throw new APSTimeoutError();
    }
    throw error;
  } finally {
    clearTimeout(abortTimeoutHandle);
  }
}
