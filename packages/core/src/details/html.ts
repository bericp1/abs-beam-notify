import cheerio, { Cheerio, CheerioAPI, Element } from 'cheerio';
import chunk from 'lodash.chunk';

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
            /(?<rawKey>[^:]+):(?<rawValue>[^:]+)/i,
          );
          if (matches) {
            const key = matches.groups?.rawKey?.trim();
            const value = matches.groups?.rawValue?.trim();
            if (key && value) {
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

export function parseBeamDetailsFromAPSStatusPageHTML(
  html: string,
): Map<string, string> {
  const $ = cheerio.load(html);
  const $tables = $('table');
  const mainStatuses = parseStatusCellTriplesFromTable($, $tables.eq(0));
  const details = parseStatusCellTriplesFromTable($, $tables.eq(1));
  return new Map<string, string>([
    ...mainStatuses.entries(),
    ...details.entries(),
  ]);
}
