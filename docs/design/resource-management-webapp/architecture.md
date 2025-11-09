# アトリエ錬金術ゲーム リソース管理Webアプリ アーキテクチャ設計

## 🔵 システム概要

本システムは、「アトリエ錬金術ゲーム」の開発支援ツールとして、ゲーム内リソース（カード、顧客、錬金スタイル、マップノード、メタ進行データなど）を効率的に管理するための管理画面Webアプリケーションである。

**🔵 目的**: ゲームバランス調整、データ管理、コンテンツ追加を容易にする
**🔵 対象ユーザー**: ゲーム開発者、ゲームデザイナー
**🟡 開発規模**: 個人開発プロジェクト（MVP: 1〜2週間、正式リリース: 2〜3週間）

---

## 🔵 アーキテクチャパターン

### パターン: **3層アーキテクチャ + SPA (シングルページアプリケーション)**

#### 選択理由:
- **🔵 フロントエンドとバックエンドの完全分離**: 独立したデプロイ・スケーリングが可能（要件WRREQ-001系列より）
- **🟡 スケーラビリティ**: フロントエンドとバックエンドを個別にスケールアウト可能
- **🔵 RESTful API**: 標準的なHTTP通信でクライアントとサーバーを疎結合に（要件WRREQ-067より）
- **🟡 保守性**: 各レイヤーの責務が明確で、テスト・デバッグが容易
- **🔵 Azure App Service対応**: フロントエンドとバックエンドをそれぞれAzure App Serviceにデプロイ可能（要件WRREQ-008系列より）

#### レイヤー構成:
1. **プレゼンテーション層** (Frontend)
   - React 18+ + Vite + TailwindCSS
   - ユーザーインターフェース、フォームバリデーション、状態管理

2. **アプリケーション層** (Backend API)
   - Hono.js + TypeScript
   - ビジネスロジック、バリデーション、API提供

3. **🔵 データアクセス層** (Repository)
   - Repository Pattern（データアクセスの抽象化層）
   - インターフェース定義により実装を差し替え可能
   - Prisma実装（本番環境用）とIn-Memory実装（テスト用）を提供

4. **データ層** (Database)
   - PostgreSQL
   - データ永続化、トランザクション管理

---

## 🔵 コンポーネント構成

### フロントエンド (SPA)

#### フレームワーク・ライブラリ
- **🔵 UI フレームワーク**: React 18+（要件WRREQ-001より）
- **🔵 ビルドツール**: Vite 5.0+（要件WRREQ-001-2より）
- **🔵 言語**: TypeScript 5.0+（要件WRREQ-002より）
- **🔵 スタイリング**: TailwindCSS（要件WRREQ-005より）
- **🟡 UIコンポーネント**: shadcn/ui（TailwindCSSベースのコンポーネントライブラリ）
- **🔵 ルーティング**: React Router 6+（要件WRREQ-001-3より）
- **🔵 サーバー状態管理**: TanStack Query (React Query) 5.0+（要件WRREQ-001-4より）
- **🔵 バリデーション**: Zod 3.0+（要件WRREQ-001-5より）
- **🔵 HTTPクライアント**: Axios 1.6+（要件WRREQ-001-6より）
- **🟡 フォーム管理**: React Hook Form 7+（フォーム状態管理とバリデーション）

#### 状態管理戦略
- **🔵 サーバー状態**: TanStack Query（データフェッチ、キャッシング、同期）
- **🟡 クライアント状態**: React Hooks（useState、useReducer、Context API）
- **🟡 フォーム状態**: React Hook Form + Zod（バリデーション）

#### ディレクトリ構造
```
frontend/
├── src/
│   ├── components/          # UIコンポーネント
│   │   ├── common/         # 共通コンポーネント（Button、Modal、Toast等）
│   │   ├── layouts/        # レイアウトコンポーネント（Sidebar、Header等）
│   │   └── features/       # 機能別コンポーネント（CardList、CustomerForm等）
│   ├── pages/              # ページコンポーネント（React Router用）
│   │   ├── Dashboard.tsx
│   │   ├── Cards/
│   │   ├── Customers/
│   │   └── AlchemyStyles/
│   ├── hooks/              # カスタムフック（TanStack Query）
│   │   ├── useCards.ts
│   │   ├── useCustomers.ts
│   │   └── useAlchemyStyles.ts
│   ├── api/                # API クライアント（Axios）
│   │   ├── client.ts       # Axios インスタンス、インターセプター
│   │   ├── cards.ts        # カードAPI呼び出し
│   │   ├── customers.ts    # 顧客API呼び出し
│   │   └── index.ts
│   ├── types/              # 型定義（Zod スキーマ、TypeScript型）
│   │   ├── card.ts
│   │   ├── customer.ts
│   │   └── common.ts
│   ├── utils/              # ユーティリティ関数
│   ├── App.tsx             # ルートコンポーネント
│   └── main.tsx            # エントリーポイント
├── public/                 # 静的ファイル
├── package.json
├── vite.config.ts
└── tsconfig.json
```

