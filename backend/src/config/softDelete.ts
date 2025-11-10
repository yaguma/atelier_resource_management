/**
 * ソフトデリート設定
 * deletedAtフィールドを持つモデルの一覧を管理
 */

/**
 * ソフトデリート対応モデルのSet
 *
 * このSetに含まれるモデルには、以下の処理が自動的に適用される:
 * - DELETE操作がUPDATEに変換される（deletedAtに現在時刻を設定）
 * - SELECT操作に deletedAt IS NULL フィルタが追加される
 *
 * 新しいモデルを追加する場合:
 * 1. Prismaスキーマに deletedAt フィールドを追加
 * 2. このSetにモデル名（小文字）を追加
 */
export const SOFT_DELETE_MODELS = new Set<string>([
  'card',
  'customer',
  'alchemystyle',
  'reward',
  'mapnode',
  'metacurrency',
  'metaprogress',
  'metaskill',
  'gamesystem',
]);

/**
 * 指定されたモデル名がソフトデリート対応かどうかを判定
 *
 * @param modelName - モデル名（大文字小文字は区別しない）
 * @returns ソフトデリート対応の場合true
 */
export function isSoftDeleteModel(modelName: string | undefined): boolean {
  if (!modelName) {
    return false;
  }
  return SOFT_DELETE_MODELS.has(modelName.toLowerCase());
}
