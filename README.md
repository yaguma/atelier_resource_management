# アトリエ資源管理Webアプリケーション

工房経営を支援するためのカード・顧客・調合スタイル管理システム

## プロジェクト概要

このプロジェクトは、アトリエシリーズの世界観をベースとした資源管理Webアプリケーションです。カード管理、顧客管理、調合スタイル管理などの機能を提供します。

## 技術スタック

### バックエンド

- **フレームワーク**: Hono (v4.6.15) - 高速・軽量なWebフレームワーク
- **ランタイム**: Node.js v20.x
- **データベース**: PostgreSQL
- **ORM**: Prisma (v5.22.0)
- **バリデーション**: Zod (v3.23.8)
- **テスト**: Vitest (v2.1.6)
- **型定義**: TypeScript (v5.6.3)

### フロントエンド

- **フレームワーク**: React (v18) + TypeScript
- **ビルドツール**: Vite
- **UI**: TailwindCSS
- **状態管理**: TanStack Query v5
- **ルーティング**: React Router v6
- **バリデーション**: Zod + React Hook Form

### インフラ

- **ホスティング**: Azure App Service
- **データベース**: Azure Database for PostgreSQL
- **CI/CD**: GitHub Actions

## 🔵 Phase 2 完了内容（Repository Pattern対応）

Phase 2では、Repository Patternを導入し、カード管理API・顧客管理APIの実装を完了しました。

### 🔵 主要機能

#### 1. Repository Pattern実装

- **Card Repository**（Prisma実装 + In-Memory実装）
  - `PrismaCardRepository`: 本番環境用のPrisma実装
  - `InMemoryCardRepository`: テスト用のメモリ実装
  - インターフェース: `ICardRepository`

- **Customer Repository**（Prisma実装 + In-Memory実装）
  - `PrismaCustomerRepository`: 本番環境用のPrisma実装
  - `InMemoryCustomerRepository`: テスト用のメモリ実装
  - インターフェース: `ICustomerRepository`

#### 2. Service層実装

- **CardService**: カード管理のビジネスロジック
  - 重複チェック、バリデーション、エラーハンドリング
  - Repository インターフェースに依存（実装には依存しない）

- **CustomerService**: 顧客管理のビジネスロジック
  - N:Mリレーション処理（報酬カード）
  - バリデーション、エラーハンドリング

#### 3. カード管理API

- `GET /api/cards` - カード一覧取得（ページネーション、フィルタリング対応）
- `GET /api/cards/:id` - カード詳細取得
- `POST /api/cards` - カード作成
- `PUT /api/cards/:id` - カード更新（部分更新対応）
- `DELETE /api/cards/:id` - カード削除（依存関係チェック、ソフトデリート）

#### 4. 顧客管理API

- `GET /api/customers` - 顧客一覧取得（ページネーション、フィルタリング対応）
- `GET /api/customers/:id` - 顧客詳細取得
- `POST /api/customers` - 顧客作成（N:M関連付け対応）
- `PUT /api/customers/:id` - 顧客更新（N:M関連更新対応）
- `DELETE /api/customers/:id` - 顧客削除（ソフトデリート）

#### 5. 🔵 体系的エラーコード

全エラーレスポンスに体系的なエラーコードを導入：

- **AUTH_xxx**: 認証・認可エラー（将来実装）
- **VALID_xxx**: バリデーションエラー
- **RES_xxx**: リソースエラー（未検出、重複、依存関係）
- **DB_xxx**: データベースエラー
- **REPO_xxx**: Repositoryエラー
- **SYS_xxx**: システムエラー
- **NET_xxx**: ネットワークエラー

### 🔵 Repository Pattern の利点

1. **依存性の逆転**: Service層はインターフェースに依存し、実装には依存しない
2. **テスタビリティ**: In-Memory実装を使用した高速なユニットテスト
3. **柔軟性**: 環境変数`REPOSITORY_TYPE`で実装を切り替え可能
4. **保守性**: データアクセス層の変更がService層に影響しない

### テスト

```bash
cd backend
npm test
```

**テスト結果**: 96個のテストケースすべてが成功✅

- ユニットテスト: In-Memory Repository使用
- 統合テスト: Prisma Repository使用
- カバレッジ: 高いコードカバレッジを達成

## プロジェクト構造

