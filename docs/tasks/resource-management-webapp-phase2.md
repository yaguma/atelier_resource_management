# Phase 2: カード・顧客管理API実装

## フェーズ概要

### 要件名
resource-management-webapp

### 期間・目標
- **期間**: 8営業日（Week 3）
- **総工数**: 64時間
- **タスク数**: 12タスク
- **目標**: カード管理APIと顧客管理APIの実装

### 成果物
- カード管理API（GET一覧・詳細、POST、PUT、DELETE）
- 顧客管理API（GET一覧・詳細、POST、PUT、DELETE）
- N:Mリレーション処理（顧客報酬カード）
- 依存関係チェック機能
- APIバリデーションスキーマ

---

## 週次計画

### Week 3（Day 11-15）: カード管理API実装
**目標**: カード管理APIの全CRUDエンドポイントを実装する

**成果物**:
- カード一覧・詳細取得エンドポイント（GET /api/cards, GET /api/cards/:id）
- カード作成エンドポイント（POST /api/cards）
- カード更新エンドポイント（PUT /api/cards/:id）
- カード削除エンドポイント（DELETE /api/cards/:id）
- 依存関係チェック機能

### Week 3（Day 16-18）: 顧客管理API実装
**目標**: 顧客管理APIの全CRUDエンドポイントを実装する

**成果物**:
- 顧客一覧・詳細取得エンドポイント（GET /api/customers, GET /api/customers/:id）
- 顧客作成エンドポイント（POST /api/customers）
- 顧客更新エンドポイント（PUT /api/customers/:id）
- 顧客削除エンドポイント（DELETE /api/customers/:id）
- N:Mリレーション処理（報酬カード関連）

---

## 日次タスク

### Day 11（8時間）: カード一覧取得API実装

#### ☑ TASK-0016: カード一覧取得API実装（GET /api/cards）
- **推定工数**: 8時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-012, WRREQ-013, WRREQ-016
- **依存タスク**: TASK-0005, TASK-0007, TASK-0009, TASK-0012, TASK-0013

**実装詳細**:
1. `src/routes/cards.ts`、`src/controllers/cardController.ts`、`src/types/card.ts`作成
2. GET /api/cards エンドポイント実装（ページネーション: page, limit / フィルタリング: cardType, search）
3. Prisma findManyでカード一覧取得（ソフトデリート対応）
4. Zodスキーマ定義（CardType, CardRarity, listCardsQuery）
5. `/api/cards`パスでルート統合

**完了条件**:
- [ ] GET /api/cards が動作する
- [ ] ページネーション（page, limit）が動作する
- [ ] フィルタリング（cardType, search）が動作する
- [ ] レスポンスに total, page, limit, totalPages が含まれる
- [ ] 削除済みカード（deletedAt != NULL）が除外される

**テスト要件**: パラメータなしで全カード取得、cardType/searchフィルタリング、ページネーション、削除済みカード除外を確認

---

### Day 12（8時間）: カード詳細取得API実装

#### ☑ TASK-0017: カード詳細取得API実装（GET /api/cards/:id）
- **推定工数**: 8時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-012, WRREQ-013, WRREQ-015, WRREQ-016
- **依存タスク**: TASK-0016

**実装詳細**:
1. GET /api/cards/:id エンドポイント実装（UUID検証、パスパラメータからID取得）
2. `src/controllers/cardController.ts`にgetCardById関数追加（Prisma findUnique、リレーションデータ含む、404エラーハンドリング）
3. `src/middlewares/validateUUID.ts`作成（UUID形式チェック、不正時400エラー）

**完了条件**:
- [ ] GET /api/cards/:id が動作する
- [ ] 存在するIDで詳細データ取得できる
- [ ] 存在しないIDで404エラーが返る
- [ ] 不正なUUID形式で400エラーが返る
- [ ] リレーションデータ（evolutionFrom, evolutionTo等）が含まれる

**テスト要件**: 正常UUID詳細取得、不正/存在しないUUIDで400/404エラー、削除済みカード除外、リレーションデータ含有を確認

---

### Day 13（8時間）: カード作成API実装

#### ☑ TASK-0018: カード作成API実装（POST /api/cards）
- **推定工数**: 8時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-012, WRREQ-013, WRREQ-014, WRREQ-017, WRREQ-020
- **依存タスク**: TASK-0016, TASK-0017

