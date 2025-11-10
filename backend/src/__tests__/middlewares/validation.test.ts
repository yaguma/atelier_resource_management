import { describe, it, expect } from 'vitest';
import { Hono } from 'hono';
import { z } from 'zod';
import { validate } from '../../middlewares/validation';
import { VALID_001, VALID_002 } from '../../constants/errorCodes';

describe('バリデーションミドルウェア', () => {
  describe('bodyバリデーション', () => {
    it('正常なリクエストの場合、バリデーションを通過する', async () => {
      const app = new Hono();
      const testSchema = z.object({
        name: z.string().min(1),
        age: z.number().min(0),
      });

      app.post('/test', validate(testSchema, 'body'), (c) => {
        const validated = c.get('validated');
        return c.json({ success: true, data: validated });
      });

      const req = new Request('http://localhost/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'テスト太郎', age: 25 }),
      });

      const res = await app.fetch(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data).toEqual({ name: 'テスト太郎', age: 25 });
    });

    it('不正なリクエストの場合、400エラーとVALID_001コードを返す', async () => {
      const app = new Hono();
      const testSchema = z.object({
        name: z.string().min(1, '名前は必須です'),
        age: z.number().min(0, '年齢は0以上で指定してください'),
      });

      app.post('/test', validate(testSchema, 'body'), (c) => {
        return c.json({ success: true });
      });

      const req = new Request('http://localhost/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: '', age: -5 }),
      });

      const res = await app.fetch(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error.code).toBe(VALID_001);
      expect(json.error.message).toBe('入力データが不正です');
      expect(json.error.details).toBeInstanceOf(Array);
      expect(json.error.details.length).toBeGreaterThan(0);
    });

    it('必須フィールドが不足している場合、エラー詳細を返す', async () => {
      const app = new Hono();
      const testSchema = z.object({
        name: z.string(),
        email: z.string().email(),
      });

      app.post('/test', validate(testSchema, 'body'), (c) => {
        return c.json({ success: true });
      });

      const req = new Request('http://localhost/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'テスト' }),
      });

      const res = await app.fetch(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error.code).toBe(VALID_001);
      expect(json.error.details).toBeInstanceOf(Array);

      const emailError = json.error.details.find((d: any) => d.field === 'email');
      expect(emailError).toBeDefined();
      expect(emailError.message).toBeDefined();
    });

    it('型が不一致の場合、エラーを返す', async () => {
      const app = new Hono();
      const testSchema = z.object({
        age: z.number(),
      });

      app.post('/test', validate(testSchema, 'body'), (c) => {
        return c.json({ success: true });
      });

      const req = new Request('http://localhost/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ age: 'not a number' }),
      });

      const res = await app.fetch(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error.code).toBe(VALID_001);
      expect(json.error.details[0].field).toBe('age');
    });

    it('不正なJSON形式の場合、VALID_002エラーを返す', async () => {
      const app = new Hono();
      const testSchema = z.object({
        name: z.string(),
      });

      app.post('/test', validate(testSchema, 'body'), (c) => {
        return c.json({ success: true });
      });

      const req = new Request('http://localhost/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{invalid json}', // 不正なJSON
      });

      const res = await app.fetch(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error.code).toBe(VALID_002);
      expect(json.error.message).toBe('リクエストボディのJSON解析に失敗しました');
      expect(json.error.details).toHaveProperty('reason');
    });

    it('空のボディの場合、VALID_002エラーを返す', async () => {
      const app = new Hono();
      const testSchema = z.object({
        name: z.string(),
      });

      app.post('/test', validate(testSchema, 'body'), (c) => {
        return c.json({ success: true });
      });

      const req = new Request('http://localhost/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '', // 空のボディ
      });

      const res = await app.fetch(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error.code).toBe(VALID_002);
      expect(json.error.message).toBe('リクエストボディのJSON解析に失敗しました');
    });
  });

  describe('queryバリデーション', () => {
    it('正常なクエリパラメータの場合、バリデーションを通過する', async () => {
      const app = new Hono();
      const testSchema = z.object({
        page: z.string().transform(Number),
        limit: z.string().transform(Number),
      });

      app.get('/test', validate(testSchema, 'query'), (c) => {
        const validated = c.get('validated');
        return c.json({ success: true, data: validated });
      });

      const req = new Request('http://localhost/test?page=1&limit=10', {
        method: 'GET',
      });

      const res = await app.fetch(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data).toEqual({ page: 1, limit: 10 });
    });

    it('不正なクエリパラメータの場合、400エラーを返す', async () => {
      const app = new Hono();
      const testSchema = z.object({
        id: z.string().uuid('有効なUUIDを指定してください'),
      });

      app.get('/test', validate(testSchema, 'query'), (c) => {
        return c.json({ success: true });
      });

      const req = new Request('http://localhost/test?id=invalid-uuid', {
        method: 'GET',
      });

      const res = await app.fetch(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error.code).toBe(VALID_001);
      expect(json.error.details[0].field).toBe('id');
      expect(json.error.details[0].message).toContain('UUID');
    });
  });

  describe('エラーレスポンス形式', () => {
    it('エラーレスポンスが正しい形式である', async () => {
      const app = new Hono();
      const testSchema = z.object({
        name: z.string().min(1),
      });

      app.post('/test', validate(testSchema, 'body'), (c) => {
        return c.json({ success: true });
      });

      const req = new Request('http://localhost/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const res = await app.fetch(req);
      const json = await res.json();

      expect(json).toHaveProperty('error');
      expect(json.error).toHaveProperty('code');
      expect(json.error).toHaveProperty('message');
      expect(json.error).toHaveProperty('details');
      expect(json.error.details).toBeInstanceOf(Array);

      if (json.error.details.length > 0) {
        const detail = json.error.details[0];
        expect(detail).toHaveProperty('field');
        expect(detail).toHaveProperty('message');
      }
    });
  });
});
