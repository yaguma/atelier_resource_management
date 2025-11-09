# Phase 4-B: 錬金スタイル管理

## フェーズ概要

### 要件名
resource-management-webapp

### 期間・目標
- **期間**: 3営業日（Week 7、Day 34-36）
- **総工数**: 24時間
- **タスク数**: 8タスク
- **目標**: 錬金スタイル管理機能（API + UI）を実装する

### 成果物
- 錬金スタイル管理API（GET一覧・詳細、POST、PUT、DELETE）
- 錬金スタイル管理画面（一覧・作成・編集・詳細・削除）
- N:Mリレーション UI（初期デッキカード選択）

---

## 週次計画

### Week 7（Day 34-36）: 錬金スタイル管理実装
**目標**: 錬金スタイル管理API・画面を実装する

**成果物**:
- 錬金スタイル管理API（GET、POST、PUT、DELETE）
- 錬金スタイル一覧画面（検索、フィルタリング）
- 錬金スタイル作成画面（フォーム、初期デッキ選択、バリデーション）
- 錬金スタイル編集画面（既存データ取得、初期デッキ更新）
- 錬金スタイル詳細画面（読み取り専用表示、初期デッキ表示）
- 錬金スタイル削除機能（モーダル確認、削除実行）

---

## 日次タスク

### Day 34（8時間）: 錬金スタイルAPI実装（一覧・詳細・作成）

#### ☑ TASK-0048: 錬金スタイル一覧・詳細取得API実装
- **推定工数**: 4時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-029, WRREQ-030, WRREQ-031
- **依存タスク**: TASK-0005, TASK-0007, TASK-0009, TASK-0012, TASK-0013

**実装詳細**:
1. `src/routes/alchemyStyles.ts`作成
   - Honoルーター設定
   - GET /（一覧取得）、GET /:id（詳細取得）エンドポイント定義
   - UUID検証ミドルウェア適用

2. `src/controllers/alchemyStyleController.ts`作成
   - `listAlchemyStyles`: 錬金スタイル一覧取得（削除済み除外、初期デッキカードのリレーション含む、作成日降順）
   - `getAlchemyStyleById`: 錬金スタイル詳細取得（削除済み除外、初期デッキカード詳細を含む）
   - Prismaで`initialDeckCards`リレーションをincludeして取得
   - 存在しないIDの場合は404エラー
   - エラーハンドリング（データベースエラー時は500エラー）

3. `src/types/alchemyStyle.ts`作成
   - Zodスキーマ定義（`createAlchemyStyleSchema`、`updateAlchemyStyleSchema`）
   - バリデーションルール: 錬金スタイル名（1〜100文字）、説明（1〜1000文字）、特徴（1〜500文字）、初期デッキカードID配列（最低1枚必須）
   - TypeScript型定義（`AlchemyStyle`、`CreateAlchemyStyleInput`、`UpdateAlchemyStyleInput`）

**完了条件**: GET /api/alchemy-styles、GET /api/alchemy-styles/:id が動作すること。初期デッキカードのリレーションデータが含まれること。存在しないIDで404エラーが返ること。

**テスト要件**: 一覧取得で全錬金スタイルが取得できること、詳細取得で初期デッキカードが含まれること、存在しないUUIDで404エラーが返ることをテストする。

---

#### ☑ TASK-0049: 錬金スタイル作成API実装
- **推定工数**: 4時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-029, WRREQ-030, WRREQ-031
- **依存タスク**: TASK-0048

**実装詳細**:
1. `src/controllers/alchemyStyleController.ts`に追加
   - `createAlchemyStyle`: 錬金スタイル作成
   - リクエストボディをZodスキーマでバリデーション
   - `initialDeckCardIds`に指定されたカードIDの存在確認（Prismaでカウント取得）
   - 存在しないカードIDが含まれる場合は400エラー
   - Prismaの`create`で錬金スタイル作成、`initialDeckCards`は`connect`で関連付け
   - 作成後、初期デッキカード情報を含めて返却
   - 201ステータスコードで返却
   - バリデーションエラー時は400エラー、データベースエラー時は500エラー

