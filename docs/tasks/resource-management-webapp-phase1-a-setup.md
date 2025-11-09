# Phase 1-a: プロジェクト基盤構築（環境セットアップ）

## フェーズ概要

### 要件名
resource-management-webapp

### 期間・目標
- **期間**: 5営業日（Week 1: Day 1-5）
- **総工数**: 40時間
- **タスク数**: 7タスク
- **目標**: プロジェクト環境を構築し、データベース基盤を整える

### 成果物
- フロントエンドプロジェクト（React + Vite + TypeScript + TailwindCSS）
- バックエンドプロジェクト（Hono.js + TypeScript）
- PostgreSQL環境（Docker Compose）
- Prismaスキーマ・マイグレーション
- Hono.js基本設定

---

## 週次計画

### Week 1（Day 1-5）: プロジェクト初期化とデータベース構築
**目標**: プロジェクト環境を構築し、データベース基盤を整える

**成果物**:
- フロントエンド・バックエンドプロジェクト初期化
- PostgreSQL環境（Docker Compose）
- Prismaスキーマ実装・マイグレーション
- Hono.js基本設定

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
   - src/（components/, pages/, hooks/, api/, types/, utils/）
   - components/（common/, layouts/, features/）

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
   - src/（index.ts, routes/, controllers/, services/, middlewares/, utils/, types/）
   - prisma/（schema.prisma, migrations/, seed.ts）

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
   - GameBalance初期データ（エネルギー値、コスト設定など）をupsert
   - MetaCurrency初期データ（FAME、KNOWLEDGE）をupsert
   - エラーハンドリングと$disconnect処理を含める

2. `package.json`にシードスクリプト追加
   ```json
   {
     "prisma": { "seed": "tsx prisma/seed.ts" },
     "scripts": { "prisma:seed": "tsx prisma/seed.ts" }
   }
   ```

3. シード実行: `npm run prisma:seed`

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

3. ルートファイル構造作成: routes/（index.ts, cards.ts, customers.ts, alchemyStyles.ts, mapNodes.ts, gameBalance.ts, export.ts）

**完了条件**:
- [ ] `/api/health`エンドポイントが動作する
- [ ] `{"status": "ok", "timestamp": "..."}`が返る
- [ ] ルートファイル構造が整っている
- [ ] サーバーが正常に起動する

---

## Phase 1-a 完了条件

### 必須条件
- [ ] フロントエンドプロジェクトが起動する（`npm run dev`）
- [ ] バックエンドプロジェクトが起動する（`npm run dev`）
- [ ] PostgreSQLデータベースが起動する（Docker Compose）
- [ ] Prismaマイグレーションが適用されている
- [ ] Prismaシードデータが登録されている
- [ ] `/api/health`エンドポイントが正常に動作する
- [ ] ディレクトリ構造が整っている

### 品質基準
- [ ] ESLint・Prettierでコード整形されている
- [ ] TypeScriptのコンパイルエラーがない
- [ ] 環境変数ファイルが整備されている

---

## 変更履歴

| 日付 | バージョン | 変更内容 |
|------|----------|---------|
| 2025-11-09 | 1.0 | Phase 1から分割。Day 1-5の7タスク、40時間 |
