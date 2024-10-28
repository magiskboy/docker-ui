import dayjs from 'dayjs';


export function compareStrings(a: string, b: string): number {
  return a.localeCompare(b);
}


export function compareNumbers(a: number, b: number): number {
  return a === b ? 0 : a < b ? -1 : 1;
}


export function compareDates(a: Date | string | number, b: Date | string | number): number {
  const da = dayjs(a);
  const db = dayjs(b);
  return da.isBefore(db) ? -1 : da.isAfter(db) ? 1 : 0;
}
