/**
 * 共通型定義
 */

/**
 * APIエラー型
 * エラーレスポンスで使用される
 */
export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

/**
 * バリデーションエラー詳細型
 * VALID_001エラーのdetailsで使用される
 */
export interface ValidationErrorDetail {
  field: string;
  message: string;
  code?: string;
}
