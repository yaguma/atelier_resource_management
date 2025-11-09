# Phase 1: プロジェクト基盤構築とバックエンド基盤

## フェーズ概要

### 要件名
resource-management-webapp

### 期間・目標
- **期間**: 10営業日（Week 1-2）
- **総工数**: 80時間
- **タスク数**: 15タスク
- **目標**: プロジェクトの基盤を構築し、バックエンドの共通機能を実装する

### 成果物
- フロントエンドプロジェクト（React + Vite + TypeScript + TailwindCSS）
- バックエンドプロジェクト（Hono.js + TypeScript）
- PostgreSQL環境（Docker Compose）
- Prismaスキーマ・マイグレーション
- 共通ミドルウェア（CORS、バリデーション、エラーハンドリング、ロギング）
- 共通レスポンス型・ユーティリティ
- ヘルスチェックエンドポイント

---

## 週次計画

### Week 1（Day 1-5）: プロジェクト初期化とデータベース構築
**目標**: プロジェクト環境を構築し、データベース基盤を整える

**成果物**:
- フロントエンド・バックエンドプロジェクト初期化
- PostgreSQL環境（Docker Compose）
- Prismaスキーマ実装・マイグレーション
- Hono.js基本設定

### Week 2（Day 6-10）: バックエンド共通機能実装
**目標**: バックエンドの共通ミドルウェア・ユーティリティを実装する

**成果物**:
- CORSミドルウェア
- バリデーションミドルウェア
- エラーハンドリングミドルウェア
- ロギングミドルウェア
- 共通レスポンス型・ユーティリティ
- ヘルスチェックエンドポイント

---

## 日次タスク

### Day 1（8時間）: フロントエンドプロジェクト初期化

#### ☑ TASK-0001: フロントエンドプロジェクト初期化
- **推定工数**: 8時間
- **タスクタイプ**: DIRECT
- **要件へのリンク**: WRREQ-001, WRREQ-001-2, WRREQ-002, WRREQ-005
- **依存タスク**: なし

**実装詳細**:
1. Viteプロジェクト作成
   ```bash
   npm create vite@latest frontend -- --template react-ts
   cd frontend
   npm install
   ```

2. TailwindCSS設定
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

3. 必須ライブラリインストール
   ```bash
   npm install react-router-dom@6 @tanstack/react-query@5 zod@3 axios@1
   npm install react-hook-form@7 @hookform/resolvers
   npm install -D @types/node
   ```

4. TailwindCSS設定（`tailwind.config.js`）
   ```javascript
   /** @type {import('tailwindcss').Config} */
   export default {
     content: [
       "./index.html",
       "./src/**/*.{js,ts,jsx,tsx}",
     ],
     theme: {
       extend: {},
     },
     plugins: [],
   }
   ```

5. ディレクトリ構造作成
   ```
   frontend/
   ├── src/
   │   ├── components/
   │   │   ├── common/
   │   │   ├── layouts/
   │   │   └── features/
   │   ├── pages/
   │   ├── hooks/
   │   ├── api/
   │   ├── types/
   │   ├── utils/
   │   ├── App.tsx
   │   └── main.tsx
   ├── public/
   ├── package.json
   ├── vite.config.ts
   └── tsconfig.json
   ```

6. ESLint・Prettier設定
   ```bash
   npm install -D eslint prettier eslint-config-prettier eslint-plugin-react
   ```

7. 環境変数設定（`.env.development`）
   ```
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

**完了条件**:
- [ ] `npm run dev`でVite開発サーバーが起動する
- [ ] `http://localhost:5173`でReactアプリが表示される
- [ ] TailwindCSSのスタイルが適用される
- [ ] ESLint・Prettierが動作する
- [ ] ディレクトリ構造が整っている

---

### Day 2（8時間）: バックエンドプロジェクト初期化

#### ☑ TASK-0002: バックエンドプロジェクト初期化
- **推定工数**: 8時間
- **タスクタイプ**: DIRECT
- **要件へのリンク**: WRREQ-001-1, WRREQ-002, WRREQ-004
- **依存タスク**: なし

