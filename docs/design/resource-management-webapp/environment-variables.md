# 環境変数管理

## 🔵 概要

本システムでは、環境ごとに異なる設定を環境変数で管理します。

- **🔵 開発環境**: `.env`ファイル（ローカル）
- **🔵 本番環境**: Azure App Serviceのアプリケーション設定
- **🔵 テスト環境**: `.env.test`ファイル または GitHub Actions Secrets

---

## 🔵 バックエンド環境変数

### 必須環境変数

#### 🔵 データベース関連

| 変数名 | 説明 | 開発環境の例 | 本番環境の例 | 必須 |
|--------|------|------------|------------|------|
| `DATABASE_URL` | PostgreSQL接続文字列 | `postgresql://postgres:postgres@localhost:5432/atelier_resource_mgmt` | `postgresql://user:pass@xxx.postgres.database.azure.com:5432/atelier_db?sslmode=require` | ✅ |

#### 🔵 Repository設定

| 変数名 | 説明 | 開発環境の例 | 本番環境の例 | 必須 |
|--------|------|------------|------------|------|
| `REPOSITORY_TYPE` | Repository実装の種類 | `prisma` | `prisma` | ✅ |
| | | `memory`（テスト時） | | |

**値の説明**:
- `prisma`: Prisma Repository（本番環境用、PostgreSQL使用）
- `memory`: In-Memory Repository（テスト用、データベース不要）

#### 🔵 サーバー設定

| 変数名 | 説明 | 開発環境の例 | 本番環境の例 | 必須 |
|--------|------|------------|------------|------|
| `NODE_ENV` | 実行環境 | `development` | `production` | ✅ |
| `PORT` | サーバーポート番号 | `3000` | `8080` | ✅ |

#### 🔵 CORS設定

| 変数名 | 説明 | 開発環境の例 | 本番環境の例 | 必須 |
|--------|------|------------|------------|------|
| `FRONTEND_URL` | フロントエンドURL | `http://localhost:5173` | `https://atelier-mgmt-frontend.azurewebsites.net` | ✅ |
| `CORS_ORIGIN` | CORS許可オリジン | `http://localhost:5173` | `https://atelier-mgmt-frontend.azurewebsites.net` | ✅ |

### オプション環境変数

#### 🟡 ロギング設定

| 変数名 | 説明 | デフォルト値 | 例 |
|--------|------|------------|-----|
| `LOG_LEVEL` | ログレベル | `info` | `debug`, `info`, `warn`, `error` |
| `LOG_FORMAT` | ログフォーマット | `json` | `json`, `text` |

#### 🟡 セキュリティ設定

| 変数名 | 説明 | デフォルト値 | 例 |
|--------|------|------------|-----|
| `RATE_LIMIT_MAX` | レート制限（リクエスト数/分） | `100` | `100` |
| `RATE_LIMIT_WINDOW_MS` | レート制限ウィンドウ（ミリ秒） | `60000` | `60000` (1分) |

#### 🟡 Prisma設定

| 変数名 | 説明 | デフォルト値 | 例 |
|--------|------|------------|-----|
| `PRISMA_QUERY_LOG` | クエリログ出力 | `false` | `true`, `false` |
| `PRISMA_CONNECTION_LIMIT` | 接続プール最大数 | `10` | `10` |

---

## 🔵 フロントエンド環境変数

### 必須環境変数

#### 🔵 API設定

| 変数名 | 説明 | 開発環境の例 | 本番環境の例 | 必須 |
|--------|------|------------|------------|------|
| `VITE_API_BASE_URL` | バックエンドAPIのベースURL | `http://localhost:3000/api` | `https://atelier-mgmt-backend.azurewebsites.net/api` | ✅ |

### オプション環境変数

#### 🟡 機能フラグ

| 変数名 | 説明 | デフォルト値 | 例 |
|--------|------|------------|-----|
| `VITE_ENABLE_DEV_TOOLS` | React DevTools有効化 | `false` | `true`（開発時のみ） |
| `VITE_API_TIMEOUT` | APIタイムアウト（ミリ秒） | `10000` | `10000` (10秒) |

---

## 🔵 環境別設定例

### 開発環境 (.env)

```bash
# データベース
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/atelier_resource_mgmt

# Repository設定
REPOSITORY_TYPE=prisma

# サーバー設定
NODE_ENV=development
PORT=3000

# CORS設定
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173

# ロギング（オプション）
LOG_LEVEL=debug
LOG_FORMAT=text

# Prisma（オプション）
PRISMA_QUERY_LOG=true
```

### テスト環境 (.env.test)

```bash
# Repository設定（In-Memory使用）
REPOSITORY_TYPE=memory

# サーバー設定
NODE_ENV=test
PORT=3001

# CORS設定
CORS_ORIGIN=http://localhost:5173

# ロギング
LOG_LEVEL=error
LOG_FORMAT=json
```

### 本番環境 (Azure App Service アプリケーション設定)

