import { Context, Next } from 'hono';

/**
 * ロギングミドルウェア
 * リクエスト・レスポンスの情報をコンソールに出力する
 */
export async function logger(c: Context, next: Next) {
  const start = Date.now();
  const method = c.req.method;
  const path = c.req.path;

  // リクエスト開始ログ
  console.log(`→ ${method} ${path}`);

  await next();

  // レスポンス後の処理
  const status = c.res.status;
  const duration = Date.now() - start;

  // ステータスコードに応じた絵文字を選択
  let emoji = '✅';
  if (status >= 500) {
    emoji = '❌';
  } else if (status >= 400) {
    emoji = '⚠️';
  }

  // レスポンスログ
  console.log(`${emoji} ${method} ${path} ${status} ${duration}ms`);
}