**実装詳細**:
1. Node.jsプロジェクト作成
   ```bash
   mkdir backend
   cd backend
   npm init -y
   ```

2. TypeScript設定
   ```bash
   npm install -D typescript @types/node tsx
   npx tsc --init
   ```

3. Hono.js・Prismaインストール
   ```bash
   npm install hono@4 @hono/node-server
   npm install @prisma/client@5
   npm install -D prisma@5
   ```

4. 開発用ライブラリインストール
   ```bash
   npm install -D nodemon concurrently
   npm install zod@3
   npm install dotenv
   ```

5. ディレクトリ構造作成
   ```
   backend/
   ├── src/
   │   ├── index.ts
   │   ├── routes/
   │   ├── controllers/
   │   ├── services/
   │   ├── middlewares/
   │   ├── utils/
   │   └── types/
   ├── prisma/
   │   ├── schema.prisma
   │   ├── migrations/
   │   └── seed.ts
   ├── package.json
   └── tsconfig.json
   ```

6. `tsconfig.json`設定
   ```json
   {
     "compilerOptions": {
       "target": "ES2022",
       "module": "ESNext",
       "moduleResolution": "Node",
       "outDir": "./dist",
       "rootDir": "./src",
       "strict": true,
       "esModuleInterop": true,
       "skipLibCheck": true,
       "forceConsistentCasingInFileNames": true
     },
     "include": ["src/**/*"],
     "exclude": ["node_modules"]
   }
   ```

7. `package.json`スクリプト設定
   ```json
   {
     "scripts": {
       "dev": "tsx watch src/index.ts",
       "build": "tsc",
       "start": "node dist/index.js",
       "prisma:generate": "prisma generate",
       "prisma:migrate": "prisma migrate dev",
       "prisma:studio": "prisma studio"
     }
   }
   ```

8. 環境変数設定（`.env.development`）
   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/atelier_resource_mgmt?schema=public"
   PORT=3000
   CORS_ORIGIN=http://localhost:5173
   NODE_ENV=development
   ```

9. 基本的なHono.jsアプリ作成（`src/index.ts`）
   ```typescript
   import { Hono } from 'hono';
   import { serve } from '@hono/node-server';

   const app = new Hono();

   app.get('/', (c) => {
     return c.json({ message: 'Hello Hono!' });
   });

   const port = Number(process.env.PORT) || 3000;
   console.log(`Server is running on port ${port}`);

   serve({
     fetch: app.fetch,
     port,
   });
   ```

**完了条件**:
- [ ] `npm run dev`でHono.jsサーバーが起動する
- [ ] `http://localhost:3000`にアクセスすると`{"message": "Hello Hono!"}`が返る
- [ ] TypeScriptのコンパイルが成功する
- [ ] ディレクトリ構造が整っている
- [ ] 環境変数が読み込まれる

---

### Day 3（8時間）: PostgreSQL環境構築

#### ☑ TASK-0003: PostgreSQL環境構築（Docker Compose）
- **推定工数**: 4時間
- **タスクタイプ**: DIRECT
- **要件へのリンク**: WRREQ-003, WRREQ-007
- **依存タスク**: なし

**実装詳細**:
1. プロジェクトルートに`docker-compose.yml`作成
   ```yaml
   version: '3.8'
   services:
     db:
       image: postgres:15
       container_name: atelier_resource_mgmt_db
       environment:
         POSTGRES_USER: postgres
         POSTGRES_PASSWORD: postgres
         POSTGRES_DB: atelier_resource_mgmt
       ports:
         - "5432:5432"
       volumes:
         - postgres_data:/var/lib/postgresql/data
       restart: unless-stopped

   volumes:
     postgres_data:
   ```

2. Docker Compose起動
   ```bash
   docker-compose up -d
   ```

3. PostgreSQL接続確認
   ```bash
   docker exec -it atelier_resource_mgmt_db psql -U postgres -d atelier_resource_mgmt
   ```

4. `.gitignore`更新
   ```
   # Database
   .env
   .env.*.local

   # Docker
   docker-compose.override.yml
   ```

