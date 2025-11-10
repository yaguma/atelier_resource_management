/**
 * 🔵 Card（カード）型定義
 * Prisma Cardモデルに基づく型定義
 */

/**
 * カード系統
 */
export enum CardType {
  MATERIAL = 'MATERIAL',     // 素材
  OPERATION = 'OPERATION',   // 操作
  CATALYST = 'CATALYST',     // 触媒
  KNOWLEDGE = 'KNOWLEDGE',   // 知識
  SPECIAL = 'SPECIAL',       // 特殊
  ARTIFACT = 'ARTIFACT',     // アーティファクト
}

/**
 * カードレア度
 */
export enum CardRarity {
  COMMON = 'COMMON',
  UNCOMMON = 'UNCOMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY',
}

/**
 * Card型（完全な型定義）
 */
export interface Card {
  // 共通フィールド
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  // カード固有フィールド
  name: string;
  description: string;
  cardType: CardType;
  attribute: Record<string, any>; // JSON形式
  stabilityValue: number;
  reactionEffect: string | null;
  energyCost: number;
  imageUrl: string | null;
  rarity: CardRarity | null;

  // リレーション
  evolutionFromId: string | null;
  evolutionFrom: Card | null;
  evolutionTo: Card[];
  initialDeckStyles: any[]; // AlchemyStyle[]
  unlockableContent: any | null; // UnlockableContent | null
  rewardCustomers: any[]; // Customer[]
}

/**
 * カード作成リクエスト型
 */
export interface CreateCardRequest {
  name: string;
  description: string;
  cardType: CardType;
  attribute: Record<string, any>;
  stabilityValue: number;
  reactionEffect?: string | null;
  energyCost: number;
  imageUrl?: string | null;
  rarity?: CardRarity | null;
  evolutionFromId?: string | null;
}

/**
 * カード更新リクエスト型
 */
export interface UpdateCardRequest {
  name?: string;
  description?: string;
  cardType?: CardType;
  attribute?: Record<string, any>;
  stabilityValue?: number;
  reactionEffect?: string | null;
  energyCost?: number;
  imageUrl?: string | null;
  rarity?: CardRarity | null;
  evolutionFromId?: string | null;
}
