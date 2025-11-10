# Phase 1-b: バックエンド共通機能実装（ミドルウェア + Repository Pattern基盤）

## フェーズ概要

### 要件名
resource-management-webapp

### 期間・目標
- **期間**: 6営業日（Week 2: Day 6-11）
- **総工数**: 48時間
- **タスク数**: 10タスク
- **目標**: バックエンドの共通ミドルウェア・ユーティリティ・Repository Pattern基盤を実装する

### 成果物
- CORSミドルウェア（詳細設定）
- バリデーションミドルウェア
- エラーハンドリングミドルウェア（体系的なエラーコード）
- ロギングミドルウェア
- 共通レスポンス型・ユーティリティ
- Prismaソフトデリートミドルウェア
- 🔵 **Repository Pattern基盤**（インターフェース、依存性注入コンテナ）
- 🔵 **エラーコード定数定義**
- ヘルスチェックエンドポイント（拡張版）
- 統合テスト環境

---

## 週次計画

### Week 2（Day 6-11）: バックエンド共通機能実装 + Repository Pattern基盤
**目標**: バックエンドの共通ミドルウェア・ユーティリティを実装し、Repository Pattern基盤を構築する

**成果物**:
- CORSミドルウェア（詳細設定）
- バリデーションミドルウェア
- エラーハンドリングミドルウェア（体系的なエラーコード）
- ロギングミドルウェア
- 共通レスポンス型・ユーティリティ
- 🔵 Repository Pattern基盤
- 🔵 エラーコード定数定義
- ヘルスチェックエンドポイント

---

## 日次タスク

### Day 6（8時間）: CORSミドルウェア実装（詳細設定）

#### ☑ TASK-0008: 🔵 CORSミドルウェア実装（詳細設定）
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
     // 🔵 設計書に基づいて詳細化
     allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
     exposeHeaders: ['X-Total-Count', 'X-Page', 'X-Limit'],
     maxAge: 86400, // 24時間
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
   - 🔵 exposeHeadersの確認（X-Total-Count等）

**完了条件**:
- [ ] CORSミドルウェアが適用される
- [ ] フロントエンドからAPIアクセスできる
- [ ] OPTIONSリクエストが正常に処理される
- [ ] CORS関連ヘッダーが正しく設定される
- [ ] 🔵 exposeHeaders（X-Total-Count, X-Page, X-Limit）が設定される
- [ ] 🔵 maxAge（86400）が設定される

**テスト要件**:
- [ ] フロントエンドから`/api/health`にアクセスできる
- [ ] CORSエラーが発生しない
- [ ] 異なるオリジンからのアクセスが許可される
- [ ] 🔵 レスポンスヘッダーにX-Total-Count等が含まれる

---

#### ☑ TASK-0008A: 🔵 エラーコード定数定義
- **推定工数**: 4時間
- **タスクタイプ**: DIRECT
- **要件へのリンク**: WRREQ-069（エラーハンドリング）
- **依存タスク**: なし

