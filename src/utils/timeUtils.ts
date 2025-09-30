/**
 * 時間フォーマット関連のユーティリティ関数
 */

/**
 * 時間文字列を「HH:MM」形式に統一フォーマット
 * @param timeString - 入力時間文字列（様々な形式に対応）
 * @returns HH:MM形式の時間文字列
 */
export const formatTimeToHHMM = (timeString: string): string => {
  if (!timeString) return '00:00';
  
  // 既にHH:MM形式の場合はそのまま返す（ゼロパディング確認）
  if (/^\d{2}:\d{2}$/.test(timeString)) {
    return timeString;
  }
  
  // HH:MM:SS形式の場合は秒を削除
  if (/^\d{1,2}:\d{2}:\d{2}$/.test(timeString)) {
    return timeString.substring(0, 5).padStart(5, '0');
  }
  
  // H:MM形式の場合はゼロパディング
  if (/^\d{1}:\d{2}$/.test(timeString)) {
    const [hour, minute] = timeString.split(':');
    return `${hour.padStart(2, '0')}:${minute}`;
  }
  
  // HH:MM:SS.sss形式（ミリ秒付き）の場合は秒とミリ秒を削除
  if (/^\d{1,2}:\d{2}:\d{2}\.\d+$/.test(timeString)) {
    return timeString.substring(0, 5).padStart(5, '0');
  }
  
  // 日本語形式「午前X時」「午後X時」の処理
  const japaneseTimeMatch = timeString.match(/^(午前|午後)(\d{1,2})時$/);
  if (japaneseTimeMatch) {
    const [, period, hourStr] = japaneseTimeMatch;
    let hour = parseInt(hourStr, 10);
    
    // 午後の場合は12時間を加算（ただし12時は除く）
    if (period === '午後' && hour !== 12) {
      hour += 12;
    }
    // 午前12時は0時に変換
    if (period === '午前' && hour === 12) {
      hour = 0;
    }
    
    return `${hour.toString().padStart(2, '0')}:00`;
  }
  
  // その他の形式の場合はデフォルト値を返す
  console.warn(`Unsupported time format: ${timeString}`);
  return '00:00';
};

/**
 * 時間文字列を表示用にフォーマット（常にHH:MM形式）
 * @param timeString - 時間文字列
 * @returns HH:MM形式の時間文字列
 */
export const displayTime = (timeString: string): string => {
  return formatTimeToHHMM(timeString);
};

/**
 * 勤務時間を計算（HH:MM形式で返す）
 * @param startTime - 開始時間（HH:MM形式）
 * @param endTime - 終了時間（HH:MM形式）
 * @returns 勤務時間の文字列（例：「8時間30分」）
 */
export const calculateWorkDuration = (startTime: string, endTime: string): string => {
  const start = formatTimeToHHMM(startTime);
  const end = formatTimeToHHMM(endTime);
  
  const [startHour, startMinute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;
  
  if (endMinutes <= startMinutes) {
    return '0時間';
  }
  
  const diffMinutes = endMinutes - startMinutes;
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  
  return minutes > 0 ? `${hours}時間${minutes}分` : `${hours}時間`;
};