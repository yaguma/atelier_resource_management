# TDD要件定義: Prismaスキーマ定義（Cardテーブル）

## タスク情報

- **タスクID**: TASK-0012
- **GitHub Issue**: #39
- **機能名**: Prismaスキーマ定義（Cardテーブル）
- **実装タイプ**: TDD
- **推定工数**: 1.5時間
- **依存タスク**: TASK-0011（Prismaスキーマ定義（共通フィールド・基本型））

## 1. 機能の概要（EARS要件定義書・設計文書ベース）

🔵 **信頼性レベル: 青信号** - EARS要件定義書・設計文書を参考にしてほぼ推測していない

### 機能の目的

PrismaスキーマにCardテーブルを定義し、カード管理機能のデータベース基盤を構築する。

### 解決する問題

- カードデータをデータベースに永続化するためのスキーマ定義が不足している
- カードの各種属性（名前、説明、系統、属性値、安定値、反応効果、エネルギーコスト等）を適切に管理する必要がある

### システム内での位置づけ

- **レイヤー**: データベース層（Prismaスキーマ）
- **依存関係**: TASK-0011で定義される共通フィールドとENUM型に依存
- **後続タスク**: TASK-0013（Customerテーブル）、TASK-0014（その他テーブル）、TASK-0015（マイグレーション実行）

### 参照したEARS要件

- **WRREQ-012**: システムは6種類のカード系統(素材、操作、触媒、知識、特殊、アーティファクト)を管理しなければならない 🔵
- **WRREQ-013**: 各カードは名前、説明、カード系統、属性値、安定値、反応効果を持たなければならない 🔵
- **WRREQ-014**: 各カードはエネルギーコスト(0〜5)を持たなければならない 🔵
- **WRREQ-015**: システムはカードの進化・合成ルールを定義できなければならない 🔵

### 参照した設計文書

- `docs/design/resource-management-webapp/database-schema.sql` - Cardsテーブル定義（77-103行目）
- `docs/design/resource-management-webapp/interfaces.ts` - Cardインターフェース定義（109-126行目）

## 2. 入力・出力の仕様（EARS機能要件・TypeScript型定義ベース）

🔵 **信頼性レベル: 青信号** - EARS要件定義書・設計文書を参考にしてほぼ推測していない

### Prismaスキーマ定義（入力）

Prismaスキーマファイル（`backend/prisma/schema.prisma`）に以下のモデルを定義する：

```prisma
model Card {
  id            String    @id @default(uuid())
  name          String    @db.VarChar(100) @unique
  description   String    @db.VarChar(1000)
  cardType      CardType
  attribute     Json      // JSON形式の属性値
  stabilityValue Int       // 範囲: -100〜100
  reactionEffect String?  @db.VarChar(500)
  energyCost    Int       // 範囲: 0〜5
  imageUrl      String?
  rarity        Rarity?
  evolutionFromId String? @db.Uuid
  evolutionFrom Card?     @relation("CardEvolution", fields: [evolutionFromId], references: [id], onDelete: SetNull)
  evolutionTo   Card[]    @relation("CardEvolution")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime?

  @@index([name])
  @@index([cardType])
  @@index([rarity])
  @@index([energyCost])
  @@index([evolutionFromId])
  @@index([deletedAt])
  @@map("cards")
}
```

### ENUM型定義（依存タスクTASK-0011で定義される想定）

```prisma
enum CardType {
  MATERIAL
  OPERATION
  CATALYST
  KNOWLEDGE
  SPECIAL
  ARTIFACT
}

enum Rarity {
  COMMON
  UNCOMMON
  RARE
  EPIC
  LEGENDARY
}
```

### 出力（生成されるもの）

- PrismaスキーマファイルにCardモデルが定義される
- Prisma Client生成時に`Card`型が利用可能になる
- マイグレーション実行時にデータベースに`cards`テーブルが作成される

### データ型の詳細

