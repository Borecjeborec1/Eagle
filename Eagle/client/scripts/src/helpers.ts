export function minutes(minutes: number): number {
  return minutes * 60 * 1000;
}
export function seconds(seconds: number): number {
  return seconds * 1000;
}
export function hexToRgb(hex: string): { red: number, green: number, blue: number } | null {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    red: parseInt(result[1], 16),
    green: parseInt(result[2], 16),
    blue: parseInt(result[3], 16)
  } : null;
}