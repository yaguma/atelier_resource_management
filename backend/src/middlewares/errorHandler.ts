import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { RES_001, RES_002, DB_003, SYS_001 } from '../constants/errorCodes';

/**
 * Prismaエラーコード判定
 */
function isPrismaError(error: any): error is { code: string; meta?: any } {
  return error && typeof error.code === 'string' && error.code.startsWith('P');
}

/**
 * グローバルエラーハンドラー
 * HTTPException、Prismaエラー、その他のエラーを処理する
 *
 * @param err - エラーオブジェクト
 * @param c - Honoコンテキスト
 * @returns JSONエラーレスポンス
 */
export function errorHandler(err: Error, c: Context) {
  // エラーをコンソールに出力（ロギング）
  console.error('Error occurred:', err);

  // HTTPException の処理
  if (err instanceof HTTPException) {
    const status = err.status;
    return c.json(
      {
        error: {
          code: `HTTP_${status}`,
          message: err.message,
        },
      },
      status
    );
  }

  // Prismaエラーの処理
  if (isPrismaError(err)) {
    const prismaCode = err.code;

    // P2002: ユニーク制約違反
    if (prismaCode === 'P2002') {
      const meta = err.meta as any;
      const target = meta?.target ? meta.target.join(', ') : '不明';
      return c.json(
        {
          error: {
            code: RES_002,
            message: '同名のリソースが既に存在します',
            details: {
              prismaCode,
              target,
            },
          },
        },
        409
      );
    }

    // P2025: レコード未検出
    if (prismaCode === 'P2025') {
      return c.json(
        {
          error: {
            code: RES_001,
            message: '指定されたリソースが見つかりません',
            details: {
              prismaCode,
            },
          },
        },
        404
      );
    }

    // その他のPrismaエラー
    return c.json(
      {
        error: {
          code: DB_003,
          message: 'クエリ実行エラーが発生しました',
          details: {
            prismaCode,
          },
        },
      },
      500
    );
  }

  // デフォルトエラー（予期しないエラー）
  return c.json(
    {
      error: {
        code: SYS_001,
        message: '内部サーバーエラーが発生しました',
        details:
          process.env.NODE_ENV === 'development'
            ? {
                message: err.message,
                stack: err.stack,
              }
            : undefined,
      },
    },
    500
  );
}
