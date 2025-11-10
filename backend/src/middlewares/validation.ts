import { Context, Next } from 'hono';
import { ZodSchema, ZodError } from 'zod';
import { VALID_001, VALID_002 } from '../constants/errorCodes';
import { ValidationErrorDetail } from '../types/index';

/**
 * バリデーションミドルウェア
 * Zodスキーマを使用してリクエストのbodyまたはqueryをバリデーションする
 *
 * @param schema - Zodバリデーションスキーマ
 * @param target - バリデーション対象（'body' または 'query'）
 * @returns Honoミドルウェア関数
 */
export function validate(schema: ZodSchema, target: 'body' | 'query' = 'body') {
  return async (c: Context, next: Next) => {
    try {
      // ターゲットに応じてデータを取得
      let data: any;
      if (target === 'body') {
        try {
          data = await c.req.json();
        } catch (jsonError) {
          // JSON解析エラーの処理
          return c.json(
            {
              error: {
                code: VALID_002,
                message: 'リクエストボディのJSON解析に失敗しました',
                details: {
                  reason: jsonError instanceof Error ? jsonError.message : 'Invalid JSON format',
                },
              },
            },
            400
          );
        }
      } else if (target === 'query') {
        data = c.req.query();
      }

      // Zodスキーマでバリデーション
      const validated = schema.parse(data);

      // バリデーション済みデータをコンテキストに保存
      c.set('validated', validated);

      await next();
    } catch (error) {
      if (error instanceof ZodError) {
        // ZodErrorを構造化レスポンスに変換
        const details: ValidationErrorDetail[] = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        return c.json(
          {
            error: {
              code: VALID_001,
              message: '入力データが不正です',
              details,
            },
          },
          400
        );
      }

      // その他のエラーはそのまま投げる
      throw error;
    }
  };
}
