// ============================================
// アトリエ錬金術ゲーム リソース管理Webアプリ
// TypeScript型定義
// ============================================

// ============================================
// 🔵 共通型定義
// ============================================

/**
 * 🔵 全エンティティの共通フィールド
 */
export interface BaseEntity {
  /** 🔵 UUID v4 (主キー) */
  id: string;
  /** 🔵 作成日時 */
  createdAt: Date;
  /** 🔵 更新日時 */
  updatedAt: Date;
  /** 🔵 削除日時（ソフトデリート用、nullable） */
  deletedAt: Date | null;
}

/**
 * 🔵 属性値（JSON形式）
 * 例: { "fire": 5, "water": 3, "earth": 2 }
 */
export type AttributeValue = Record<string, number>;

// ============================================
// 🔵 Enum定義
// ============================================

/**
 * 🔵 カード系統（WRREQ-012より）
 */
export enum CardType {
  /** 素材 */
  MATERIAL = 'MATERIAL',
  /** 操作 */
  OPERATION = 'OPERATION',
  /** 触媒 */
  CATALYST = 'CATALYST',
  /** 知識 */
  KNOWLEDGE = 'KNOWLEDGE',
  /** 特殊 */
  SPECIAL = 'SPECIAL',
  /** アーティファクト */
  ARTIFACT = 'ARTIFACT',
}

/**
 * 🟡 カードレア度
 */
export enum CardRarity {
  COMMON = 'COMMON',
  UNCOMMON = 'UNCOMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY',
}

/**
 * 🔵 ノードタイプ（WRREQ-033より）
 */
export enum NodeType {
  /** 依頼 */
  REQUEST = 'REQUEST',
  /** 商人 */
  MERCHANT = 'MERCHANT',
  /** 実験 */
  EXPERIMENT = 'EXPERIMENT',
  /** 魔物 */
  MONSTER = 'MONSTER',
  /** ボス依頼 */
  BOSS_REQUEST = 'BOSS_REQUEST',
}

/**
 * 🔵 メタ通貨タイプ（WRREQ-038より）
 */
export enum MetaCurrencyType {
  /** 名声 */
  FAME = 'FAME',
  /** 知識ポイント */
  KNOWLEDGE = 'KNOWLEDGE',
}

/**
 * 🔵 アンロック可能コンテンツタイプ（WRREQ-039より）
 */
export enum UnlockableContentType {
  /** 新カード */
  CARD = 'CARD',
  /** 新顧客 */
  CUSTOMER = 'CUSTOMER',
  /** 新素材 */
  MATERIAL = 'MATERIAL',
}

/**
 * 🔵 ゲームバランス設定カテゴリ（WRREQ-048〜051より）
 */
export enum GameBalanceCategory {
  /** エネルギーシステム */
  ENERGY = 'ENERGY',
  /** 手札システム */
  HAND = 'HAND',
  /** 安定値・暴発 */
  STABILITY = 'STABILITY',
  /** プレイ時間 */
  PLAYTIME = 'PLAYTIME',
}

// ============================================
// 🔵 エンティティ定義
// ============================================

/**
 * 🔵 1. Card（カード）エンティティ
 * WRREQ-012〜018より
 */
export interface Card extends BaseEntity {
  /** 🔵 カード名（最大100文字、ユニーク制約） */
  name: string;
  /** 🔵 説明（最大1000文字） */
  description: string;
  /** 🔵 カード系統 */
  cardType: CardType;
  /** 🔵 属性値（JSON形式） */
  attribute: AttributeValue;
  /** 🔵 安定値（範囲: -100〜100） */
  stabilityValue: number;
  /** 🔵 反応効果（最大500文字、nullable） */
  reactionEffect: string | null;
  /** 🔵 エネルギーコスト（範囲: 0〜5） */
  energyCost: number;
  /** 🟡 カード画像URL（nullable） */
  imageUrl: string | null;
  /** 🟡 レア度（nullable） */
  rarity: CardRarity | null;

  // リレーション
  /** 🔵 進化元カード（1:1、nullable） */
  evolutionFrom: Card | null;
  /** 🔵 進化元カードID */
  evolutionFromId: string | null;
  /** 🔵 進化先カード（1:N） */
  evolutionTo: Card[];
  /** 🔵 このカードを初期デッキに含む錬金スタイル（N:M） */
  initialDeckStyles: AlchemyStyle[];
  /** 🔵 このカードのアンロック条件（1:1、nullable） */
  unlockableContent: UnlockableContent | null;
  /** 🔵 このカードを報酬として持つ顧客（N:M） */
  rewardCustomers: Customer[];
}

