import { describe, test, expect } from 'vitest';
import {
  isRequired,
  isString,
  isNumber,
  isEmail,
  isUUID,
  isInRange,
  isMaxLength,
  isMinLength,
} from './validation';

describe('バリデーション関数', () => {
  describe('isRequired', () => {
    // 【テスト目的】: isRequired関数が有効な値に対してtrueを返すことを確認する
    // 【テスト内容】: 値が存在する場合にtrueを返す機能をテストする
    // 【期待される動作】: 有効な値（空でない文字列、数値、オブジェクトなど）に対してtrueを返す
    // 🔴 信頼性レベル: 一般的なバリデーション機能のベストプラクティス
    test('TC-VALID-001: isRequired関数が有効な値に対してtrueを返すこと', () => {
      // 【テストデータ準備】: 様々な型の有効な値を用意
      // 【初期条件設定】: 有効な値を設定
      expect(isRequired('test')).toBe(true); // 【確認内容】: 文字列が有効であることを確認 🔴
      expect(isRequired(123)).toBe(true); // 【確認内容】: 数値が有効であることを確認 🔴
      expect(isRequired({})).toBe(true); // 【確認内容】: オブジェクトが有効であることを確認 🔴
      expect(isRequired([])).toBe(true); // 【確認内容】: 配列が有効であることを確認 🔴
    });

    // 【テスト目的】: isRequired関数が無効な値に対してfalseを返すことを確認する
    // 【テスト内容】: 値が存在しない場合にfalseを返す機能をテストする
    // 【期待される動作】: 無効な値（null、undefined、空文字列など）に対してfalseを返す
    // 🔴 信頼性レベル: 一般的なバリデーション機能のベストプラクティス
    test('TC-VALID-002: isRequired関数が無効な値に対してfalseを返すこと', () => {
      // 【テストデータ準備】: 無効な値の代表例を用意
      // 【初期条件設定】: 無効な値を設定
      expect(isRequired(null)).toBe(false); // 【確認内容】: nullが無効であることを確認 🔴
      expect(isRequired(undefined)).toBe(false); // 【確認内容】: undefinedが無効であることを確認 🔴
      expect(isRequired('')).toBe(false); // 【確認内容】: 空文字列が無効であることを確認 🔴
    });
  });

  describe('isString', () => {
    // 【テスト目的】: isString関数が文字列型を正しく判定できることを確認する
    // 【テスト内容】: 値が文字列型であるかを判定する機能（型ガード）をテストする
    // 【期待される動作】: 文字列に対してtrueを返し、それ以外に対してfalseを返す
    // 🔴 信頼性レベル: TypeScriptの型ガード機能に基づく
    test('TC-VALID-003: isString関数が文字列型を正しく判定できること', () => {
      // 【テストデータ準備】: 様々な型の値を用意
      // 【初期条件設定】: 様々な型の値を設定
      expect(isString('test')).toBe(true); // 【確認内容】: 文字列がtrueを返すことを確認 🔴
      expect(isString(123)).toBe(false); // 【確認内容】: 数値がfalseを返すことを確認 🔴
      expect(isString(null)).toBe(false); // 【確認内容】: nullがfalseを返すことを確認 🔴
      expect(isString(undefined)).toBe(false); // 【確認内容】: undefinedがfalseを返すことを確認 🔴
      expect(isString({})).toBe(false); // 【確認内容】: オブジェクトがfalseを返すことを確認 🔴
    });
  });

  describe('isNumber', () => {
    // 【テスト目的】: isNumber関数が数値型を正しく判定できることを確認する
    // 【テスト内容】: 値が数値型であるかを判定する機能（型ガード）をテストする
    // 【期待される動作】: 数値に対してtrueを返し、それ以外に対してfalseを返す
    // 🔴 信頼性レベル: TypeScriptの型ガード機能に基づく
    test('TC-VALID-004: isNumber関数が数値型を正しく判定できること', () => {
      // 【テストデータ準備】: 様々な型の値を用意
      // 【初期条件設定】: 様々な型の値を設定
      expect(isNumber(123)).toBe(true); // 【確認内容】: 数値がtrueを返すことを確認 🔴
      expect(isNumber(NaN)).toBe(false); // 【確認内容】: NaNがfalseを返すことを確認 🔴
      expect(isNumber('123')).toBe(false); // 【確認内容】: 文字列がfalseを返すことを確認 🔴
      expect(isNumber(null)).toBe(false); // 【確認内容】: nullがfalseを返すことを確認 🔴
      expect(isNumber(undefined)).toBe(false); // 【確認内容】: undefinedがfalseを返すことを確認 🔴
    });
  });

  describe('isEmail', () => {
    // 【テスト目的】: isEmail関数が有効なメールアドレスを正しく判定できることを確認する
    // 【テスト内容】: 文字列が有効なメールアドレス形式であるかを判定する機能をテストする
    // 【期待される動作】: 有効なメールアドレス形式に対してtrueを返す
    // 🔴 信頼性レベル: 一般的なメールアドレス形式のベストプラクティス
    test('TC-VALID-005: isEmail関数が有効なメールアドレスを正しく判定できること', () => {
      // 【テストデータ準備】: 有効なメールアドレス形式の例を用意
      // 【初期条件設定】: 有効なメールアドレス形式を設定
      expect(isEmail('test@example.com')).toBe(true); // 【確認内容】: 一般的なメールアドレス形式が有効であることを確認 🔴
      expect(isEmail('user.name@example.co.jp')).toBe(true); // 【確認内容】: サブドメインとTLDを含むメールアドレス形式が有効であることを確認 🔴
    });

    // 【テスト目的】: isEmail関数が無効なメールアドレスを正しく判定できることを確認する
    // 【テスト内容】: 文字列が無効なメールアドレス形式であるかを判定する機能をテストする
    // 【期待される動作】: 無効なメールアドレス形式に対してfalseを返す
    // 🔴 信頼性レベル: 一般的なメールアドレス形式のベストプラクティス
    test('TC-VALID-006: isEmail関数が無効なメールアドレスを正しく判定できること', () => {
      // 【テストデータ準備】: 無効なメールアドレス形式の例を用意
      // 【初期条件設定】: 無効なメールアドレス形式を設定
      expect(isEmail('invalid-email')).toBe(false); // 【確認内容】: @記号がない形式が無効であることを確認 🔴
      expect(isEmail('@example.com')).toBe(false); // 【確認内容】: ローカル部がない形式が無効であることを確認 🔴
      expect(isEmail('test@')).toBe(false); // 【確認内容】: ドメイン部がない形式が無効であることを確認 🔴
      expect(isEmail('test@.com')).toBe(false); // 【確認内容】: ドメイン名がない形式が無効であることを確認 🔴
    });
  });

  describe('isUUID', () => {
    // 【テスト目的】: isUUID関数が有効なUUIDを正しく判定できることを確認する
    // 【テスト内容】: 文字列が有効なUUID形式であるかを判定する機能をテストする
    // 【期待される動作】: 有効なUUID形式に対してtrueを返す
    // 🔴 信頼性レベル: UUID標準（RFC 4122）に基づく
    test('TC-VALID-007: isUUID関数が有効なUUIDを正しく判定できること', () => {
      // 【テストデータ準備】: 有効なUUID形式の例を用意
      // 【初期条件設定】: 有効なUUID形式を設定
      const validUUID = '550e8400-e29b-41d4-a716-446655440000';

      // 【実際の処理実行】: isUUID関数を呼び出す
      // 【処理内容】: 文字列が有効なUUID形式であるかを判定する
      const result = isUUID(validUUID);

      // 【結果検証】: 判定結果がtrueであることを確認
      // 【期待値確認】: 有効なUUID形式であるため
      expect(result).toBe(true); // 【確認内容】: UUID v4形式が有効であることを確認 🔴
    });

    // 【テスト目的】: isUUID関数が無効なUUIDを正しく判定できることを確認する
    // 【テスト内容】: 文字列が無効なUUID形式であるかを判定する機能をテストする
    // 【期待される動作】: 無効なUUID形式に対してfalseを返す
    // 🔴 信頼性レベル: UUID標準（RFC 4122）に基づく
    test('TC-VALID-008: isUUID関数が無効なUUIDを正しく判定できること', () => {
      // 【テストデータ準備】: 無効なUUID形式の例を用意
      // 【初期条件設定】: 無効なUUID形式を設定
      expect(isUUID('invalid-uuid')).toBe(false); // 【確認内容】: 無効な形式が無効であることを確認 🔴
      expect(isUUID('550e8400-e29b-41d4-a716')).toBe(false); // 【確認内容】: 不完全な形式が無効であることを確認 🔴
      expect(isUUID('550e8400e29b41d4a716446655440000')).toBe(false); // 【確認内容】: ハイフンがない形式が無効であることを確認 🔴
    });
  });

  describe('isInRange', () => {
    // 【テスト目的】: isInRange関数が範囲チェックを正しく実行できることを確認する
    // 【テスト内容】: 数値が指定された範囲内にあるかを判定する機能をテストする
    // 【期待される動作】: 範囲内の値に対してtrueを返し、範囲外の値に対してfalseを返す
    // 🔴 信頼性レベル: 一般的なバリデーション機能のベストプラクティス
    test('TC-VALID-009: isInRange関数が範囲チェックを正しく実行できること', () => {
      // 【テストデータ準備】: 範囲内、範囲外、境界値の例を用意
      // 【初期条件設定】: 様々な値を設定
      expect(isInRange(5, 0, 10)).toBe(true); // 【確認内容】: 範囲内の値がtrueを返すことを確認 🔴
      expect(isInRange(15, 0, 10)).toBe(false); // 【確認内容】: 範囲外の値がfalseを返すことを確認 🔴
      expect(isInRange(0, 0, 10)).toBe(true); // 【確認内容】: 最小境界値がtrueを返すことを確認 🔴
      expect(isInRange(10, 0, 10)).toBe(true); // 【確認内容】: 最大境界値がtrueを返すことを確認 🔴
    });
  });

  describe('isMaxLength', () => {
    // 【テスト目的】: isMaxLength関数が最大文字数チェックを正しく実行できることを確認する
    // 【テスト内容】: 文字列が指定された最大文字数以下であるかを判定する機能をテストする
    // 【期待される動作】: 最大文字数以下の文字列に対してtrueを返し、超過している文字列に対してfalseを返す
    // 🔴 信頼性レベル: 一般的なバリデーション機能のベストプラクティス
    test('TC-VALID-010: isMaxLength関数が最大文字数チェックを正しく実行できること', () => {
      // 【テストデータ準備】: 最大文字数以下、超過、境界値の例を用意
      // 【初期条件設定】: 様々な文字列を設定
      expect(isMaxLength('test', 10)).toBe(true); // 【確認内容】: 最大文字数以下の文字列がtrueを返すことを確認 🔴
      expect(isMaxLength('this is a very long string', 10)).toBe(false); // 【確認内容】: 超過している文字列がfalseを返すことを確認 🔴
      expect(isMaxLength('1234567890', 10)).toBe(true); // 【確認内容】: 境界値がtrueを返すことを確認 🔴
    });
  });

  describe('isMinLength', () => {
    // 【テスト目的】: isMinLength関数が最小文字数チェックを正しく実行できることを確認する
    // 【テスト内容】: 文字列が指定された最小文字数以上であるかを判定する機能をテストする
    // 【期待される動作】: 最小文字数以上の文字列に対してtrueを返し、未満の文字列に対してfalseを返す
    // 🔴 信頼性レベル: 一般的なバリデーション機能のベストプラクティス
    test('TC-VALID-011: isMinLength関数が最小文字数チェックを正しく実行できること', () => {
      // 【テストデータ準備】: 最小文字数以上、未満、境界値の例を用意
      // 【初期条件設定】: 様々な文字列を設定
      expect(isMinLength('test', 3)).toBe(true); // 【確認内容】: 最小文字数以上の文字列がtrueを返すことを確認 🔴
      expect(isMinLength('ab', 3)).toBe(false); // 【確認内容】: 未満の文字列がfalseを返すことを確認 🔴
      expect(isMinLength('abc', 3)).toBe(true); // 【確認内容】: 境界値がtrueを返すことを確認 🔴
    });
  });

  describe('境界値テスト', () => {
    // 【テスト目的】: 空文字列が正しく処理されることを確認する
    // 【テスト内容】: 空文字列が各バリデーション関数で正しく判定されることをテストする
    // 【期待される動作】: 空文字列が各関数で一貫した動作をする
    // 🔴 信頼性レベル: 一般的な境界値テストのベストプラクティス
    test('TC-VALID-201: 空文字列の処理', () => {
      // 【テストデータ準備】: 空文字列を用意
      // 【初期条件設定】: 空文字列を設定
      const emptyString = '';

      // 【結果検証】: 各関数で空文字列が正しく判定されることを確認
      // 【期待値確認】: 各関数で一貫した動作が保証されること
      expect(isRequired(emptyString)).toBe(false); // 【確認内容】: 空文字列が無効であることを確認 🔴
      expect(isString(emptyString)).toBe(true); // 【確認内容】: 空文字列が文字列型であることを確認 🔴
      expect(isMaxLength(emptyString, 10)).toBe(true); // 【確認内容】: 空文字列が最大文字数以下であることを確認 🔴
      expect(isMinLength(emptyString, 3)).toBe(false); // 【確認内容】: 空文字列が最小文字数未満であることを確認 🔴
    });
  });
});

