# Phase 2: カード・顧客管理API実装

## フェーズ概要

### 要件名
resource-management-webapp

### 期間・目標
- **期間**: 8営業日（Week 2-3）
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

### Week 2（Day 11-15）: カード管理API実装
**目標**: カード管理APIの全CRUDエンドポイントを実装する

**成果物**:
- カード一覧・詳細取得エンドポイント（GET /api/cards, GET /api/cards/:id）
- カード作成エンドポイント（POST /api/cards）
- カード更新エンドポイント（PUT /api/cards/:id）
- カード削除エンドポイント（DELETE /api/cards/:id）
- 依存関係チェック機能

### Week 3（Day 16-20）: 顧客管理API実装
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
1. `src/routes/cards.ts`作成
   - GET /api/cards エンドポイント実装
   - ページネーション対応（page, limit）
   - フィルタリング対応（cardType, search）

2. `src/controllers/cardController.ts`作成
   - listCards関数実装
   - Prisma findManyでカード一覧取得
   - ソフトデリート対応（deletedAt IS NULL）

3. `src/types/card.ts`作成
   - CardTypeスキーマ定義（Zod）
   - CardRarityスキーマ定義（Zod）
   - listCardsQueryスキーマ定義（Zod）

4. ルート統合
   - `src/routes/index.ts`にカードルート追加
   - `/api/cards`パスでマウント

**完了条件**:
- [ ] GET /api/cards が動作する
- [ ] ページネーション（page, limit）が動作する
- [ ] フィルタリング（cardType, search）が動作する
- [ ] レスポンスに total, page, limit, totalPages が含まれる
- [ ] 削除済みカード（deletedAt != NULL）が除外される

**テスト要件**:
- [ ] パラメータなしで全カード取得できる
- [ ] cardType指定でフィルタリングできる
- [ ] search指定で名前部分一致検索できる
- [ ] ページネーションが正しく動作する
- [ ] 削除済みカードが除外される

---

### Day 12（8時間）: カード詳細取得API実装

#### ☑ TASK-0017: カード詳細取得API実装（GET /api/cards/:id）
- **推定工数**: 8時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-012, WRREQ-013, WRREQ-015, WRREQ-016
- **依存タスク**: TASK-0016

**実装詳細**:
1. GET /api/cards/:id エンドポイント実装
   - パスパラメータからID取得
   - UUID検証

2. `src/controllers/cardController.ts`に追加
   - getCardById関数実装
   - Prisma findUniqueでカード取得
   - リレーションデータ含める（evolutionFrom, evolutionTo, initialDeckStyles, unlockableContent）
   - 404エラーハンドリング

3. UUID検証ミドルウェア作成
   - `src/middlewares/validateUUID.ts`
   - パラメータのUUID形式チェック
   - 不正な場合400エラー

**完了条件**:
- [ ] GET /api/cards/:id が動作する
- [ ] 存在するIDで詳細データ取得できる
- [ ] 存在しないIDで404エラーが返る
- [ ] 不正なUUID形式で400エラーが返る
- [ ] リレーションデータ（evolutionFrom, evolutionTo等）が含まれる

**テスト要件**:
- [ ] 正常なUUIDで詳細取得できる
- [ ] 存在しないUUIDで404エラーが返る
- [ ] 不正なUUID形式で400エラーが返る
- [ ] 削除済みカードで404エラーが返る
- [ ] レスポンスに全フィールドが含まれる

---

### Day 13（8時間）: カード作成API実装

#### ☑ TASK-0018: カード作成API実装（POST /api/cards）
- **推定工数**: 8時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-012, WRREQ-013, WRREQ-014, WRREQ-017, WRREQ-020
- **依存タスク**: TASK-0016, TASK-0017

**実装詳細**:
1. POST /api/cards エンドポイント実装
   - リクエストボディ受け取り
   - バリデーションミドルウェア適用