/**
 * 🔵 2. Customer（顧客）エンティティ
 * WRREQ-021〜028より
 */
export interface Customer extends BaseEntity {
  /** 🔵 顧客名（最大100文字） */
  name: string;
  /** 🔵 説明（最大1000文字） */
  description: string;
  /** 🔵 顧客タイプ（最大50文字） */
  customerType: string;
  /** 🔵 難易度（範囲: 1〜5星） */
  difficulty: number;
  /** 🔵 必要属性値（JSON形式） */
  requiredAttribute: AttributeValue;
  /** 🔵 品質条件（範囲: 0〜100） */
  qualityCondition: number;
  /** 🔵 安定性条件（範囲: 0〜100） */
  stabilityCondition: number;
  /** 🔵 報酬: 名声（範囲: 0〜1000） */
  rewardFame: number;
  /** 🔵 報酬: 知識ポイント（範囲: 0〜1000） */
  rewardKnowledge: number;
  /** 🟡 顧客ポートレートURL（nullable） */
  portraitUrl: string | null;

  // リレーション
  /** 🔵 報酬カード（N:M） */
  rewardCards: Card[];
  /** 🔵 この顧客が登場するノード（1:N） */
  mapNodes: MapNode[];
  /** 🔵 この顧客のアンロック条件（1:1、nullable） */
  unlockableContent: UnlockableContent | null;
}

/**
 * 🔵 3. AlchemyStyle（錬金スタイル）エンティティ
 * WRREQ-029〜032より
 */
export interface AlchemyStyle extends BaseEntity {
  /** 🔵 スタイル名（最大100文字、ユニーク制約） */
  name: string;
  /** 🔵 説明（最大1000文字） */
  description: string;
  /** 🔵 特徴（最大500文字） */
  characteristics: string;
  /** 🟡 アイコンURL（nullable） */
  iconUrl: string | null;

  // リレーション
  /** 🔵 初期デッキのカード（N:M） */
  initialDeckCards: Card[];
}

/**
 * 🔵 4. MapNode（マップノード）エンティティ
 * WRREQ-033〜037より
 */
export interface MapNode extends BaseEntity {
  /** 🔵 ノード名（最大100文字） */
  name: string;
  /** 🔵 ノードタイプ */
  nodeType: NodeType;
  /** 🔵 説明（最大1000文字） */
  description: string;
  /** 🔵 イベント内容（JSON形式） */
  eventContent: Record<string, any>;
  /** 🔵 報酬（JSON形式、nullable） */
  rewards: Record<string, any> | null;
  /** 🟡 アイコンURL（nullable） */
  iconUrl: string | null;

  // リレーション
  /** 🔵 このノードの顧客（N:1、nullable） */
  customer: Customer | null;
  /** 🔵 顧客ID */
  customerId: string | null;
  /** 🔵 このノードのマップテンプレート（N:1、nullable） */
  mapTemplate: MapTemplate | null;
  /** 🔵 マップテンプレートID */
  mapTemplateId: string | null;
  /** 🟡 ノードの座標位置（JSON形式: {x: number, y: number}） */
  position: { x: number; y: number } | null;
}

/**
 * 🔵 5. MapTemplate（マップテンプレート）エンティティ
 * WRREQ-035〜036より
 */
export interface MapTemplate extends BaseEntity {
  /** 🔵 マップ名（最大100文字） */
  name: string;
  /** 🔵 説明（最大1000文字） */
  description: string;
  /** 🔵 難易度（範囲: 1〜5） */
  difficulty: number;
  /** 🔵 ノード数（範囲: 30〜50） */
  nodeCount: number;
  /** 🟡 アイコンURL（nullable） */
  iconUrl: string | null;

  // リレーション
  /** 🔵 このテンプレートに含まれるノード（1:N） */
  nodes: MapNode[];
}

/**
 * 🔵 6. MetaCurrency（メタ通貨）エンティティ
 * WRREQ-038より
 */
export interface MetaCurrency extends BaseEntity {
  /** 🔵 通貨タイプ（ユニーク制約） */
  currencyType: MetaCurrencyType;
  /** 🔵 説明（最大500文字） */
  description: string;
  /** 🟡 アイコンURL（nullable） */
  iconUrl: string | null;
}

