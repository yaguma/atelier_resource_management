/**
 * 日付フォーマット関数
 * 🔴 信頼性レベル: 一般的な日付フォーマット機能のベストプラクティス
 */

/**
 * 日付をDateオブジェクトに変換する（共通処理）
 * @param date - 変換対象の日付（Date、文字列、数値）
 * @returns Dateオブジェクト
 * @throws 無効な日付形式の場合
 */
function toDate(date: Date | string | number): Date {
  // nullやundefinedのチェック
  if (date === null || date === undefined) {
    throw new Error('日付がnullまたはundefinedです');
  }

  // Dateオブジェクトに変換
  let dateObj: Date;
  if (date instanceof Date) {
    dateObj = date;
  } else if (typeof date === 'string') {
    dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      throw new Error('無効な日付文字列です');
    }
  } else if (typeof date === 'number') {
    dateObj = new Date(date);
  } else {
    throw new Error('無効な日付形式です');
  }

  return dateObj;
}

/**
 * 日付をフォーマットする
 * @param date - フォーマット対象の日付（Date、文字列、数値）
 * @param format - フォーマット文字列（デフォルト: 'YYYY-MM-DD HH:mm:ss'）
 * @returns フォーマットされた日付文字列
 */
export function formatDate(
  date: Date | string | number,
  format: string = 'YYYY-MM-DD HH:mm:ss',
): string {
  const dateObj = toDate(date);

  // フォーマット文字列を置換
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const seconds = String(dateObj.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * 日付をISO 8601形式でフォーマットする
 * @param date - フォーマット対象の日付（Date、文字列、数値）
 * @returns ISO 8601形式の日付文字列
 */
export function formatDateISO(date: Date | string | number): string {
  const dateObj = toDate(date);
  return dateObj.toISOString();
}

/**
 * 日付を短い形式（YYYY-MM-DD）でフォーマットする
 * @param date - フォーマット対象の日付（Date、文字列、数値）
 * @returns 短い形式の日付文字列
 */
export function formatDateShort(date: Date | string | number): string {
  return formatDate(date, 'YYYY-MM-DD');
}

