/**
 * メートルをキロメートルに変換してフォーマット
 * @param meters メートル単位の距離
 * @returns "X.X" 形式の文字列（km）
 */
export function formatDistance(meters: number): string {
  return (meters / 1000).toFixed(1);
}

/**
 * 秒を時間表示にフォーマット
 * @param seconds 秒数
 * @returns "X時間Y分" または "Y分" 形式の文字列
 */
export function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  
  if (hrs > 0) {
    return `${hrs}時間${mins}分`;
  }
  return `${mins}分`;
}