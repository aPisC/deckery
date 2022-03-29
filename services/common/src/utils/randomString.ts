const defaultSource = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function randomString(length: number, source: string = defaultSource): string {
  return Array(length)
    .fill(0)
    .map((x) => source[Math.floor(Math.random() * source.length)])
    .join('');
}
