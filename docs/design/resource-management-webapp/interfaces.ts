/**
 * リソース管理Webアプリ TypeScript型定義
 * 
 * 【信頼性レベル】:
 * - 🔵 青信号: 要件定義書から直接導出された確実な型定義
 * - 🟡 黄信号: 要件定義書から妥当な推測による型定義
 * - 🔴 赤信号: 一般的なWebアプリ管理画面のベストプラクティスから推測
 */

// ============================================================================
// 共通型定義
// ============================================================================

/**
 * 共通フィールド（全エンティティ） 🔵
 * 要件定義書より
 */
export interface BaseEntity {
  id: string; // UUID v4
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null; // ソフトデリート用
}

/**
 * API共通レスポンス型 🔵
 * 要件定義書より
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

/**
 * API共通エラーレスポンス型 🔵
 * 要件定義書より
 */
export interface ApiErrorResponse {
  error: {
    code: string; // エラーコード（例: VALID_REQUIRED, RES_NOT_FOUND）
    message: string; // エラーメッセージ
    details?: unknown[]; // 詳細情報（バリデーションエラーなど）
  };
}

/**
 * ページネーション型 🔵
 * 要件定義書より
 */
export interface PaginationParams {
  page: number; // 1始まり
  limit: number; // デフォルト: 20
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================================================
// カード関連型定義
// ============================================================================

/**
 * カード系統 🔵
 * 要件定義書 REQ-022, WRREQ-012より
 */
export enum CardType {
  MATERIAL = 'MATERIAL', // 素材カード
  OPERATION = 'OPERATION', // 操作カード
  CATALYST = 'CATALYST', // 触媒カード
  KNOWLEDGE = 'KNOWLEDGE', // 知識カード
  SPECIAL = 'SPECIAL', // 特殊カード
  ARTIFACT = 'ARTIFACT', // アーティファクト
}

/**
 * レア度 🔵
 * 要件定義書より
 */
export enum Rarity {
  COMMON = 'COMMON', // コモン
  UNCOMMON = 'UNCOMMON', // アンコモン
  RARE = 'RARE', // レア
  EPIC = 'EPIC', // エピック
  LEGENDARY = 'LEGENDARY', // レジェンダリー
}

/**
 * 属性値型 🔵
 * 要件定義書より（JSON形式）
 */
export interface AttributeValues {
  fire?: number;
  water?: number;
  earth?: number;
  wind?: number;
  poison?: number;
  [key: string]: number | undefined;
}

/**
 * カードエンティティ 🔵
 * 要件定義書より
 */
export interface Card extends BaseEntity {
  name: string; // 最大100文字、必須、ユニーク制約
  description: string; // 最大1000文字、必須
  cardType: CardType; // カード系統
  attribute: AttributeValues; // JSON形式
  stabilityValue: number; // 範囲: -100〜100
  reactionEffect: string | null; // 最大500文字、nullable
  energyCost: number; // 範囲: 0〜5、必須
  imageUrl: string | null; // nullable
  rarity: Rarity | null; // nullable
  
