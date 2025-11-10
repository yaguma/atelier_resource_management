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

/**
 * API成功レスポンス型
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

/**
 * ページネーションレスポンス型
 */
export interface PaginatedResponse<T> {
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * APIエラーレスポンス型
 */
export interface ApiErrorResponse {
  error: ApiError;
}