**実装詳細**:
1. `src/constants/errorCodes.ts`作成
   ```typescript
   /**
    * 🔵 エラーコード定数定義
    * 設計書 api-endpoints.md に基づく体系的なエラーコード
    */

   // 🔵 認証・認可エラー（AUTH_xxx）
   export const AUTH_001 = 'AUTH_001'; // 認証エラー（将来実装）
   export const AUTH_002 = 'AUTH_002'; // トークン期限切れ（将来実装）
   export const AUTH_003 = 'AUTH_003'; // 権限不足（将来実装）

   // 🔵 バリデーションエラー（VALID_xxx）
   export const VALID_001 = 'VALID_001'; // バリデーションエラー
   export const VALID_002 = 'VALID_002'; // 型不一致
   export const VALID_003 = 'VALID_003'; // 必須フィールド不足
   export const VALID_004 = 'VALID_004'; // 範囲外の値

   // 🔵 リソースエラー（RES_xxx）
   export const RES_001 = 'RES_001'; // リソース未検出
   export const RES_002 = 'RES_002'; // 重複エントリ
   export const RES_003 = 'RES_003'; // 依存関係エラー
   export const RES_004 = 'RES_004'; // 削除済みリソース

   // 🔵 データベースエラー（DB_xxx）
   export const DB_001 = 'DB_001'; // データベース接続エラー
   export const DB_002 = 'DB_002'; // トランザクションエラー
   export const DB_003 = 'DB_003'; // クエリ実行エラー
   export const DB_004 = 'DB_004'; // データベース過負荷

   // 🔵 Repository エラー（REPO_xxx）
   export const REPO_001 = 'REPO_001'; // Repository初期化エラー
   export const REPO_002 = 'REPO_002'; // Repository操作エラー
   export const REPO_003 = 'REPO_003'; // 実装未検出

   // 🔵 システムエラー（SYS_xxx）
   export const SYS_001 = 'SYS_001'; // 内部サーバーエラー
   export const SYS_002 = 'SYS_002'; // サービス利用不可
   export const SYS_003 = 'SYS_003'; // タイムアウト

   // 🔵 ネットワークエラー（NET_xxx）
   export const NET_001 = 'NET_001'; // レート制限超過
   export const NET_002 = 'NET_002'; // リクエストサイズ超過
   export const NET_003 = 'NET_003'; // リクエストタイムアウト

   // 🔵 エラーコードマップ（コードからメッセージへの変換）
   export const ERROR_MESSAGES: Record<string, string> = {
     // 認証・認可エラー
     [AUTH_001]: '認証エラー',
     [AUTH_002]: 'トークンの有効期限が切れています',
     [AUTH_003]: '権限がありません',

     // バリデーションエラー
     [VALID_001]: '入力データが不正です',
     [VALID_002]: 'データ型が不正です',
     [VALID_003]: '必須フィールドが不足しています',
     [VALID_004]: '値が許容範囲外です',

     // リソースエラー
     [RES_001]: '指定されたリソースが見つかりません',
     [RES_002]: '同名のリソースが既に存在します',
     [RES_003]: '他のリソースから参照されているため削除できません',
     [RES_004]: '削除済みのリソースです',

     // データベースエラー
     [DB_001]: 'データベース接続エラーが発生しました',
     [DB_002]: 'トランザクションエラーが発生しました',
     [DB_003]: 'クエリ実行エラーが発生しました',
     [DB_004]: 'データベースが過負荷状態です',

     // Repository エラー
     [REPO_001]: 'Repository初期化エラーが発生しました',
     [REPO_002]: 'Repository操作エラーが発生しました',
     [REPO_003]: '指定されたRepository実装が見つかりません',

     // システムエラー
     [SYS_001]: '内部サーバーエラーが発生しました',
     [SYS_002]: 'サービスが利用できません',
     [SYS_003]: 'リクエストがタイムアウトしました',

     // ネットワークエラー
     [NET_001]: 'API呼び出し回数が制限を超過しました',
     [NET_002]: 'リクエストサイズが大きすぎます',
     [NET_003]: 'リクエストがタイムアウトしました',
   };
   ```

2. `src/types/index.ts`にエラー型定義追加
   ```typescript
   export interface ApiError {
     code: string;
     message: string;
     details?: any;
   }

   export interface ValidationErrorDetail {
     field: string;
     message: string;
     code?: string;
   }
   ```

**完了条件**:
- [ ] エラーコード定数が定義される
- [ ] エラーメッセージマップが定義される
- [ ] エラー型定義が整っている
- [ ] 将来実装用のエラーコードも含まれる

---

### Day 7（8時間）: バリデーションミドルウェア実装

#### ☑ TASK-0009: バリデーションミドルウェア実装
- **推定工数**: 4時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-070, WRREQ-070-2
- **依存タスク**: TASK-0007, TASK-0008A

**実装詳細**:
1. `src/middlewares/validation.ts`作成
   - Zodスキーマでbody/queryをバリデーション
   - 🔵 ZodErrorを構造化レスポンスに変換（code: VALID_001, message, details）
   - バリデーション済みデータを`c.set('validated', validated)`で設定

2. バリデーションスキーマ例（`src/types/validation.ts`）
   - createCardSchemaなど、各エンティティのスキーマ定義

3. 使用例: `routes.post('/cards', validate(createCardSchema, 'body'), ...)`

**完了条件**:
- [ ] バリデーションミドルウェアが動作する
- [ ] 🔵 ZodエラーがVALID_001コード付きレスポンスに変換される
- [ ] バリデーションエラー時に400ステータスが返る
- [ ] bodyとqueryの両方に対応している

**テスト要件**:
- [ ] 正常なリクエストがバリデーションを通過する
- [ ] 不正なリクエストでバリデーションエラーが返る
- [ ] エラーレスポンスが正しい形式である（code, message, details）
- [ ] フィールド名とエラーメッセージが正しい

---

#### ☑ TASK-0010: 🔵 エラーハンドリングミドルウェア実装（体系的エラーコード対応）
- **推定工数**: 4時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-069, WRREQ-070-2
- **依存タスク**: TASK-0007, TASK-0008A

