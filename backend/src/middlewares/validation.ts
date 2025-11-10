/**
 * TASK-0009: バリデーションミドルウェア実装
 *
 * このミドルウェアは、Zodスキーマを使用してリクエストデータをバリデーションします。
 * バリデーションエラーが発生した場合は、体系的なエラーコード（VALID_001〜VALID_004）を
 * 含む構造化されたエラーレスポンスを返します。
 *
 * 🔵 設計文書: api-endpoints.md の「バリデーションエラー（VALID_xxx）」に基づく実装
 * 🔵 要件: WRREQ-070、WRREQ-070-2
 */

import { MiddlewareHandler } from 'hono';
import { z } from 'zod';
import { VALID_001, VALID_002, VALID_003, VALID_004, ERROR_MESSAGES } from '../constants/errorCodes';
import { ValidationErrorDetail } from '../types/index';

/**
 * バリデーションミドルウェア
 *
 * リクエストのbodyまたはqueryをZodスキーマでバリデーションします。
 * バリデーション成功時は、検証済みデータをHonoコンテキストに設定します。
 * バリデーション失敗時は、構造化されたエラーレスポンス（400 Bad Request）を返します。
 *
 * @param schema - Zodバリデーションスキーマ
 * @param target - バリデーション対象（'body' または 'query'）
 * @returns ミドルウェアハンドラー
 *
 * @example
 * ```typescript
 * // POSTリクエストのbodyをバリデーション
 * app.post('/api/cards', validate(createCardSchema, 'body'), async (c) => {
 *   const validated = c.get('validated');
 *   // ...
 * });
 *
 * // GETリクエストのqueryをバリデーション
 * app.get('/api/cards', validate(paginationSchema, 'query'), async (c) => {
 *   const validated = c.get('validated');
 *   // ...
 * });
 * ```
 */
export function validate(
  schema: z.ZodSchema,
  target: 'body' | 'query'
): MiddlewareHandler {
  return async (c, next) => {
    try {
      // 🔵 リクエストからデータを取得
      let data: unknown;
      if (target === 'body') {
        data = await c.req.json();
      } else {
        // クエリパラメータをオブジェクトに変換
        const url = new URL(c.req.url);
        data = Object.fromEntries(url.searchParams.entries());
      }

      // 🔵 Zodスキーマでバリデーション
      const validated = schema.parse(data);

      // 🔵 検証済みデータをHonoコンテキストに設定
      c.set('validated', validated);

      // 次のミドルウェア/ハンドラーに処理を渡す
      await next();
    } catch (error) {
      // 🔵 ZodErrorの場合、構造化されたエラーレスポンスを返す
      if (error instanceof z.ZodError) {
        const details: ValidationErrorDetail[] = error.issues.map((issue) => ({
          field: String(issue.path[0] || 'unknown'),
          message: issue.message,
          code: mapZodErrorCode(issue.code, issue),
        }));

        return c.json(
          {
            error: {
              code: VALID_001,
              message: ERROR_MESSAGES[VALID_001],
              details,
            },
          },
          400
        );
      }

      // その他のエラーは再スロー
      throw error;
    }
  };
}

/**
 * ZodエラーコードからVALID_xxxエラーコードへのマッピング
 *
 * Zodの内部エラーコードを、設計文書で定義された体系的なエラーコードに変換します。
 *
 * @param zodCode - Zodのエラーコード
 * @param issue - Zodのエラーissue（追加情報を取得するため）
 * @returns VALID_xxxエラーコード
 */
function mapZodErrorCode(zodCode: z.ZodIssueCode, issue: z.ZodIssue): string {
  switch (zodCode) {
    case 'invalid_type':
      // 🔵 VALID_003: 必須フィールド不足（expected string/number/etc, received undefined）
      // 🔵 VALID_002: 型不一致（例: 数値を期待しているが文字列が来た）
      if ('received' in issue && issue.received === 'undefined') {
        return VALID_003;
      }
      return VALID_002;

    case 'too_small':
      // 🔵 VALID_003: 必須フィールド不足（min(1)の文字列）
      // 🔵 VALID_004: 範囲外の値（最小値未満の数値）
      if ('type' in issue && issue.type === 'string') {
        return VALID_003;
      }
      return VALID_004;

    case 'too_big':
      // 🔵 VALID_004: 範囲外の値（最大値超過）
      return VALID_004;

    case 'invalid_enum_value':
      // 🔵 VALID_002: 型不一致（列挙型の値が不正）
      return VALID_002;

    default:
      // その他のエラーは一般的なバリデーションエラー
      return VALID_001;
  }
}
