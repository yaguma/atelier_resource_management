# リソース管理Webアプリ アーキテクチャ設計

## システム概要

本システムは、アトリエ錬金術ゲームの開発支援ツールとして、ゲーム内リソース（カード、顧客、錬金スタイル、マップノード、メタ進行データなど）を効率的に管理するためのWebアプリケーションである。

**目的**: ゲームバランス調整、データ管理、コンテンツ追加を容易にする  
**対象ユーザー**: ゲーム開発者、ゲームデザイナー  
**技術スタック**: React 18+ + Vite + TypeScript + TailwindCSS + React Router + TanStack Query + Zod + Axios (フロントエンド)、Hono.js + TypeScript + Prisma + PostgreSQL (バックエンド)

**【信頼性レベル】**:
- 🔵 **青信号**: 要件定義書から直接導出された確実な設計
- 🟡 **黄信号**: 要件定義書から妥当な推測による設計
- 🔴 **赤信号**: 一般的なWebアプリ管理画面のベストプラクティスから推測

---

## アーキテクチャパターン

### 採用パターン

- **パターン**: `Furetue based architecture` + `Functional Core, Imperative Shell` 🔴
- **理由**: 
  - ビジネスロジックを純粋関数として実装し、テスト容易性と保守性を向上
  - 副作用（DBアクセス、API呼び出し）をImperative Shellに分離し、Functional Coreの純粋性を保つ
  - Repository Patternにより、データアクセス層を抽象化し、依存性の逆転を実現

### レイヤー構成

```
┌─────────────────────────────────────┐
│   Presentation Layer (React)        │
│   - UI Components                   │
│   - Pages                           │
│   - Hooks (TanStack Query)          │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   Application Layer (Hono.js)       │
│   - Controllers                     │
│   - Routes                          │
│   - Middlewares                     │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   Domain Layer (Functional Core)    │
│   - Services (純粋関数)              │
│   - Domain Models                   │
│   - Business Logic                  │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   Infrastructure Layer (Shell)      │
│   - Repositories (Prisma/Memory)    │
│   - Database (PostgreSQL)            │
│   - External APIs                   │
└─────────────────────────────────────┘
```

---

## コンポーネント構成

### フロントエンド

- **フレームワーク**: React 18+ 🔵 *要件WRREQ-001より*
- **ビルドツール**: Vite 🔵 *要件WRREQ-001-2より*
- **ルーティング**: React Router v6 🔵 *要件WRREQ-001-3より*
- **状態管理**: TanStack Query (React Query) v5 🔵 *要件WRREQ-001-4より*
  - サーバー状態管理（APIデータのキャッシング・同期）
  - クライアント状態管理: React Hooks (useState, useReducer)
- **バリデーション**: Zod + React Hook Form 🔵 *要件WRREQ-001-5より*
- **HTTPクライアント**: Axios 🔵 *要件WRREQ-001-6より*
- **スタイリング**: TailwindCSS 🔵 *要件WRREQ-005より*
- **アーキテクチャ**: SPA (Single Page Application) 🔵 *要件定義書より*

### バックエンド

- **フレームワーク**: Hono.js v4.0+ 🔵 *要件WRREQ-001-1より*
- **ランタイム**: Node.js 18+ 🔵 *技術的制約より*
- **ORM**: Prisma 5.0+ 🔵 *要件WRREQ-004より*
- **バリデーション**: Zod 3.0+ 🔵 *要件WRREQ-001-5より*
- **認証方式**: MVPでは認証なし 🔵 *要件WRREQ-009より*
  - 将来的にJWT認証を実装可能 🔴 *要件WRREQ-010より*
- **アーキテクチャ**: RESTful API 🔵 *要件WRREQ-067より*

### データベース

- **DBMS**: PostgreSQL 14+ (開発環境) / Azure Database for PostgreSQL (本番環境) 🔵 *要件WRREQ-003, WRREQ-008-2より*
- **ORM**: Prisma 5.0+ 🔵 *要件WRREQ-004より*
- **キャッシュ**: 現時点では実装なし 🔴 *将来的にRedis導入を検討*
- **マイグレーション**: Prisma Migrate 🔵 *技術的制約より*

---

## システム境界

### フロントエンド/バックエンドの分離

- **完全分離**: フロントエンドとバックエンドは独立したアプリケーションとして実装 🔵 *要件定義書より*
- **通信方式**: RESTful API (JSON) 🔵 *要件WRREQ-067より*
- **CORS設定**: フロントエンドとバックエンドの異なるオリジン間通信を許可 🔵 *要件WRREQ-070-1より*
- **デプロイ**: 独立したデプロイ・スケーリングが可能 🔵 *要件定義書より*

### マイクロサービスの必要性

- **現時点**: モノリシック構成（単一バックエンドAPI） 🔴
- **理由**: 
  - MVP段階では機能が限定的で、マイクロサービス化のメリットが少ない
  - 開発・運用コストを抑えるため
- **将来の検討**: 機能拡張（認証、分析、通知など）に応じてマイクロサービス化を検討 🔴

---

## ディレクトリ構造

### フロントエンド構造

