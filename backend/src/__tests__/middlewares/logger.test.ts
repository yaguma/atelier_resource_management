import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Hono } from 'hono';
import { logger } from '../../middlewares/logger';

describe('ロギングミドルウェア', () => {
  let consoleLogSpy: any;

  beforeEach(() => {
    // console.logをモック化
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    // モックをリストア
    consoleLogSpy.mockRestore();
  });

  describe('リクエストログ', () => {
    it('リクエスト開始時にログが出力される', async () => {
      const app = new Hono();
      app.use('*', logger);
      app.get('/test', (c) => c.json({ ok: true }));

      const req = new Request('http://localhost/test');
      await app.fetch(req);

      expect(consoleLogSpy).toHaveBeenCalledWith('→ GET /test');
    });

    it('POSTリクエストでもログが出力される', async () => {
      const app = new Hono();
      app.use('*', logger);
      app.post('/test', (c) => c.json({ ok: true }));

      const req = new Request('http://localhost/test', { method: 'POST' });
      await app.fetch(req);

      expect(consoleLogSpy).toHaveBeenCalledWith('→ POST /test');
    });
  });

  describe('レスポンスログ', () => {
    it('200ステータスの場合、✅絵文字が表示される', async () => {
      const app = new Hono();
      app.use('*', logger);
      app.get('/test', (c) => c.json({ ok: true }));

      const req = new Request('http://localhost/test');
      await app.fetch(req);

      // 2番目の呼び出しがレスポンスログ
      const secondCall = consoleLogSpy.mock.calls[1][0];
      expect(secondCall).toMatch(/✅/);
      expect(secondCall).toMatch(/GET \/test 200/);
      expect(secondCall).toMatch(/\d+ms/);
    });

    it('404ステータスの場合、⚠️絵文字が表示される', async () => {
      const app = new Hono();
      app.use('*', logger);
      // ルートを定義しない（404が返る）

      const req = new Request('http://localhost/test');
      await app.fetch(req);

      const secondCall = consoleLogSpy.mock.calls[1][0];
      expect(secondCall).toMatch(/⚠️/);
      expect(secondCall).toMatch(/404/);
    });

    it('500ステータスの場合、❌絵文字が表示される', async () => {
      const app = new Hono();
      app.use('*', logger);
      app.get('/test', () => {
        throw new Error('Test error');
      });

      const req = new Request('http://localhost/test');
      await app.fetch(req);

      const secondCall = consoleLogSpy.mock.calls[1][0];
      expect(secondCall).toMatch(/❌/);
      expect(secondCall).toMatch(/500/);
    });
  });

  describe('実行時間の記録', () => {
    it('実行時間が記録される', async () => {
      const app = new Hono();
      app.use('*', logger);
      app.get('/test', async (c) => {
        // 少し遅延を追加
        await new Promise((resolve) => setTimeout(resolve, 10));
        return c.json({ ok: true });
      });

      const req = new Request('http://localhost/test');
      await app.fetch(req);

      const secondCall = consoleLogSpy.mock.calls[1][0];
      // 実行時間がミリ秒で記録されている
      expect(secondCall).toMatch(/\d+ms/);

      // 実行時間を抽出して検証
      const match = secondCall.match(/(\d+)ms/);
      expect(match).toBeTruthy();
      if (match) {
        const duration = parseInt(match[1], 10);
        // 10ms以上かかっているはず（遅延を追加したため）
        expect(duration).toBeGreaterThanOrEqual(10);
      }
    });
  });

  describe('複数リクエスト', () => {
    it('複数のリクエストがそれぞれログに記録される', async () => {
      const app = new Hono();
      app.use('*', logger);
      app.get('/test1', (c) => c.json({ ok: true }));
      app.get('/test2', (c) => c.json({ ok: true }));

      const req1 = new Request('http://localhost/test1');
      await app.fetch(req1);

      const req2 = new Request('http://localhost/test2');
      await app.fetch(req2);

      // 4回呼ばれているはず（リクエスト開始 + レスポンス） × 2
      expect(consoleLogSpy).toHaveBeenCalledTimes(4);

      expect(consoleLogSpy.mock.calls[0][0]).toMatch(/→ GET \/test1/);
      expect(consoleLogSpy.mock.calls[1][0]).toMatch(/✅ GET \/test1 200/);
      expect(consoleLogSpy.mock.calls[2][0]).toMatch(/→ GET \/test2/);
      expect(consoleLogSpy.mock.calls[3][0]).toMatch(/✅ GET \/test2 200/);
    });
  });
});