2. `src/types/card.ts`に追加
   - createCardSchemaスキーマ定義（Zod）
     - name: string（必須、1〜100文字）
     - description: string（必須、1〜1000文字）
     - cardType: enum（必須、MATERIAL|OPERATION|CATALYST|KNOWLEDGE|SPECIAL|ARTIFACT）
     - attribute: object（必須、JSON形式）
     - stabilityValue: number（必須、-100〜100）
     - reactionEffect: string（任意、最大500文字）
     - energyCost: number（必須、0〜5）
     - imageUrl: string（任意、最大500文字、URL形式）
     - rarity: enum（任意、COMMON|UNCOMMON|RARE|EPIC|LEGENDARY）
     - evolutionFromId: UUID（任意）

3. `src/controllers/cardController.ts`に追加
   - createCard関数実装
   - Prisma createでカード作成
   - ユニーク制約違反（同名カード）ハンドリング（409エラー）
   - evolutionFromId存在チェック

**完了条件**:
- [ ] POST /api/cards が動作する
- [ ] 正常なデータでカード作成できる
- [ ] バリデーションエラー時に400エラーが返る
- [ ] 同名カード存在時に409エラーが返る
- [ ] 201 Createdステータスが返る

**テスト要件**:
- [ ] 必須フィールドのみでカード作成できる
- [ ] 全フィールド指定でカード作成できる
- [ ] 同名カード作成時に409エラーが返る
- [ ] energyCost範囲外（-1, 6）でバリデーションエラーが返る
- [ ] stabilityValue範囲外でバリデーションエラーが返る
- [ ] 存在しないevolutionFromIdで400エラーが返る

---

### Day 14（8時間）: カード更新API実装

#### ☑ TASK-0019: カード更新API実装（PUT /api/cards/:id）
- **推定工数**: 8時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-012, WRREQ-013, WRREQ-017
- **依存タスク**: TASK-0018

**実装詳細**:
1. PUT /api/cards/:id エンドポイント実装
   - パスパラメータからID取得
   - リクエストボディ受け取り
   - 部分更新対応（Partial<CardSchema>）

2. `src/types/card.ts`に追加
   - updateCardSchemaスキーマ定義（Zod）
   - createCardSchemaをpartial()で部分更新可能に

3. `src/controllers/cardController.ts`に追加
   - updateCard関数実装
   - Prisma updateでカード更新
   - 存在しないIDで404エラー
   - ユニーク制約違反（同名カード）ハンドリング（409エラー）

**完了条件**:
- [ ] PUT /api/cards/:id が動作する
- [ ] 部分更新（一部フィールドのみ）が動作する
- [ ] 全フィールド更新が動作する
- [ ] 存在しないIDで404エラーが返る
- [ ] 同名カードに変更時に409エラーが返る

**テスト要件**:
- [ ] 1フィールドのみ更新できる
- [ ] 複数フィールド更新できる
- [ ] 全フィールド更新できる
- [ ] 存在しないIDで404エラーが返る
- [ ] 同名カードに変更時に409エラーが返る
- [ ] バリデーションエラーが正しく返る

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

**テスト要件**:
- [ ] 進化元として使用中のカードで依存関係を検出できる
- [ ] 初期デッキで使用中のカードで依存関係を検出できる
- [ ] 複数の依存関係を同時に検出できる
- [ ] 依存関係がない場合、空配列が返る

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

**テスト要件**:
- [ ] 依存関係がないカードを削除できる
- [ ] 削除後、GET /api/cardsで取得できない
- [ ] 削除後、GET /api/cards/:idで404エラーが返る
- [ ] 進化元として使用中のカードで409エラーが返る
- [ ] 初期デッキで使用中のカードで409エラーが返る

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

**テスト要件**:
- [ ] パラメータなしで全顧客取得できる
- [ ] difficulty指定でフィルタリングできる
- [ ] search指定で名前部分一致検索できる
- [ ] ページネーションが正しく動作する
- [ ] 削除済み顧客が除外される

---

### Day 17（8時間）: 顧客詳細取得API実装

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