/**
 * 🔵 7. UnlockableContent（アンロック可能コンテンツ）エンティティ
 * WRREQ-039〜040より
 */
export interface UnlockableContent extends BaseEntity {
  /** 🔵 コンテンツタイプ */
  contentType: UnlockableContentType;
  /** 🔵 必要名声（範囲: 0〜10000、デフォルト: 0） */
  requiredFame: number;
  /** 🔵 必要知識ポイント（範囲: 0〜10000、デフォルト: 0） */
  requiredKnowledge: number;

  // リレーション
  /** 🔵 アンロック対象カード（1:1、nullable） */
  card: Card | null;
  /** 🔵 カードID */
  cardId: string | null;
  /** 🔵 アンロック対象顧客（1:1、nullable） */
  customer: Customer | null;
  /** 🔵 顧客ID */
  customerId: string | null;
}

/**
 * 🔵 8. GameBalance（ゲームバランス）エンティティ
 * WRREQ-041〜042、WRREQ-048〜051より
 */
export interface GameBalance extends BaseEntity {
  /** 🔵 設定キー（最大100文字、ユニーク制約） */
  settingKey: string;
  /** 🔵 設定値（最大500文字） */
  settingValue: string;
  /** 🔵 説明（最大500文字） */
  description: string;
  /** 🔵 カテゴリ */
  category: GameBalanceCategory;
}

// ============================================
// 🔵 API リクエスト/レスポンス型定義
// ============================================

/**
 * 🔵 共通APIレスポンス
 */
export interface ApiResponse<T> {
  /** 🔵 データ */
  data?: T;
  /** 🔴 メッセージ */
  message?: string;
  /** 🔴 エラー */
  error?: ApiError;
}

/**
 * 🔴 APIエラー
 */
export interface ApiError {
  /** 🔴 エラーコード */
  code: string;
  /** 🔴 エラーメッセージ */
  message: string;
  /** 🔴 詳細エラー（バリデーションエラー等） */
  details?: ValidationError[];
}

/**
 * 🔴 バリデーションエラー
 */
export interface ValidationError {
  /** 🔴 フィールド名 */
  field: string;
  /** 🔴 エラーメッセージ */
  message: string;
}

/**
 * 🔵 ページネーションレスポンス
 */
export interface PaginatedResponse<T> {
  /** 🔵 アイテムリスト */
  items: T[];
  /** 🔵 総件数 */
  total: number;
  /** 🔵 現在のページ番号 */
  page: number;
  /** 🔵 1ページあたりの件数 */
  limit: number;
  /** 🟡 総ページ数 */
  totalPages?: number;
}

/**
 * 🔵 ページネーションクエリパラメータ
 */
export interface PaginationQuery {
  /** 🔵 ページ番号（デフォルト: 1） */
  page?: number;
  /** 🔵 1ページあたりの件数（デフォルト: 20） */
  limit?: number;
}

// ============================================
// 🔵 Card API 型定義
// ============================================

/**
 * 🔵 カード作成リクエスト
 */
export interface CreateCardRequest {
  name: string;
  description: string;
  cardType: CardType;
  attribute: AttributeValue;
  stabilityValue: number;
  reactionEffect?: string | null;
  energyCost: number;
  imageUrl?: string | null;
  rarity?: CardRarity | null;
  evolutionFromId?: string | null;
}

/**
 * 🔵 カード更新リクエスト（部分更新可能）
 */
export interface UpdateCardRequest {
  name?: string;
  description?: string;
  cardType?: CardType;
  attribute?: AttributeValue;
  stabilityValue?: number;
  reactionEffect?: string | null;
  energyCost?: number;
  imageUrl?: string | null;
  rarity?: CardRarity | null;
  evolutionFromId?: string | null;
}

/**
 * 🔵 カード検索クエリパラメータ
 */
export interface CardQueryParams extends PaginationQuery {
  /** 🔵 カード系統でフィルタ */
  cardType?: CardType;
  /** 🔵 名前で部分一致検索 */
  search?: string;
}

/**
 * 🔵 カード一覧レスポンス
 */
export type CardListResponse = ApiResponse<PaginatedResponse<Card>>;

/**
 * 🔵 カード詳細レスポンス
 */
export type CardDetailResponse = ApiResponse<Card>;

// ============================================
// 🔵 Customer API 型定義
// ============================================