**完了条件**:
- [ ] `docker-compose up -d`でPostgreSQLが起動する
- [ ] `docker ps`でコンテナが動作している
- [ ] `psql`でデータベースに接続できる
- [ ] `backend/.env`の`DATABASE_URL`で接続できる

---

#### ☑ TASK-0004: Prismaスキーマ実装
- **推定工数**: 4時間
- **タスクタイプ**: DIRECT
- **要件へのリンク**: WRREQ-004, WRREQ-012〜051（データモデル関連）
- **依存タスク**: TASK-0002, TASK-0003

**実装詳細**:
1. Prisma初期化
   ```bash
   cd backend
   npx prisma init
   ```

2. `prisma/schema.prisma`に設計文書のスキーマをコピー
   - ソース: `docs/design/resource-management-webapp/database-schema.prisma`
   - 全Enum定義をコピー（CardType, CardRarity, NodeType, MetaCurrencyType, UnlockableContentType, GameBalanceCategory）
   - 全モデル定義をコピー（Card, Customer, AlchemyStyle, MapNode, MapTemplate, MetaCurrency, UnlockableContent, GameBalance）

3. Prisma Client生成
   ```bash
   npx prisma generate
   ```

**完了条件**:
- [ ] `prisma/schema.prisma`に全エンティティが定義されている
- [ ] `npx prisma generate`が成功する
- [ ] `node_modules/@prisma/client`が生成される
- [ ] TypeScriptで`import { PrismaClient } from '@prisma/client'`ができる

---

### Day 4（8時間）: Prismaマイグレーションとシード

#### ☑ TASK-0005: Prismaマイグレーション実行
- **推定工数**: 4時間
- **タスクタイプ**: DIRECT
- **要件へのリンク**: WRREQ-003, WRREQ-004
- **依存タスク**: TASK-0004

**実装詳細**:
1. 初回マイグレーション実行
   ```bash
   npx prisma migrate dev --name init
   ```

2. マイグレーション確認
   ```bash
   npx prisma migrate status
   ```

3. Prisma Studio起動
   ```bash
   npx prisma studio
   ```

4. データベース構造確認
   - テーブル作成確認
   - インデックス作成確認
   - 外部キー制約確認

**完了条件**:
- [ ] `prisma/migrations/`にマイグレーションファイルが生成される
- [ ] PostgreSQLに全テーブルが作成される
- [ ] `npx prisma studio`でGUI確認できる
- [ ] 全エンティティのテーブル・カラムが正しい

---

#### ☑ TASK-0006: Prismaシードデータ作成
- **推定工数**: 4時間
- **タスクタイプ**: DIRECT
- **要件へのリンク**: WRREQ-027, WRREQ-041, WRREQ-048〜051
- **依存タスク**: TASK-0005

**実装詳細**:
1. `prisma/seed.ts`作成
   ```typescript
   import { PrismaClient } from '@prisma/client';

   const prisma = new PrismaClient();

   async function main() {
     console.log('🌱 Seeding database...');

     // GameBalance初期データ
     const gameBalanceData = [
       {
         settingKey: 'energy_initial_value',
         settingValue: '3',
         description: '初期エネルギー値',
         category: 'ENERGY',
       },
       {
         settingKey: 'energy_max_value',
         settingValue: '10',
         description: '最大エネルギー値',
         category: 'ENERGY',
       },
       // ... 他のゲームバランス設定
     ];

     for (const data of gameBalanceData) {
       await prisma.gameBalance.upsert({
         where: { settingKey: data.settingKey },
         update: {},
         create: data,
       });
     }

     // MetaCurrency初期データ
     await prisma.metaCurrency.upsert({
       where: { currencyType: 'FAME' },
       update: {},
       create: {
         currencyType: 'FAME',
         description: '名声ポイント',
       },
     });

     await prisma.metaCurrency.upsert({
       where: { currencyType: 'KNOWLEDGE' },
       update: {},
       create: {
         currencyType: 'KNOWLEDGE',
         description: '知識ポイント',
       },
     });

     console.log('✅ Seeding completed!');
   }

   main()
     .catch((e) => {
       console.error(e);
       process.exit(1);
     })
     .finally(async () => {
       await prisma.$disconnect();
     });
   ```

