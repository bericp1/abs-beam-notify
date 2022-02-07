import { APSBeamDetails } from './common.js';

export function diffAPSBeamDetails(
  oldDetails: APSBeamDetails,
  newDetails: APSBeamDetails,
): (keyof APSBeamDetails)[] {
  const changedDetails: (keyof APSBeamDetails)[] = [];
  for (const [detailKey, oldValue] of Object.entries(oldDetails) as [
    keyof APSBeamDetails,
    string | null,
  ][]) {
    const newValue = newDetails[detailKey];
    if (oldValue !== newValue) {
      changedDetails.push(detailKey);
    }
  }
  return changedDetails;
}
