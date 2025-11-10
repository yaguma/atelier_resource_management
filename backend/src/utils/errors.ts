import { DependencyInfo } from './dependencyCheck';

/**
 * 🔵 アプリケーション共通エラークラス
 * 体系的なエラーコードを持つカスタムエラー
 */
export class AppError extends Error {
  /**
   * @param code エラーコード（AUTH_xxx, VALID_xxx, RES_xxx等）
   * @param message エラーメッセージ
   * @param dependencies 依存関係情報（RES_003の場合のみ）
   */
  constructor(
    public readonly code: string,
    message: string,
    public readonly dependencies?: DependencyInfo[]
  ) {
    super(message);
    this.name = 'AppError';

    // スタックトレースを正しく設定
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 🔵 リソース未検出エラー（RES_001）
 */
export class ResourceNotFoundError extends AppError {
  constructor(resourceName: string) {
    super('RES_001', `${resourceName}が見つかりません`);
    this.name = 'ResourceNotFoundError';
  }
}

/**
 * 🔵 重複エントリエラー（RES_002）
 */
export class DuplicateResourceError extends AppError {
  constructor(resourceName: string, fieldName: string = '名前') {
    super('RES_002', `同じ${fieldName}の${resourceName}が既に存在します`);
    this.name = 'DuplicateResourceError';
  }
}

/**
 * 🔵 依存関係エラー（RES_003）
 */
export class DependencyError extends AppError {
  constructor(dependencies: DependencyInfo[]) {
    super('RES_003', '他のリソースから参照されているため削除できません', dependencies);
    this.name = 'DependencyError';
  }
}

/**
 * 🔵 バリデーションエラー（VALID_001）
 */
export class ValidationError extends AppError {
  constructor(message: string = '入力データが不正です') {
    super('VALID_001', message);
    this.name = 'ValidationError';
  }
}

/**
 * エラーがAppErrorかどうかをチェックする型ガード
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
