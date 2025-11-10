/**
 * TASK-0009: バリデーションミドルウェア実装 - バリデーションスキーマ定義
 *
 * このファイルでは、各エンティティのバリデーションスキーマを定義します。
 * これらのスキーマは、バリデーションミドルウェアと組み合わせて使用されます。
 *
 * 🟡 使用例として、カード作成・ページネーションのスキーマを定義
 */

import { z } from 'zod';

/**
 * 🟡 カード作成スキーマ例
 *
 * カード作成APIのリクエストボディをバリデーションするためのスキーマです。
 * 設計文書（api-endpoints.md、database-schema.prisma）に基づいて定義されています。
 *
 * @example
 * ```typescript
 * import { validate } from '../middlewares/validation';
 * import { createCardSchema } from '../types/validation';
 *
 * app.post('/api/cards', validate(createCardSchema, 'body'), async (c) => {
 *   const validated = c.get('validated');
 *   // validated の型は CreateCardInput として推論される
 *   // ...
 * });
 * ```
 */
export const createCardSchema = z.object({
  name: z
    .string({ required_error: '名前は必須です' })
    .min(1, '名前は必須です')
    .max(100, '名前は100文字以内で入力してください'),

  cardType: z.enum(['素材カード', '調合カード', '参考書'], {
    errorMap: () => ({ message: 'カード種別が不正です' }),
  }),

  energyCost: z
    .number({ required_error: 'エネルギーコストは必須です' })
    .min(0, 'エネルギーコストは0以上で入力してください')
    .max(5, 'エネルギーコストは5以下で入力してください'),

  stabilityValue: z
    .number()
    .min(-100, '安定値は-100以上で入力してください')
    .max(100, '安定値は100以下で入力してください')
    .optional(),

  description: z.string().max(500, '説明は500文字以内で入力してください').optional(),
});

/**
 * 🟡 カード更新スキーマ例
 *
 * カード更新APIのリクエストボディをバリデーションするためのスキーマです。
 * 作成スキーマと似ていますが、すべてのフィールドがオプショナルです。
 */
export const updateCardSchema = createCardSchema.partial();

/**
 * 🟡 ページネーションスキーマ
 *
 * GETリクエストのクエリパラメータ（page, limit）をバリデーションするためのスキーマです。
 * クエリパラメータは文字列として受け取り、数値に変換します。
 *
 * @example
 * ```typescript
 * app.get('/api/cards', validate(paginationSchema, 'query'), async (c) => {
 *   const { page, limit } = c.get('validated');
 *   // page と limit は number 型として推論される
 *   // デフォルト値: page=1, limit=10
 *   // ...
 * });
 * ```
 */
export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1, 'ページ番号は1以上で入力してください')),

  limit: z
    .string()
    .optional()
    .default('10')
    .transform(Number)
    .pipe(
      z
        .number()
        .min(1, '件数は1以上で入力してください')
        .max(100, '件数は100以下で入力してください')
    ),
});

/**
 * 🟡 UUID検証スキーマ
 *
 * パスパラメータやクエリパラメータのUUIDをバリデーションするためのスキーマです。
 */
export const uuidSchema = z.string().uuid('有効なUUIDを入力してください');

/**
 * 🟡 ID検証スキーマ（パスパラメータ用）
 *
 * パスパラメータのIDをバリデーションするためのスキーマです。
 */
export const idParamSchema = z.object({
  id: uuidSchema,
});

// 型推論のためのユーティリティ型
export type CreateCardInput = z.infer<typeof createCardSchema>;
export type UpdateCardInput = z.infer<typeof updateCardSchema>;
export type PaginationQuery = z.infer<typeof paginationSchema>;
