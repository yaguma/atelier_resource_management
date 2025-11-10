/**
 * 🔵 Repository Pattern 共通型定義
 * 全てのRepositoryで使用する共通の型定義
 */

/**
 * ページネーションオプション
 */
export interface PaginationOptions {
  page: number;
  limit: number;
}

/**
 * ページネーション結果
 */
export interface PaginationResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
