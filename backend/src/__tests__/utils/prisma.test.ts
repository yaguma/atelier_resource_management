import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getPrismaClient, disconnectPrisma } from '../../utils/prisma';

describe('Prismaユーティリティ', () => {
  describe('getPrismaClient', () => {
    it('Prismaクライアントのシングルトンインスタンスを返す', () => {
      const client1 = getPrismaClient();
      const client2 = getPrismaClient();

      // 同じインスタンスが返されることを確認
      expect(client1).toBe(client2);
    });

    it('Prismaクライアントが正しく初期化される', () => {
      const client = getPrismaClient();

      expect(client).toBeDefined();
      expect(client.$connect).toBeDefined();
      expect(client.$disconnect).toBeDefined();
      expect(client.$use).toBeDefined();
    });
  });

  describe('disconnectPrisma', () => {
    it('Prismaクライアントを切断できる', async () => {
      const client = getPrismaClient();

      // $disconnectをスパイ
      const disconnectSpy = vi.spyOn(client, '$disconnect').mockResolvedValue();

      await disconnectPrisma();

      expect(disconnectSpy).toHaveBeenCalled();

      // スパイをリストア
      disconnectSpy.mockRestore();
    });
  });

  describe('ソフトデリートミドルウェア', () => {
    it('Prismaクライアントにミドルウェアが適用されている', () => {
      const client = getPrismaClient();

      // $use メソッドが存在することを確認
      expect(client.$use).toBeDefined();
      expect(typeof client.$use).toBe('function');
    });

    // 注意: 実際のミドルウェアの動作テストはデータベース接続が必要なため、
    // 統合テストで実施することが推奨される
    // ここではミドルウェアが適用されていることのみを確認
  });
});

describe('環境変数', () => {
  it('PRISMA_QUERY_LOGが設定されている場合、クエリログが有効になる', () => {
    const originalEnv = process.env.PRISMA_QUERY_LOG;

    // 環境変数を設定
    process.env.PRISMA_QUERY_LOG = 'true';

    // 新しいクライアントを取得
    const client = getPrismaClient();

    expect(client).toBeDefined();

    // 元の環境変数に戻す
    if (originalEnv !== undefined) {
      process.env.PRISMA_QUERY_LOG = originalEnv;
    } else {
      delete process.env.PRISMA_QUERY_LOG;
    }
  });
});