#### 🔵 レスポンシブデザイン
- **🔵 対応要件**: WRREQ-006
- **🟡 ブレークポイント**: TailwindCSSのデフォルト（sm: 640px、md: 768px、lg: 1024px、xl: 1280px）
- **🟡 デザイン方針**: デスクトップファースト（管理画面のため）

---

### バックエンド (API Server)

#### フレームワーク・ライブラリ
- **🔵 Webフレームワーク**: Hono.js 4.0+（要件WRREQ-001-1より）
- **🔵 言語**: TypeScript 5.0+（要件WRREQ-002より）
- **🔵 ORM**: Prisma 5.0+（要件WRREQ-004より）
- **🔵 データベース**: PostgreSQL 14+（要件WRREQ-003より）

#### ミドルウェア構成
- **🔴 CORS**: フロントエンドとバックエンドの分離のためCORS設定（要件WRREQ-070-1より）
- **🟡 バリデーション**: Zod（リクエストボディ・クエリパラメータのバリデーション）（要件WRREQ-070-2より）
- **🔴 エラーハンドリング**: 構造化されたエラーレスポンス（要件WRREQ-069より）
- **🟡 ロギング**: リクエスト・レスポンスのログ記録（要件WRREQ-070-2、WRNFR-011より）

#### ディレクトリ構造
```
backend/
├── src/
│   ├── index.ts            # エントリーポイント（Honoアプリ初期化）
│   ├── routes/             # APIルート定義
│   │   ├── cards.ts        # カード管理API
│   │   ├── customers.ts    # 顧客管理API
│   │   ├── alchemyStyles.ts
│   │   ├── mapNodes.ts
│   │   ├── gameBalance.ts
│   │   └── index.ts        # ルート統合
│   ├── controllers/        # コントローラー（ビジネスロジック）
│   │   ├── cardController.ts
│   │   ├── customerController.ts
│   │   └── ...
│   ├── services/           # サービス層（ビジネスロジック）
│   │   ├── cardService.ts
│   │   ├── customerService.ts
│   │   └── ...
│   ├── 🔵 repositories/    # 🔵 データアクセス層（Repository Pattern）
│   │   ├── interfaces/     # 🔵 Repositoryインターフェース定義
│   │   │   ├── ICardRepository.ts
│   │   │   ├── ICustomerRepository.ts
│   │   │   └── ...
│   │   ├── prisma/         # 🔵 Prisma実装（本番環境用）
│   │   │   ├── PrismaCardRepository.ts
│   │   │   ├── PrismaCustomerRepository.ts
│   │   │   └── ...
│   │   └── memory/         # 🔵 In-Memory実装（テスト用）
│   │       ├── InMemoryCardRepository.ts
│   │       ├── InMemoryCustomerRepository.ts
│   │       └── ...
│   ├── middlewares/        # ミドルウェア
│   │   ├── cors.ts
│   │   ├── validation.ts
│   │   ├── errorHandler.ts
│   │   └── logger.ts
│   ├── 🔵 di/              # 🔵 依存性注入コンテナ
│   │   └── container.ts    # 🔵 Repositoryの生成とインジェクション
│   ├── utils/              # ユーティリティ
│   │   ├── response.ts     # レスポンスフォーマット
│   │   └── validation.ts   # バリデーションヘルパー
│   └── types/              # 型定義
│       └── index.ts
├── prisma/                 # 🟡 Prisma関連（本番環境用のみ）
│   ├── schema.prisma       # Prismaスキーマ
│   ├── migrations/         # マイグレーションファイル
│   └── seed.ts             # シードデータ
├── 🔵 tests/               # 🔵 テスト
│   ├── unit/               # 🔵 ユニットテスト（In-Memory Repository使用）
│   │   ├── services/
│   │   └── controllers/
│   └── integration/        # 🔵 統合テスト（Prisma Repository使用）
│       └── api/
├── package.json
└── tsconfig.json
```

#### 認証方式（将来的）
- **🔴 現状**: MVPでは認証なし（要件WRREQ-009より）
- **🔴 将来的**: JWT (JSON Web Token)（要件WRREQ-010より）

---

### データベース