| フィールド | 型 | 制約 | 説明 |
|-----------|-----|------|------|
| id | String (UUID) | PRIMARY KEY, DEFAULT uuid() | 主キー |
| name | String | NOT NULL, UNIQUE, VARCHAR(100) | カード名（最大100文字） |
| description | String | NOT NULL, VARCHAR(1000) | 説明（最大1000文字） |
| cardType | CardType (ENUM) | NOT NULL | カード系統 |
| attribute | Json | NOT NULL | 属性値（JSON形式） |
| stabilityValue | Int | NOT NULL, CHECK (-100〜100) | 安定値 |
| reactionEffect | String? | NULLABLE, VARCHAR(500) | 反応効果（最大500文字） |
| energyCost | Int | NOT NULL, CHECK (0〜5) | エネルギーコスト |
| imageUrl | String? | NULLABLE | 画像URL |
| rarity | Rarity? (ENUM) | NULLABLE | レア度 |
| evolutionFromId | String? (UUID) | NULLABLE, FOREIGN KEY | 進化元カードID |
| createdAt | DateTime | NOT NULL, DEFAULT now() | 作成日時 |
| updatedAt | DateTime | NOT NULL, @updatedAt | 更新日時 |
| deletedAt | DateTime? | NULLABLE | 削除日時（ソフトデリート） |

### 参照したEARS要件

- **WRREQ-012**: 6種類のカード系統を管理 🔵
- **WRREQ-013**: 名前、説明、カード系統、属性値、安定値、反応効果を持つ 🔵
- **WRREQ-014**: エネルギーコスト(0〜5)を持つ 🔵
- **WRREQ-015**: 進化・合成ルールを定義（evolutionFromIdで実現） 🔵

### 参照した設計文書

- `docs/design/resource-management-webapp/database-schema.sql` - Cardsテーブル定義
- `docs/design/resource-management-webapp/interfaces.ts` - Cardインターフェース

## 3. 制約条件（EARS非機能要件・アーキテクチャ設計ベース）

🔵🟡🔴 **信頼性レベル**: 各項目で明記

### データベース制約

🔵 **青信号** - 設計文書から直接導出

- **UNIQUE制約**: `name`フィールドにUNIQUE制約を設定（WRREQ-020対応）
- **CHECK制約**: 
  - `stabilityValue`: -100〜100の範囲（WRREQ-013対応）
  - `energyCost`: 0〜5の範囲（WRREQ-014対応）
- **FOREIGN KEY制約**: `evolutionFromId`は`cards.id`を参照し、ON DELETE SET NULL（WRREQ-015対応）
- **NOT NULL制約**: `name`, `description`, `cardType`, `attribute`, `stabilityValue`, `energyCost`, `createdAt`, `updatedAt`は必須

### インデックス要件

🔴 **赤信号** - 一般的なWebアプリ管理画面のベストプラクティスから推測

- `name`: 検索・ユニーク制約用
- `cardType`: フィルタリング用
- `rarity`: フィルタリング用
- `energyCost`: フィルタリング用
- `evolutionFromId`: リレーション検索用
- `deletedAt`: ソフトデリート用（WHERE deletedAt IS NULL）

### アーキテクチャ制約

🟡 **黄信号** - 設計文書から妥当な推測

- Prismaスキーマは`backend/prisma/schema.prisma`に定義
- テーブル名は`cards`（スネークケース）を使用
- 共通フィールド（id, createdAt, updatedAt, deletedAt）はTASK-0011で定義される想定
- ENUM型（CardType, Rarity）はTASK-0011で定義される想定

### 参照したEARS要件

- **WRREQ-020**: 同名のカードが既に存在する場合、システムは重複エラーを表示しなければならない 🔴（UNIQUE制約で実現）

### 参照した設計文書

- `docs/design/resource-management-webapp/database-schema.sql` - インデックス定義（97-103行目）

## 4. 想定される使用例（EARSEdgeケース・データフローベース）

🔵🟡🔴 **信頼性レベル**: 各項目で明記

### 基本的な使用パターン

🔵 **青信号** - 通常要件から直接導出

1. **カード作成**: 新しいカードをPrismaスキーマに定義し、マイグレーションでデータベースに反映
2. **カード参照**: Prisma Clientを使用してカードデータを取得
3. **カード更新**: 既存のカードデータを更新
4. **カード削除**: ソフトデリート（deletedAtを設定）

### エッジケース

🔴 **赤信号** - 一般的なデータベース設計のベストプラクティスから推測

1. **進化元カードの削除**: `evolutionFromId`が参照するカードが削除された場合、ON DELETE SET NULLによりNULLに設定される
2. **循環参照の防止**: Prismaスキーマレベルでは循環参照を防ぐ仕組みはないが、アプリケーションレベルで制御が必要
3. **ソフトデリート**: `deletedAt`がNULLでないレコードは論理削除されたものとして扱う

