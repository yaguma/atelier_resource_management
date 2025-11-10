/**
 * TASK-0009: バリデーションミドルウェア実装 - テストファイル
 * TDDフェーズ: Red Phase（失敗するテストを作成）
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { Hono } from 'hono';
import { z } from 'zod';
import { validate } from '../../src/middlewares/validation';
import { VALID_001, VALID_002, VALID_003, VALID_004, ERROR_MESSAGES } from '../../src/constants/errorCodes';

describe('🔵 バリデーションミドルウェア', () => {
  let app: Hono;

  beforeEach(() => {
    app = new Hono();
  });

  /**
   * 🔵 TC-001: bodyバリデーション成功
   *
   * Given: 有効なリクエストボディデータ（name, age）
   *        Zodスキーマ（string min(1), number 0-150）
   * When:  バリデーションミドルウェアを実行
   * Then:  バリデーション成功
   *        検証済みデータがc.get('validated')で取得できる
   *        次のハンドラーが実行される
   */
  it('TC-001: bodyバリデーション成功', async () => {
    // Zodスキーマ定義
    const testSchema = z.object({
      name: z.string().min(1),
      age: z.number().min(0).max(150),
    });

    // テストエンドポイント定義
    app.post('/test', validate(testSchema, 'body'), async (c) => {
      const validated = c.get('validated');
      return c.json({ success: true, data: validated });
    });

    // テスト実行
    const res = await app.request('/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'テストユーザー', age: 25 }),
    });

    // 検証
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data).toEqual({ name: 'テストユーザー', age: 25 });
  });

  /**
   * 🔵 TC-002: queryバリデーション成功
   *
   * Given: 有効なクエリパラメータ（page=2, limit=20）
   *        Zodスキーマ（string→number変換、page≧1, limit 1-100）
   * When:  バリデーションミドルウェアを実行（target: 'query'）
   * Then:  バリデーション成功
   *        文字列が数値に変換される
   *        検証済みデータがc.get('validated')で取得できる
   */
  it('TC-002: queryバリデーション成功', async () => {
    // Zodスキーマ定義（クエリパラメータは文字列として受け取り、数値に変換）
    const paginationSchema = z.object({
      page: z.string().transform(Number).pipe(z.number().min(1)),
      limit: z.string().transform(Number).pipe(z.number().min(1).max(100)),
    });

    // テストエンドポイント定義
    app.get('/test', validate(paginationSchema, 'query'), async (c) => {
      const validated = c.get('validated');
      return c.json({ success: true, data: validated });
    });

    // テスト実行
    const res = await app.request('/test?page=2&limit=20');

    // 検証
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data).toEqual({ page: 2, limit: 20 });
  });

  /**
   * 🟡 TC-003: オプショナルフィールドのバリデーション成功
   *
   * Given: 必須フィールド（name）とオプショナルフィールド（description, tags）を含むスキーマ
   *        オプショナルフィールドを含まないリクエストボディ
   * When:  バリデーションミドルウェアを実行
   * Then:  バリデーション成功
   *        必須フィールドのみ検証される
   *        オプショナルフィールドは省略可能
   */
  it('TC-003: オプショナルフィールドのバリデーション成功', async () => {
    // Zodスキーマ定義
    const schema = z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      tags: z.array(z.string()).optional(),
    });

    // テストエンドポイント定義
    app.post('/test', validate(schema, 'body'), async (c) => {
      const validated = c.get('validated');
      return c.json({ success: true, data: validated });
    });

    // テスト実行
    const res = await app.request('/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'テスト' }),
    });

    // 検証
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.name).toBe('テスト');
    // オプショナルフィールドは含まれない
    expect(json.data.description).toBeUndefined();
    expect(json.data.tags).toBeUndefined();
  });

  /**
   * 🔵 TC-004: 必須フィールド不足エラー（VALID_003）
   *
   * Given: 必須フィールド（name, email）を含むスキーマ
   *        nameフィールドが不足しているリクエストボディ
   * When:  バリデーションミドルウェアを実行
   * Then:  バリデーション失敗
   *        400 Bad Requestが返る
   *        エラーレスポンスにVALID_001とVALID_003が含まれる
   *        details配列にフィールド名とメッセージが含まれる
   */
  it('TC-004: 必須フィールド不足エラー（VALID_003）', async () => {
    // Zodスキーマ定義
    const schema = z.object({
      name: z.string({ required_error: '名前は必須です' }).min(1, '名前は必須です'),
      email: z.string().email('有効なメールアドレスを入力してください'),
    });

    // テストエンドポイント定義
    app.post('/test', validate(schema, 'body'), async (c) => {
      return c.json({ success: true });
    });

    // テスト実行（nameフィールドなし）
    const res = await app.request('/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' }),
    });

    // 検証
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBeDefined();
    expect(json.error.code).toBe(VALID_001);
    expect(json.error.message).toBe(ERROR_MESSAGES[VALID_001]);
    expect(json.error.details).toBeInstanceOf(Array);
    expect(json.error.details.length).toBeGreaterThan(0);

    const nameError = json.error.details.find((d: any) => d.field === 'name');
    expect(nameError).toBeDefined();
    expect(nameError.code).toBe(VALID_003);
    expect(nameError.message).toBe('名前は必須です');
  });

  /**
   * 🔵 TC-005: 型不一致エラー（VALID_002）
   *
   * Given: 数値と真偽値を期待するスキーマ
   *        文字列型のデータを含むリクエストボディ
   * When:  バリデーションミドルウェアを実行
   * Then:  バリデーション失敗
   *        400 Bad Requestが返る
   *        エラーレスポンスにVALID_002が含まれる
   *        複数フィールドのエラーがdetails配列に含まれる
   */
  it('TC-005: 型不一致エラー（VALID_002）', async () => {
    // Zodスキーマ定義
    const schema = z.object({
      age: z.number(),
      active: z.boolean(),
    });

    // テストエンドポイント定義
    app.post('/test', validate(schema, 'body'), async (c) => {
      return c.json({ success: true });
    });

    // テスト実行（型が不正）
    const res = await app.request('/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ age: 'twenty', active: 'yes' }),
    });

    // 検証
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBeDefined();
    expect(json.error.code).toBe(VALID_001);
    expect(json.error.details).toBeInstanceOf(Array);
    expect(json.error.details.length).toBe(2);

    const ageError = json.error.details.find((d: any) => d.field === 'age');
    expect(ageError).toBeDefined();
    expect(ageError.code).toBe(VALID_002);

    const activeError = json.error.details.find((d: any) => d.field === 'active');
    expect(activeError).toBeDefined();
    expect(activeError.code).toBe(VALID_002);
  });

  /**
   * 🔵 TC-006: 範囲外の値エラー（VALID_004）
   *
   * Given: 数値範囲制約を含むスキーマ（energyCost: 0-5, stabilityValue: -100〜100）
   *        範囲外の値を含むリクエストボディ
   * When:  バリデーションミドルウェアを実行
   * Then:  バリデーション失敗
   *        400 Bad Requestが返る
   *        エラーレスポンスにVALID_004が含まれる
   *        範囲制約違反のメッセージが表示される
   */
  it('TC-006: 範囲外の値エラー（VALID_004）', async () => {
    // Zodスキーマ定義
    const schema = z.object({
      energyCost: z.number().min(0).max(5, 'エネルギーコストは0〜5の範囲で入力してください'),
      stabilityValue: z.number().min(-100).max(100, '安定値は-100〜100の範囲で入力してください'),
    });

    // テストエンドポイント定義
    app.post('/test', validate(schema, 'body'), async (c) => {
      return c.json({ success: true });
    });

    // テスト実行（範囲外の値）
    const res = await app.request('/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ energyCost: 10, stabilityValue: 150 }),
    });

    // 検証
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBeDefined();
    expect(json.error.code).toBe(VALID_001);
    expect(json.error.details).toBeInstanceOf(Array);
    expect(json.error.details.length).toBe(2);

    const energyError = json.error.details.find((d: any) => d.field === 'energyCost');
    expect(energyError).toBeDefined();
    expect(energyError.code).toBe(VALID_004);
    expect(energyError.message).toBe('エネルギーコストは0〜5の範囲で入力してください');

    const stabilityError = json.error.details.find((d: any) => d.field === 'stabilityValue');
    expect(stabilityError).toBeDefined();
    expect(stabilityError.code).toBe(VALID_004);
    expect(stabilityError.message).toBe('安定値は-100〜100の範囲で入力してください');
  });

  /**
   * 🔵 TC-007: 列挙型エラー（VALID_002）
   *
   * Given: 列挙型制約を含むスキーマ（cardType: '素材カード' | '調合カード' | '参考書'）
   *        許可されていない値を含むリクエストボディ
   * When:  バリデーションミドルウェアを実行
   * Then:  バリデーション失敗
   *        400 Bad Requestが返る
   *        エラーレスポンスにVALID_002が含まれる
   *        カスタムエラーメッセージが表示される
   */
  it('TC-007: 列挙型エラー（VALID_002）', async () => {
    // Zodスキーマ定義
    const schema = z.object({
      cardType: z.enum(['素材カード', '調合カード', '参考書'], {
        errorMap: () => ({ message: 'カード種別が不正です' }),
      }),
    });

    // テストエンドポイント定義
    app.post('/test', validate(schema, 'body'), async (c) => {
      return c.json({ success: true });
    });

    // テスト実行（不正な列挙値）
    const res = await app.request('/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cardType: '攻撃カード' }),
    });

    // 検証
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBeDefined();
    expect(json.error.code).toBe(VALID_001);
    expect(json.error.details).toBeInstanceOf(Array);

    const cardTypeError = json.error.details.find((d: any) => d.field === 'cardType');
    expect(cardTypeError).toBeDefined();
    expect(cardTypeError.code).toBe(VALID_002);
    expect(cardTypeError.message).toBe('カード種別が不正です');
  });

  /**
   * 🟡 TC-008: 最小値でバリデーション成功
   *
   * Given: 数値範囲制約を含むスキーマ（energyCost: 0-5, stabilityValue: -100〜100）
   *        最小値を含むリクエストボディ
   * When:  バリデーションミドルウェアを実行
   * Then:  バリデーション成功
   *        最小値が許容される
   */
  it('TC-008: 最小値でバリデーション成功', async () => {
    // Zodスキーマ定義
    const schema = z.object({
      energyCost: z.number().min(0).max(5),
      stabilityValue: z.number().min(-100).max(100),
    });

    // テストエンドポイント定義
    app.post('/test', validate(schema, 'body'), async (c) => {
      const validated = c.get('validated');
      return c.json({ success: true, data: validated });
    });

    // テスト実行（最小値）
    const res = await app.request('/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ energyCost: 0, stabilityValue: -100 }),
    });

    // 検証
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data).toEqual({ energyCost: 0, stabilityValue: -100 });
  });

  /**
   * 🟡 TC-009: 最大値でバリデーション成功
   *
   * Given: 数値範囲制約を含むスキーマ（energyCost: 0-5, stabilityValue: -100〜100）
   *        最大値を含むリクエストボディ
   * When:  バリデーションミドルウェアを実行
   * Then:  バリデーション成功
   *        最大値が許容される
   */
  it('TC-009: 最大値でバリデーション成功', async () => {
    // Zodスキーマ定義
    const schema = z.object({
      energyCost: z.number().min(0).max(5),
      stabilityValue: z.number().min(-100).max(100),
    });

    // テストエンドポイント定義
    app.post('/test', validate(schema, 'body'), async (c) => {
      const validated = c.get('validated');
      return c.json({ success: true, data: validated });
    });

    // テスト実行（最大値）
    const res = await app.request('/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ energyCost: 5, stabilityValue: 100 }),
    });

    // 検証
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data).toEqual({ energyCost: 5, stabilityValue: 100 });
  });

  /**
   * 🟡 TC-010: 最小値-1でVALID_004エラー
   *
   * Given: 数値範囲制約を含むスキーマ（energyCost: 0-5, stabilityValue: -100〜100）
   *        最小値-1を含むリクエストボディ
   * When:  バリデーションミドルウェアを実行
   * Then:  バリデーション失敗
   *        400 Bad Requestが返る
   *        エラーレスポンスにVALID_004が含まれる
   */
  it('TC-010: 最小値-1でVALID_004エラー', async () => {
    // Zodスキーマ定義
    const schema = z.object({
      energyCost: z.number().min(0),
      stabilityValue: z.number().min(-100),
    });

    // テストエンドポイント定義
    app.post('/test', validate(schema, 'body'), async (c) => {
      return c.json({ success: true });
    });

    // テスト実行（最小値-1）
    const res = await app.request('/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ energyCost: -1, stabilityValue: -101 }),
    });

    // 検証
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBeDefined();
    expect(json.error.code).toBe(VALID_001);
    expect(json.error.details).toBeInstanceOf(Array);
    expect(json.error.details.length).toBe(2);

    const energyError = json.error.details.find((d: any) => d.field === 'energyCost');
    expect(energyError).toBeDefined();
    expect(energyError.code).toBe(VALID_004);

    const stabilityError = json.error.details.find((d: any) => d.field === 'stabilityValue');
    expect(stabilityError).toBeDefined();
    expect(stabilityError.code).toBe(VALID_004);
  });

  /**
   * 🟡 TC-011: 最大値+1でVALID_004エラー
   *
   * Given: 数値範囲制約を含むスキーマ（energyCost: 0-5, stabilityValue: -100〜100）
   *        最大値+1を含むリクエストボディ
   * When:  バリデーションミドルウェアを実行
   * Then:  バリデーション失敗
   *        400 Bad Requestが返る
   *        エラーレスポンスにVALID_004が含まれる
   */
  it('TC-011: 最大値+1でVALID_004エラー', async () => {
    // Zodスキーマ定義
    const schema = z.object({
      energyCost: z.number().max(5),
      stabilityValue: z.number().max(100),
    });

    // テストエンドポイント定義
    app.post('/test', validate(schema, 'body'), async (c) => {
      return c.json({ success: true });
    });

    // テスト実行（最大値+1）
    const res = await app.request('/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ energyCost: 6, stabilityValue: 101 }),
    });

    // 検証
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBeDefined();
    expect(json.error.code).toBe(VALID_001);
    expect(json.error.details).toBeInstanceOf(Array);
    expect(json.error.details.length).toBe(2);

    const energyError = json.error.details.find((d: any) => d.field === 'energyCost');
    expect(energyError).toBeDefined();
    expect(energyError.code).toBe(VALID_004);

    const stabilityError = json.error.details.find((d: any) => d.field === 'stabilityValue');
    expect(stabilityError).toBeDefined();
    expect(stabilityError.code).toBe(VALID_004);
  });
});