#### DBMS
- **🔵 開発環境**: PostgreSQL 14+（ローカルDocker）
- **🔵 本番環境**: Azure Database for PostgreSQL（要件WRREQ-008-2より）

#### 🔵 データアクセス層の設計（Repository Pattern）
- **🔵 抽象化**: Repository インターフェースでデータアクセスを抽象化
- **🔵 実装の分離**:
  - **Prisma実装**: 本番環境用（要件WRREQ-004より）
  - **In-Memory実装**: テスト用（データベース不要）
- **🔵 依存性注入**: 環境変数により実装を切り替え（`NODE_ENV`、`REPOSITORY_TYPE`）
- **🔵 テスタビリティ**: データベースなしでユニットテストが実行可能

#### キャッシュ戦略
- **🟡 クエリキャッシュ**: TanStack Queryのクライアントサイドキャッシング（staleTime: 5分）
- **🔴 将来的**: Redis（サーバーサイドキャッシング）

#### バックアップ戦略
- **🔴 開発環境**: 定期的なpg_dumpによるバックアップ
- **🔵 本番環境**: Azure Database for PostgreSQLの自動バックアップ機能

---

## 🔵 デプロイメントアーキテクチャ

### 🔵 デプロイ先: Azure App Service

#### フロントエンド
- **🔵 Azure App Service (Linux)**: React SPAのホスティング（要件WRREQ-008より）
- **🟡 静的ファイル配信**: Viteビルド成果物（dist/）をデプロイ
- **🟡 環境変数**: APIエンドポイントURL（VITE_API_BASE_URL）

#### バックエンド
- **🔵 Azure App Service (Linux, Node.js)**: Hono.js APIサーバー（要件WRREQ-008-1より）
- **🟡 環境変数**: DATABASE_URL、PORT、CORS_ORIGIN等

#### データベース
- **🔵 Azure Database for PostgreSQL**: マネージドPostgreSQLサービス（要件WRREQ-008-2より）
- **🟡 接続**: SSL接続、プライベートエンドポイント推奨

#### デプロイスロット
- **🟡 本番スロット**: 安定版のデプロイ
- **🟡 ステージングスロット**: テスト環境（Azure App Serviceの機能活用）

#### CI/CD
- **🟡 GitHub Actions**: 自動ビルド・テスト・デプロイ
  - フロントエンド: `main`ブランチへのpush時に自動デプロイ
  - バックエンド: `main`ブランチへのpush時に自動デプロイ
  - Prismaマイグレーション: デプロイ前に自動実行

---

## 🔵 セキュリティ設計

### 🔴 脆弱性対策
- **SQLインジェクション**: Prisma ORMの使用（プリペアドステートメント）（要件WRNFR-004より）
- **XSS対策**: Reactのデフォルトエスケープ機能、DOMPurify使用（要件WRNFR-005より）
- **CSRF対策**: 将来的なJWT認証実装時にトークンベース認証で対応（要件WRNFR-006より）

### 🔵 HTTPS
- **🟡 開発環境**: HTTP（localhost）
- **🔴 本番環境**: Azure App ServiceのHTTPS強制有効化

### 🔴 CORS設定（詳細）

#### 🔵 環境別CORS設定

**開発環境**:
```typescript
cors({
  origin: 'http://localhost:5173',
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposeHeaders: ['X-Total-Count', 'X-Page', 'X-Limit'],
  maxAge: 86400, // 24時間
})
```

**本番環境**:
```typescript
cors({
  origin: process.env.CORS_ORIGIN || 'https://atelier-mgmt-frontend.azurewebsites.net',
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposeHeaders: ['X-Total-Count', 'X-Page', 'X-Limit'],
  maxAge: 86400,
})
```

#### 🔵 CORS設定項目の詳細

| 項目 | 開発環境 | 本番環境 | 説明 |
|------|---------|---------|------|
| **origin** | `http://localhost:5173` | `https://atelier-mgmt-frontend.azurewebsites.net` | 許可するオリジン（環境変数で設定） |
| **credentials** | `true` | `true` | Cookie・認証情報の送信を許可 |
| **allowMethods** | GET, POST, PUT, DELETE, OPTIONS | GET, POST, PUT, DELETE, OPTIONS | 許可するHTTPメソッド |
| **allowHeaders** | Content-Type, Authorization, X-Requested-With | Content-Type, Authorization, X-Requested-With | 許可するリクエストヘッダー |
| **exposeHeaders** | X-Total-Count, X-Page, X-Limit | X-Total-Count, X-Page, X-Limit | クライアントに公開するレスポンスヘッダー |
| **maxAge** | 86400 (24時間) | 86400 (24時間) | プリフライトリクエストのキャッシュ時間 |