**テスト要件**:
- [ ] 正常なUUIDで詳細取得できる
- [ ] 存在しないUUIDで404エラーが返る
- [ ] 不正なUUID形式で400エラーが返る
- [ ] 削除済み顧客で404エラーが返る
- [ ] rewardCards配列が正しく含まれる

---

### Day 18（8時間）: 顧客作成API実装（N:Mリレーション対応）

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

**テスト要件**:
- [ ] 必須フィールドのみで顧客作成できる
- [ ] rewardCardIds指定で報酬カード関連付けできる
- [ ] difficulty範囲外（0, 6）でバリデーションエラーが返る
- [ ] 存在しないrewardCardIdで400エラーが返る
- [ ] 作成後、GET /api/customers/:idでrewardCardsが取得できる

---

### Day 19（8時間）: 顧客更新API実装（N:Mリレーション対応）

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

**テスト要件**:
- [ ] 1フィールドのみ更新できる
- [ ] rewardCardIds更新で関連が正しく置換される
- [ ] rewardCardIds空配列で全関連削除できる
- [ ] 存在しないIDで404エラーが返る
- [ ] 存在しないrewardCardIdで400エラーが返る

---

### Day 20（8時間）: 顧客削除API実装と統合テスト

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

**テスト要件**:
- [ ] 顧客を削除できる
- [ ] 削除後、GET /api/customersで取得できない
- [ ] 削除後、GET /api/customers/:idで404エラーが返る
- [ ] N:M関連（rewardCards）も削除される

---

#### ☑ TASK-0027: Phase 2統合テスト・ドキュメント整備
- **推定工数**: 4時間
- **タスクタイプ**: DIRECT
- **要件へのリンク**: 全API要件
- **依存タスク**: TASK-0016〜0026

**実装詳細**:
1. APIエンドポイント統合テスト実施
   - Postman/Thunder Clientでマニュアルテスト
   - 全エンドポイントの動作確認
   - エラーケースの確認

2. テストシナリオ実行
   - **カード管理フロー**:
     1. カード一覧取得（空）
     2. カード作成（3件）
     3. カード一覧取得（3件表示）
     4. カード詳細取得
     5. カード更新
     6. カード削除（依存関係なし）
     7. カード削除（依存関係あり）→409エラー

   - **顧客管理フロー**:
     1. 顧客一覧取得（空）
     2. 顧客作成（報酬カードあり）
     3. 顧客一覧取得（表示確認）
     4. 顧客詳細取得（rewardCards含む）
     5. 顧客更新（報酬カード変更）
     6. 顧客削除

3. Prisma Studioでデータ確認
   - カードテーブル
   - 顧客テーブル
   - 中間テーブル（CustomerRewardCard）
   - deletedAtフィールド

4. API仕様書確認
   - `docs/design/resource-management-webapp/api-endpoints.md`
   - 実装と仕様の一致確認

5. README.md更新
   - Phase 2完了内容追記
   - APIエンドポイント一覧追記
   - サンプルリクエスト追記

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

**作成時**:
```typescript
await prisma.customer.create({
  data: {
    name: "顧客名",
    // ... 他のフィールド
    rewardCards: {
      connect: rewardCardIds.map(id => ({ id }))
    }
  }
});
```

**更新時**:
```typescript
await prisma.customer.update({
  where: { id },
  data: {
    // ... 他のフィールド
    rewardCards: {
      set: rewardCardIds.map(id => ({ id }))
    }
  }
});
```

### 依存関係チェックパターン

```typescript
const dependencies = await checkCardDependencies(cardId);
if (dependencies.length > 0) {
  return errorResponse(c, 'DEPENDENCY_ERROR',
    'このカードは他のリソースから参照されているため削除できません',
    409,
    dependencies
  );
}
```

---

## 変更履歴

| 日付 | バージョン | 変更内容 |
|------|----------|---------|
| 2025-11-09 | 1.0 | 初版作成。12タスク、64時間 |
