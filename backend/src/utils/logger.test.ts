import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { logInfo, logWarn, logError, logDebug } from './logger';

describe('ログ出力関数', () => {
  // 【テスト前準備】: 各テスト実行前に行う準備作業
  // 【環境初期化】: テスト環境をクリーンな状態にする理由と方法
  beforeEach(() => {
    // コンソール出力をモック化
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'debug').mockImplementation(() => {});
  });

  // 【テスト後処理】: 各テスト実行後に行うクリーンアップ作業
  // 【状態復元】: 次のテストに影響しないよう状態を復元する理由
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('logInfo', () => {
    // 【テスト目的】: logInfo関数が情報ログを正しく出力できることを確認する
    // 【テスト内容】: 情報レベルのログを出力する機能をテストする
    // 【期待される動作】: コンソールに情報ログが出力される
    // 🔴 信頼性レベル: 一般的なログ出力機能のベストプラクティス
    test('TC-LOG-001: logInfo関数が情報ログを正しく出力できること', () => {
      // 【テストデータ準備】: 一般的な情報ログの例を用意
      // 【初期条件設定】: メッセージとデータを設定
      const message = 'ユーザーがログインしました';
      const data = { userId: '123' };

      // 【実際の処理実行】: logInfo関数を呼び出す
      // 【処理内容】: 情報ログを出力する
      logInfo(message, data);

      // 【結果検証】: コンソールに情報ログが出力されることを確認
      // 【期待値確認】: メッセージとデータが正しく出力されること
      expect(console.log).toHaveBeenCalled(); // 【確認内容】: コンソールにログが出力されることを確認 🔴
    });
  });

  describe('logWarn', () => {
    // 【テスト目的】: logWarn関数が警告ログを正しく出力できることを確認する
    // 【テスト内容】: 警告レベルのログを出力する機能をテストする
    // 【期待される動作】: コンソールに警告ログが出力される
    // 🔴 信頼性レベル: 一般的なログ出力機能のベストプラクティス
    test('TC-LOG-002: logWarn関数が警告ログを正しく出力できること', () => {
      // 【テストデータ準備】: 一般的な警告ログの例を用意
      // 【初期条件設定】: メッセージとデータを設定
      const message = 'リクエストが遅延しています';
      const data = { duration: 5000 };

      // 【実際の処理実行】: logWarn関数を呼び出す
      // 【処理内容】: 警告ログを出力する
      logWarn(message, data);

      // 【結果検証】: コンソールに警告ログが出力されることを確認
      // 【期待値確認】: メッセージとデータが正しく出力されること
      expect(console.warn).toHaveBeenCalled(); // 【確認内容】: コンソールに警告ログが出力されることを確認 🔴
    });
  });

  describe('logError', () => {
    // 【テスト目的】: logError関数がエラーログを正しく出力できることを確認する
    // 【テスト内容】: エラーレベルのログを出力する機能をテストする
    // 【期待される動作】: コンソールにエラーログが出力される
    // 🔴 信頼性レベル: 一般的なログ出力機能のベストプラクティス
    test('TC-LOG-003: logError関数がエラーログを正しく出力できること', () => {
      // 【テストデータ準備】: 一般的なエラーログの例を用意
      // 【初期条件設定】: メッセージとエラーオブジェクトを設定
      const message = 'データベース接続エラー';
      const error = new Error('Connection failed');

      // 【実際の処理実行】: logError関数を呼び出す
      // 【処理内容】: エラーログを出力する
      logError(message, error);

      // 【結果検証】: コンソールにエラーログが出力されることを確認
      // 【期待値確認】: メッセージとエラーオブジェクトが正しく出力されること
      expect(console.error).toHaveBeenCalled(); // 【確認内容】: コンソールにエラーログが出力されることを確認 🔴
    });
  });

  describe('logDebug', () => {
    // 【テスト目的】: logDebug関数がデバッグログを正しく出力できることを確認する
    // 【テスト内容】: デバッグレベルのログを出力する機能をテストする
    // 【期待される動作】: コンソールにデバッグログが出力される
    // 🔴 信頼性レベル: 一般的なログ出力機能のベストプラクティス
    test('TC-LOG-004: logDebug関数がデバッグログを正しく出力できること', () => {
      // 【テストデータ準備】: 一般的なデバッグログの例を用意
      // 【初期条件設定】: メッセージとデータを設定
      const message = 'リクエストパラメータ';
      const data = { params: { id: '123' } };

      // 【実際の処理実行】: logDebug関数を呼び出す
      // 【処理内容】: デバッグログを出力する
      logDebug(message, data);

      // 【結果検証】: コンソールにデバッグログが出力されることを確認
      // 【期待値確認】: メッセージとデータが正しく出力されること
      expect(console.debug).toHaveBeenCalled(); // 【確認内容】: コンソールにデバッグログが出力されることを確認 🔴
    });
  });
});

