import { PrismaClient } from '@prisma/client';

/**
 * Prismaクライアントのシングルトンインスタンス
 * ソフトデリートミドルウェアを設定済み
 */
let prismaInstance: PrismaClient | null = null;

/**
 * Prismaクライアントを取得（シングルトンパターン）
 * ソフトデリートミドルウェアを適用したクライアントを返す
 */
export function getPrismaClient(): PrismaClient {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient({
      log: process.env.PRISMA_QUERY_LOG === 'true' ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
    });

    // ソフトデリートミドルウェアを適用
    setupSoftDeleteMiddleware(prismaInstance);
  }

  return prismaInstance;
}

/**
 * ソフトデリートミドルウェアをPrismaクライアントに適用
 *
 * @param prisma - Prismaクライアントインスタンス
 */
function setupSoftDeleteMiddleware(prisma: PrismaClient) {
  // DELETE操作をUPDATE操作に変換（deletedAtを設定）
  prisma.$use(async (params, next) => {
    // DELETE操作の場合
    if (params.action === 'delete') {
      params.action = 'update';
      params.args.data = { deletedAt: new Date() };
    }

    // DELETE MANY操作の場合
    if (params.action === 'deleteMany') {
      params.action = 'updateMany';
      if (params.args.data !== undefined) {
        params.args.data.deletedAt = new Date();
      } else {
        params.args.data = { deletedAt: new Date() };
      }
    }

    return next(params);
  });

  // SELECT操作にdeletedAt IS NULLフィルタを追加
  prisma.$use(async (params, next) => {
    // テーブルにdeletedAtフィールドがあるか確認
    const modelsWithSoftDelete = [
      'card',
      'customer',
      'alchemyStyle',
      'reward',
      'mapNode',
      'metaCurrency',
      'metaProgress',
      'metaSkill',
      'gameSystem',
    ];

    const modelName = params.model?.toLowerCase();

    // deletedAtフィールドを持つモデルのみフィルタを適用
    if (modelName && modelsWithSoftDelete.includes(modelName)) {
      if (params.action === 'findUnique' || params.action === 'findFirst') {
        // 既存のwhereに追加
        params.args.where = {
          ...params.args.where,
          deletedAt: null,
        };
      }

      if (params.action === 'findMany') {
        // whereが未定義の場合は初期化
        if (!params.args) {
          params.args = {};
        }

        if (!params.args.where) {
          params.args.where = {};
        }

        // 既存のwhereに追加
        params.args.where = {
          ...params.args.where,
          deletedAt: null,
        };
      }

      if (params.action === 'count') {
        // whereが未定義の場合は初期化
        if (!params.args) {
          params.args = {};
        }

        if (!params.args.where) {
          params.args.where = {};
        }

        params.args.where = {
          ...params.args.where,
          deletedAt: null,
        };
      }
    }

    return next(params);
  });
}

/**
 * Prismaクライアントを切断
 * アプリケーション終了時に呼び出す
 */
export async function disconnectPrisma() {
  if (prismaInstance) {
    await prismaInstance.$disconnect();
    prismaInstance = null;
  }
}

// デフォルトエクスポート
export const prisma = getPrismaClient();