2. `package.json`にシードスクリプト追加
   ```json
   {
     "prisma": {
       "seed": "tsx prisma/seed.ts"
     },
     "scripts": {
       "prisma:seed": "tsx prisma/seed.ts"
     }
   }
   ```

3. シード実行
   ```bash
   npm run prisma:seed
   ```

**完了条件**:
- [ ] `npm run prisma:seed`が成功する
- [ ] GameBalanceテーブルに初期データが登録される
- [ ] MetaCurrencyテーブルに初期データが登録される
- [ ] Prisma Studioでデータ確認できる

---

### Day 5（8時間）: Hono.js基本設定

#### ☑ TASK-0007: Hono.js基本設定とルーティング構造
- **推定工数**: 8時間
- **タスクタイプ**: DIRECT
- **要件へのリンク**: WRREQ-001-1, WRREQ-067
- **依存タスク**: TASK-0002, TASK-0005

**実装詳細**:
1. `src/routes/index.ts`作成
   ```typescript
   import { Hono } from 'hono';

   const routes = new Hono();

   // ヘルスチェック
   routes.get('/health', (c) => {
     return c.json({ status: 'ok', timestamp: new Date().toISOString() });
   });

   export default routes;
   ```

2. `src/index.ts`更新
   ```typescript
   import { Hono } from 'hono';
   import { serve } from '@hono/node-server';
   import routes from './routes';

   const app = new Hono();

   // API routes
   app.route('/api', routes);

   const port = Number(process.env.PORT) || 3000;
   console.log(`🚀 Server is running on port ${port}`);

   serve({
     fetch: app.fetch,
     port,
   });
   ```

3. ルートファイル構造作成
   ```
   backend/src/routes/
   ├── index.ts          # ルート統合
   ├── cards.ts          # カード管理API（Phase 2で実装）
   ├── customers.ts      # 顧客管理API（Phase 2で実装）
   ├── alchemyStyles.ts  # 錬金スタイル管理API（Phase 4で実装）
   ├── mapNodes.ts       # マップノード管理API（Phase 4で実装）
   ├── gameBalance.ts    # ゲームバランス管理API（Phase 5で実装）
   └── export.ts         # エクスポート/インポートAPI（Phase 5で実装）
   ```

**完了条件**:
- [ ] `/api/health`エンドポイントが動作する
- [ ] `{"status": "ok", "timestamp": "..."}`が返る
- [ ] ルートファイル構造が整っている
- [ ] サーバーが正常に起動する

---

### Day 6（8時間）: CORSミドルウェア実装

#### ☑ TASK-0008: CORSミドルウェア実装
- **推定工数**: 4時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-070-1
- **依存タスク**: TASK-0007

**実装詳細**:
1. `src/middlewares/cors.ts`作成
   ```typescript
   import { cors } from 'hono/cors';

   export const corsMiddleware = cors({
     origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
     credentials: true,
     allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
     allowHeaders: ['Content-Type', 'Authorization'],
   });
   ```

2. `src/index.ts`に適用
   ```typescript
   import { corsMiddleware } from './middlewares/cors';

   const app = new Hono();

   // CORS middleware
   app.use('*', corsMiddleware);

   // API routes
   app.route('/api', routes);
   ```

3. CORS動作確認テスト
   - フロントエンドから`axios.get('http://localhost:3000/api/health')`実行
   - プリフライトリクエスト（OPTIONS）確認
   - Access-Control-Allow-Originヘッダー確認

**完了条件**:
- [ ] CORSミドルウェアが適用される
- [ ] フロントエンドからAPIアクセスできる
- [ ] OPTIONSリクエストが正常に処理される
- [ ] CORS関連ヘッダーが正しく設定される

**テスト要件**:
- [ ] フロントエンドから`/api/health`にアクセスできる
- [ ] CORSエラーが発生しない
- [ ] 異なるオリジンからのアクセスが許可される

---