```
frontend/
├── src/
│   ├── components/          # UIコンポーネント
│   │   ├── common/         # 共通コンポーネント
│   │   ├── cards/          # カード関連コンポーネント
│   │   ├── customers/      # 顧客関連コンポーネント
│   │   └── ...
│   ├── pages/              # ページコンポーネント
│   ├── hooks/              # カスタムフック
│   │   ├── queries/        # TanStack Queryフック
│   │   └── ...
│   ├── services/           # API呼び出しラッパー
│   ├── types/              # TypeScript型定義
│   ├── utils/              # ユーティリティ関数
│   ├── schemas/            # Zodバリデーションスキーマ
│   └── App.tsx
├── public/
└── package.json
```

### バックエンド構造

```
backend/
├── src/
│   ├── controllers/       # コントローラー層
│   ├── services/           # ビジネスロジック層（Functional Core）
│   ├── repositories/      # データアクセス層（Infrastructure）
│   │   ├── interfaces/    # Repositoryインターフェース
│   │   ├── prisma/        # Prisma実装
│   │   └── memory/        # In-Memory実装（テスト用）
│   ├── routes/            # ルート定義
│   ├── schemas/           # Zodバリデーションスキーマ
│   ├── middlewares/       # ミドルウェア
│   ├── types/             # TypeScript型定義
│   ├── utils/             # ユーティリティ関数
│   ├── config/            # 設定ファイル
│   └── index.ts
├── prisma/
│   └── schema.prisma      # Prismaスキーマ
└── package.json
```

---

## データフロー概要

1. **ユーザー操作** → React Component
2. **React Component** → TanStack Query Hook (useQuery/useMutation)
3. **TanStack Query Hook** → Axios (API呼び出し)
4. **Hono.js Route** → Controller
5. **Controller** → Service (ビジネスロジック)
6. **Service** → Repository (データアクセス)
7. **Repository** → Prisma → PostgreSQL
8. **レスポンス** → 逆順でフロントエンドへ返却

詳細は `dataflow.md` を参照。

---

## セキュリティ設計

### 認証・認可

- **MVP**: 認証なし 🔵 *要件WRREQ-009より*
- **将来**: JWT認証 + RBAC 🔴 *要件WRREQ-010, WRREQ-011より*

### セキュリティ対策

- **SQLインジェクション対策**: Prisma ORMによるパラメータ化クエリ 🔵 *要件WRNFR-004より*
- **XSS対策**: Reactの自動エスケープ + 入力値サニタイゼーション 🔵 *要件WRNFR-005より*
- **CSRF対策**: SameSite Cookie設定 + CSRFトークン検証 🔵 *要件WRNFR-006より*

---

## パフォーマンス設計

### フロントエンド

- **初期表示**: 2秒以内 🔵 *要件WRNFR-001より*
- **検索・フィルタリング**: 500ms以内 🔵 *要件WRNFR-003より*
- **最適化**: 
  - TanStack Queryによるキャッシング（staleTime: 5分、cacheTime: 10分） 🔴
  - ページネーション（20件/ページ） 🔵 *要件定義書より*
  - デバウンス処理（検索入力500ms後） 🔴

### バックエンド

- **API応答時間**: 500ms以内（目標） 🔴
- **最適化**:
  - データベースインデックス戦略 🔴
  - クエリ最適化（N+1問題の回避） 🔴
  - 将来的にRedisキャッシュ導入を検討 🔴

---

## デプロイ設計

### 開発環境

- **フロントエンド**: `http://localhost:5173` (Vite Dev Server) 🔵
- **バックエンド**: `http://localhost:3000` 🔵
- **データベース**: ローカルPostgreSQL 🔵

### 本番環境

- **フロントエンド**: Azure App Service 🔵 *要件WRREQ-008より*
- **バックエンド**: Azure App Service 🔵 *要件WRREQ-008-1より*
- **データベース**: Azure Database for PostgreSQL 🔵 *要件WRREQ-008-2より*
- **CI/CD**: GitHub Actions 🔵 *技術的制約より*
- **デプロイスロット**: 本番・ステージング環境 🔵 *要件定義書より*

---

## テスト戦略

### フロントエンド

- **ユニットテスト**: Vitest + React Testing Library 🔴
- **E2Eテスト**: Playwright (オプション) 🔴 *要件WRNFR-014より*

### バックエンド

- **ユニットテスト**: Vitest + In-Memory Repository 🔵 *既存実装より*
- **統合テスト**: Vitest + Prisma Repository 🔵 *既存実装より*
- **テストカバレッジ**: 80%以上を目標 🔴

---

## 保守性設計

### コード品質

- **リンター**: ESLint + Prettier 🔵 *要件WRNFR-010より*
- **型チェック**: TypeScript strict mode 🔵
- **コンポーネント志向**: Reactコンポーネントの再利用性を重視 🔵 *要件WRNFR-009より*

### ログ・監視

- **エラーログ**: 構造化ログ（JSON形式） 🔵 *要件WRNFR-011より*
- **デバッグ**: 開発環境で詳細ログ、本番環境でエラーログのみ 🔴

---

## 変更履歴

| 日付 | バージョン | 変更内容 |
|------|----------|---------|
| 2025-01-XX | 1.0 | 初版作成 |