**実装詳細**:
1. POST /api/cards エンドポイント実装（リクエストボディ、バリデーションミドルウェア適用）
2. `src/types/card.ts`にcreateCardSchema追加（name, description, cardType, attribute, stabilityValue, energyCost, imageUrl, rarity, evolutionFromId等のZodスキーマ定義）
3. `src/controllers/cardController.ts`にcreateCard関数追加（Prisma create、ユニーク制約違反で409エラー、evolutionFromId存在チェック）

**完了条件**:
- [ ] POST /api/cards が動作する
- [ ] 正常なデータでカード作成できる
- [ ] バリデーションエラー時に400エラーが返る
- [ ] 同名カード存在時に409エラーが返る
- [ ] 201 Createdステータスが返る

**テスト要件**: 必須/全フィールド作成、同名カード409エラー、energyCost/stabilityValue範囲外バリデーション、存在しないevolutionFromIdで400エラーを確認

---

### Day 14（8時間）: カード更新API実装

#### ☑ TASK-0019: カード更新API実装（PUT /api/cards/:id）
- **推定工数**: 8時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-012, WRREQ-013, WRREQ-017
- **依存タスク**: TASK-0018

**実装詳細**:
1. PUT /api/cards/:id エンドポイント実装（部分更新対応）
2. `src/types/card.ts`にupdateCardSchema追加（createCardSchema.partial()で部分更新可能に）
3. `src/controllers/cardController.ts`にupdateCard関数追加（Prisma update、404エラー、ユニーク制約違反で409エラー）

**完了条件**:
- [ ] PUT /api/cards/:id が動作する
- [ ] 部分更新（一部フィールドのみ）が動作する
- [ ] 全フィールド更新が動作する
- [ ] 存在しないIDで404エラーが返る
- [ ] 同名カードに変更時に409エラーが返る

**テスト要件**: 1フィールド/複数/全フィールド部分更新、存在しないIDで404、同名変更時409、バリデーションエラーを確認

---

### Day 15（8時間）: カード削除API実装と依存関係チェック

#### ☑ TASK-0020: 依存関係チェック機能実装
- **推定工数**: 4時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-019
- **依存タスク**: TASK-0013

**実装詳細**:
1. `src/utils/dependencyCheck.ts`作成
   - checkCardDependencies関数実装
   - 以下の依存関係をチェック:
     - 他カードの進化元（evolutionFrom）として使用されているか
     - 錬金スタイルの初期デッキ（initialDeckStyles）で使用されているか
     - 顧客の報酬カード（rewardCards）として使用されているか
     - アンロック可能コンテンツ（unlockableContent）で使用されているか

2. 依存関係レスポンス型定義
   - DependencyError型定義
   - field, message含む

**完了条件**:
- [ ] checkCardDependencies関数が動作する
- [ ] 進化元として使用中の場合、依存関係を返す
- [ ] 初期デッキで使用中の場合、依存関係を返す
- [ ] 報酬カードで使用中の場合、依存関係を返す
- [ ] 依存関係がない場合、空配列を返す

**テスト要件**: 進化元/初期デッキ/複数依存関係の検出、依存なし時の空配列を確認

---

#### ☑ TASK-0021: カード削除API実装（DELETE /api/cards/:id）
- **推定工数**: 4時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-017, WRREQ-019
- **依存タスク**: TASK-0020

**実装詳細**:
1. DELETE /api/cards/:id エンドポイント実装
   - パスパラメータからID取得
   - 依存関係チェック実行

2. `src/controllers/cardController.ts`に追加
   - deleteCard関数実装
   - checkCardDependencies呼び出し
   - 依存関係がある場合、409エラー（DEPENDENCY_ERROR）
   - 依存関係がない場合、Prisma deleteでソフトデリート実行
   - 204 No Contentステータス返却

**完了条件**:
- [ ] DELETE /api/cards/:id が動作する
- [ ] 依存関係がない場合、削除成功（204）
- [ ] 依存関係がある場合、409エラーが返る
- [ ] エラーレスポンスに依存関係詳細が含まれる
- [ ] ソフトデリート（deletedAt設定）が動作する

**テスト要件**: 依存なしカード削除成功、削除後一覧/詳細で非表示、進化元/初期デッキ使用中で409エラーを確認

---

### Day 16（8時間）: 顧客一覧取得API実装

#### ☑ TASK-0022: 顧客一覧取得API実装（GET /api/customers）
- **推定工数**: 8時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-021, WRREQ-022, WRREQ-025
- **依存タスク**: TASK-0005, TASK-0007, TASK-0012

**実装詳細**:
1. `src/routes/customers.ts`作成
   - GET /api/customers エンドポイント実装
   - ページネーション対応（page, limit）
   - フィルタリング対応（difficulty, search）

