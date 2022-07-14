import {
  DownloadAPSStatusPageOptions,
  downloadAPSStatusPageAsHTML,
} from './download.js';
import { parseAPSBeamDetailsFromStatusPageHTML } from './html.js';
import { APSBeamDetails } from './common.js';
import { uploadImagesToS3AndTransformDetails } from './s3.js';

export type GetCurrentAPSBeamDetailsOptions = DownloadAPSStatusPageOptions & {
  s3LocationForImages?: string | null;
};

export async function getCurrentAPSBeamDetails({
  s3LocationForImages,
  ...downloadOptions
}: GetCurrentAPSBeamDetailsOptions = {}): Promise<APSBeamDetails> {
  const html = await downloadAPSStatusPageAsHTML(downloadOptions);
  const details = parseAPSBeamDetailsFromStatusPageHTML(html);
  if (s3LocationForImages) {
    return uploadImagesToS3AndTransformDetails(details, s3LocationForImages);
  }
  return details;
}
