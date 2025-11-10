import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import 'dotenv/config';
import { corsMiddleware } from './middlewares/cors';
import { errorHandler } from './middlewares/errorHandler';
import { logger } from './middlewares/logger';
import { prisma, disconnectPrisma } from './utils/prisma';

const app = new Hono();

// Prismaクライアント初期化（ソフトデリートミドルウェア適用済み）
console.log('Prisma client initialized with soft delete middleware');

// ロギングミドルウェアを全ルートに適用
app.use('*', logger);

// CORSミドルウェアを全ルートに適用
app.use('*', corsMiddleware);

// エラーハンドラーを適用
app.onError(errorHandler);

app.get('/', (c) => {
  return c.json({ message: 'Hello Hono!' });
});

const port = Number(process.env.PORT) || 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});

// アプリケーション終了時の処理
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await disconnectPrisma();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  await disconnectPrisma();
  process.exit(0);
});