**実装詳細**:
1. `src/middlewares/errorHandler.ts`作成
   - HTTPExceptionを処理（err.statusとmessageを返す）
   - 🔵 Prismaエラーを体系的エラーコードに変換
     - P2002（ユニーク制約違反）→ 409 / RES_002
     - P2025（レコード未検出）→ 404 / RES_001
     - その他Prismaエラー → 500 / DB_003
   - デフォルトエラー: 500 / SYS_001
   - 全エラーをconsole.errorに出力

2. `src/index.ts`に適用: `app.onError(errorHandler)`

**完了条件**:
- [ ] エラーハンドラーが適用される
- [ ] HTTPExceptionが正しく処理される
- [ ] 🔵 Prismaエラーが体系的エラーコードに変換される
- [ ] 構造化されたエラーレスポンスが返る（code, message, details）
- [ ] 🔵 エラーコード定数（RES_001, RES_002, DB_003, SYS_001）が使用される

**テスト要件**:
- [ ] 500エラー時に正しいレスポンスが返る
- [ ] Prismaエラー（P2002, P2025）が正しく処理される
- [ ] 🔵 エラーレスポンスにエラーコードが含まれる
- [ ] エラーログがコンソールに出力される

---

### Day 8（8時間）: ロギングミドルウェアと共通レスポンス型

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

#### ☑ TASK-0012: 共通レスポンス型・ユーティリティ実装
- **推定工数**: 4時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-067, WRREQ-068, WRREQ-069
- **依存タスク**: TASK-0007, TASK-0008A

**実装詳細**:
1. `src/utils/response.ts`作成
   - successResponse: `{data, message}`形式のレスポンス
   - paginatedResponse: `{data: {items, total, page, limit, totalPages}}`形式
   - 🔵 errorResponse: `{error: {code, message, details}}`形式（エラーコード定数使用）
   - notFoundResponse: 404エラー専用ヘルパー（🔵 RES_001使用）

2. `src/utils/validation.ts`作成
   - paginationQuerySchema: page/limitのZodスキーマ
   - uuidSchema: UUID検証スキーマ
   - validateUUID: UUID検証ヘルパー関数

3. `src/types/index.ts`作成
   - ApiResponse<T>, ApiError, ValidationError, PaginatedResponse<T>のインターフェース定義

**完了条件**:
- [ ] 共通レスポンス関数が実装される
- [ ] ページネーションレスポンス関数が実装される
- [ ] 🔵 エラーレスポンス関数が実装される（エラーコード定数使用）
- [ ] 共通バリデーションスキーマが実装される
- [ ] TypeScript型定義が整っている

**テスト要件**:
- [ ] `successResponse`が正しいJSON形式を返す
- [ ] `paginatedResponse`が正しいページネーション情報を返す
- [ ] 🔵 `errorResponse`が正しいエラー形式を返す（code含む）
- [ ] UUID検証が正しく動作する

---

### Day 9（8時間）: Prismaソフトデリートとヘルスチェック

#### ☑ TASK-0013: Prismaソフトデリートミドルウェア実装
- **推定工数**: 4時間
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

#### ☑ TASK-0014: ヘルスチェックエンドポイント拡張
- **推定工数**: 4時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-067
- **依存タスク**: TASK-0007, TASK-0013

**実装詳細**:
1. `src/routes/health.ts`作成
   - `prisma.$queryRaw`でデータベース接続確認
   - 成功時: `{status: "ok", timestamp, database: "connected"}`
   - 🔵 失敗時: `{status: "error", timestamp, database: "disconnected", error: {code: DB_001, message}}`（503）

2. `src/routes/index.ts`に統合: `routes.route('/health', health)`

**完了条件**:
- [ ] `/api/health`でヘルスチェックできる
- [ ] データベース接続状態が確認できる
- [ ] 🔵 エラー時に503ステータス + DB_001コードが返る
- [ ] タイムスタンプが含まれる

**テスト要件**:
- [ ] データベース接続時に`status: "ok"`が返る
- [ ] データベース切断時に`status: "error"`が返る
- [ ] レスポンスに`timestamp`が含まれる
- [ ] 🔵 エラー時にDB_001コードが含まれる

---

### Day 10（8時間）: 🔵 Repository Pattern基盤構築

#### ☑ TASK-0015A: 🔵 Repository Pattern基盤構築（インターフェース + 依存性注入）
- **推定工数**: 8時間
- **タスクタイプ**: TDD
- **要件へのリンク**: 設計書 architecture.md（Repository Pattern）
- **依存タスク**: TASK-0005, TASK-0013

