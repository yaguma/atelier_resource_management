/**
 * カード関連の型定義とZodバリデーションスキーマ
 * TASK-0031: Zodバリデーションスキーマ実装
 */

import { z } from 'zod';

// ========================================
// Zodスキーマ定義
// ========================================

/**
 * カードタイプのEnum
 */
export const cardTypeEnum = z.enum(
  ['item', 'weapon', 'armor', 'accessory', 'material'],
  {
    errorMap: () => ({
      message:
        'カードタイプは、item（アイテム）、weapon（武器）、armor（防具）、accessory（アクセサリー）、material（素材）のいずれかを選択してください',
    }),
  },
);

/**
 * カードレアリティのEnum
 */
export const cardRarityEnum = z.enum(
  ['common', 'uncommon', 'rare', 'epic', 'legendary'],
  {
    errorMap: () => ({
      message:
        'レアリティは、common（コモン）、uncommon（アンコモン）、rare（レア）、epic（エピック）、legendary（レジェンダリー）のいずれかを選択してください',
    }),
  },
);

/**
 * カード属性のEnum
 */
export const cardAttributeEnum = z.enum(
  ['fire', 'water', 'earth', 'wind', 'light', 'dark', 'none'],
  {
    errorMap: () => ({
      message:
        '属性は、fire（火）、water（水）、earth（地）、wind（風）、light（光）、dark（闇）、none（なし）のいずれかを選択してください',
    }),
  },
);

/**
 * カード作成用のバリデーションスキーマ
 */
export const createCardSchema = z.object({
  name: z
    .string({ required_error: 'カード名は必須です' })
    .min(1, 'カード名は1文字以上で入力してください')
    .max(100, 'カード名は100文字以内で入力してください'),

  description: z
    .string({ required_error: '説明は必須です' })
    .min(1, '説明は1文字以上で入力してください')
    .max(500, '説明は500文字以内で入力してください'),

  cardType: cardTypeEnum,

  rarity: cardRarityEnum,

  attribute: cardAttributeEnum,

  stabilityValue: z
    .number({ required_error: '安定度は必須です' })
    .int('安定度は整数で入力してください')
    .min(0, '安定度は0以上で入力してください')
    .max(100, '安定度は100以下で入力してください'),

  energyCost: z
    .number({ required_error: 'エネルギーコストは必須です' })
    .int('エネルギーコストは整数で入力してください')
    .min(0, 'エネルギーコストは0以上で入力してください')
    .max(10, 'エネルギーコストは10以下で入力してください'),

  unlockCondition: z
    .string()
    .max(200, 'アンロック条件は200文字以内で入力してください')
    .optional(),

  tags: z
    .array(z.string().max(50, 'タグは50文字以内で入力してください'))
    .max(10, 'タグは10個まで登録できます')
    .optional(),

  imageUrl: z
    .string()
    .url('画像URLは正しいURL形式で入力してください')
    .max(500, '画像URLは500文字以内で入力してください')
    .optional(),
});

/**
 * カード更新用のバリデーションスキーマ（部分更新に対応）
 */
export const updateCardSchema = createCardSchema.partial().extend({
  id: z.string().uuid('不正なカードIDです'),
});

// ========================================
// TypeScript型定義
// ========================================

/**
 * Zodスキーマから型を生成
 */
export type CardType = z.infer<typeof cardTypeEnum>;
export type CardRarity = z.infer<typeof cardRarityEnum>;
export type CardAttribute = z.infer<typeof cardAttributeEnum>;
export type CreateCardInput = z.infer<typeof createCardSchema>;
export type UpdateCardInput = z.infer<typeof updateCardSchema>;

/**
 * カード型定義（DBから取得されるデータ）
 */
export interface Card {
  id: string;
  name: string;
  description: string;
  cardType: CardType;
  rarity: CardRarity;
  attribute: CardAttribute;
  stabilityValue: number;
  energyCost: number;
  unlockCondition?: string;
  tags?: string[];
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}