#### ☑ TASK-0009: バリデーションミドルウェア実装
- **推定工数**: 4時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-070, WRREQ-070-2
- **依存タスク**: TASK-0007

**実装詳細**:
1. `src/middlewares/validation.ts`作成
   ```typescript
   import { Context, Next } from 'hono';
   import { ZodSchema, ZodError } from 'zod';

   export const validate = (schema: ZodSchema, target: 'body' | 'query' = 'body') => {
     return async (c: Context, next: Next) => {
       try {
         const data = target === 'body' ? await c.req.json() : c.req.query();
         const validated = schema.parse(data);
         c.set('validated', validated);
         await next();
       } catch (error) {
         if (error instanceof ZodError) {
           return c.json({
             error: {
               code: 'VALIDATION_ERROR',
               message: '入力データが不正です',
               details: error.errors.map((err) => ({
                 field: err.path.join('.'),
                 message: err.message,
               })),
             },
           }, 400);
         }
         throw error;
       }
     };
   };
   ```

2. バリデーションスキーマ例（`src/types/validation.ts`）
   ```typescript
   import { z } from 'zod';

   export const createCardSchema = z.object({
     name: z.string().min(1).max(100),
     description: z.string().min(1).max(1000),
     cardType: z.enum(['MATERIAL', 'OPERATION', 'CATALYST', 'KNOWLEDGE', 'SPECIAL', 'ARTIFACT']),
     attribute: z.record(z.number()),
     stabilityValue: z.number().min(-100).max(100),
     energyCost: z.number().min(0).max(5),
     // ... 他のフィールド
   });
   ```

3. 使用例
   ```typescript
   import { validate } from './middlewares/validation';
   import { createCardSchema } from './types/validation';

   routes.post('/cards', validate(createCardSchema, 'body'), async (c) => {
     const validated = c.get('validated');
     // ... カード作成処理
   });
   ```

**完了条件**:
- [ ] バリデーションミドルウェアが動作する
- [ ] Zodエラーが構造化されたレスポンスに変換される
- [ ] バリデーションエラー時に400ステータスが返る
- [ ] bodyとqueryの両方に対応している

**テスト要件**:
- [ ] 正常なリクエストがバリデーションを通過する
- [ ] 不正なリクエストでバリデーションエラーが返る
- [ ] エラーレスポンスが正しい形式である
- [ ] フィールド名とエラーメッセージが正しい

---

### Day 7（8時間）: エラーハンドリングとロギング

#### ☑ TASK-0010: エラーハンドリングミドルウェア実装
- **推定工数**: 4時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-069, WRREQ-070-2
- **依存タスク**: TASK-0007

**実装詳細**:
1. `src/middlewares/errorHandler.ts`作成
   ```typescript
   import { Context } from 'hono';
   import { HTTPException } from 'hono/http-exception';

   export const errorHandler = (err: Error, c: Context) => {
     console.error('❌ Error:', err);

     // HTTPException（Honoの標準例外）
     if (err instanceof HTTPException) {
       return c.json({
         error: {
           code: 'HTTP_ERROR',
           message: err.message,
         },
       }, err.status);
     }

     // Prisma エラー
     if (err.name === 'PrismaClientKnownRequestError') {
       const prismaError = err as any;
       if (prismaError.code === 'P2002') {
         return c.json({
           error: {
             code: 'DUPLICATE_ENTRY',
             message: 'ユニーク制約違反: 同じデータが既に存在します',
           },
         }, 409);
       }
       if (prismaError.code === 'P2025') {
         return c.json({
           error: {
             code: 'NOT_FOUND',
             message: 'リソースが見つかりません',
           },
         }, 404);
       }
     }

     // デフォルトエラー
     return c.json({
       error: {
         code: 'INTERNAL_ERROR',
         message: 'サーバーエラーが発生しました',
       },
     }, 500);
   };
   ```

2. `src/index.ts`に適用
   ```typescript
   import { errorHandler } from './middlewares/errorHandler';

   const app = new Hono();

   // ... middleware

   // Error handler
   app.onError(errorHandler);
   ```

