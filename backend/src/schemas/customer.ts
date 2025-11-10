import { z } from 'zod';

/**
 * 🔵 顧客作成リクエストのZodスキーマ
 */
export const createCustomerSchema = z.object({
  name: z
    .string()
    .min(1, '顧客名は必須です')
    .max(100, '顧客名は100文字以内で入力してください'),
  description: z
    .string()
    .min(1, '説明は必須です')
    .max(500, '説明は500文字以内で入力してください'),
  customerType: z
    .string()
    .min(1, '顧客タイプは必須です')
    .max(50, '顧客タイプは50文字以内で入力してください'),
  difficulty: z
    .number()
    .int('難易度は整数である必要があります')
    .min(1, '難易度は1以上である必要があります')
    .max(5, '難易度は5以下である必要があります'),
  requiredAttribute: z.record(z.any()).default({}),
  qualityCondition: z
    .number()
    .int('品質条件は整数である必要があります')
    .min(0, '品質条件は0以上である必要があります')
    .max(100, '品質条件は100以下である必要があります'),
  stabilityCondition: z
    .number()
    .int('安定条件は整数である必要があります')
    .min(0, '安定条件は0以上である必要があります')
    .max(100, '安定条件は100以下である必要があります'),
  rewardFame: z
    .number()
    .int('名声報酬は整数である必要があります')
    .min(0, '名声報酬は0以上である必要があります')
    .max(1000, '名声報酬は1000以下である必要があります'),
  rewardKnowledge: z
    .number()
    .int('知識報酬は整数である必要があります')
    .min(0, '知識報酬は0以上である必要があります')
    .max(1000, '知識報酬は1000以下である必要があります'),
  portraitUrl: z.string().url('ポートレートURLは正しいURL形式である必要があります').nullable().optional(),
  rewardCardIds: z.array(z.string().uuid('報酬カードIDはUUID形式である必要があります')).optional(),
});

/**
 * 🔵 顧客更新リクエストのZodスキーマ
 */
export const updateCustomerSchema = z.object({
  name: z
    .string()
    .min(1, '顧客名は必須です')
    .max(100, '顧客名は100文字以内で入力してください')
    .optional(),
  description: z
    .string()
    .min(1, '説明は必須です')
    .max(500, '説明は500文字以内で入力してください')
    .optional(),
  customerType: z
    .string()
    .min(1, '顧客タイプは必須です')
    .max(50, '顧客タイプは50文字以内で入力してください')
    .optional(),
  difficulty: z
    .number()
    .int('難易度は整数である必要があります')
    .min(1, '難易度は1以上である必要があります')
    .max(5, '難易度は5以下である必要があります')
    .optional(),
  requiredAttribute: z.record(z.any()).optional(),
  qualityCondition: z
    .number()
    .int('品質条件は整数である必要があります')
    .min(0, '品質条件は0以上である必要があります')
    .max(100, '品質条件は100以下である必要があります')
    .optional(),
  stabilityCondition: z
    .number()
    .int('安定条件は整数である必要があります')
    .min(0, '安定条件は0以上である必要があります')
    .max(100, '安定条件は100以下である必要があります')
    .optional(),
  rewardFame: z
    .number()
    .int('名声報酬は整数である必要があります')
    .min(0, '名声報酬は0以上である必要があります')
    .max(1000, '名声報酬は1000以下である必要があります')
    .optional(),
  rewardKnowledge: z
    .number()
    .int('知識報酬は整数である必要があります')
    .min(0, '知識報酬は0以上である必要があります')
    .max(1000, '知識報酬は1000以下である必要があります')
    .optional(),
  portraitUrl: z.string().url('ポートレートURLは正しいURL形式である必要があります').nullable().optional(),
  rewardCardIds: z.array(z.string().uuid('報酬カードIDはUUID形式である必要があります')).optional(),
});

/**
 * 🔵 顧客一覧取得クエリのZodスキーマ
 */
export const listCustomersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  difficulty: z.coerce.number().int().min(1).max(5).optional(),
  search: z.string().max(100).optional(),
});
