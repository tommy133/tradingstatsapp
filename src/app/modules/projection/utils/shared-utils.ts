export function getUpdownLabel(updown: number | null) {
  if (updown === null) return 'Not defined';
  return updown ? 'LONG' : 'SHORT';
}
