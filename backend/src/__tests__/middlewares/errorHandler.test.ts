import { describe, it, expect } from 'vitest';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { errorHandler } from '../../middlewares/errorHandler';
import { RES_001, RES_002, DB_003, SYS_001 } from '../../constants/errorCodes';

describe('エラーハンドリングミドルウェア', () => {
  describe('HTTPException処理', () => {
    it('HTTPExceptionを正しく処理する', async () => {
      const app = new Hono();
      app.onError(errorHandler);

      app.get('/test', () => {
        throw new HTTPException(404, { message: 'Not Found' });
      });

      const req = new Request('http://localhost/test');
      const res = await app.fetch(req);
      const json = await res.json();

      expect(res.status).toBe(404);
      expect(json.error.code).toBe('HTTP_404');
      expect(json.error.message).toBe('Not Found');
    });

    it('401エラーを正しく処理する', async () => {
      const app = new Hono();
      app.onError(errorHandler);

      app.get('/test', () => {
        throw new HTTPException(401, { message: 'Unauthorized' });
      });

      const req = new Request('http://localhost/test');
      const res = await app.fetch(req);
      const json = await res.json();

      expect(res.status).toBe(401);
      expect(json.error.code).toBe('HTTP_401');
      expect(json.error.message).toBe('Unauthorized');
    });
  });

  describe('Prismaエラー処理', () => {
    it('P2002（ユニーク制約違反）を409エラーとRES_002コードに変換する', async () => {
      const app = new Hono();
      app.onError(errorHandler);

      app.get('/test', () => {
        const error: any = new Error('Unique constraint failed');
        error.code = 'P2002';
        error.meta = { target: ['name'] };
        throw error;
      });

      const req = new Request('http://localhost/test');
      const res = await app.fetch(req);
      const json = await res.json();

      expect(res.status).toBe(409);
      expect(json.error.code).toBe(RES_002);
      expect(json.error.message).toBe('同名のリソースが既に存在します');
      expect(json.error.details.prismaCode).toBe('P2002');
      expect(json.error.details.target).toBe('name');
    });

    it('P2025（レコード未検出）を404エラーとRES_001コードに変換する', async () => {
      const app = new Hono();
      app.onError(errorHandler);

      app.get('/test', () => {
        const error: any = new Error('Record not found');
        error.code = 'P2025';
        throw error;
      });

      const req = new Request('http://localhost/test');
      const res = await app.fetch(req);
      const json = await res.json();

      expect(res.status).toBe(404);
      expect(json.error.code).toBe(RES_001);
      expect(json.error.message).toBe('指定されたリソースが見つかりません');
      expect(json.error.details.prismaCode).toBe('P2025');
    });

    it('その他のPrismaエラーを500エラーとDB_003コードに変換する', async () => {
      const app = new Hono();
      app.onError(errorHandler);

      app.get('/test', () => {
        const error: any = new Error('Database error');
        error.code = 'P2003';
        throw error;
      });

      const req = new Request('http://localhost/test');
      const res = await app.fetch(req);
      const json = await res.json();

      expect(res.status).toBe(500);
      expect(json.error.code).toBe(DB_003);
      expect(json.error.message).toBe('クエリ実行エラーが発生しました');
      expect(json.error.details.prismaCode).toBe('P2003');
    });
  });

  describe('デフォルトエラー処理', () => {
    it('予期しないエラーを500エラーとSYS_001コードに変換する', async () => {
      const app = new Hono();
      app.onError(errorHandler);

      app.get('/test', () => {
        throw new Error('Unexpected error');
      });

      const req = new Request('http://localhost/test');
      const res = await app.fetch(req);
      const json = await res.json();

      expect(res.status).toBe(500);
      expect(json.error.code).toBe(SYS_001);
      expect(json.error.message).toBe('内部サーバーエラーが発生しました');
    });

    it('開発環境ではエラー詳細を返す', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const app = new Hono();
      app.onError(errorHandler);

      app.get('/test', () => {
        throw new Error('Test error');
      });

      const req = new Request('http://localhost/test');
      const res = await app.fetch(req);
      const json = await res.json();

      expect(json.error.details).toBeDefined();
      expect(json.error.details.message).toBe('Test error');
      expect(json.error.details.stack).toBeDefined();

      process.env.NODE_ENV = originalEnv;
    });

    it('本番環境ではエラー詳細を返さない', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const app = new Hono();
      app.onError(errorHandler);

      app.get('/test', () => {
        throw new Error('Test error');
      });

      const req = new Request('http://localhost/test');
      const res = await app.fetch(req);
      const json = await res.json();

      expect(json.error.details).toBeUndefined();

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('エラーレスポンス形式', () => {
    it('全てのエラーが統一された形式で返される', async () => {
      const app = new Hono();
      app.onError(errorHandler);

      app.get('/test', () => {
        throw new Error('Test');
      });

      const req = new Request('http://localhost/test');
      const res = await app.fetch(req);
      const json = await res.json();

      expect(json).toHaveProperty('error');
      expect(json.error).toHaveProperty('code');
      expect(json.error).toHaveProperty('message');
      expect(typeof json.error.code).toBe('string');
      expect(typeof json.error.message).toBe('string');
    });
  });
});
