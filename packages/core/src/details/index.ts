import {
  DownloadAPSStatusPageOptions,
  downloadAPSStatusPageAsHTML,
} from './download.js';
import { parseAPSBeamDetailsFromStatusPageHTML } from './html.js';
import { APSBeamDetails } from './common.js';

export type GetCurrentAPSBeamDetailsOptions = DownloadAPSStatusPageOptions;

export async function getCurrentAPSBeamDetails(
  options: GetCurrentAPSBeamDetailsOptions = {},
): Promise<APSBeamDetails> {
  const html = await downloadAPSStatusPageAsHTML(options);
  return parseAPSBeamDetailsFromStatusPageHTML(html);
}