**実装詳細**:
1. **ディレクトリ構造作成**
   ```
   backend/src/
   ├── repositories/
   │   ├── interfaces/      # 🔵 Repository インターフェース定義
   │   ├── prisma/          # 🔵 Prisma実装（本番環境用）
   │   └── memory/          # 🔵 In-Memory実装（テスト用）
   ├── di/                  # 🔵 依存性注入コンテナ
   │   └── container.ts
   └── ...
   ```

2. **共通型定義**（`src/types/repository.ts`）
   ```typescript
   // ページネーションオプション
   export interface PaginationOptions {
     page: number;
     limit: number;
   }

   // ページネーション結果
   export interface PaginationResult<T> {
     items: T[];
     total: number;
     page: number;
     limit: number;
     totalPages: number;
   }
   ```

3. **サンプルRepositoryインターフェース作成**（`src/repositories/interfaces/ICardRepository.ts`）
   ```typescript
   import { Card, CreateCardRequest, UpdateCardRequest } from '../../types/card';
   import { PaginationOptions, PaginationResult } from '../../types/repository';

   /**
    * 🔵 Card Repository インターフェース
    * Prisma実装とIn-Memory実装の両方がこのインターフェースを実装する
    */
   export interface ICardRepository {
     // 作成
     create(data: CreateCardRequest): Promise<Card>;

     // 検索
     findById(id: string): Promise<Card | null>;
     findByName(name: string): Promise<Card | null>;
     findMany(
       options: PaginationOptions,
       filters?: { cardType?: string; search?: string }
     ): Promise<PaginationResult<Card>>;

     // 更新
     update(id: string, data: UpdateCardRequest): Promise<Card>;

     // 削除（ソフトデリート）
     delete(id: string): Promise<void>;

     // カウント
     count(filters?: { cardType?: string }): Promise<number>;
   }
   ```

4. **依存性注入コンテナ実装**（`src/di/container.ts`）
   ```typescript
   import { ICardRepository } from '../repositories/interfaces/ICardRepository';
   // 将来的に他のRepositoryもimport

   /**
    * 🔵 Repository コンテナインターフェース
    * 全てのRepositoryをまとめて管理
    */
   export interface IRepositoryContainer {
     cardRepository: ICardRepository;
     // 将来的に追加
     // customerRepository: ICustomerRepository;
     // alchemyStyleRepository: IAlchemyStyleRepository;
     // ...
   }

   /**
    * 🔵 Repository コンテナを作成
    * 環境変数REPOSITORY_TYPEに応じてPrisma実装またはIn-Memory実装を返す
    */
   export function createRepositoryContainer(): IRepositoryContainer {
     const repositoryType = process.env.REPOSITORY_TYPE || 'prisma';

     if (repositoryType === 'memory') {
       // 🔵 テスト環境: In-Memory実装
       // TODO: Phase 2でIn-Memory実装を追加
       throw new Error('In-Memory implementation not yet available');
     }

     // 🔵 本番環境: Prisma実装
     // TODO: Phase 2でPrisma実装を追加
     throw new Error('Prisma implementation not yet available');
   }
   ```

5. **環境変数追加**（`.env.development`）
   ```
   # 🔵 Repository設定
   REPOSITORY_TYPE=prisma
   ```

6. **src/index.ts にコンテナ初期化コード追加**
   ```typescript
   import { createRepositoryContainer } from './di/container';

   const app = new Hono();

   // 🔵 Repository コンテナの初期化
   const repositoryContainer = createRepositoryContainer();

   // 🔵 Repository コンテナをコンテキストに追加
   app.use('*', async (c, next) => {
     c.set('repositories', repositoryContainer);
     await next();
   });

   // CORS, routes, etc.
   ```

**完了条件**:
- [ ] 🔵 `src/repositories/interfaces/`ディレクトリが作成される
- [ ] 🔵 `src/repositories/prisma/`ディレクトリが作成される
- [ ] 🔵 `src/repositories/memory/`ディレクトリが作成される
- [ ] 🔵 `src/di/`ディレクトリが作成される
- [ ] 🔵 ICardRepositoryインターフェースが定義される
- [ ] 🔵 createRepositoryContainer関数が実装される
- [ ] 🔵 環境変数REPOSITORY_TYPEが追加される
- [ ] 🔵 Repository コンテナがHonoコンテキストに追加される
- [ ] TypeScriptのコンパイルエラーがない