  // リレーション
  evolutionFromId: string | null; // 進化元カードID
  evolutionFrom?: Card | null; // 進化元カード（1:1）
  evolutionTo?: Card[]; // 進化先カード（1:N）
  initialDeckStyles?: AlchemyStyle[]; // 初期デッキに含む錬金スタイル（N:M）
  unlockableContent?: UnlockableContent | null; // アンロック条件（1:1）
}

/**
 * カード作成リクエスト 🔵
 * 要件定義書より
 */
export interface CreateCardRequest {
  name: string;
  description: string;
  cardType: CardType;
  attribute: AttributeValues;
  stabilityValue: number;
  reactionEffect?: string | null;
  energyCost: number;
  imageUrl?: string | null;
  rarity?: Rarity | null;
  evolutionFromId?: string | null;
}

/**
 * カード更新リクエスト 🔵
 * 要件定義書より（部分更新可）
 */
export interface UpdateCardRequest {
  name?: string;
  description?: string;
  cardType?: CardType;
  attribute?: AttributeValues;
  stabilityValue?: number;
  reactionEffect?: string | null;
  energyCost?: number;
  imageUrl?: string | null;
  rarity?: Rarity | null;
  evolutionFromId?: string | null;
}

/**
 * カード一覧取得クエリパラメータ 🔵
 * 要件定義書より
 */
export interface GetCardsQuery extends PaginationParams {
  search?: string; // カード名での部分一致検索
  cardType?: CardType; // カード系統でフィルタリング
  rarity?: Rarity; // レア度でフィルタリング
}

// ============================================================================
// 顧客関連型定義
// ============================================================================

/**
 * 顧客エンティティ 🔵
 * 要件定義書より
 */
export interface Customer extends BaseEntity {
  name: string; // 最大100文字、必須
  description: string; // 最大1000文字、必須
  customerType: string; // 顧客タイプ、最大50文字、必須
  difficulty: number; // 難易度、範囲: 1〜5星、必須
  requiredAttribute: AttributeValues; // 必要属性値、JSON形式
  qualityCondition: number; // 品質条件、範囲: 0〜100
  stabilityCondition: number; // 安定性条件、範囲: 0〜100
  rewardFame: number; // 報酬: 名声、範囲: 0〜1000
  rewardKnowledge: number; // 報酬: 知識ポイント、範囲: 0〜1000
  portraitUrl: string | null; // 顧客ポートレートURL、nullable
  
  // リレーション
  rewardCards?: Card[]; // 報酬カード（N:M）
  mapNodes?: MapNode[]; // この顧客が登場するノード（1:N）
  unlockableContent?: UnlockableContent | null; // アンロック条件（1:1）
}

/**
 * 顧客作成リクエスト 🔵
 * 要件定義書より
 */
export interface CreateCustomerRequest {
  name: string;
  description: string;
  customerType: string;
  difficulty: number;
  requiredAttribute: AttributeValues;
  qualityCondition: number;
  stabilityCondition: number;
  rewardFame: number;
  rewardKnowledge: number;
  portraitUrl?: string | null;
  rewardCardIds?: string[]; // 報酬カードID配列（N:M関連付け）
}

/**
 * 顧客更新リクエスト 🔵
 * 要件定義書より（部分更新可）
 */
export interface UpdateCustomerRequest {
  name?: string;
  description?: string;
  customerType?: string;
  difficulty?: number;
  requiredAttribute?: AttributeValues;
  qualityCondition?: number;
  stabilityCondition?: number;
  rewardFame?: number;
  rewardKnowledge?: number;
  portraitUrl?: string | null;
  rewardCardIds?: string[]; // 報酬カードID配列（N:M関連付け）
}

/**
 * 顧客一覧取得クエリパラメータ 🔵
 * 要件定義書より
 */
export interface GetCustomersQuery extends PaginationParams {
  search?: string; // 顧客名での部分一致検索
  difficulty?: number; // 難易度でフィルタリング（1〜5）
  customerType?: string; // 顧客タイプでフィルタリング
}

// ============================================================================
// 錬金スタイル関連型定義
// ============================================================================

/**
 * 錬金スタイルエンティティ 🔵
 * 要件定義書より
 */
export interface AlchemyStyle extends BaseEntity {
  name: string; // 最大100文字、必須、ユニーク制約
  description: string; // 最大1000文字、必須
  characteristics: string; // 特徴、最大500文字、必須
  iconUrl: string | null; // アイコンURL、nullable
  
