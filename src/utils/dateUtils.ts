/**
 * 日本標準時（JST）での日付操作ユーティリティ
 */

/**
 * 現在の日本時間での日付を取得
 */
export const getJSTDate = (): Date => {
  const now = new Date();
  // 日本時間（UTC+9）での現在時刻を取得
  const jstTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  return jstTime;
};

/**
 * 日付をYYYY-MM-DD形式の文字列に変換（JST基準）
 */
export const formatJSTDateToYYYYMMDD = (date: Date): string => {
  // 日本時間での日付文字列を取得
  return date.toLocaleDateString('sv-SE', { timeZone: 'Asia/Tokyo' });
};

/**
 * 日付を表示用にフォーマット（JST基準）
 */
export const formatJSTDateForDisplay = (date: Date): string => {
  const formatted = date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    timeZone: 'Asia/Tokyo'
  });
  
  // 曜日を括弧書きに変換
  return formatted
    .replace('日曜日', '(日)')
    .replace('月曜日', '(月)')
    .replace('火曜日', '(火)')
    .replace('水曜日', '(水)')
    .replace('木曜日', '(木)')
    .replace('金曜日', '(金)')
    .replace('土曜日', '(土)');
};

/**
 * 日付文字列（YYYY-MM-DD）からDateオブジェクトを作成（JST基準）
 */
export const parseJSTDateString = (dateString: string): Date => {
  // YYYY-MM-DD形式の文字列を日本時間のDateオブジェクトに変換
  const [year, month, day] = dateString.split('-').map(Number);
  // 月は0ベースなので-1する
  return new Date(year, month - 1, day);
};

/**
 * 前日の日付を取得（JST基準）
 */
export const getYesterdayJST = (): Date => {
  const today = getJSTDate();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  return yesterday;
};

/**
 * 翌日の日付を取得（JST基準）
 */
export const getTomorrowJST = (): Date => {
  const today = getJSTDate();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  return tomorrow;
};