**完了条件**:
- [ ] エラーハンドラーが適用される
- [ ] HTTPExceptionが正しく処理される
- [ ] Prismaエラーが正しく処理される
- [ ] 構造化されたエラーレスポンスが返る

**テスト要件**:
- [ ] 500エラー時に正しいレスポンスが返る
- [ ] Prismaエラー（P2002, P2025）が正しく処理される
- [ ] エラーログがコンソールに出力される

---

#### ☑ TASK-0011: ロギングミドルウェア実装
- **推定工数**: 4時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-070-2, WRNFR-011
- **依存タスク**: TASK-0007

**実装詳細**:
1. `src/middlewares/logger.ts`作成
   ```typescript
   import { Context, Next } from 'hono';

   export const logger = async (c: Context, next: Next) => {
     const start = Date.now();
     const method = c.req.method;
     const path = c.req.path;

     console.log(`➡️  ${method} ${path}`);

     await next();

     const end = Date.now();
     const status = c.res.status;
     const duration = end - start;

     const emoji = status >= 500 ? '❌' : status >= 400 ? '⚠️' : '✅';
     console.log(`${emoji} ${method} ${path} ${status} ${duration}ms`);
   };
   ```

2. `src/index.ts`に適用
   ```typescript
   import { logger } from './middlewares/logger';

   const app = new Hono();

   // Logger middleware
   app.use('*', logger);

   // ... other middleware
   ```

**完了条件**:
- [ ] ロギングミドルウェアが適用される
- [ ] リクエスト・レスポンスがログに出力される
- [ ] 実行時間が記録される
- [ ] ステータスコードに応じた絵文字が表示される

**テスト要件**:
- [ ] リクエスト時にログが出力される
- [ ] レスポンス時にログが出力される
- [ ] 実行時間が正しく計測される

---

### Day 8（8時間）: 共通レスポンス型・ユーティリティ

#### ☑ TASK-0012: 共通レスポンス型・ユーティリティ実装
- **推定工数**: 6時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-067, WRREQ-068, WRREQ-069
- **依存タスク**: TASK-0007

**実装詳細**:
1. `src/utils/response.ts`作成
   ```typescript
   import { Context } from 'hono';

   /**
    * 成功レスポンス
    */
   export const successResponse = <T>(c: Context, data: T, message: string = 'Success', status: number = 200) => {
     return c.json({
       data,
       message,
     }, status);
   };

   /**
    * ページネーションレスポンス
    */
   export const paginatedResponse = <T>(
     c: Context,
     items: T[],
     total: number,
     page: number,
     limit: number,
   ) => {
     return c.json({
       data: {
         items,
         total,
         page,
         limit,
         totalPages: Math.ceil(total / limit),
       },
     });
   };

   /**
    * エラーレスポンス
    */
   export const errorResponse = (
     c: Context,
     code: string,
     message: string,
     status: number = 400,
     details?: any[],
   ) => {
     return c.json({
       error: {
         code,
         message,
         ...(details && { details }),
       },
     }, status);
   };

   /**
    * 404レスポンス
    */
   export const notFoundResponse = (c: Context, resourceName: string = 'リソース') => {
     return errorResponse(c, 'NOT_FOUND', `${resourceName}が見つかりません`, 404);
   };
   ```

2. `src/utils/validation.ts`作成
   ```typescript
   import { z } from 'zod';

   /**
    * ページネーションクエリスキーマ
    */
   export const paginationQuerySchema = z.object({
     page: z.string().optional().default('1').transform(Number),
     limit: z.string().optional().default('20').transform(Number),
   });

   /**
    * UUID検証
    */
   export const uuidSchema = z.string().uuid();

   /**
    * バリデーションヘルパー
    */
   export const validateUUID = (id: string): boolean => {
     return uuidSchema.safeParse(id).success;
   };
   ```

