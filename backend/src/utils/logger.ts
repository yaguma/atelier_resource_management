/**
 * ログ出力関数
 * 🔴 信頼性レベル: 一般的なログ出力機能のベストプラクティス
 */

/**
 * ログレベル
 */
type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

/**
 * ログを出力する（共通処理）
 * @param level - ログレベル
 * @param message - ログメッセージ
 * @param data - 追加データ（オプション）
 */
function log(level: LogLevel, message: string, data?: unknown): void {
  const logMessage = `[${level}] ${message}`;
  const logMethod = level === 'ERROR' ? console.error : level === 'WARN' ? console.warn : level === 'DEBUG' ? console.debug : console.log;

  if (data !== undefined) {
    logMethod(logMessage, data);
  } else {
    logMethod(logMessage);
  }
}

/**
 * 情報ログを出力する
 * @param message - ログメッセージ
 * @param data - 追加データ（オプション）
 */
export function logInfo(message: string, data?: unknown): void {
  log('INFO', message, data);
}

/**
 * 警告ログを出力する
 * @param message - ログメッセージ
 * @param data - 追加データ（オプション）
 */
export function logWarn(message: string, data?: unknown): void {
  log('WARN', message, data);
}

/**
 * エラーログを出力する
 * @param message - ログメッセージ
 * @param error - エラーオブジェクト（オプション）
 */
export function logError(message: string, error?: Error | unknown): void {
  log('ERROR', message, error);
}

/**
 * デバッグログを出力する
 * @param message - ログメッセージ
 * @param data - 追加データ（オプション）
 */
export function logDebug(message: string, data?: unknown): void {
  log('DEBUG', message, data);
}

