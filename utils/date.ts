export function formatDate(date: Date): string {
  return `${date.getFullYear()}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`
}

/**
 * 指定した日付の週の開始日（日曜日）を取得
 * @param date 基準日
 * @returns 日曜日の0時0分0秒
 */
export function getWeekStart(date: Date = new Date()): Date {
  const result = new Date(date);
  const day = result.getDay(); // 0 (日曜) ~ 6 (土曜)
  result.setDate(result.getDate() - day);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * 指定した日付の週の終了日（土曜日）を取得
 * @param date 基準日
 * @returns 土曜日の23時59分59秒
 */
export function getWeekEnd(date: Date = new Date()): Date {
  const result = new Date(date);
  const day = result.getDay();
  result.setDate(result.getDate() + (6 - day));
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * 指定した日付の月の開始日を取得
 * @param date 基準日
 * @returns 月初の0時0分0秒
 */
export function getMonthStart(date: Date = new Date()): Date {
  const result = new Date(date);
  result.setDate(1);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * 指定した日付の月の終了日を取得
 * @param date 基準日
 * @returns 月末の23時59分59秒
 */
export function getMonthEnd(date: Date = new Date()): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + 1);
  result.setDate(0);
  result.setHours(23, 59, 59, 999);
  return result;
}

export function formatDateKey(date: Date): string {
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
}
