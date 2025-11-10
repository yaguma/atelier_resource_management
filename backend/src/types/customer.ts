/**
 * 🔵 Customer（顧客）型定義
 * Prisma Customerモデルに基づく型定義
 */

/**
 * Customer型（完全な型定義）
 */
export interface Customer {
  // 共通フィールド
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  // 顧客固有フィールド
  name: string;
  description: string;
  customerType: string;
  difficulty: number; // 1〜5星
  requiredAttribute: Record<string, any>; // JSON形式
  qualityCondition: number; // 0〜100
  stabilityCondition: number; // 0〜100
  rewardFame: number; // 0〜1000
  rewardKnowledge: number; // 0〜1000
  portraitUrl: string | null;

  // リレーション
  rewardCards: any[]; // Card[]
  mapNodes: any[]; // MapNode[]
  unlockableContent: any | null; // UnlockableContent | null
}

/**
 * 顧客作成リクエスト型
 */
export interface CreateCustomerRequest {
  name: string;
  description: string;
  customerType: string;
  difficulty: number;
  requiredAttribute: Record<string, any>;
  qualityCondition: number;
  stabilityCondition: number;
  rewardFame: number;
  rewardKnowledge: number;
  portraitUrl?: string | null;
  rewardCardIds?: string[]; // N:Mリレーション用
}

/**
 * 顧客更新リクエスト型
 */
export interface UpdateCustomerRequest {
  name?: string;
  description?: string;
  customerType?: string;
  difficulty?: number;
  requiredAttribute?: Record<string, any>;
  qualityCondition?: number;
  stabilityCondition?: number;
  rewardFame?: number;
  rewardKnowledge?: number;
  portraitUrl?: string | null;
  rewardCardIds?: string[]; // N:Mリレーション用
}
