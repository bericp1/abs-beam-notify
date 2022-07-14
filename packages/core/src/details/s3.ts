import fetch from 'node-fetch';
import AWS from 'aws-sdk';
import path from 'path';
import { APSBeamDetails } from 'src/details/common';

function parseS3Location(s3Location: string): {
  bucket: string;
  prefix: string;
} {
  let url: URL;
  try {
    url = new URL(s3Location);
  } catch (urlParseError) {
    const error: Error & { cause?: Error } = new Error(
      'Failed to parse s3 location. Make sure it is in the form s3://bucket/key',
    );
    error.cause = urlParseError as Error;
    throw error;
  }
  if (url.protocol !== 's3:') {
    throw new Error(
      'Failed to parse s3 location. Make sure it is in the form s3://bucket/key',
    );
  }
  return {
    bucket: url.host.toString(),
    prefix: url.pathname.replace(/^\/+/, '').replace(/\/+$/, '').trim(),
  };
}

async function uploadImageAndReturnPublicURL(
  url: string,
  {
    bucket,
    prefix,
    filePrefix = '',
  }: { bucket: string; prefix: string; filePrefix?: string },
): Promise<string> {
  const s3 = new AWS.S3();
  const { pathname: originalFilePathname } = new URL(url);
  const originalFilename = path.basename(originalFilePathname);
  const headImageResponse = await fetch(url, { method: 'head' });
  const rawEtag = headImageResponse.headers.get('etag') || `${process.hrtime.bigint()}`;
  const etag = rawEtag.replace(/^"+/, '').replace(/"+$/, '').trim();
  const key = `${prefix}/${filePrefix}${etag}-${originalFilename}`;
  const baseParams = {
    Bucket: bucket,
    Key: key,
  };
  try {
    await s3.headObject(baseParams).promise();
    return `https://${bucket}.s3.amazonaws.com/${key}`;
  } catch (ignored) {
    // ignored
  }
  const imageResponse = await fetch(url, { method: 'get' });
  const result = await s3
    .upload({
      ...baseParams,
      Body: imageResponse.body || undefined,
      ACL: 'public-read',
      ContentType: imageResponse.headers.get('content-type') || undefined,
      ContentLength:
        parseInt(imageResponse.headers.get('content-length') || '', 10)
        || undefined,
    })
    .promise();
  return result.Location;
}

export async function uploadImagesToS3AndTransformDetails(
  currentDetails: APSBeamDetails,
  s3Location: string,
): Promise<APSBeamDetails> {
  const { bucket, prefix } = parseS3Location(s3Location);
  let newDetails = currentDetails;
  if (currentDetails.historyPlotPNGSrc) {
    newDetails = {
      ...newDetails,
      historyPlotPNGSrc: await uploadImageAndReturnPublicURL(
        currentDetails.historyPlotPNGSrc,
        { bucket, prefix },
      ),
    };
  }
  return newDetails;
}
