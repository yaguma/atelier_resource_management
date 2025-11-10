import { z } from 'zod';

/**
 * バリデーションスキーマ定義
 * 各エンティティのバリデーションスキーマを定義する
 */

/**
 * ページネーションクエリパラメータスキーマ
 */
export const paginationQuerySchema = z.object({
  page: z.string().optional().default('1').transform(Number),
  limit: z.string().optional().default('10').transform(Number),
});

/**
 * UUID検証スキーマ
 */
export const uuidSchema = z.string().uuid('有効なUUIDを指定してください');

/**
 * カード作成リクエストスキーマ（例）
 * Phase 2で実際のカード管理API実装時に使用
 */
export const createCardSchema = z.object({
  name: z
    .string()
    .min(1, 'カード名は必須です')
    .max(100, 'カード名は100文字以内で入力してください'),
  description: z.string().optional(),
  cardType: z.enum(['MATERIAL', 'PRODUCT', 'SPECIAL'], {
    errorMap: () => ({ message: 'カードタイプはMATERIAL、PRODUCT、SPECIALのいずれかを指定してください' }),
  }),
  rarity: z
    .number()
    .int('レアリティは整数で指定してください')
    .min(1, 'レアリティは1以上で指定してください')
    .max(5, 'レアリティは5以下で指定してください'),
  effectDescription: z.string().optional(),
  imageUrl: z.string().url('有効なURLを指定してください').optional(),
});

/**
 * カード更新リクエストスキーマ（例）
 * Phase 2で実際のカード管理API実装時に使用
 */
export const updateCardSchema = z.object({
  name: z
    .string()
    .min(1, 'カード名は必須です')
    .max(100, 'カード名は100文字以内で入力してください')
    .optional(),
  description: z.string().optional(),
  cardType: z
    .enum(['MATERIAL', 'PRODUCT', 'SPECIAL'], {
      errorMap: () => ({
        message: 'カードタイプはMATERIAL、PRODUCT、SPECIALのいずれかを指定してください',
      }),
    })
    .optional(),
  rarity: z
    .number()
    .int('レアリティは整数で指定してください')
    .min(1, 'レアリティは1以上で指定してください')
    .max(5, 'レアリティは5以下で指定してください')
    .optional(),
  effectDescription: z.string().optional(),
  imageUrl: z.string().url('有効なURLを指定してください').optional(),
});

/**
 * カード検索クエリパラメータスキーマ（例）
 * Phase 2で実際のカード管理API実装時に使用
 */
export const cardSearchQuerySchema = paginationQuerySchema.extend({
  cardType: z.enum(['MATERIAL', 'PRODUCT', 'SPECIAL']).optional(),
  search: z.string().optional(),
});
