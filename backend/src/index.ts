import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import 'dotenv/config';
import { corsMiddleware } from './middlewares/cors';
import { errorHandler } from './middlewares/errorHandler';
import { logger } from './middlewares/logger';
import { prisma, disconnectPrisma } from './utils/prisma';
// 🔵 Repository Pattern基盤（Phase 1-B: TASK-0015A）
import { createRepositoryContainer } from './di/container';
// 🔵 Card Routes（Phase 2: TASK-0016）
import cardsRouter from './routes/cards';
// 🔵 Customer Routes（Phase 2: TASK-0022）
import customersRouter from './routes/customers';

const app = new Hono();

// Prismaクライアント初期化（ソフトデリートミドルウェア適用済み）
console.log('Prisma client initialized with soft delete middleware');

// 🔵 Repository コンテナの初期化（Phase 2: TASK-0015B, TASK-0015C）
const repositoryContainer = createRepositoryContainer();
console.log(`Repository container initialized with type: ${process.env.REPOSITORY_TYPE || 'prisma'}`);

// 🔵 Repository コンテナをコンテキストに追加（Phase 2: TASK-0015C）
app.use('*', async (c, next) => {
  c.set('repositories', repositoryContainer);
  await next();
});

// ロギングミドルウェアを全ルートに適用
app.use('*', logger);

// CORSミドルウェアを全ルートに適用
app.use('*', corsMiddleware);

// エラーハンドラーを適用
app.onError(errorHandler);

app.get('/', (c) => {
  return c.json({ message: 'Hello Hono!' });
});

// 🔵 API Routes
app.route('/api/cards', cardsRouter);
app.route('/api/customers', customersRouter);

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
