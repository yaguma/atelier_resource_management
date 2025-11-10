# TASK-0008: CORSミドルウェア実装（詳細設定） - TDD要件定義書

## 1. 機能の概要（EARS要件定義書・設計文書ベース）

### 🔵 青信号（確実な要件）

**何をする機能か**:
- バックエンドAPI（Hono.js）にCORS（Cross-Origin Resource Sharing）ミドルウェアを実装する
- フロントエンド（React SPA）とバックエンド（Hono.js API）が異なるオリジンで動作するため、ブラウザのCORSポリシーに対応する

**どのような問題を解決するか**:
- フロントエンド（http://localhost:5173）からバックエンド（http://localhost:3000）へのHTTPリクエストがブラウザのCORSポリシーで拒否される問題を解決
- プリフライトリクエスト（OPTIONS）を正しく処理する
- ページネーションヘッダー（X-Total-Count、X-Page、X-Limit）をフロントエンドに公開する

**想定されるユーザー**:
- ゲーム開発者（フロントエンドからAPIを呼び出す）
- ゲームデザイナー（管理画面を使用する）

**システム内での位置づけ**:
- **レイヤー**: バックエンド - ミドルウェア層
- **アーキテクチャ**: 3層アーキテクチャ（フロントエンド・バックエンド分離型SPA）
- **実行順序**: 全リクエストに対して最初に実行されるミドルウェア

**参照したEARS要件**:
- **WRREQ-070-1**: システムはCORS(Cross-Origin Resource Sharing)を適切に設定しなければならない 🔴

**参照した設計文書**:
- **architecture.md**:
  - セクション「ミドルウェア構成」 - CORS設定の位置づけ
  - セクション「CORS設定（詳細）」 - 詳細な設定項目と環境別設定
- **environment-variables.md**:
  - セクション「CORS設定」 - 環境変数FRONTEND_URL、CORS_ORIGIN
- **api-endpoints.md**:
  - サンプルコード - Hono.jsでのCORS適用方法
- **dataflow.md**:
  - データフローダイアグラム - CORSミドルウェアがリクエスト処理の最初に実行される

---

## 2. 入力・出力の仕様（EARS機能要件・TypeScript型定義ベース）

### 🔵 青信号（確実な要件）

**入力パラメータ（環境変数から）**:
- `process.env.CORS_ORIGIN`: 許可するオリジン（文字列）
  - 開発環境: `'http://localhost:5173'`
  - 本番環境: `'https://atelier-mgmt-frontend.azurewebsites.net'`
  - デフォルト値: `'http://localhost:5173'`

**入力パラメータ（HTTPリクエストから）**:
- リクエストヘッダー `Origin`: クライアントのオリジン
- リクエストメソッド: `OPTIONS`（プリフライトリクエスト）または通常のリクエスト

**出力値（HTTPレスポンスヘッダー）**:
- `Access-Control-Allow-Origin`: 許可されたオリジン（CORS_ORIGINの値）
- `Access-Control-Allow-Credentials`: `true`
- `Access-Control-Allow-Methods`: `'GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'`
- `Access-Control-Allow-Headers`: `'Content-Type', 'Authorization', 'X-Requested-With'`
- `Access-Control-Expose-Headers`: `'X-Total-Count', 'X-Page', 'X-Limit'`
- `Access-Control-Max-Age`: `86400` (24時間 = 86400秒)

**入出力の関係性**:
- `CORS_ORIGIN`環境変数の値が`Access-Control-Allow-Origin`ヘッダーに設定される
- プリフライトリクエスト（OPTIONS）の場合、上記ヘッダーを含む200 OKレスポンスを返す
- 通常のリクエストの場合、ミドルウェアがCORSヘッダーを追加して次のミドルウェアに処理を渡す

**データフロー**:
```
[フロントエンド]
  ↓ HTTP Request（Origin: http://localhost:5173）
[Hono.js CORSミドルウェア]
  ↓ CORSヘッダー追加
[次のミドルウェア（バリデーション、エラーハンドリング等）]
  ↓
[APIルート]
  ↓ HTTP Response（Access-Control-*ヘッダー付き）
[フロントエンド]
```

**参照したEARS要件**:
- **WRREQ-070-1**: システムはCORS(Cross-Origin Resource Sharing)を適切に設定しなければならない 🔴

**参照した設計文書**:
- **architecture.md**: セクション「CORS設定項目の詳細」 - 設定項目の表
- **environment-variables.md**: セクション「CORS設定」 - FRONTEND_URL、CORS_ORIGIN

---

## 3. 制約条件（EARS非機能要件・アーキテクチャ設計ベース）

### 🔵 青信号（確実な要件）

**アーキテクチャ制約**:
- Hono.jsの`cors`ミドルウェアを使用する（`hono/cors`からインポート）
- ミドルウェアは`app.use('*', corsMiddleware)`で全ルートに適用する
- ミドルウェアファイルは`backend/src/middlewares/cors.ts`に配置する
- `backend/src/index.ts`でインポートして適用する

**環境変数制約**:
- `CORS_ORIGIN`または`FRONTEND_URL`環境変数が設定されていること
- 設定されていない場合はデフォルト値`'http://localhost:5173'`を使用する

**セキュリティ要件**:
- 本番環境では特定のオリジンのみを許可する（ワイルドカード`*`は使用しない）
- `credentials: true`を設定してCookie・認証情報の送信を許可する（将来の認証機能実装に備えて）

### 🟡 黄信号（妥当な推測）

**パフォーマンス要件**:
- CORSミドルウェアはリクエスト処理の最初に実行されるため、軽量であること
- プリフライトリクエストは即座に200 OKを返すこと（データベースアクセス不要）