```bash
# データベース
DATABASE_URL=postgresql://admin:SecurePass123@atelier-db.postgres.database.azure.com:5432/atelier_resource_mgmt?sslmode=require

# Repository設定
REPOSITORY_TYPE=prisma

# サーバー設定
NODE_ENV=production
PORT=8080

# CORS設定
FRONTEND_URL=https://atelier-mgmt-frontend.azurewebsites.net
CORS_ORIGIN=https://atelier-mgmt-frontend.azurewebsites.net

# ロギング
LOG_LEVEL=info
LOG_FORMAT=json

# Prisma
PRISMA_CONNECTION_LIMIT=20

# セキュリティ
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=60000
```

---

## 🔴 セキュリティ上の注意

### ⚠️ `.env`ファイルの管理

- **🔴 `.gitignore`に必ず追加**: `.env`ファイルをGitにコミットしない
- **🔴 本番環境の機密情報を含めない**: 開発環境用のダミー値のみ使用
- **🔴 `.env.example`を用意**: 必要な環境変数の一覧をサンプルとして提供

### 🔵 .env.example（サンプルファイル）

```bash
# データベース
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Repository設定
REPOSITORY_TYPE=prisma

# サーバー設定
NODE_ENV=development
PORT=3000

# CORS設定
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173

# ロギング（オプション）
LOG_LEVEL=info
LOG_FORMAT=json
```

### 🔵 Azure App Serviceでの設定方法

#### Azure Portal での設定

1. Azure Portal → App Service → 設定 → 構成
2. 「アプリケーション設定」タブ → 「新しいアプリケーション設定」
3. 環境変数を追加（例: `DATABASE_URL`, `FRONTEND_URL`等）
4. 「保存」をクリック

#### Azure CLI での設定

```bash
# 環境変数を設定
az webapp config appsettings set \
  --resource-group atelier-rg \
  --name atelier-backend \
  --settings \
    DATABASE_URL="postgresql://..." \
    REPOSITORY_TYPE="prisma" \
    NODE_ENV="production" \
    FRONTEND_URL="https://atelier-mgmt-frontend.azurewebsites.net"
```

---

## 🔵 環境変数の読み込み

### バックエンド（Hono.js）

```typescript
// src/config/env.ts
import { config } from 'dotenv';

// 環境変数を読み込み
config();

export const env = {
  // データベース
  databaseUrl: process.env.DATABASE_URL!,

  // Repository設定
  repositoryType: process.env.REPOSITORY_TYPE || 'prisma',

  // サーバー設定
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),

  // CORS設定
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',

  // ロギング
  logLevel: process.env.LOG_LEVEL || 'info',
  logFormat: process.env.LOG_FORMAT || 'json',

  // Prisma
  prismaQueryLog: process.env.PRISMA_QUERY_LOG === 'true',
  prismaConnectionLimit: parseInt(process.env.PRISMA_CONNECTION_LIMIT || '10', 10),

  // セキュリティ
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
} as const;

// 必須環境変数のチェック
if (!env.databaseUrl && env.repositoryType === 'prisma') {
  throw new Error('DATABASE_URL is required when REPOSITORY_TYPE is prisma');
}
```

### フロントエンド（Vite + React）

```typescript
// src/config/env.ts
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  enableDevTools: import.meta.env.VITE_ENABLE_DEV_TOOLS === 'true',
  apiTimeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000', 10),
} as const;
```

---

## 🔵 CI/CD環境での設定

### GitHub Actions

```yaml
# .github/workflows/backend-deploy.yml
name: Backend Deploy

env:
  # GitHub Secretsから環境変数を設定
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
  REPOSITORY_TYPE: prisma
  NODE_ENV: production
  FRONTEND_URL: ${{ secrets.FRONTEND_URL }}
  CORS_ORIGIN: ${{ secrets.CORS_ORIGIN }}

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Azure
        run: |
          # デプロイコマンド
```

### GitHub Secretsに登録すべき変数

- `DATABASE_URL`: PostgreSQL接続文字列
- `FRONTEND_URL`: フロントエンドURL
- `CORS_ORIGIN`: CORS許可オリジン
- `AZURE_CREDENTIALS`: Azure認証情報

---

## 🔵 トラブルシューティング

### 環境変数が読み込まれない

**原因**: `.env`ファイルが存在しない、またはパスが間違っている

**解決策**:
```bash
# .envファイルが存在するか確認
ls -la .env

# .env.exampleからコピー
cp .env.example .env
```

### データベース接続エラー

**原因**: `DATABASE_URL`の形式が間違っている

**解決策**:
```bash
# 正しい形式で設定
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
```

### CORS エラー

**原因**: `CORS_ORIGIN`がフロントエンドURLと一致していない

**解決策**:
```bash
# フロントエンドURLを確認して設定
CORS_ORIGIN=http://localhost:5173  # 開発環境
CORS_ORIGIN=https://your-app.azurewebsites.net  # 本番環境
```

---

## 🗓️ 変更履歴

| 日付 | バージョン | 変更内容 |
|------|----------|---------|
| 2025-11-09 | 1.0 | 初版作成。環境変数管理の詳細を文書化 |