2. ルート追加
   - POST /（作成）エンドポイント追加

**完了条件**: POST /api/alchemy-styles が動作すること。正常なデータで錬金スタイル作成できること。initialDeckCardIds指定でN:M関連付けできること。バリデーションエラー時に400エラーが返ること。存在しないinitialDeckCardIdで400エラーが返ること。

**テスト要件**: 必須フィールドで錬金スタイル作成できること、initialDeckCardIds指定で初期デッキ関連付けできること、存在しないinitialDeckCardIdで400エラーが返ること、作成後にGET /api/alchemy-styles/:idでinitialDeckCardsが取得できることをテストする。

---

### Day 35（8時間）: 錬金スタイルAPI更新・削除 & 一覧画面

#### ☑ TASK-0050: 錬金スタイル更新API実装
- **推定工数**: 3時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-029, WRREQ-030, WRREQ-031
- **依存タスク**: TASK-0049

**実装詳細**:
1. `src/controllers/alchemyStyleController.ts`に追加
   - `updateAlchemyStyle`: 錬金スタイル更新
   - リクエストボディをZodスキーマでバリデーション（部分更新対応）
   - 既存錬金スタイルの存在確認（削除済み除外）
   - 存在しない場合は404エラー
   - `initialDeckCardIds`が指定されている場合、カードIDの存在確認
   - 存在しないカードIDが含まれる場合は400エラー
   - Prismaの`update`で錬金スタイル更新、`initialDeckCards`は`set`で関連を置換
   - 更新後、初期デッキカード情報を含めて返却
   - バリデーションエラー時は400エラー、データベースエラー時は500エラー

2. ルート追加
   - PUT /:id（更新）エンドポイント追加、UUID検証ミドルウェア適用

**完了条件**: PUT /api/alchemy-styles/:id が動作すること。部分更新（一部フィールドのみ）が動作すること。initialDeckCardIds更新が動作すること。存在しないIDで404エラーが返ること。

**テスト要件**: 1フィールドのみ更新できること、initialDeckCardIds更新で関連が正しく置換されること、存在しないIDで404エラーが返ることをテストする。

---

#### ☑ TASK-0051: 錬金スタイル削除API実装
- **推定工数**: 2時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-031
- **依存タスク**: TASK-0050

**実装詳細**:
1. `src/controllers/alchemyStyleController.ts`に追加
   - `deleteAlchemyStyle`: 錬金スタイル削除
   - 既存錬金スタイルの存在確認（削除済み除外）
   - 存在しない場合は404エラー
   - Prismaの`update`でソフトデリート（`deletedAt`に現在日時を設定）
   - 204ステータスコード（No Content）で返却
   - データベースエラー時は500エラー

2. ルート追加
   - DELETE /:id（削除）エンドポイント追加、UUID検証ミドルウェア適用

3. `src/routes/index.ts`にルート統合
   - `/api/alchemy-styles`パスに錬金スタイルルーターを登録

**完了条件**: DELETE /api/alchemy-styles/:id が動作すること。削除成功時に204ステータスが返ること。ソフトデリート（deletedAt設定）が動作すること。存在しないIDで404エラーが返ること。

**テスト要件**: 錬金スタイルを削除できること、削除後にGET /api/alchemy-stylesで取得できないこと、削除後にGET /api/alchemy-styles/:idで404エラーが返ることをテストする。

---

#### ☑ TASK-0052: 錬金スタイル一覧画面実装
- **推定工数**: 3時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-029, WRREQ-030, WRREQ-031
- **依存タスク**: TASK-0048, TASK-0049, TASK-0050, TASK-0051

