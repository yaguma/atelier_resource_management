# Phase 1-b: バックエンド共通機能実装（ミドルウェア）

## フェーズ概要

### 要件名
resource-management-webapp

### 期間・目標
- **期間**: 5営業日（Week 2: Day 6-10）
- **総工数**: 40時間
- **タスク数**: 8タスク
- **目標**: バックエンドの共通ミドルウェア・ユーティリティを実装する

### 成果物
- CORSミドルウェア
- バリデーションミドルウェア
- エラーハンドリングミドルウェア
- ロギングミドルウェア
- 共通レスポンス型・ユーティリティ
- Prismaソフトデリートミドルウェア
- ヘルスチェックエンドポイント（拡張版）
- 統合テスト環境

---

## 週次計画

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
   - Zodスキーマでbody/queryをバリデーション
   - ZodErrorを構造化レスポンスに変換（code, message, details）
   - バリデーション済みデータを`c.set('validated', validated)`で設定

2. バリデーションスキーマ例（`src/types/validation.ts`）
   - createCardSchemaなど、各エンティティのスキーマ定義

3. 使用例: `routes.post('/cards', validate(createCardSchema, 'body'), ...)`

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
   - HTTPExceptionを処理（err.statusとmessageを返す）
   - Prismaエラーを処理（P2002: 409 DUPLICATE_ENTRY、P2025: 404 NOT_FOUND）
   - デフォルトエラー: 500 INTERNAL_ERROR
   - 全エラーをconsole.errorに出力

2. `src/index.ts`に適用: `app.onError(errorHandler)`

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
   - リクエスト開始時: method, pathをログ出力
   - レスポンス後: status, 実行時間をログ出力
   - ステータスコードに応じた絵文字表示（500+: ❌、400+: ⚠️、その他: ✅）

2. `src/index.ts`に適用: `app.use('*', logger)`

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
   - successResponse: `{data, message}`形式のレスポンス
   - paginatedResponse: `{data: {items, total, page, limit, totalPages}}`形式
   - errorResponse: `{error: {code, message, details}}`形式
   - notFoundResponse: 404エラー専用ヘルパー

2. `src/utils/validation.ts`作成
   - paginationQuerySchema: page/limitのZodスキーマ
   - uuidSchema: UUID検証スキーマ
   - validateUUID: UUID検証ヘルパー関数

3. `src/types/index.ts`作成
   - ApiResponse<T>, ApiError, ValidationError, PaginatedResponse<T>のインターフェース定義

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
   - ソフトデリートミドルウェア: delete/deleteMany → update/updateMany（deletedAt設定）
   - SELECT時: findUnique/findFirst/findMany で deletedAt IS NULL フィルタ
   - シングルトンパターンでPrismaClient管理

2. `src/index.ts`でPrismaクライアント初期化
   - SIGTERM時に`prisma.$disconnect()`実行

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
   - `prisma.$queryRaw`でデータベース接続確認
   - 成功時: `{status: "ok", timestamp, database: "connected"}`
   - 失敗時: `{status: "error", timestamp, database: "disconnected", error}`（503）

2. `src/routes/index.ts`に統合: `routes.route('/health', health)`

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
1. 環境変数ファイル作成: `.env.development`, `.env.test`, `.env.example`

2. `.env.example`に必須項目を記載（DATABASE_URL, PORT, NODE_ENV, CORS_ORIGIN）

3. 統合テスト実施: 全プロジェクトの起動確認、API疎通確認、CORS動作確認、ミドルウェア動作確認

4. README.md作成: セットアップ手順、起動コマンド、動作確認URLを記載

**完了条件**:
- [ ] 環境変数ファイルが整備されている
- [ ] 統合テストが全て通る
- [ ] README.mdにセットアップ手順が記載されている
- [ ] 新規開発者が環境構築できる

---

## Phase 1-b 完了条件

### 必須条件
- [ ] CORSミドルウェアが動作する
- [ ] バリデーションミドルウェアが動作する
- [ ] エラーハンドリングが動作する
- [ ] ロギングが動作する
- [ ] Prismaソフトデリートが動作する
- [ ] `/api/health`エンドポイントが正常に動作する（データベース接続確認付き）
- [ ] フロントエンドからバックエンドAPIにアクセスできる

### 品質基準
- [ ] ESLint・Prettierでコード整形されている
- [ ] TypeScriptのコンパイルエラーがない
- [ ] 全テストが通る
- [ ] README.mdのセットアップ手順が正しい

---

## Phase 1全体の完了条件

### 必須条件（Phase 1-a + 1-b）
- [ ] フロントエンド・バックエンドプロジェクトが起動する
- [ ] PostgreSQLデータベースが起動する
- [ ] Prismaマイグレーションが適用されている
- [ ] `/api/health`エンドポイントが正常に動作する
- [ ] CORSミドルウェアが動作する
- [ ] バリデーションミドルウェアが動作する
- [ ] エラーハンドリングが動作する
- [ ] ロギングが動作する
- [ ] Prismaソフトデリートが動作する

### マイルストーン
- [x] **M1: MVP基盤完成** - Phase 1完了時点で達成

---

## 変更履歴

| 日付 | バージョン | 変更内容 |
|------|----------|---------|
| 2025-11-09 | 1.0 | Phase 1から分割。Day 6-10の8タスク、40時間 |
