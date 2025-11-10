/**
 * 🔵 エラーコード定数定義
 * 設計書 api-endpoints.md に基づく体系的なエラーコード
 */

// 🔵 認証・認可エラー(AUTH_xxx)
export const AUTH_001 = 'AUTH_001'; // 認証エラー(将来実装)
export const AUTH_002 = 'AUTH_002'; // トークン期限切れ(将来実装)
export const AUTH_003 = 'AUTH_003'; // 権限不足(将来実装)

// 🔵 バリデーションエラー(VALID_xxx)
export const VALID_001 = 'VALID_001'; // バリデーションエラー
export const VALID_002 = 'VALID_002'; // 型不一致
export const VALID_003 = 'VALID_003'; // 必須フィールド不足
export const VALID_004 = 'VALID_004'; // 範囲外の値

// 🔵 リソースエラー(RES_xxx)
export const RES_001 = 'RES_001'; // リソース未検出
export const RES_002 = 'RES_002'; // 重複エントリ
export const RES_003 = 'RES_003'; // 依存関係エラー
export const RES_004 = 'RES_004'; // 削除済みリソース

// 🔵 データベースエラー(DB_xxx)
export const DB_001 = 'DB_001'; // データベース接続エラー
export const DB_002 = 'DB_002'; // トランザクションエラー
export const DB_003 = 'DB_003'; // クエリ実行エラー
export const DB_004 = 'DB_004'; // データベース過負荷

// 🔵 Repository エラー(REPO_xxx)
export const REPO_001 = 'REPO_001'; // Repository初期化エラー
export const REPO_002 = 'REPO_002'; // Repository操作エラー
export const REPO_003 = 'REPO_003'; // 実装未検出

// 🔵 システムエラー(SYS_xxx)
export const SYS_001 = 'SYS_001'; // 内部サーバーエラー
export const SYS_002 = 'SYS_002'; // サービス利用不可
export const SYS_003 = 'SYS_003'; // タイムアウト

// 🔵 ネットワークエラー(NET_xxx)
export const NET_001 = 'NET_001'; // レート制限超過
export const NET_002 = 'NET_002'; // リクエストサイズ超過
export const NET_003 = 'NET_003'; // リクエストタイムアウト

// 🔵 エラーコードマップ(コードからメッセージへの変換)
export const ERROR_MESSAGES: Record<string, string> = {
  // 認証・認可エラー
  [AUTH_001]: '認証エラー',
  [AUTH_002]: 'トークンの有効期限が切れています',
  [AUTH_003]: '権限がありません',

  // バリデーションエラー
  [VALID_001]: '入力データが不正です',
  [VALID_002]: 'データ型が不正です',
  [VALID_003]: '必須フィールドが不足しています',
  [VALID_004]: '値が許容範囲外です',

  // リソースエラー
  [RES_001]: '指定されたリソースが見つかりません',
  [RES_002]: '同名のリソースが既に存在します',
  [RES_003]: '他のリソースから参照されているため削除できません',
  [RES_004]: '削除済みのリソースです',

  // データベースエラー
  [DB_001]: 'データベース接続エラーが発生しました',
  [DB_002]: 'トランザクションエラーが発生しました',
  [DB_003]: 'クエリ実行エラーが発生しました',
  [DB_004]: 'データベースが過負荷状態です',

  // Repository エラー
  [REPO_001]: 'Repository初期化エラーが発生しました',
  [REPO_002]: 'Repository操作エラーが発生しました',
  [REPO_003]: '指定されたRepository実装が見つかりません',

  // システムエラー
  [SYS_001]: '内部サーバーエラーが発生しました',
  [SYS_002]: 'サービスが利用できません',
  [SYS_003]: 'リクエストがタイムアウトしました',

  // ネットワークエラー
  [NET_001]: 'API呼び出し回数が制限を超過しました',
  [NET_002]: 'リクエストサイズが大きすぎます',
  [NET_003]: 'リクエストがタイムアウトしました',
};
