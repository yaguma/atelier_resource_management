/**
 * バリデーション関数
 * 🔴 信頼性レベル: 一般的なバリデーション機能のベストプラクティス
 */

/**
 * 必須チェック
 * @param value - チェック対象の値
 * @returns 値が存在する場合true、それ以外false
 */
export function isRequired(value: unknown): boolean {
  if (value === null || value === undefined) {
    return false;
  }
  if (typeof value === 'string' && value.trim() === '') {
    return false;
  }
  return true;
}

/**
 * 文字列型チェック（型ガード）
 * @param value - チェック対象の値
 * @returns 値が文字列型の場合true、それ以外false
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * 数値型チェック（型ガード）
 * @param value - チェック対象の値
 * @returns 値が数値型の場合true、それ以外false
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * メールアドレス形式チェック
 * @param value - チェック対象の文字列
 * @returns 有効なメールアドレス形式の場合true、それ以外false
 */
export function isEmail(value: string): boolean {
  if (!isString(value)) {
    return false;
  }
  // 基本的なメールアドレス形式の正規表現
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

/**
 * UUID形式チェック
 * @param value - チェック対象の文字列
 * @returns 有効なUUID形式の場合true、それ以外false
 */
export function isUUID(value: string): boolean {
  if (!isString(value)) {
    return false;
  }
  // UUID v4形式の正規表現
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

/**
 * 範囲チェック
 * @param value - チェック対象の数値
 * @param min - 最小値
 * @param max - 最大値
 * @returns 値が範囲内の場合true、それ以外false
 */
export function isInRange(value: number, min: number, max: number): boolean {
  if (!isNumber(value)) {
    return false;
  }
  return value >= min && value <= max;
}

/**
 * 最大文字数チェック
 * @param value - チェック対象の文字列
 * @param maxLength - 最大文字数
 * @returns 文字列が最大文字数以下の場合true、それ以外false
 */
export function isMaxLength(value: string, maxLength: number): boolean {
  if (!isString(value)) {
    return false;
  }
  return value.length <= maxLength;
}

/**
 * 最小文字数チェック
 * @param value - チェック対象の文字列
 * @param minLength - 最小文字数
 * @returns 文字列が最小文字数以上の場合true、それ以外false
 */
export function isMinLength(value: string, minLength: number): boolean {
  if (!isString(value)) {
    return false;
  }
  return value.length >= minLength;
}