**互換性要件**:
- モダンブラウザ（Chrome、Firefox、Safari、Edge）のCORS仕様に対応する
- プリフライトリクエスト（OPTIONS）を正しく処理する

**参照したEARS要件**:
- **WRREQ-070-1**: システムはCORS(Cross-Origin Resource Sharing)を適切に設定しなければならない 🔴
- **WRREQ-070-2**: APIはHono.jsのミドルウェアを活用してバリデーション、ロギング、エラーハンドリングを実装しなければならない 🟡

**参照した設計文書**:
- **architecture.md**: セクション「ミドルウェア構成」、「CORS設定（詳細）」
- **environment-variables.md**: セクション「CORS設定」

---

## 4. 想定される使用例（EARSEdgeケース・データフローベース）

### 🔵 青信号（確実な要件）

**基本的な使用パターン**:

1. **通常のGETリクエスト**:
   - フロントエンド（http://localhost:5173）から`axios.get('http://localhost:3000/api/health')`実行
   - CORSミドルウェアが`Access-Control-Allow-Origin: http://localhost:5173`ヘッダーを追加
   - リクエストが成功する

2. **プリフライトリクエスト（OPTIONS）**:
   - フロントエンドからPOSTリクエスト実行前にブラウザが自動的にOPTIONSリクエストを送信
   - CORSミドルウェアが適切なヘッダーを含む200 OKレスポンスを返す
   - ブラウザがプリフライトを通過後、実際のPOSTリクエストが送信される

3. **ページネーションヘッダーの取得**:
   - フロントエンドが`/api/cards?page=1&limit=10`にリクエスト
   - バックエンドが`X-Total-Count`、`X-Page`、`X-Limit`ヘッダーを付与
   - CORSミドルウェアの`exposeHeaders`設定により、フロントエンドがこれらのヘッダーを読み取れる

### 🟡 黄信号（妥当な推測）

**エッジケース**:

1. **環境変数未設定**:
   - `CORS_ORIGIN`環境変数が設定されていない場合
   - デフォルト値`'http://localhost:5173'`が使用される

2. **異なるポート番号からのアクセス**:
   - フロントエンドが`http://localhost:3000`から`http://localhost:3000/api`にアクセス
   - 同一オリジンのためCORSチェックは実行されない（正常動作）

**エラーケース**:

1. **許可されていないオリジンからのアクセス**:
   - `http://example.com`から`http://localhost:3000/api`にアクセス
   - ブラウザがCORSエラーを表示（ミドルウェアは403エラーを返さず、ブラウザが拒否）

**参照したEARS要件**:
- **WRREQ-070-1**: システムはCORS(Cross-Origin Resource Sharing)を適切に設定しなければならない 🔴

**参照した設計文書**:
- **dataflow.md**: セクション「カード作成フロー」 - CORSミドルウェアの実行タイミング
- **api-endpoints.md**: サンプルコード - プリフライトリクエストの処理

---

## 5. EARS要件・設計文書との対応関係

**参照したユーザストーリー**:
- なし（インフラ層の技術的要件）

**参照した機能要件**:
- **WRREQ-070-1**: システムはCORS(Cross-Origin Resource Sharing)を適切に設定しなければならない 🔴
- **WRREQ-070-2**: APIはHono.jsのミドルウェアを活用してバリデーション、ロギング、エラーハンドリングを実装しなければならない 🟡

**参照した非機能要件**:
- なし（機能要件に含まれる）

**参照したEdgeケース**:
- なし（明示的なEdgeケース要件は定義されていない）

**参照した受け入れ基準**:
- CORSミドルウェアが適用される
- フロントエンドからAPIアクセスできる
- OPTIONSリクエストが正常に処理される
- CORS関連ヘッダーが正しく設定される
- exposeHeaders（X-Total-Count, X-Page, X-Limit）が設定される
- maxAge（86400）が設定される

**参照した設計文書**:

- **アーキテクチャ**:
  - `architecture.md` - セクション「ミドルウェア構成」（Line 115-119）
  - `architecture.md` - セクション「CORS設定（詳細）」（Line 250-309）
  - `architecture.md` - セクション「ディレクトリ構造」 - `middlewares/cors.ts`の配置（Line 155）

- **データフロー**:
  - `dataflow.md` - セクション「システム全体のデータフロー図」 - CORSミドルウェアの位置（Line 18）
  - `dataflow.md` - セクション「カード作成フロー」 - CORSミドルウェアの実行タイミング（Line 222）

- **型定義**:
  - なし（Hono.jsのCORSミドルウェアの型を使用）

- **データベース**:
  - なし（データベースアクセス不要）

- **API仕様**:
  - `api-endpoints.md` - サンプルコード（Line 1059-1083）- Hono.jsでのCORS適用例

- **環境変数**:
  - `environment-variables.md` - セクション「CORS設定」（Line 41-46）- FRONTEND_URL、CORS_ORIGIN

---

## 実装ファイル

- `backend/src/middlewares/cors.ts` - CORSミドルウェア実装
- `backend/src/index.ts` - ミドルウェア適用

---

## 品質判定

✅ **高品質**:
- 要件の曖昧さ: なし（EARS要件、設計文書から明確に定義されている）
- 入出力定義: 完全（環境変数、HTTPヘッダー、レスポンスヘッダー）
- 制約条件: 明確（Hono.js、環境変数、セキュリティ）
- 実装可能性: 確実（Hono.jsの標準機能を使用）

---

## 次のステップ

次のお勧めステップ: `/tdd-testcases` でテストケースの洗い出しを行います。
