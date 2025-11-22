# バックエンド API

アトリエ資源管理WebアプリケーションのバックエンドAPIサーバー

## 技術スタック

- **フレームワーク**: Hono.js v4.6.15
- **ランタイム**: Node.js v20.x
- **言語**: TypeScript 5.6.3
- **ORM**: Prisma 5.22.0
- **バリデーション**: Zod 3.23.8
- **開発ツール**: tsx 4.19.2

## セットアップ

### 前提条件

- Node.js v20.x以上
- npm または yarn
- PostgreSQL（データベース）

### インストール

```bash
# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env
# .envファイルを編集してデータベース接続情報を設定

# Prismaマイグレーション（データベース設定後）
npx prisma migrate dev

# Prisma Client生成
npx prisma generate
```

### 開発サーバーの起動

```bash
# 開発サーバー起動（ホットリロード有効）
npm run dev

# 型チェック
npm run type-check

# ビルド
npm run build

# 本番モードで起動
npm start

# リンター実行
npm run lint
```

## プロジェクト構造

```
backend/
├── src/
│   ├── config/          # 設定ファイル
│   ├── controllers/     # コントローラー層
│   ├── services/        # ビジネスロジック層
│   ├── repositories/    # データアクセス層
│   ├── routes/          # ルート定義
│   ├── middlewares/     # ミドルウェア
│   ├── types/           # TypeScript型定義
│   ├── utils/           # ユーティリティ関数
│   └── index.ts         # エントリーポイント
├── prisma/              # Prismaスキーマ
├── dist/                # ビルド出力
└── package.json
```

## APIエンドポイント

### ヘルスチェック

```
GET /health
```

レスポンス:
```json
{
  "status": "ok"
}
```

### ルート

```
GET /
```

レスポンス:
```json
{
  "message": "Atelier Resource Management API"
}
```

## 環境変数

`.env`ファイルに以下の環境変数を設定してください：

```env
# データベース接続
DATABASE_URL="postgresql://user:password@localhost:5432/atelier_resource_mgmt?schema=public"

# サーバー設定
PORT=3000
NODE_ENV=development

# CORS設定
CORS_ORIGIN=http://localhost:5173

# Repository設定
REPOSITORY_TYPE=prisma
```

## 開発

### コード品質

- TypeScript strict mode有効
- ESLintによるコード品質チェック
- 型安全性の確保

### テスト

（今後実装予定）

## ライセンス

（プロジェクトのライセンスに準拠）

