import dayjs from 'dayjs';

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));


export function formatBytes(bytes: number, decimals?: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const num = parseFloat((bytes / Math.pow(k, i)).toFixed(i < 2 ? 0 : (decimals ?? 0)));
    return `${num} ${sizes[i]}`;
}

export function formatRelativeDate(date: Date | string | number | dayjs.Dayjs): string {
  return String(dayjs(date).from(dayjs()));
}

