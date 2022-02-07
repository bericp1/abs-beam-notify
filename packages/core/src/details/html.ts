import * as cheerio from 'cheerio';
import type { Cheerio, CheerioAPI, Element } from 'cheerio';
import chunk from 'lodash.chunk';
import { DEFAULT_APS_URL } from './download.js';
import { APSBeamDetails, APS_BEAM_DETAIL_LABELS } from './common.js';

function parseStatusCellTriplesFromTable(
  $: CheerioAPI,
  $table: Cheerio<Element>,
): Map<string, string> {
  return new Map(
    $table
      .find('tr')
      .toArray()
      .map(($row) => chunk($($row).find('td').toArray(), 3).reduce(
        (pairs: [string, string][], cells) => {
          const chunkText = $(cells).text().trim().replace(/\n+/g, '');
          const matches = chunkText.match(
            /(?<rawKey>[^:]+):(?<rawValue>[^:]*)/i,
          );
          if (matches) {
            const key = matches.groups?.rawKey?.trim();
            const value = matches.groups?.rawValue?.trim();
            if (key && typeof value !== 'undefined') {
              pairs.push([key, value]);
            }
          }
          return pairs;
        },
        [],
      ))
      .flat(),
  );
}

function buildAPSBeamDetailsFromScrapedHTMLData({
  simpleDetailsFromHTML = new Map(),
  historyPlotPNGSrc = null,
}: {
  simpleDetailsFromHTML?: Map<string, string>;
  historyPlotPNGSrc?: string | null;
} = {}): APSBeamDetails {
  const getSimpleDetail: (detailKey: keyof APSBeamDetails) => string | null = (
    detailKey,
  ) => {
    const simpleDetailValue = simpleDetailsFromHTML.get(
      APS_BEAM_DETAIL_LABELS[detailKey],
    );
    return typeof simpleDetailValue === 'undefined' ? null : simpleDetailValue;
  };
  return {
    beamCurrent: getSimpleDetail('beamCurrent'),
    beamlinesOperating: getSimpleDetail('beamlinesOperating'),
    fillPattern: getSimpleDetail('fillPattern'),
    floorCoordinator: getSimpleDetail('floorCoordinator'),
    globalFeedback: getSimpleDetail('globalFeedback'),
    lastDumpTripReason: getSimpleDetail('lastDumpTripReason'),
    localSteering: getSimpleDetail('localSteering'),
    nextFillInformation: getSimpleDetail('nextFillInformation'),
    operationStatus: getSimpleDetail('operationStatus'),
    operatorsInCharge: getSimpleDetail('operatorsInCharge'),
    problemInformation: getSimpleDetail('problemInformation'),
    historyPlotPNGSrc: historyPlotPNGSrc
      ? new URL(historyPlotPNGSrc, DEFAULT_APS_URL).toString()
      : null,
  };
}

export function parseAPSBeamDetailsFromStatusPageHTML(
  html: string,
): APSBeamDetails {
  const $ = cheerio.load(html);
  const $tables = $('table');
  const simpleDetailsFromHTML = new Map([
    ...parseStatusCellTriplesFromTable($, $tables.eq(0)),
    ...parseStatusCellTriplesFromTable($, $tables.eq(1)),
  ]);
  const $plotImg = $('img[src*="plot" i]').first();
  const rawHistoryPlotPNGSrc = $plotImg.length ? $plotImg.attr('src') : null;
  return buildAPSBeamDetailsFromScrapedHTMLData({
    simpleDetailsFromHTML,
    historyPlotPNGSrc: rawHistoryPlotPNGSrc
      ? `${rawHistoryPlotPNGSrc}?ts=${Date.now()}`
      : null,
  });
}
