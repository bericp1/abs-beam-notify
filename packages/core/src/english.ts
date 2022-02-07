export function formatListInEnglish(
  list: string[],
  conjunction: string = 'and',
) {
  if (list.length <= 1) {
    return list[0];
  }
  const start = list.length === 2 ? list[0] : `${list.slice(0, -1).join(', ')},`;
  return `${start} ${conjunction} ${list[list.length - 1]}`;
}
