import { z } from 'zod';
import { CardType, CardRarity } from '../types/card';

/**
 * 🔵 Card Type Zodスキーマ
 */
export const cardTypeSchema = z.nativeEnum(CardType);

/**
 * 🔵 Card Rarity Zodスキーマ
 */
export const cardRaritySchema = z.nativeEnum(CardRarity);

/**
 * 🔵 カード作成リクエストのZodスキーマ
 */
export const createCardSchema = z.object({
  name: z
    .string()
    .min(1, 'カード名は必須です')
    .max(100, 'カード名は100文字以内で入力してください'),
  description: z
    .string()
    .min(1, '説明は必須です')
    .max(500, '説明は500文字以内で入力してください'),
  cardType: cardTypeSchema,
  attribute: z.record(z.any()).default({}),
  stabilityValue: z
    .number()
    .int('安定値は整数である必要があります')
    .min(0, '安定値は0以上である必要があります')
    .max(100, '安定値は100以下である必要があります'),
  reactionEffect: z.string().max(200).nullable().optional(),
  energyCost: z
    .number()
    .int('エネルギーコストは整数である必要があります')
    .min(0, 'エネルギーコストは0以上である必要があります')
    .max(10, 'エネルギーコストは10以下である必要があります'),
  imageUrl: z.string().url('画像URLは正しいURL形式である必要があります').nullable().optional(),
  rarity: cardRaritySchema.nullable().optional(),
  evolutionFromId: z.string().uuid('進化元IDはUUID形式である必要があります').nullable().optional(),
});

/**
 * 🔵 カード更新リクエストのZodスキーマ
 */
export const updateCardSchema = z.object({
  name: z
    .string()
    .min(1, 'カード名は必須です')
    .max(100, 'カード名は100文字以内で入力してください')
    .optional(),
  description: z
    .string()
    .min(1, '説明は必須です')
    .max(500, '説明は500文字以内で入力してください')
    .optional(),
  cardType: cardTypeSchema.optional(),
  attribute: z.record(z.any()).optional(),
  stabilityValue: z
    .number()
    .int('安定値は整数である必要があります')
    .min(0, '安定値は0以上である必要があります')
    .max(100, '安定値は100以下である必要があります')
    .optional(),
  reactionEffect: z.string().max(200).nullable().optional(),
  energyCost: z
    .number()
    .int('エネルギーコストは整数である必要があります')
    .min(0, 'エネルギーコストは0以上である必要があります')
    .max(10, 'エネルギーコストは10以下である必要があります')
    .optional(),
  imageUrl: z.string().url('画像URLは正しいURL形式である必要があります').nullable().optional(),
  rarity: cardRaritySchema.nullable().optional(),
  evolutionFromId: z.string().uuid('進化元IDはUUID形式である必要があります').nullable().optional(),
});

/**
 * 🔵 カード一覧取得クエリのZodスキーマ
 */
export const listCardsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cardType: cardTypeSchema.optional(),
  search: z.string().max(100).optional(),
});
