import { Context } from 'hono';
import { RES_001 } from '../constants/errorCodes';

/**
 * 成功レスポンスを返す
 *
 * @param c - Honoコンテキスト
 * @param data - レスポンスデータ
 * @param message - 成功メッセージ（オプション）
 * @param status - HTTPステータスコード（デフォルト: 200）
 * @returns JSONレスポンス
 */
export function successResponse<T>(
  c: Context,
  data: T,
  message?: string,
  status: number = 200
) {
  return c.json(
    {
      data,
      ...(message && { message }),
    },
    status
  );
}

/**
 * ページネーションレスポンスを返す
 *
 * @param c - Honoコンテキスト
 * @param items - データ配列
 * @param total - 総件数
 * @param page - 現在のページ番号
 * @param limit - 1ページあたりの件数
 * @returns JSONレスポンス
 */
export function paginatedResponse<T>(
  c: Context,
  items: T[],
  total: number,
  page: number,
  limit: number
) {
  const totalPages = Math.ceil(total / limit);

  return c.json({
    data: {
      items,
      total,
      page,
      limit,
      totalPages,
    },
  });
}

/**
 * エラーレスポンスを返す
 *
 * @param c - Honoコンテキスト
 * @param code - エラーコード
 * @param message - エラーメッセージ
 * @param details - エラー詳細（オプション）
 * @param status - HTTPステータスコード
 * @returns JSONレスポンス
 */
export function errorResponse(
  c: Context,
  code: string,
  message: string,
  details?: any,
  status: number = 500
) {
  return c.json(
    {
      error: {
        code,
        message,
        ...(details && { details }),
      },
    },
    status
  );
}

/**
 * 404 Not Foundレスポンスを返す
 *
 * @param c - Honoコンテキスト
 * @param resourceName - リソース名（オプション）
 * @returns JSONレスポンス
 */
export function notFoundResponse(c: Context, resourceName?: string) {
  const message = resourceName
    ? `指定された${resourceName}が見つかりません`
    : '指定されたリソースが見つかりません';

  return errorResponse(c, RES_001, message, undefined, 404);
}
