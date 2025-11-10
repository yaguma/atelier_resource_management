/**
 * TASK-0008: CORSミドルウェア実装（詳細設定）
 *
 * このミドルウェアは、フロントエンド（React SPA）とバックエンド（Hono.js API）が
 * 異なるオリジンで動作するため、ブラウザのCORSポリシーに対応します。
 *
 * 🔵 設計文書: architecture.md の「CORS設定（詳細）」に基づく実装
 * 🔵 要件: WRREQ-070-1、WRREQ-070-2
 */

import { cors } from 'hono/cors';

/**
 * CORSミドルウェア
 *
 * フロントエンドからのAPIアクセスを許可するためのCORS設定を行います。
 *
 * 設定項目:
 * - origin: 許可するオリジン（環境変数CORS_ORIGINから取得、デフォルト: http://localhost:5173）
 * - credentials: Cookie・認証情報の送信を許可（true）
 * - allowMethods: 許可するHTTPメソッド（GET、POST、PUT、DELETE、OPTIONS）
 * - allowHeaders: 許可するリクエストヘッダー（Content-Type、Authorization、X-Requested-With）
 * - exposeHeaders: フロントエンドに公開するレスポンスヘッダー（X-Total-Count、X-Page、X-Limit）
 * - maxAge: プリフライトリクエストのキャッシュ時間（86400秒 = 24時間）
 */
export const corsMiddleware = cors({
  // 🔵 環境変数CORS_ORIGINから許可するオリジンを取得
  // デフォルト値: http://localhost:5173（開発環境用）
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',

  // 🔵 Cookie・認証情報の送信を許可
  // 将来の認証機能実装に備えてtrueに設定
  credentials: true,

  // 🔵 許可するHTTPメソッド
  // REST APIで使用される標準的なメソッドを全て許可
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],

  // 🔵 許可するリクエストヘッダー
  // - Content-Type: リクエストボディの形式指定
  // - Authorization: 認証トークン（将来実装用）
  // - X-Requested-With: AJAXリクエストの識別
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],

  // 🔵 フロントエンドに公開するレスポンスヘッダー
  // ページネーション情報をフロントエンドが読み取れるようにする
  // - X-Total-Count: 総件数
  // - X-Page: 現在のページ番号
  // - X-Limit: 1ページあたりの件数
  exposeHeaders: ['X-Total-Count', 'X-Page', 'X-Limit'],

  // 🔵 プリフライトリクエストのキャッシュ時間
  // 24時間（86400秒）キャッシュすることで、パフォーマンスを向上
  maxAge: 86400,
});
