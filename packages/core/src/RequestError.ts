import { Response } from 'node-fetch';

export class RequestError extends Error {
  #response: Response;

  constructor({ response }: { response: Response }) {
    super('An HTTP request failed.');
    this.#response = response;
  }

  get response() {
    return this.#response;
  }
}