/**
 * 🔵 顧客作成リクエスト
 */
export interface CreateCustomerRequest {
  name: string;
  description: string;
  customerType: string;
  difficulty: number;
  requiredAttribute: AttributeValue;
  qualityCondition: number;
  stabilityCondition: number;
  rewardFame: number;
  rewardKnowledge: number;
  portraitUrl?: string | null;
  /** 🔵 報酬カードIDリスト */
  rewardCardIds?: string[];
}

/**
 * 🔵 顧客更新リクエスト（部分更新可能）
 */
export interface UpdateCustomerRequest {
  name?: string;
  description?: string;
  customerType?: string;
  difficulty?: number;
  requiredAttribute?: AttributeValue;
  qualityCondition?: number;
  stabilityCondition?: number;
  rewardFame?: number;
  rewardKnowledge?: number;
  portraitUrl?: string | null;
  rewardCardIds?: string[];
}

/**
 * 🔵 顧客検索クエリパラメータ
 */
export interface CustomerQueryParams extends PaginationQuery {
  /** 🔵 難易度でフィルタ */
  difficulty?: number;
  /** 🔵 名前で部分一致検索 */
  search?: string;
}

/**
 * 🔵 顧客一覧レスポンス
 */
export type CustomerListResponse = ApiResponse<PaginatedResponse<Customer>>;

/**
 * 🔵 顧客詳細レスポンス
 */
export type CustomerDetailResponse = ApiResponse<Customer>;

// ============================================
// 🔵 AlchemyStyle API 型定義
// ============================================

/**
 * 🔵 錬金スタイル作成リクエスト
 */
export interface CreateAlchemyStyleRequest {
  name: string;
  description: string;
  characteristics: string;
  iconUrl?: string | null;
  /** 🔵 初期デッキカードIDリスト */
  initialDeckCardIds: string[];
}

/**
 * 🔵 錬金スタイル更新リクエスト（部分更新可能）
 */
export interface UpdateAlchemyStyleRequest {
  name?: string;
  description?: string;
  characteristics?: string;
  iconUrl?: string | null;
  initialDeckCardIds?: string[];
}

/**
 * 🔵 錬金スタイル一覧レスポンス
 */
export type AlchemyStyleListResponse = ApiResponse<AlchemyStyle[]>;

/**
 * 🔵 錬金スタイル詳細レスポンス
 */
export type AlchemyStyleDetailResponse = ApiResponse<AlchemyStyle>;

// ============================================
// 🔵 MapNode API 型定義
// ============================================

/**
 * 🔵 マップノード作成リクエスト
 */
export interface CreateMapNodeRequest {
  name: string;
  nodeType: NodeType;
  description: string;
  eventContent: Record<string, any>;
  rewards?: Record<string, any> | null;
  iconUrl?: string | null;
  customerId?: string | null;
  mapTemplateId?: string | null;
  position?: { x: number; y: number } | null;
}

/**
 * 🔵 マップノード更新リクエスト（部分更新可能）
 */
export interface UpdateMapNodeRequest {
  name?: string;
  nodeType?: NodeType;
  description?: string;
  eventContent?: Record<string, any>;
  rewards?: Record<string, any> | null;
  iconUrl?: string | null;
  customerId?: string | null;
  mapTemplateId?: string | null;
  position?: { x: number; y: number } | null;
}

/**
 * 🔵 マップノード検索クエリパラメータ
 */
export interface MapNodeQueryParams extends PaginationQuery {
  /** 🔵 ノードタイプでフィルタ */
  nodeType?: NodeType;
  /** 🔵 名前で部分一致検索 */
  search?: string;
}

/**
 * 🔵 マップノード一覧レスポンス
 */
export type MapNodeListResponse = ApiResponse<PaginatedResponse<MapNode>>;

/**
 * 🔵 マップノード詳細レスポンス
 */
export type MapNodeDetailResponse = ApiResponse<MapNode>;

// ============================================
// 🔵 MapTemplate API 型定義
// ============================================

/**
 * 🔵 マップテンプレート作成リクエスト
 */
export interface CreateMapTemplateRequest {
  name: string;
  description: string;
  difficulty: number;
  nodeCount: number;
  iconUrl?: string | null;
  /** 🔵 含めるノードIDリスト */
  nodeIds?: string[];
}

/**
 * 🔵 マップテンプレート更新リクエスト（部分更新可能）
 */