**テスト要件**:
- [ ] 🔵 環境変数REPOSITORY_TYPE=prismaでサーバーが起動する
- [ ] 🔵 環境変数REPOSITORY_TYPE=memoryでサーバーが起動する（Phase 2で実装後）
- [ ] 🔵 Honoコンテキストから`c.get('repositories')`でコンテナが取得できる

---

### Day 11（8時間）: Phase 1統合テスト・環境変数管理

#### ☑ TASK-0015: 🔵 Phase 1統合テスト・環境変数管理（REPOSITORY_TYPE追加）
- **推定工数**: 8時間
- **タスクタイプ**: DIRECT
- **要件へのリンク**: WRREQ-007, WRNFR-012, WRNFR-013、設計書 environment-variables.md
- **依存タスク**: TASK-0001〜0014, TASK-0015A

**実装詳細**:
1. 環境変数ファイル作成: `.env.development`, `.env.test`, `.env.example`

2. 🔵 `.env.example`に必須項目を記載（設計書に基づく）
   ```
   # データベース
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/atelier_resource_mgmt

   # 🔵 Repository設定
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

   # Prisma（オプション）
   PRISMA_QUERY_LOG=false
   ```

3. 🔵 `.env.test`作成（In-Memory Repository使用）
   ```
   # 🔵 Repository設定（In-Memory使用）
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

4. 統合テスト実施: 全プロジェクトの起動確認、API疎通確認、CORS動作確認、ミドルウェア動作確認、🔵 Repository コンテナ動作確認

5. README.md作成: セットアップ手順、起動コマンド、動作確認URL、🔵 環境変数REPOSITORY_TYPEの説明を記載

**完了条件**:
- [ ] 環境変数ファイルが整備されている
- [ ] 🔵 `.env.example`にREPOSITORY_TYPEが含まれる
- [ ] 🔵 `.env.test`でREPOSITORY_TYPE=memoryが設定される
- [ ] 統合テストが全て通る
- [ ] README.mdにセットアップ手順が記載されている
- [ ] 🔵 README.mdにREPOSITORY_TYPEの説明が記載されている
- [ ] 新規開発者が環境構築できる

---

## Phase 1-b 完了条件

### 必須条件
- [ ] CORSミドルウェアが動作する（🔵 詳細設定：exposeHeaders, maxAge）
- [ ] バリデーションミドルウェアが動作する（🔵 VALID_001エラーコード対応）
- [ ] エラーハンドリングが動作する（🔵 体系的エラーコード対応）
- [ ] ロギングが動作する
- [ ] Prismaソフトデリートが動作する
- [ ] `/api/health`エンドポイントが正常に動作する（データベース接続確認付き、🔵 DB_001エラーコード対応）
- [ ] フロントエンドからバックエンドAPIにアクセスできる
- [ ] 🔵 エラーコード定数が定義されている
- [ ] 🔵 Repository Pattern基盤が構築されている
- [ ] 🔵 依存性注入コンテナが動作する
- [ ] 🔵 環境変数REPOSITORY_TYPEが設定されている

### 品質基準
- [ ] ESLint・Prettierでコード整形されている
- [ ] TypeScriptのコンパイルエラーがない
- [ ] 全テストが通る
- [ ] README.mdのセットアップ手順が正しい（🔵 REPOSITORY_TYPE説明含む）

---

## Phase 1全体の完了条件

### 必須条件（Phase 1-a + 1-b）
- [ ] フロントエンド・バックエンドプロジェクトが起動する
- [ ] PostgreSQLデータベースが起動する
- [ ] Prismaマイグレーションが適用されている
- [ ] `/api/health`エンドポイントが正常に動作する
- [ ] CORSミドルウェアが動作する（🔵 詳細設定）
- [ ] バリデーションミドルウェアが動作する
- [ ] エラーハンドリングが動作する（🔵 体系的エラーコード）
- [ ] ロギングが動作する
- [ ] Prismaソフトデリートが動作する
- [ ] 🔵 Repository Pattern基盤が構築されている
- [ ] 🔵 依存性注入コンテナが動作する

### マイルストーン
- [x] **M1: MVP基盤完成** - Phase 1完了時点で達成

---

## 変更履歴

| 日付 | バージョン | 変更内容 |
|------|----------|---------|
| 2025-11-09 | 1.0 | Phase 1から分割。Day 6-10の8タスク、40時間 |
| 2025-11-10 | 2.0 | 🔵 設計書更新に伴うタスク追加。Repository Pattern基盤、エラーコード体系化、CORS詳細設定、REPOSITORY_TYPE環境変数。Day 6-11の10タスク、48時間 |
