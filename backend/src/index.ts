import { Hono } from 'hono';
import { serve } from '@hono/node-server';

const app = new Hono();

// ヘルスチェックエンドポイント
app.get('/health', (c) => {
  return c.json({ status: 'ok' });
});

// ルートエンドポイント
app.get('/', (c) => {
  return c.json({ message: 'Atelier Resource Management API' });
});

const port = Number(process.env.PORT) || 3000;

console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});