export interface UpdateMapTemplateRequest {
  name?: string;
  description?: string;
  difficulty?: number;
  nodeCount?: number;
  iconUrl?: string | null;
  nodeIds?: string[];
}

/**
 * 🔵 マップテンプレート検索クエリパラメータ
 */
export interface MapTemplateQueryParams extends PaginationQuery {
  /** 🔵 難易度でフィルタ */
  difficulty?: number;
  /** 🔵 名前で部分一致検索 */
  search?: string;
}

/**
 * 🔵 マップテンプレート一覧レスポンス
 */
export type MapTemplateListResponse = ApiResponse<PaginatedResponse<MapTemplate>>;

/**
 * 🔵 マップテンプレート詳細レスポンス
 */
export type MapTemplateDetailResponse = ApiResponse<MapTemplate>;

// ============================================
// 🔵 GameBalance API 型定義
// ============================================

/**
 * 🔵 ゲームバランス更新リクエスト
 */
export interface UpdateGameBalanceRequest {
  settingValue: string;
  description?: string;
}

/**
 * 🔵 ゲームバランス検索クエリパラメータ
 */
export interface GameBalanceQueryParams {
  /** 🔵 カテゴリでフィルタ */
  category?: GameBalanceCategory;
}

/**
 * 🔵 ゲームバランス一覧レスポンス
 */
export type GameBalanceListResponse = ApiResponse<GameBalance[]>;

/**
 * 🔵 ゲームバランス詳細レスポンス
 */
export type GameBalanceDetailResponse = ApiResponse<GameBalance>;

// ============================================
// 🔵 Export/Import API 型定義
// ============================================

/**
 * 🔵 エクスポートクエリパラメータ
 */
export interface ExportQueryParams {
  /** 🔵 エクスポート対象リソース（カンマ区切り） */
  resources?: string;
}

/**
 * 🔵 エクスポートデータ
 */
export interface ExportData {
  /** 🔵 エクスポート日時 */
  exportedAt: string;
  /** 🔵 バージョン */
  version: string;
  /** 🔵 カードデータ */
  cards?: Card[];
  /** 🔵 顧客データ */
  customers?: Customer[];
  /** 🔵 錬金スタイルデータ */
  alchemyStyles?: AlchemyStyle[];
  /** 🔵 マップノードデータ */
  mapNodes?: MapNode[];
  /** 🔵 ゲームバランスデータ */
  gameBalance?: GameBalance[];
}

/**
 * 🔵 インポート結果
 */
export interface ImportResult {
  /** 🔵 カードインポート件数 */
  cards?: number;
  /** 🔵 顧客インポート件数 */
  customers?: number;
  /** 🔵 錬金スタイルインポート件数 */
  alchemyStyles?: number;
  /** 🔵 マップノードインポート件数 */
  mapNodes?: number;
  /** 🔵 ゲームバランスインポート件数 */
  gameBalance?: number;
}

/**
 * 🔵 インポートレスポンス
 */
export interface ImportResponse extends ApiResponse<ImportResult> {
  /** 🔵 インポート統計 */
  imported: ImportResult;
}

// ============================================
// 🟡 フロントエンド専用型定義
// ============================================

/**
 * 🟡 フォーム状態
 */
export interface FormState<T> {
  /** 🟡 フォームデータ */
  data: T;
  /** 🟡 バリデーションエラー */
  errors: Record<keyof T, string>;
  /** 🟡 送信中フラグ */
  isSubmitting: boolean;
  /** 🟡 ダーティフラグ */
  isDirty: boolean;
}

/**
 * 🟡 UIトースト通知
 */
export interface Toast {
  /** 🟡 ID */
  id: string;
  /** 🟡 メッセージ */
  message: string;
  /** 🟡 タイプ */
  type: 'success' | 'error' | 'warning' | 'info';
  /** 🟡 表示時間（ミリ秒） */
  duration?: number;
}

/**
 * 🟡 モーダル状態
 */
export interface ModalState {
  /** 🟡 モーダルが開いているか */
  isOpen: boolean;
  /** 🟡 モーダルタイプ */
  type: 'confirm' | 'error' | 'info';
  /** 🟡 タイトル */
  title: string;
  /** 🟡 メッセージ */
  message: string;
  /** 🟡 確認コールバック */
  onConfirm?: () => void;
  /** 🟡 キャンセルコールバック */
  onCancel?: () => void;
}