```
atelier_resource_management/
├── backend/                    # バックエンドアプリケーション
│   ├── src/
│   │   ├── config/            # 設定ファイル
│   │   ├── constants/         # 定数定義（エラーコード等）
│   │   ├── controllers/       # コントローラー
│   │   ├── di/                # 依存性注入コンテナ
│   │   ├── middlewares/       # ミドルウェア
│   │   ├── repositories/      # 🔵 Repository層
│   │   │   ├── interfaces/    # Repository インターフェース
│   │   │   ├── prisma/        # Prisma実装
│   │   │   └── memory/        # In-Memory実装
│   │   ├── routes/            # ルート定義
│   │   ├── schemas/           # Zodバリデーションスキーマ
│   │   ├── services/          # 🔵 Service層
│   │   ├── types/             # 型定義
│   │   ├── utils/             # ユーティリティ
│   │   └── __tests__/         # テストファイル
│   ├── prisma/                # Prismaスキーマ
│   └── package.json
├── frontend/                   # フロントエンドアプリケーション
│   ├── src/
│   └── package.json
├── docs/                       # ドキュメント
│   ├── design/                # 設計書
│   │   └── resource-management-webapp/
│   │       ├── api-endpoints.md       # API仕様書
│   │       ├── architecture.md        # アーキテクチャ設計書
│   │       ├── database-schema.md     # データベーススキーマ
│   │       └── ...
│   ├── implements/            # 実装ドキュメント
│   └── tasks/                 # タスク管理
└── README.md
```

## セットアップ

### 前提条件

- Node.js v20.x
- PostgreSQL
- npm または yarn

### バックエンドセットアップ

```bash
cd backend

# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env
# .envファイルを編集してデータベース接続情報を設定

# Prismaマイグレーション
npx prisma migrate dev

# サーバー起動
npm run dev
```

### フロントエンドセットアップ

```bash
cd frontend

# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev
```

## 🔵 環境変数

### backend/.env

```env
# データベース接続
DATABASE_URL="postgresql://user:password@localhost:5432/atelier_resource_mgmt?schema=public"

# サーバー設定
PORT=3000
NODE_ENV=development

# CORS設定
CORS_ORIGIN=http://localhost:5173

# 🔵 Repository設定（Phase 2対応）
REPOSITORY_TYPE=prisma  # 'prisma' または 'memory'
```

## API仕様書

詳細なAPI仕様書は以下を参照してください：

📄 [docs/design/resource-management-webapp/api-endpoints.md](docs/design/resource-management-webapp/api-endpoints.md)

### ベースURL

- **開発環境**: `http://localhost:3000/api`
- **本番環境**: `https://{app-name}.azurewebsites.net/api`

### エンドポイント例

```bash
# カード一覧取得
GET /api/cards?page=1&limit=20&cardType=素材カード&search=炎

# カード詳細取得
GET /api/cards/:id

# カード作成
POST /api/cards
Content-Type: application/json

{
  "name": "炎の素材",
  "description": "高温を発する赤い鉱石",
  "cardType": "素材カード",
  "attribute": "火",
  "stabilityValue": 80,
  "energyCost": 2,
  "rarity": "コモン"
}

# 顧客一覧取得
GET /api/customers?page=1&limit=20&difficulty=3

# 顧客作成（N:M関連付け）
POST /api/customers
Content-Type: application/json

{
  "name": "薬屋のおばあちゃん",
  "description": "村の薬屋を営む老婦人",
  "customerType": "村人",
  "difficulty": 1,
  "qualityCondition": 30,
  "stabilityCondition": 20,
  "reputationReward": 50,
  "knowledgeReward": 10,
  "rewardCardIds": ["card-id-1", "card-id-2"]
}
```

## 開発ガイド

### コーディング規約

- ESLint + Prettier を使用
- TypeScript strict mode 有効
- コミット前に`npm run lint`と`npm test`を実行

### テスト

```bash
# 全テスト実行
npm test

# テストカバレッジ確認
npm run test:coverage

# 特定のテストファイルのみ実行
npm test src/__tests__/controllers/cardController.test.ts
```

### 🔵 Repository Pattern使用例

```typescript
// Controller内でServiceを生成
const repositories = c.get('repositories') as IRepositoryContainer;
const cardService = new CardService(repositories.cardRepository);

// ユニットテスト: In-Memory Repository使用
const cardRepository = new InMemoryCardRepository();
const cardService = new CardService(cardRepository);

// 統合テスト: Prisma Repository使用
const cardRepository = new PrismaCardRepository();
const cardService = new CardService(cardRepository);
```

## デプロイ

### Azure App Service へのデプロイ

```bash
# ビルド
npm run build

# デプロイ
az webapp up --name {app-name} --resource-group {rg-name}
```

## マイルストーン

- [x] **M1: プロジェクト基盤完成** - Phase 1完了
- [x] **M2: バックエンドAPI完成** - Phase 2完了（Repository Pattern対応）
- [ ] **M3: フロントエンド基盤完成** - Phase 3-A
- [ ] **M4: カード管理画面完成** - Phase 3-B
- [ ] **M5: 顧客管理画面完成** - Phase 4-A
- [ ] **M6: 調合スタイル管理画面完成** - Phase 4-B
- [ ] **M7: 統合・デプロイ完成** - Phase 5

## ライセンス

MIT

## 貢献

プルリクエストを歓迎します。大きな変更の場合は、まずissueを開いて変更内容を議論してください。

詳細な開発ガイドラインについては、[CONTRIBUTING.md](CONTRIBUTING.md) を参照してください。

## お問い合わせ

プロジェクトに関する質問や提案は、GitHubのIssueでお願いします。
