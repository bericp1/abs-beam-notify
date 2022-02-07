import { setTimeout, clearTimeout } from 'timers';
import http from 'http';
import https from 'https';
import fetch, { AbortError, RequestInit, Response } from 'node-fetch';
import { RequestError } from '../RequestError.js';

const httpAgent = new http.Agent({
  keepAlive: true,
});

const httpsAgent = new https.Agent({
  keepAlive: true,
});

async function fetchWithTimeout(
  url: string,
  init: RequestInit & { timeout: number },
): Promise<Response> {
  const abortController = new AbortController();
  const abortTimeoutHandle = setTimeout(() => {
    abortController.abort();
  }, init.timeout);
  try {
    return await fetch(url, {
      ...init,
      signal: abortController.signal,
      agent: (_parsedUrl) => (_parsedUrl.protocol === 'http:' ? httpAgent : httpsAgent),
    });
  } finally {
    clearTimeout(abortTimeoutHandle);
  }
}

export const DEFAULT_APS_URL = 'https://www3.aps.anl.gov/aod/blops/status/srStatus.html';

export const DEFAULT_APS_TIMEOUT = 10000;

export class APSStatusPageTimeoutError extends Error {
  constructor() {
    super('Timed out while trying to reach the APS status beam status page.');
    Object.setPrototypeOf(this, APSStatusPageTimeoutError.prototype);
  }
}

export interface DownloadAPSStatusPageOptions {
  timeout?: number;
  url?: string;
}

export async function downloadAPSStatusPageAsHTML({
  timeout = DEFAULT_APS_TIMEOUT,
  url = DEFAULT_APS_URL,
}: DownloadAPSStatusPageOptions = {}): Promise<string> {
  let response: Response;
  try {
    response = await fetchWithTimeout(url, {
      timeout,
      method: 'get',
    });
  } catch (error) {
    if (error instanceof AbortError) {
      throw new APSStatusPageTimeoutError();
    }
    throw error;
  }
  if (response.ok) {
    return response.text();
  }
  throw new RequestError({ response });
}