  // リレーション
  initialDeckCards?: Card[]; // 初期デッキのカード（N:M）
}

/**
 * 錬金スタイル作成リクエスト 🔵
 * 要件定義書より
 */
export interface CreateAlchemyStyleRequest {
  name: string;
  description: string;
  characteristics: string;
  iconUrl?: string | null;
  initialDeckCardIds?: string[]; // 初期デッキのカードID配列（N:M関連付け）
}

/**
 * 錬金スタイル更新リクエスト 🔵
 * 要件定義書より（部分更新可）
 */
export interface UpdateAlchemyStyleRequest {
  name?: string;
  description?: string;
  characteristics?: string;
  iconUrl?: string | null;
  initialDeckCardIds?: string[]; // 初期デッキのカードID配列（N:M関連付け）
}

// ============================================================================
// マップノード関連型定義
// ============================================================================

/**
 * ノードタイプ 🔵
 * 要件定義書 REQ-016, WRREQ-033より
 */
export enum NodeType {
  REQUEST = 'REQUEST', // 依頼
  MERCHANT = 'MERCHANT', // 商人
  EXPERIMENT = 'EXPERIMENT', // 実験
  MONSTER = 'MONSTER', // 魔物
  BOSS_REQUEST = 'BOSS_REQUEST', // ボス依頼
}

/**
 * イベント内容型 🔴
 * JSON形式（要件定義書より推測）
 */
export interface EventContent {
  type: string;
  description: string;
  successReward?: unknown;
  failurePenalty?: unknown;
  [key: string]: unknown;
}

/**
 * 報酬型 🔴
 * JSON形式（要件定義書より推測）
 */
export interface Rewards {
  cards?: string[]; // カードID配列
  fame?: number;
  knowledge?: number;
  [key: string]: unknown;
}

/**
 * マップノードエンティティ 🔵
 * 要件定義書より
 */
export interface MapNode extends BaseEntity {
  name: string; // 最大100文字、必須
  nodeType: NodeType; // ノードタイプ
  description: string; // 最大1000文字、必須
  eventContent: EventContent; // イベント内容、JSON形式、必須
  rewards: Rewards | null; // 報酬、JSON形式、nullable
  iconUrl: string | null; // アイコンURL、nullable
  
  // リレーション
  customerId: string | null; // このノードの顧客ID（N:1、nullable）
  customer?: Customer | null; // このノードの顧客
}

/**
 * マップノード作成リクエスト 🔵
 * 要件定義書より
 */
export interface CreateMapNodeRequest {
  name: string;
  nodeType: NodeType;
  description: string;
  eventContent: EventContent;
  rewards?: Rewards | null;
  iconUrl?: string | null;
  customerId?: string | null;
}

/**
 * マップノード更新リクエスト 🔵
 * 要件定義書より（部分更新可）
 */
export interface UpdateMapNodeRequest {
  name?: string;
  nodeType?: NodeType;
  description?: string;
  eventContent?: EventContent;
  rewards?: Rewards | null;
  iconUrl?: string | null;
  customerId?: string | null;
}

/**
 * マップノード一覧取得クエリパラメータ 🔵
 * 要件定義書より
 */
export interface GetMapNodesQuery extends PaginationParams {
  search?: string; // ノード名での部分一致検索
  nodeType?: NodeType; // ノードタイプでフィルタリング
}

// ============================================================================
// メタ通貨関連型定義
// ============================================================================

/**
 * 通貨タイプ 🔵
 * 要件定義書より
 */
export enum CurrencyType {
  FAME = 'FAME', // 名声
  KNOWLEDGE = 'KNOWLEDGE', // 知識ポイント
}

/**
 * メタ通貨エンティティ 🔵
 * 要件定義書より
 */
export interface MetaCurrency extends BaseEntity {
  currencyType: CurrencyType; // 通貨タイプ、ユニーク制約
  description: string; // 説明、最大500文字、必須
  iconUrl: string | null; // アイコンURL、nullable
}

// ============================================================================
// アンロック可能コンテンツ関連型定義
// ============================================================================

/**
 * コンテンツタイプ 🔵
 * 要件定義書より
 */
export enum ContentType {
  CARD = 'CARD', // カード
  CUSTOMER = 'CUSTOMER', // 顧客
  MATERIAL = 'MATERIAL', // 素材
}

/**
 * アンロック可能コンテンツエンティティ 🔵
 * 要件定義書より
 */
export interface UnlockableContent extends BaseEntity {
  contentType: ContentType; // コンテンツタイプ
  requiredFame: number; // 必要名声、範囲: 0〜10000、デフォルト: 0
  requiredKnowledge: number; // 必要知識ポイント、範囲: 0〜10000、デフォルト: 0
  