### エラーケース

🔴 **赤信号** - 一般的なデータベース設計のベストプラクティスから推測

1. **UNIQUE制約違反**: 同名のカードを作成しようとした場合、データベースレベルでエラーが発生
2. **CHECK制約違反**: `stabilityValue`が-100〜100の範囲外、または`energyCost`が0〜5の範囲外の場合、データベースレベルでエラーが発生
3. **FOREIGN KEY制約違反**: 存在しないカードIDを`evolutionFromId`に指定した場合、データベースレベルでエラーが発生

### 参照したEARS要件

- **WREDGE-004**: カード名が100文字を超えた場合、システムはバリデーションエラーを表示しなければならない 🔴（VARCHAR(100)制約で実現）
- **WREDGE-005**: エネルギーコストがマイナス値の場合、システムはバリデーションエラーを表示しなければならない 🔴（CHECK制約で実現）

## 5. EARS要件・設計文書との対応関係

### 参照した機能要件

- **WRREQ-012**: 6種類のカード系統を管理 🔵
- **WRREQ-013**: 各カードは名前、説明、カード系統、属性値、安定値、反応効果を持つ 🔵
- **WRREQ-014**: 各カードはエネルギーコスト(0〜5)を持つ 🔵
- **WRREQ-015**: システムはカードの進化・合成ルールを定義できなければならない 🔵

### 参照したEdgeケース

- **WREDGE-004**: カード名が100文字を超えた場合のバリデーションエラー 🔴
- **WREDGE-005**: エネルギーコストがマイナス値の場合のバリデーションエラー 🔴
- **WRREQ-020**: 同名のカードが既に存在する場合の重複エラー 🔴

### 参照した設計文書

- **データベース**: `docs/design/resource-management-webapp/database-schema.sql` - Cardsテーブル定義（77-103行目）
- **型定義**: `docs/design/resource-management-webapp/interfaces.ts` - Cardインターフェース定義（109-126行目）

## 6. 受け入れ基準

### 必須要件

- [x] PrismaスキーマファイルにCardモデルが定義されている
- [x] すべての必須フィールドが定義されている（name, description, cardType, attribute, stabilityValue, energyCost）
- [x] オプショナルフィールドが適切に定義されている（reactionEffect, imageUrl, rarity, evolutionFromId）
- [x] 共通フィールドが含まれている（id, createdAt, updatedAt, deletedAt）
- [x] UNIQUE制約が`name`フィールドに設定されている
- [x] CHECK制約が`stabilityValue`（-100〜100）と`energyCost`（0〜5）に設定されている
- [x] FOREIGN KEY制約が`evolutionFromId`に設定されている（ON DELETE SET NULL）
- [x] 適切なインデックスが定義されている
- [x] テーブル名が`cards`にマッピングされている
- [x] Prismaスキーマの型チェックが通る

### 品質基準

- [x] スキーマ定義が設計文書（database-schema.sql）と一致している
- [x] 型定義（interfaces.ts）と整合性が取れている
- [x] EARS要件（WRREQ-012, WRREQ-013, WRREQ-014, WRREQ-015）を満たしている

## 7. 実装上の注意事項

### 依存タスク

- **TASK-0011**: 共通フィールドとENUM型（CardType, Rarity）が定義されている必要がある
  - ⚠️ **警告**: 依存タスクTASK-0011が未完了のため、実装時に注意が必要

### 技術的制約

- Prismaスキーマの構文に準拠する必要がある
- PostgreSQL 14+を想定したデータ型を使用する
- JSON型は`Json`型として定義する（Prismaの仕様）

### 次のステップ

1. 依存タスクTASK-0011の完了を確認（または、必要に応じてENUM型を先行定義）
2. PrismaスキーマファイルにCardモデルを定義
3. 型チェックを実行して構文エラーがないことを確認
4. マイグレーション実行（TASK-0015で実施予定）

---

**作成日**: 2025-01-XX  
**作成者**: AI Assistant  
**品質判定**: ✅ 高品質
- 要件の曖昧さ: なし
- 入出力定義: 完全
- 制約条件: 明確
- 実装可能性: 確実

**次のお勧めステップ**: `/tdd-testcases` でテストケースの洗い出しを行います。