2. `src/controllers/customerController.ts`作成
   - listCustomers関数実装
   - Prisma findManyで顧客一覧取得
   - ソフトデリート対応（deletedAt IS NULL）

3. `src/types/customer.ts`作成
   - listCustomersQueryスキーマ定義（Zod）
   - difficultyフィルタ（1〜5）
   - searchフィルタ（名前部分一致）

4. ルート統合
   - `src/routes/index.ts`に顧客ルート追加
   - `/api/customers`パスでマウント

**完了条件**:
- [ ] GET /api/customers が動作する
- [ ] ページネーション（page, limit）が動作する
- [ ] フィルタリング（difficulty, search）が動作する
- [ ] レスポンスに total, page, limit, totalPages が含まれる
- [ ] 削除済み顧客（deletedAt != NULL）が除外される

**テスト要件**: パラメータなしで全顧客取得、difficulty/searchフィルタリング、ページネーション、削除済み顧客除外を確認

---

### Day 17（16時間）: 顧客詳細取得API・更新API実装

#### ☑ TASK-0023: 顧客詳細取得API実装（GET /api/customers/:id）
- **推定工数**: 8時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-021, WRREQ-022, WRREQ-023, WRREQ-024, WRREQ-025
- **依存タスク**: TASK-0022

**実装詳細**:
1. GET /api/customers/:id エンドポイント実装
   - パスパラメータからID取得
   - UUID検証ミドルウェア適用

2. `src/controllers/customerController.ts`に追加
   - getCustomerById関数実装
   - Prisma findUniqueで顧客取得
   - リレーションデータ含める（rewardCards）
   - 404エラーハンドリング

3. レスポンス型定義
   - CustomerDetailResponse型定義
   - rewardCards配列含む（id, name）

**完了条件**:
- [ ] GET /api/customers/:id が動作する
- [ ] 存在するIDで詳細データ取得できる
- [ ] 存在しないIDで404エラーが返る
- [ ] 不正なUUID形式で400エラーが返る
- [ ] リレーションデータ（rewardCards）が含まれる

**テスト要件**: 正常UUID詳細取得、不正/存在しないUUIDで400/404エラー、削除済み顧客除外、rewardCards配列含有を確認

---

#### ☑ TASK-0025: 顧客更新API実装（PUT /api/customers/:id）
- **推定工数**: 8時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-021, WRREQ-022, WRREQ-024, WRREQ-026
- **依存タスク**: TASK-0024

**実装詳細**:
1. PUT /api/customers/:id エンドポイント実装
   - パスパラメータからID取得
   - リクエストボディ受け取り
   - 部分更新対応（Partial<CustomerSchema>）

2. `src/types/customer.ts`に追加
   - updateCustomerSchemaスキーマ定義（Zod）
   - createCustomerSchemaをpartial()で部分更新可能に

3. `src/controllers/customerController.ts`に追加
   - updateCustomer関数実装
   - N:Mリレーション更新処理（rewardCardIds）
     - 既存の関連を全て削除（disconnect）
     - 新しい関連を追加（connect）
   - Prisma update + set パターン使用
   - 存在しないIDで404エラー

**完了条件**:
- [ ] PUT /api/customers/:id が動作する
- [ ] 部分更新（一部フィールドのみ）が動作する
- [ ] rewardCardIds更新が動作する
- [ ] 存在しないIDで404エラーが返る
- [ ] 存在しないrewardCardIdで400エラーが返る

**テスト要件**: 1フィールド更新、rewardCardIds置換/空配列で全削除、存在しないIDで404/400エラーを確認

---

### Day 18（16時間）: 顧客作成API・削除API実装と統合テスト

#### ☑ TASK-0024: 顧客作成API実装（POST /api/customers）
- **推定工数**: 8時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-021, WRREQ-022, WRREQ-023, WRREQ-024, WRREQ-026
- **依存タスク**: TASK-0022, TASK-0023

**実装詳細**:
1. POST /api/customers エンドポイント実装
   - リクエストボディ受け取り
   - バリデーションミドルウェア適用

2. `src/types/customer.ts`に追加
   - createCustomerSchemaスキーマ定義（Zod）
     - name: string（必須、1〜100文字）
     - description: string（必須、1〜1000文字）
     - customerType: string（必須、最大50文字）
     - difficulty: number（必須、1〜5）
     - requiredAttribute: object（必須、JSON形式）
     - qualityCondition: number（必須、0〜100）
     - stabilityCondition: number（必須、0〜100）
     - rewardFame: number（必須、0〜1000）
     - rewardKnowledge: number（必須、0〜1000）
     - portraitUrl: string（任意、最大500文字、URL形式）
     - rewardCardIds: array（任意、UUIDの配列）