#### 🔵 複数オリジン対応（将来的）

```typescript
// 複数のオリジンを許可する場合
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://atelier-mgmt-frontend.azurewebsites.net',
  'https://atelier-mgmt-frontend-staging.azurewebsites.net',
];

cors({
  origin: (origin) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return origin;
    }
    throw new HTTPException(403, { message: 'CORS policy violation' });
  },
  credentials: true,
  // ...
})
```

#### 🔴 セキュリティ注意事項

- **🔴 ワイルドカード禁止**: `origin: '*'`は本番環境では絶対に使用しない
- **🔴 環境変数管理**: オリジンURLは環境変数で管理し、ハードコードしない
- **🔴 credentials使用時の制限**: `credentials: true`の場合、`origin: '*'`は使用不可
- **🔴 プリフライトリクエスト**: OPTIONSメソッドを許可し、適切に処理

### 🔴 環境変数管理
- **🔴 開発環境**: `.env`ファイル（`.gitignore`に追加）
- **🔴 本番環境**: Azure App Serviceのアプリケーション設定
- **📄 詳細**: [environment-variables.md](./environment-variables.md) を参照

---

## 🔵 パフォーマンス設計

### 🔴 レスポンス時間目標
- **🔴 一覧画面初期表示**: 2秒以内（要件WRNFR-001より）
- **🔴 検索・フィルタリング**: 500ms以内（要件WRNFR-003より）
- **🔴 API応答時間**: 1秒以内（平均）

### 🟡 最適化戦略
- **🟡 フロントエンド**:
  - コード分割（React.lazy、Suspense）
  - 画像最適化（WebP形式、遅延読み込み）
  - TanStack Queryのキャッシング（staleTime: 5分、cacheTime: 10分）

- **🟡 バックエンド**:
  - データベースインデックス（頻繁に検索されるフィールド）
  - ページネーション（デフォルト: 20件/ページ）
  - N+1問題の回避（Prismaの`include`を適切に使用）

- **🔴 データベース**:
  - 適切なインデックス設定（name、cardType、customerType等）
  - クエリ最適化（EXPLAIN ANALYZEによる分析）

### 🔴 スケーラビリティ
- **🔴 データ量**: 1000件以上のデータでもページネーションで快適に操作可能（要件WRNFR-002より）
- **🟡 同時接続数**: 初期は10〜20ユーザー程度を想定（個人開発プロジェクトのため）

---

## 🔴 エラーハンドリング設計

### 🔴 エラー分類
1. **バリデーションエラー** (400 Bad Request)
   - フォーム入力エラー、リクエストデータの不正
   - Zodバリデーションエラーメッセージを構造化して返却

2. **リソース未検出** (404 Not Found)
   - 存在しないID指定、削除済みリソースへのアクセス

3. **競合エラー** (409 Conflict)
   - ユニーク制約違反（同名カード、同名錬金スタイル等）

4. **サーバーエラー** (500 Internal Server Error)
   - データベース接続エラー、予期しない例外

### 🔴 エラーレスポンス形式
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "入力データが不正です",
    "details": [
      {
        "field": "energyCost",
        "message": "エネルギーコストは0〜5の範囲で入力してください"
      }
    ]
  }
}
```

### 🔴 フロントエンドエラー表示
- **🔴 トースト通知**: 一時的なエラー（ネットワークエラー等）
- **🔴 フォーム内エラー**: バリデーションエラー（フィールド下に赤字表示）
- **🔴 モーダルエラー**: 重大なエラー（データベース接続エラー等）

---

## 🔵 テスト戦略

### 🔵 ユニットテスト（データベース不要）
- **🔴 フロントエンド**: Vitest + Testing Library（カスタムフック、ユーティリティ関数）
- **🔵 バックエンド**: Vitest + In-Memory Repository
  - **サービス層のテスト**: In-Memory Repository を注入してテスト
  - **コントローラー層のテスト**: In-Memory Repository を注入してテスト
  - **🔵 データベース不要**: PostgreSQL、Dockerコンテナ不要でテスト実行
  - **🔵 高速実行**: メモリ内でデータ操作、CI/CD環境でも高速

### 🔴 統合テスト（データベース使用）
- **🔴 API テスト**: Honoアプリケーション全体のエンドツーエンドテスト
  - Prisma Repository を使用
  - テスト用データベース（Docker）でテスト実行
- **🔴 データベーステスト**: Prismaマイグレーション、シード実行

### 🔴 E2Eテスト（オプション）
- **🔴 ツール**: Playwright（ユーザーフローのテスト）

### 🔵 テスト戦略の利点
- **🔵 高速なユニットテスト**: データベース起動不要で数秒で完了
- **🔵 CI/CD最適化**: GitHub Actions等でデータベースセットアップ不要
- **🔵 テスト環境の分離**: ユニットテストと統合テストを明確に分離
- **🔵 モック不要**: In-Memory実装が実際のRepositoryと同じインターフェース

### 🔴 テストカバレッジ目標
- **🟡 80%以上推奨**: 重要なビジネスロジック、API エンドポイント

---

## 🟡 開発環境

### 🔴 必須ソフトウェア
- **Node.js**: 18+ LTS
- **npm/yarn/pnpm**: パッケージマネージャー
- **Docker**: ローカルPostgreSQL実行用
- **Git**: バージョン管理

### 🟡 推奨開発ツール
- **VS Code**: IDE（ESLint、Prettier、Prisma拡張機能推奨）
- **Postman/Thunder Client**: API テスト
- **Prisma Studio**: データベースGUI

### 🟡 Docker Compose 構成
```yaml
version: '3.8'
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: atelier_resource_mgmt
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## 🔵 データフロー概要