**実装詳細**:
1. `src/pages/alchemy-styles/AlchemyStyleListPage.tsx`作成
   - TanStack Queryの`useAlchemyStyles`フックを使用してデータ取得
   - テーブル形式で錬金スタイル一覧を表示（名前、特徴、初期デッキ枚数、操作ボタン）
   - 新規作成ボタン、詳細・編集リンクを配置
   - データ取得中はローディング表示
   - エラー発生時はエラーメッセージ表示

2. `src/hooks/useAlchemyStyles.ts`作成
   - TanStack Queryの`useQuery`、`useMutation`を使用
   - `useAlchemyStyles`: 一覧取得フック
   - `useAlchemyStyle`: 詳細取得フック
   - `useCreateAlchemyStyle`: 作成ミューテーション
   - `useUpdateAlchemyStyle`: 更新ミューテーション
   - `useDeleteAlchemyStyle`: 削除ミューテーション
   - 各ミューテーション成功時にクエリキャッシュを無効化

3. `src/api/alchemyStyles.ts`作成
   - `getAlchemyStyles`: GET /api/alchemy-styles
   - `getAlchemyStyle`: GET /api/alchemy-styles/:id
   - `createAlchemyStyle`: POST /api/alchemy-styles
   - `updateAlchemyStyle`: PUT /api/alchemy-styles/:id
   - `deleteAlchemyStyle`: DELETE /api/alchemy-styles/:id

4. `src/router/index.tsx`にルート追加
   - `/alchemy-styles`（一覧）、`/alchemy-styles/new`（作成）、`/alchemy-styles/:id`（詳細）、`/alchemy-styles/:id/edit`（編集）ルートを追加
   - 各ルートに対応するコンポーネントをインポート

**完了条件**: 錬金スタイル一覧が表示されること。新規作成ボタンが動作すること。詳細・編集リンクが動作すること。

**テスト要件**: データ取得時に錬金スタイルが表示されること、初期デッキカード数が正しく表示されることをテストする。

---

### Day 36（8時間）: 錬金スタイル作成・編集・詳細・削除画面

#### ☑ TASK-0053: 錬金スタイル作成画面実装
- **推定工数**: 3時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-029, WRREQ-030, WRREQ-031
- **依存タスク**: TASK-0052

**実装詳細**:
1. `src/pages/alchemy-styles/AlchemyStyleCreatePage.tsx`作成
   - React Hook Form + Zodバリデーションを使用したフォーム実装
   - `useCreateAlchemyStyle`ミューテーションフックを使用
   - `useCards`フックで初期デッキカード候補一覧を取得
   - 基本情報入力フィールド: 錬金スタイル名、説明、特徴、アイコンURL（オプション）
   - 初期デッキカード選択UI: チェックボックスリストで複数カード選択可能（N:Mリレーション対応、最低1枚必須）
   - Toast通知機能を統合（成功・エラー通知）
   - 作成成功後に一覧画面へ遷移
   - キャンセルボタンで一覧画面へ戻る

**完了条件**: 錬金スタイル作成フォームが表示され、バリデーションが動作すること。初期デッキカード選択UI（チェックボックス）が動作し、錬金スタイル作成が成功すること。Toast通知が表示され、作成後に一覧画面に遷移すること。

**テスト要件**: フォーム送信でAPIが呼ばれること、バリデーションエラーが表示されること、初期デッキカード選択でN:M関連付けができること、作成成功でToast通知が表示されることをテストする。

---

#### ☑ TASK-0054: 錬金スタイル編集画面実装
- **推定工数**: 2時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-029, WRREQ-030, WRREQ-031
- **依存タスク**: TASK-0053

**実装詳細**:
1. `src/pages/alchemy-styles/AlchemyStyleEditPage.tsx`作成
   - AlchemyStyleCreatePageと類似の構造
   - `useParams`でURLからIDを取得
   - `useAlchemyStyle`フックで既存錬金スタイルデータを取得
   - `useEffect`でフォームに既存データを設定（`reset`メソッド使用）
   - 初期デッキカード選択状態を既存データから復元
   - `useUpdateAlchemyStyle`ミューテーションフックで更新
   - Toast通知機能を統合
   - 更新成功後に一覧画面へ遷移
   - データ取得中はローディング表示