3. `src/controllers/customerController.ts`に追加
   - createCustomer関数実装
   - N:Mリレーション処理（rewardCardIds）
   - Prisma create + connect パターン使用
   - rewardCardIds存在チェック（全カードIDが有効か）

**完了条件**:
- [ ] POST /api/customers が動作する
- [ ] 正常なデータで顧客作成できる
- [ ] rewardCardIds指定でN:M関連付けできる
- [ ] バリデーションエラー時に400エラーが返る
- [ ] 存在しないrewardCardIdで400エラーが返る

**テスト要件**: 必須フィールド作成、rewardCardIds関連付け、difficulty範囲外バリデーション、存在しないIDで400エラー、作成後rewardCards取得を確認

---

#### ☑ TASK-0026: 顧客削除API実装（DELETE /api/customers/:id）
- **推定工数**: 4時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-026
- **依存タスク**: TASK-0025

**実装詳細**:
1. DELETE /api/customers/:id エンドポイント実装
   - パスパラメータからID取得
   - 依存関係チェック不要（顧客は他リソースから参照されない）

2. `src/controllers/customerController.ts`に追加
   - deleteCustomer関数実装
   - Prisma deleteでソフトデリート実行
   - N:M関連（rewardCards）は自動削除（中間テーブル）
   - 204 No Contentステータス返却

**完了条件**:
- [ ] DELETE /api/customers/:id が動作する
- [ ] 削除成功時に204ステータスが返る
- [ ] ソフトデリート（deletedAt設定）が動作する
- [ ] 存在しないIDで404エラーが返る

**テスト要件**: 顧客削除成功、削除後一覧/詳細で非表示、N:M関連も削除を確認

---

#### ☑ TASK-0027: Phase 2統合テスト・ドキュメント整備
- **推定工数**: 4時間
- **タスクタイプ**: DIRECT
- **要件へのリンク**: 全API要件
- **依存タスク**: TASK-0016〜0026

**実装詳細**:
1. APIエンドポイント統合テスト実施（Postman/Thunder Client）
   - カード管理フロー: 一覧→作成→詳細→更新→削除（依存チェック含む）
   - 顧客管理フロー: 一覧→作成（N:M関連）→詳細→更新（関連変更）→削除

2. データ確認（Prisma Studio）
   - カード/顧客テーブル、中間テーブル、deletedAtフィールド

3. API仕様書確認（`docs/design/resource-management-webapp/api-endpoints.md`）

4. README.md更新（Phase 2完了内容、APIエンドポイント一覧）

**完了条件**:
- [ ] 全APIエンドポイントが正常に動作する
- [ ] テストシナリオが全て通る
- [ ] Prisma Studioでデータが正しく保存される
- [ ] ソフトデリートが正しく動作する
- [ ] N:Mリレーション（rewardCards）が正しく動作する
- [ ] README.mdが更新されている

---

## Phase 2 完了条件

### 必須条件
- [ ] カード管理API（GET一覧・詳細、POST、PUT、DELETE）が動作する
- [ ] 顧客管理API（GET一覧・詳細、POST、PUT、DELETE）が動作する
- [ ] ページネーション・フィルタリングが動作する
- [ ] バリデーションエラーが正しく返る
- [ ] 依存関係チェックが動作する（カード削除時）
- [ ] N:Mリレーション（顧客報酬カード）が動作する
- [ ] ソフトデリートが動作する
- [ ] エラーハンドリングが正しく動作する

### 品質基準
- [ ] 全APIエンドポイントのテストが通る
- [ ] TypeScriptのコンパイルエラーがない
- [ ] ESLint・Prettierでコード整形されている
- [ ] API仕様書と実装が一致している

### マイルストーン
- [x] **M2: バックエンドAPI完成** - Phase 2完了時点で達成

---

## 備考

### N:Mリレーション処理パターン
- **作成時**: `rewardCards: { connect: rewardCardIds.map(id => ({ id })) }`
- **更新時**: `rewardCards: { set: rewardCardIds.map(id => ({ id })) }`

### 依存関係チェックパターン
`checkCardDependencies(cardId)`で依存関係を確認し、存在する場合は409エラーを返す

---

## 変更履歴

| 日付 | バージョン | 変更内容 |
|------|----------|---------|
| 2025-11-09 | 1.0 | 初版作成。12タスク、64時間 |