### ユーザー操作からデータ保存までの流れ

```
[ユーザー]
  ↓ フォーム入力
[React Component]
  ↓ Zodバリデーション
[TanStack Query Mutation]
  ↓ Axiosリクエスト
[Hono.js API Endpoint]
  ↓ ミドルウェア（CORS、バリデーション）
[Controller]
  ↓ ビジネスロジック
[Service Layer]
  ↓ 🔵 Repository Interface (ICardRepository)
  ├─ 本番環境 → [🔵 Prisma Repository] → [PostgreSQL Database]
  └─ テスト環境 → [🔵 In-Memory Repository] → [メモリ内データ]
  ↓ レスポンス
[Hono.js API]
  ↓ JSON
[TanStack Query]
  ↓ キャッシュ更新
[React Component]
  ↓ UI更新
[ユーザー] - トースト通知
```

---

## 🟡 非機能要件への対応

### 🔴 保守性（WRNFR-009〜011）
- **🟡 コンポーネント志向**: React コンポーネントの粒度を適切に設計
- **🟡 ESLint + Prettier**: コード品質・一貫性の維持
- **🟡 エラーログ**: Winston等のロガーライブラリ導入（将来的）

### 🔴 ユーザビリティ（WRNFR-007〜008）
- **🔴 直感的UI**: 一貫したデザインシステム（TailwindCSS + shadcn/ui）
- **🔴 学習コスト低減**: パンくずリスト、ヘルプテキスト、バリデーションエラーの明確化

---

## 📝 アーキテクチャ決定記録(ADR)

### ADR-001: フロントエンドフレームワークにReact+Viteを採用
- **🔵 決定**: React 18+ + Vite
- **🔵 理由**: 要件WRREQ-001、WRREQ-001-2より。高速な開発体験、豊富なエコシステム、TypeScript完全サポート

### ADR-002: バックエンドフレームワークにHono.jsを採用
- **🔵 決定**: Hono.js 4.0+
- **🔵 理由**: 要件WRREQ-001-1より。軽量高速、TypeScriptファースト、エッジランタイム対応

### ADR-003: Azure App Serviceへのデプロイ
- **🔵 決定**: Azure App Service（フロントエンド・バックエンド）
- **🔵 理由**: 要件WRREQ-008系列より。エンタープライズ環境での運用、デプロイスロット機能、Azure Database for PostgreSQLとの統合

### ADR-004: TanStack Query + Zod + Axiosの採用
- **🔵 決定**: TanStack Query（サーバー状態管理）、Zod（バリデーション）、Axios（HTTPクライアント）
- **🔵 理由**: 要件WRREQ-001-4〜6より。効率的なデータフェッチ・キャッシング、型安全なバリデーション、柔軟なHTTPクライアント

### ADR-005: MVPでは認証機能を実装しない
- **🔵 決定**: 認証なし
- **🔵 理由**: 要件WRREQ-009より。開発初期は単一開発者のため、開発速度を優先

---

## 🗓️ 変更履歴

| 日付 | バージョン | 変更内容 |
|------|----------|---------|
| 2025-11-09 | 1.0 | 初版作成。React+Vite+Hono.js+Azure App Serviceベースのアーキテクチャ設計 |
| 2025-11-09 | 2.0 | 🔵 Repository Patternを導入。Prismaがなくてもテストが動く設計に変更。データアクセス層を抽象化し、In-Memory実装とPrisma実装を切り替え可能に |