**完了条件**: 既存錬金スタイルデータが取得され、フォームに既存データが表示されること。既存の初期デッキカード選択状態が復元され、錬金スタイル更新が成功すること。Toast通知が表示され、更新後に一覧画面に遷移すること。

**テスト要件**: 既存データでフォームが初期化されること、フォーム送信で更新APIが呼ばれること、初期デッキカード選択の変更が反映されること、更新成功でToast通知が表示されることをテストする。

---

#### ☑ TASK-0055: 錬金スタイル詳細・削除機能実装
- **推定工数**: 3時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-029, WRREQ-030, WRREQ-031
- **依存タスク**: TASK-0054

**実装詳細**:
1. `src/pages/alchemy-styles/AlchemyStyleDetailPage.tsx`作成
   - `useParams`でURLからIDを取得
   - `useAlchemyStyle`フックで錬金スタイル詳細データを取得
   - 読み取り専用の詳細情報表示: 錬金スタイル名、説明、特徴、アイコンURL
   - 初期デッキカード一覧をタグ形式で表示（各カードからカード詳細へのリンク付き）
   - 初期デッキカードがない場合は「初期デッキカードなし」と表示
   - 編集ボタン（編集画面へ遷移）
   - 削除ボタン（危険色のボタン）
   - 一覧に戻るボタン
   - 削除確認モーダル実装
   - モーダル内容: 「本当にこの錬金スタイルを削除しますか？この操作は取り消せません。」
   - モーダルフッター: キャンセルボタン、削除ボタン
   - `useState`でモーダル開閉状態を管理
   - `useDeleteAlchemyStyle`ミューテーションフックで削除実行
   - 削除実行中はボタンにローディング表示
   - Toast通知機能を統合
   - 削除成功後に一覧画面へ遷移
   - データ取得中はローディング表示
   - エラー発生時はエラーメッセージ表示
   - 錬金スタイルが見つからない場合は「錬金スタイルが見つかりません」と表示

**完了条件**: 錬金スタイル詳細が表示され、全フィールドが正しく表示されること。初期デッキカード一覧が表示され、初期デッキカードからカード詳細へのリンクが動作すること。編集ボタン、削除ボタン、一覧に戻るボタンが動作すること。削除確認モーダルが表示され、錬金スタイル削除が成功すること。

**テスト要件**: データ取得時に錬金スタイル詳細が表示されること、存在しないIDでエラーメッセージが表示されること、初期デッキカードが正しく表示されること、削除ボタンクリックでモーダルが表示されること、削除成功でToast通知が表示されることをテストする。

---

## Phase 4-B 完了条件

### 必須条件
- 錬金スタイル管理API（GET一覧・詳細、POST、PUT、DELETE）が動作すること
- 錬金スタイル管理画面（一覧・作成・編集・詳細・削除）が動作すること
- 錬金スタイル作成・編集時にN:M関連（初期デッキカード）が正しく動作すること
- フォームバリデーション（Zod）が正しく動作すること
- Toast通知が正しく表示されること

### 品質基準
- ESLint・Prettierでコード整形されていること
- TypeScriptのコンパイルエラーがないこと
- 全テストが通ること
- TanStack Query Devtoolsで状態確認できること
- N:Mリレーション（初期デッキカード）が正しく動作すること

### マイルストーン
- [x] **M4: 顧客・錬金スタイル管理完成** - Phase 4-B完了時点で達成

---

## 変更履歴

| 日付 | バージョン | 変更内容 |
|------|----------|---------|
| 2025-11-09 | 1.0 | Phase 4から分割。8タスク、24時間 |
