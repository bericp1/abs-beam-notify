import {
  APSStatusPageDownloadOptions,
  downloadAPSStatusPageAsHTML,
} from './download.js';
import { parseBeamDetailsFromAPSStatusPageHTML } from './html.js';

export type GetCurrentAPSBeamDetailsOptions = APSStatusPageDownloadOptions;

export async function getCurrentAPSBeamDetails(
  options: GetCurrentAPSBeamDetailsOptions = {},
): Promise<Map<string, string>> {
  const html = await downloadAPSStatusPageAsHTML(options);
  return parseBeamDetailsFromAPSStatusPageHTML(html);
}
