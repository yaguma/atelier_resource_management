import { z } from 'zod';

/**
 * ページネーションクエリパラメータスキーマ
 * page, limitパラメータのバリデーション
 */
export const paginationQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform((val) => {
      const num = Number(val);
      return isNaN(num) || num < 1 ? 1 : num;
    }),
  limit: z
    .string()
    .optional()
    .default('10')
    .transform((val) => {
      const num = Number(val);
      return isNaN(num) || num < 1 ? 10 : Math.min(num, 100); // 最大100件
    }),
});

/**
 * UUID検証スキーマ
 */
export const uuidSchema = z.string().uuid('有効なUUIDを指定してください');

/**
 * UUID検証ヘルパー関数
 *
 * @param value - 検証する値
 * @returns 有効なUUIDの場合true、それ以外はfalse
 */
export function validateUUID(value: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

/**
 * UUID検証（エラーをスローする）
 *
 * @param value - 検証する値
 * @throws エラー（無効なUUIDの場合）
 */
export function assertUUID(value: string): void {
  if (!validateUUID(value)) {
    throw new Error('有効なUUIDを指定してください');
  }
}
