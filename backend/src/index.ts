import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import 'dotenv/config';
import { corsMiddleware } from './middlewares/cors';

const app = new Hono();

// CORSミドルウェアを全ルートに適用
app.use('*', corsMiddleware);

app.get('/', (c) => {
  return c.json({ message: 'Hello Hono!' });
});

const port = Number(process.env.PORT) || 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
