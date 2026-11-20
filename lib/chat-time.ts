export const CHAT_TIME_GAP_MS = 2 * 60 * 60 * 1000

export function needsChatTimeSeparator(current: number, previous?: number) {
  return previous !== undefined && current - previous >= CHAT_TIME_GAP_MS
}
