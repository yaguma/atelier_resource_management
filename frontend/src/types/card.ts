/**
 * カード関連の型定義
 * 注: TASK-0031でZodバリデーションスキーマを実装する際に詳細化される
 */

export type CardType = 'item' | 'weapon' | 'armor' | 'accessory' | 'material';
export type CardRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type CardAttribute =
  | 'fire'
  | 'water'
  | 'earth'
  | 'wind'
  | 'light'
  | 'dark'
  | 'none';

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

export interface CreateCardInput {
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
}

export interface UpdateCardInput extends Partial<CreateCardInput> {
  id: string;
}