3. `src/types/index.ts`作成
   ```typescript
   /**
    * APIレスポンス型
    */
   export interface ApiResponse<T> {
     data?: T;
     message?: string;
     error?: ApiError;
   }

   /**
    * APIエラー型
    */
   export interface ApiError {
     code: string;
     message: string;
     details?: ValidationError[];
   }

   /**
    * バリデーションエラー型
    */
   export interface ValidationError {
     field: string;
     message: string;
   }

   /**
    * ページネーションレスポンス型
    */
   export interface PaginatedResponse<T> {
     items: T[];
     total: number;
     page: number;
     limit: number;
     totalPages?: number;
   }
   ```

**完了条件**:
- [ ] 共通レスポンス関数が実装される
- [ ] ページネーションレスポンス関数が実装される
- [ ] エラーレスポンス関数が実装される
- [ ] 共通バリデーションスキーマが実装される
- [ ] TypeScript型定義が整っている

**テスト要件**:
- [ ] `successResponse`が正しいJSON形式を返す
- [ ] `paginatedResponse`が正しいページネーション情報を返す
- [ ] `errorResponse`が正しいエラー形式を返す
- [ ] UUID検証が正しく動作する

---

#### ☑ TASK-0013: Prismaソフトデリートミドルウェア実装
- **推定工数**: 2時間
- **タスクタイプ**: TDD
- **要件へのリンク**: データモデル要件（deletedAtフィールド）
- **依存タスク**: TASK-0005

**実装詳細**:
1. `src/utils/prisma.ts`作成
   ```typescript
   import { PrismaClient } from '@prisma/client';

   const prismaClientSingleton = () => {
     const prisma = new PrismaClient();

     // ソフトデリートミドルウェア
     prisma.$use(async (params, next) => {
       // DELETE -> UPDATE に変換（deletedAt設定）
       if (params.action === 'delete') {
         params.action = 'update';
         params.args['data'] = { deletedAt: new Date() };
       }

       if (params.action === 'deleteMany') {
         params.action = 'updateMany';
         if (params.args.data != undefined) {
           params.args.data['deletedAt'] = new Date();
         } else {
           params.args['data'] = { deletedAt: new Date() };
         }
       }

       // SELECT時にdeletedAt IS NULLでフィルタ
       if (params.action === 'findUnique' || params.action === 'findFirst') {
         params.action = 'findFirst';
         params.args.where = {
           ...params.args.where,
           deletedAt: null,
         };
       }

       if (params.action === 'findMany') {
         if (params.args.where) {
           if (params.args.where.deletedAt == undefined) {
             params.args.where['deletedAt'] = null;
           }
         } else {
           params.args['where'] = { deletedAt: null };
         }
       }

       return next(params);
     });

     return prisma;
   };

   type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

   const globalForPrisma = globalThis as unknown as {
     prisma: PrismaClientSingleton | undefined;
   };

   export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

   if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
   ```

2. `src/index.ts`でPrismaクライアント初期化
   ```typescript
   import { prisma } from './utils/prisma';

   // アプリケーション終了時にPrisma切断
   process.on('SIGTERM', async () => {
     await prisma.$disconnect();
     process.exit(0);
   });
   ```

**完了条件**:
- [ ] Prismaソフトデリートミドルウェアが動作する
- [ ] `delete`が`update`に変換される
- [ ] `findMany`で削除済みデータが除外される
- [ ] Prismaクライアントがシングルトンで管理される

**テスト要件**:
- [ ] データ削除時に`deletedAt`が設定される
- [ ] `findMany`で削除済みデータが取得されない
- [ ] `findFirst`で削除済みデータが取得されない

---

### Day 9（8時間）: ヘルスチェックエンドポイント拡張

#### ☑ TASK-0014: ヘルスチェックエンドポイント拡張
- **推定工数**: 4時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-067
- **依存タスク**: TASK-0007, TASK-0013

**実装詳細**:
1. `src/routes/health.ts`作成
   ```typescript
   import { Hono } from 'hono';
   import { prisma } from '../utils/prisma';

   const health = new Hono();

   /**
    * ヘルスチェック
    */
   health.get('/', async (c) => {
     try {
       // データベース接続確認
       await prisma.$queryRaw`SELECT 1`;

       return c.json({
         status: 'ok',
         timestamp: new Date().toISOString(),
         database: 'connected',
       });
     } catch (error) {
       return c.json({
         status: 'error',
         timestamp: new Date().toISOString(),
         database: 'disconnected',
         error: error instanceof Error ? error.message : 'Unknown error',
       }, 503);
     }
   });

   export default health;
   ```

