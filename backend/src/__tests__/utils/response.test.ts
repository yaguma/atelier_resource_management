import { describe, it, expect } from 'vitest';
import { Hono } from 'hono';
import { successResponse, paginatedResponse, errorResponse, notFoundResponse } from '../../utils/response';
import { RES_001 } from '../../constants/errorCodes';

describe('レスポンスユーティリティ', () => {
  describe('successResponse', () => {
    it('成功レスポンスを返す', async () => {
      const app = new Hono();
      app.get('/test', (c) => {
        return successResponse(c, { id: 1, name: 'テスト' });
      });

      const req = new Request('http://localhost/test');
      const res = await app.fetch(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json).toHaveProperty('data');
      expect(json.data).toEqual({ id: 1, name: 'テスト' });
    });

    it('メッセージ付き成功レスポンスを返す', async () => {
      const app = new Hono();
      app.get('/test', (c) => {
        return successResponse(c, { id: 1 }, '作成に成功しました');
      });

      const req = new Request('http://localhost/test');
      const res = await app.fetch(req);
      const json = await res.json();

      expect(json).toHaveProperty('message');
      expect(json.message).toBe('作成に成功しました');
    });

    it('カスタムステータスコードを指定できる', async () => {
      const app = new Hono();
      app.post('/test', (c) => {
        return successResponse(c, { id: 1 }, '作成しました', 201);
      });

      const req = new Request('http://localhost/test', { method: 'POST' });
      const res = await app.fetch(req);

      expect(res.status).toBe(201);
    });
  });

  describe('paginatedResponse', () => {
    it('ページネーションレスポンスを返す', async () => {
      const app = new Hono();
      app.get('/test', (c) => {
        const items = [{ id: 1 }, { id: 2 }, { id: 3 }];
        return paginatedResponse(c, items, 50, 1, 10);
      });

      const req = new Request('http://localhost/test');
      const res = await app.fetch(req);
      const json = await res.json();

      expect(json).toHaveProperty('data');
      expect(json.data).toHaveProperty('items');
      expect(json.data).toHaveProperty('total');
      expect(json.data).toHaveProperty('page');
      expect(json.data).toHaveProperty('limit');
      expect(json.data).toHaveProperty('totalPages');

      expect(json.data.items).toHaveLength(3);
      expect(json.data.total).toBe(50);
      expect(json.data.page).toBe(1);
      expect(json.data.limit).toBe(10);
      expect(json.data.totalPages).toBe(5);
    });

    it('総ページ数が正しく計算される', async () => {
      const app = new Hono();
      app.get('/test', (c) => {
        return paginatedResponse(c, [], 25, 1, 10);
      });

      const req = new Request('http://localhost/test');
      const res = await app.fetch(req);
      const json = await res.json();

      // 25件 ÷ 10件/ページ = 3ページ
      expect(json.data.totalPages).toBe(3);
    });
  });

  describe('errorResponse', () => {
    it('エラーレスポンスを返す', async () => {
      const app = new Hono();
      app.get('/test', (c) => {
        return errorResponse(c, 'TEST_001', 'テストエラー', undefined, 400);
      });

      const req = new Request('http://localhost/test');
      const res = await app.fetch(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json).toHaveProperty('error');
      expect(json.error).toHaveProperty('code');
      expect(json.error).toHaveProperty('message');
      expect(json.error.code).toBe('TEST_001');
      expect(json.error.message).toBe('テストエラー');
    });

    it('詳細情報付きエラーレスポンスを返す', async () => {
      const app = new Hono();
      app.get('/test', (c) => {
        return errorResponse(
          c,
          'VALID_001',
          'バリデーションエラー',
          [{ field: 'name', message: '必須です' }],
          400
        );
      });

      const req = new Request('http://localhost/test');
      const res = await app.fetch(req);
      const json = await res.json();

      expect(json.error).toHaveProperty('details');
      expect(json.error.details).toBeInstanceOf(Array);
      expect(json.error.details[0]).toEqual({
        field: 'name',
        message: '必須です',
      });
    });

    it('デフォルトで500ステータスを返す', async () => {
      const app = new Hono();
      app.get('/test', (c) => {
        return errorResponse(c, 'SYS_001', 'サーバーエラー');
      });

      const req = new Request('http://localhost/test');
      const res = await app.fetch(req);

      expect(res.status).toBe(500);
    });
  });

  describe('notFoundResponse', () => {
    it('404エラーレスポンスを返す', async () => {
      const app = new Hono();
      app.get('/test', (c) => {
        return notFoundResponse(c);
      });

      const req = new Request('http://localhost/test');
      const res = await app.fetch(req);
      const json = await res.json();

      expect(res.status).toBe(404);
      expect(json.error.code).toBe(RES_001);
      expect(json.error.message).toBe('指定されたリソースが見つかりません');
    });

    it('リソース名付き404エラーレスポンスを返す', async () => {
      const app = new Hono();
      app.get('/test', (c) => {
        return notFoundResponse(c, 'カード');
      });

      const req = new Request('http://localhost/test');
      const res = await app.fetch(req);
      const json = await res.json();

      expect(json.error.message).toBe('指定されたカードが見つかりません');
    });
  });
});