  // リレーション
  cardId: string | null; // アンロック対象カードID（1:1、nullable）
  card?: Card | null; // アンロック対象カード
  customerId: string | null; // アンロック対象顧客ID（1:1、nullable）
  customer?: Customer | null; // アンロック対象顧客
}

// ============================================================================
// ゲームバランス関連型定義
// ============================================================================

/**
 * バランス設定カテゴリ 🔵
 * 要件定義書より
 */
export enum BalanceCategory {
  ENERGY = 'ENERGY', // エネルギー
  HAND = 'HAND', // 手札
  STABILITY = 'STABILITY', // 安定性
  PLAYTIME = 'PLAYTIME', // プレイ時間
}

/**
 * ゲームバランスエンティティ 🔵
 * 要件定義書より
 */
export interface GameBalance extends BaseEntity {
  settingKey: string; // 設定キー、最大100文字、必須、ユニーク制約
  settingValue: string; // 設定値、最大500文字、必須
  description: string; // 説明、最大500文字、必須
  category: BalanceCategory; // カテゴリ
}

/**
 * ゲームバランス更新リクエスト 🔵
 * 要件定義書より
 */
export interface UpdateGameBalanceRequest {
  settingValue: string;
  description?: string;
}

/**
 * ゲームバランス一覧取得クエリパラメータ 🔵
 * 要件定義書より
 */
export interface GetGameBalanceQuery {
  category?: BalanceCategory; // カテゴリでフィルタリング
}

// ============================================================================
// データエクスポート/インポート関連型定義
// ============================================================================

/**
 * エクスポートリクエスト 🔵
 * 要件定義書より
 */
export interface ExportRequest {
  resources?: string[]; // エクスポート対象リソース（省略時は全データ）
  // 例: ['cards', 'customers', 'alchemyStyles']
}

/**
 * インポートリクエスト 🔵
 * 要件定義書より
 */
export interface ImportRequest {
  file: File; // multipart/form-data
}

/**
 * インポートレスポンス 🔵
 * 要件定義書より
 */
export interface ImportResponse {
  message: string;
  imported: {
    cards?: number;
    customers?: number;
    alchemyStyles?: number;
    mapNodes?: number;
    [key: string]: number | undefined;
  };
}

// ============================================================================
// エラーコード型定義
// ============================================================================

/**
 * エラーコード 🔵
 * 要件定義書より（体系的エラーコード）
 */
export enum ErrorCode {
  // 認証・認可エラー（将来実装）
  AUTH_REQUIRED = 'AUTH_REQUIRED',
  AUTH_INVALID_TOKEN = 'AUTH_INVALID_TOKEN',
  AUTH_INSUFFICIENT_PERMISSION = 'AUTH_INSUFFICIENT_PERMISSION',
  
  // バリデーションエラー
  VALID_REQUIRED = 'VALID_REQUIRED',
  VALID_INVALID_FORMAT = 'VALID_INVALID_FORMAT',
  VALID_OUT_OF_RANGE = 'VALID_OUT_OF_RANGE',
  VALID_SCHEMA_ERROR = 'VALID_SCHEMA_ERROR',
  
  // リソースエラー
  RES_NOT_FOUND = 'RES_NOT_FOUND',
  RES_DUPLICATE = 'RES_DUPLICATE',
  RES_DEPENDENCY_EXISTS = 'RES_DEPENDENCY_EXISTS',
  RES_INTEGRITY_ERROR = 'RES_INTEGRITY_ERROR',
  
  // データベースエラー
  DB_CONNECTION_ERROR = 'DB_CONNECTION_ERROR',
  DB_QUERY_ERROR = 'DB_QUERY_ERROR',
  DB_TRANSACTION_ERROR = 'DB_TRANSACTION_ERROR',
  
  // Repositoryエラー
  REPO_NOT_FOUND = 'REPO_NOT_FOUND',
  REPO_CREATE_ERROR = 'REPO_CREATE_ERROR',
  REPO_UPDATE_ERROR = 'REPO_UPDATE_ERROR',
  REPO_DELETE_ERROR = 'REPO_DELETE_ERROR',
  
  // システムエラー
  SYS_INTERNAL_ERROR = 'SYS_INTERNAL_ERROR',
  SYS_UNKNOWN_ERROR = 'SYS_UNKNOWN_ERROR',
  
  // ネットワークエラー
  NET_TIMEOUT = 'NET_TIMEOUT',
  NET_CONNECTION_ERROR = 'NET_CONNECTION_ERROR',
}