2. `src/routes/index.ts`に統合
   ```typescript
   import { Hono } from 'hono';
   import health from './health';

   const routes = new Hono();

   routes.route('/health', health);

   export default routes;
   ```

**完了条件**:
- [ ] `/api/health`でヘルスチェックできる
- [ ] データベース接続状態が確認できる
- [ ] エラー時に503ステータスが返る
- [ ] タイムスタンプが含まれる

**テスト要件**:
- [ ] データベース接続時に`status: "ok"`が返る
- [ ] データベース切断時に`status: "error"`が返る
- [ ] レスポンスに`timestamp`が含まれる

---

#### ☑ TASK-0015: Phase 1統合テスト・環境変数管理
- **推定工数**: 4時間
- **タスクタイプ**: DIRECT
- **要件へのリンク**: WRREQ-007, WRNFR-012, WRNFR-013
- **依存タスク**: TASK-0001〜0014

**実装詳細**:
1. 環境変数管理ファイル作成
   - `.env.development`（開発環境）
   - `.env.test`（テスト環境）
   - `.env.example`（サンプル）

2. `.env.example`作成
   ```
   # Database
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/atelier_resource_mgmt?schema=public"

   # Server
   PORT=3000
   NODE_ENV=development

   # CORS
   CORS_ORIGIN=http://localhost:5173
   ```

3. 統合テスト実施
   - [ ] フロントエンドプロジェクトが起動する
   - [ ] バックエンドプロジェクトが起動する
   - [ ] PostgreSQLが起動する
   - [ ] `/api/health`にアクセスできる
   - [ ] フロントエンドからバックエンドAPIにアクセスできる
   - [ ] CORSエラーが発生しない
   - [ ] エラーハンドリングが動作する
   - [ ] ロギングが動作する
   - [ ] Prismaマイグレーションが適用されている
   - [ ] Prismaシードデータが登録されている

4. README.md作成
   ```markdown
   # アトリエ錬金術ゲーム リソース管理Webアプリ

   ## セットアップ

   ### 環境構築
   \`\`\`bash
   # PostgreSQL起動
   docker-compose up -d

   # バックエンド
   cd backend
   npm install
   cp .env.example .env.development
   npx prisma migrate dev
   npx prisma generate
   npm run prisma:seed
   npm run dev

   # フロントエンド
   cd frontend
   npm install
   cp .env.example .env.development
   npm run dev
   \`\`\`

   ### 動作確認
   - フロントエンド: http://localhost:5173
   - バックエンド: http://localhost:3000
   - ヘルスチェック: http://localhost:3000/api/health
   - Prisma Studio: `npm run prisma:studio`
   ```

**完了条件**:
- [ ] 環境変数ファイルが整備されている
- [ ] 統合テストが全て通る
- [ ] README.mdにセットアップ手順が記載されている
- [ ] 新規開発者が環境構築できる

---

## Phase 1 完了条件

### 必須条件
- [ ] フロントエンド・バックエンドプロジェクトが起動する
- [ ] PostgreSQLデータベースが起動する
- [ ] Prismaマイグレーションが適用されている
- [ ] `/api/health`エンドポイントが正常に動作する
- [ ] CORSミドルウェアが動作する
- [ ] バリデーションミドルウェアが動作する
- [ ] エラーハンドリングが動作する
- [ ] ロギングが動作する
- [ ] Prismaソフトデリートが動作する

### 品質基準
- [ ] ESLint・Prettierでコード整形されている
- [ ] TypeScriptのコンパイルエラーがない
- [ ] 全テストが通る
- [ ] README.mdのセットアップ手順が正しい

### マイルストーン
- [x] **M1: MVP基盤完成** - Phase 1完了時点で達成

---

## 変更履歴

| 日付 | バージョン | 変更内容 |
|------|----------|---------|
| 2025-11-09 | 1.0 | 初版作成。15タスク、80時間 |
