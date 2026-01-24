/**
 * メートルをキロメートルに変換してフォーマット
 * @param meters メートル単位の距離
 * @param decimals 小数点以下の桁数（デフォルト: 1）
 * @returns "X.X" または "X.XX" 形式の文字列（km）
 */
export function formatDistance(meters: number, decimals: number = 1): string {
  return (meters / 1000).toFixed(decimals);
}

/**
 * 秒を時間表示にフォーマット
 * @param seconds 秒数
 * @returns "X時間Y分" または "Y分" 形式の文字列
 */
export function formatDurationJa(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  
  if (hrs > 0) {
    return `${hrs}時間${mins}分`;
  }
  return `${mins}分`;
}

/**
 * 秒を時計形式にフォーマット
 * @param seconds 秒数
 * @returns "HH:MM:SS" 形式の文字列
 */
export function formatDurationHMS(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}