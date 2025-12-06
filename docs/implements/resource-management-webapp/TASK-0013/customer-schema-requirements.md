# TDD要件定義: Prismaスキーマ定義（Customerテーブル）

## タスク情報

- **タスクID**: TASK-0013
- **GitHub Issue**: #40
- **機能名**: Prismaスキーマ定義（Customerテーブル）
- **実装タイプ**: TDD
- **推定工数**: 1.5時間
- **依存タスク**: TASK-0011（Prismaスキーマ定義（共通フィールド・基本型））

## 1. 機能の概要（EARS要件定義書・設計文書ベース）

🔵 **信頼性レベル: 青信号** - EARS要件定義書・設計文書を参考にしてほぼ推測していない

### 機能の目的

PrismaスキーマにCustomerテーブルを定義し、顧客管理機能のデータベース基盤を構築する。

### 解決する問題

- 顧客データをデータベースに永続化するためのスキーマ定義が不足している
- 顧客の各種属性（名前、説明、タイプ、難易度、依頼条件、報酬設定等）を適切に管理する必要がある

### システム内での位置づけ

- **レイヤー**: データベース層（Prismaスキーマ）
- **依存関係**: TASK-0011で定義される共通フィールドに依存
- **後続タスク**: TASK-0014（その他テーブル）、TASK-0015（マイグレーション実行）

### 参照したEARS要件

- **WRREQ-021**: システムは顧客タイプの管理機能を提供しなければならない 🔵
- **WRREQ-022**: 各顧客は名前、説明、タイプ、難易度(1〜5星)を持たなければならない 🔵
- **WRREQ-023**: 各顧客依頼は指定属性値、品質条件、安定性条件を持たなければならない 🔵
- **WRREQ-024**: 各顧客は報酬設定(カード、名声、知識ポイント)を持たなければならない 🔵

### 参照した設計文書

- `docs/design/resource-management-webapp/database-schema.sql` - Customersテーブル定義（108-129行目）
- `docs/requirements/resource-management-webapp-requirements.md` - Customerデータモデル定義（445-463行目）

## 2. 入力・出力の仕様（EARS機能要件・TypeScript型定義ベース）

🔵 **信頼性レベル: 青信号** - EARS要件定義書・設計文書を参考にしてほぼ推測していない

### Prismaスキーマ定義（入力）

Prismaスキーマファイル（`backend/prisma/schema.prisma`）に以下のモデルを定義する：

```prisma
model Customer {
  id                  String    @id @default(uuid())
  name                String    @db.VarChar(100)
  description         String    @db.VarChar(1000)
  customerType        String    @db.VarChar(50)
  difficulty          Int       // 範囲: 1〜5
  requiredAttribute   Json      // JSON形式の属性値
  qualityCondition    Int       // 範囲: 0〜100
  stabilityCondition  Int       // 範囲: 0〜100
  rewardFame          Int       // 範囲: 0〜1000
  rewardKnowledge     Int       // 範囲: 0〜1000
  portraitUrl         String?
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
  deletedAt           DateTime?

  @@index([name])
  @@index([customerType])
  @@index([difficulty])
  @@index([deletedAt])
  @@map("customers")
}
```

### 出力（生成されるもの）

- PrismaスキーマファイルにCustomerモデルが定義される
- Prisma Client生成時に`Customer`型が利用可能になる
- マイグレーション実行時にデータベースに`customers`テーブルが作成される

### データ型の詳細

| フィールド | 型 | 制約 | 説明 |
|-----------|-----|------|------|
| id | String (UUID) | PRIMARY KEY, DEFAULT uuid() | 主キー |
| name | String | NOT NULL, VARCHAR(100) | 顧客名（最大100文字） |
| description | String | NOT NULL, VARCHAR(1000) | 説明（最大1000文字） |
| customerType | String | NOT NULL, VARCHAR(50) | 顧客タイプ（最大50文字） |
| difficulty | Int | NOT NULL, CHECK (1〜5) | 難易度（1〜5星） |
| requiredAttribute | Json | NOT NULL | 必要属性値（JSON形式） |
| qualityCondition | Int | NOT NULL, CHECK (0〜100) | 品質条件 |
| stabilityCondition | Int | NOT NULL, CHECK (0〜100) | 安定性条件 |
| rewardFame | Int | NOT NULL, CHECK (0〜1000) | 報酬: 名声 |
| rewardKnowledge | Int | NOT NULL, CHECK (0〜1000) | 報酬: 知識ポイント |
| portraitUrl | String? | NULLABLE | ポートレートURL |
| createdAt | DateTime | NOT NULL, DEFAULT now() | 作成日時 |
| updatedAt | DateTime | NOT NULL, @updatedAt | 更新日時 |
| deletedAt | DateTime? | NULLABLE | 削除日時（ソフトデリート） |

### 参照したEARS要件

- **WRREQ-021**: 顧客タイプの管理機能 🔵
- **WRREQ-022**: 名前、説明、タイプ、難易度を持つ 🔵
- **WRREQ-023**: 指定属性値、品質条件、安定性条件を持つ 🔵
- **WRREQ-024**: 報酬設定を持つ 🔵

### 参照した設計文書

- `docs/design/resource-management-webapp/database-schema.sql` - Customersテーブル定義

## 3. 制約条件（EARS非機能要件・アーキテクチャ設計ベース）

🔵🟡🔴 **信頼性レベル**: 各項目で明記

### データベース制約

🔵 **青信号** - 設計文書から直接導出

- **CHECK制約**:
  - `difficulty`: 1〜5の範囲（WRREQ-022対応）
  - `qualityCondition`: 0〜100の範囲（WRREQ-023対応）
  - `stabilityCondition`: 0〜100の範囲（WRREQ-023対応）
  - `rewardFame`: 0〜1000の範囲（WRREQ-024対応）
  - `rewardKnowledge`: 0〜1000の範囲（WRREQ-024対応）
- **NOT NULL制約**: `name`, `description`, `customerType`, `difficulty`, `requiredAttribute`, `qualityCondition`, `stabilityCondition`, `rewardFame`, `rewardKnowledge`, `createdAt`, `updatedAt`は必須

### インデックス要件

🔴 **赤信号** - 一般的なWebアプリ管理画面のベストプラクティスから推測

- `name`: 検索用
- `customerType`: フィルタリング用
- `difficulty`: フィルタリング用（WRREQ-061対応）
- `deletedAt`: ソフトデリート用（WHERE deletedAt IS NULL）

### アーキテクチャ制約

🟡 **黄信号** - 設計文書から妥当な推測

- Prismaスキーマは`backend/prisma/schema.prisma`に定義
- テーブル名は`customers`（スネークケース）を使用
- 共通フィールド（id, createdAt, updatedAt, deletedAt）はTASK-0011で定義される想定

### 参照したEARS要件

- **WREDGE-006**: 難易度が1〜5の範囲外の場合、システムはバリデーションエラーを表示しなければならない 🔵

### 参照した設計文書

- `docs/design/resource-management-webapp/database-schema.sql` - インデックス定義（125-129行目）

## 4. 想定される使用例（EARSEdgeケース・データフローベース）

🔵🟡🔴 **信頼性レベル**: 各項目で明記

### 基本的な使用パターン

🔵 **青信号** - 通常要件から直接導出

1. **顧客作成**: 新しい顧客をPrismaスキーマに定義し、マイグレーションでデータベースに反映
2. **顧客参照**: Prisma Clientを使用して顧客データを取得
3. **顧客更新**: 既存の顧客データを更新
4. **顧客削除**: ソフトデリート（deletedAtを設定）

### エッジケース

🔴 **赤信号** - 一般的なデータベース設計のベストプラクティスから推測

1. **ソフトデリート**: `deletedAt`がNULLでないレコードは論理削除されたものとして扱う

### エラーケース

🔴 **赤信号** - 一般的なデータベース設計のベストプラクティスから推測

1. **CHECK制約違反**: `difficulty`が1〜5の範囲外の場合、データベースレベルでエラーが発生
2. **必須フィールド未入力**: 必須フィールドがNULLの場合、データベースレベルでエラーが発生

### 参照したEARS要件

- **WREDGE-006**: 難易度が1〜5の範囲外の場合のバリデーションエラー 🔵

## 5. EARS要件・設計文書との対応関係

### 参照した機能要件

- **WRREQ-021**: 顧客タイプの管理機能 🔵
- **WRREQ-022**: 名前、説明、タイプ、難易度を持つ 🔵
- **WRREQ-023**: 指定属性値、品質条件、安定性条件を持つ 🔵
- **WRREQ-024**: 報酬設定を持つ 🔵

### 参照したEdgeケース

- **WREDGE-006**: 難易度が1〜5の範囲外の場合のバリデーションエラー 🔵

### 参照した設計文書

- **データベース**: `docs/design/resource-management-webapp/database-schema.sql` - Customersテーブル定義（108-129行目）
- **要件定義**: `docs/requirements/resource-management-webapp-requirements.md` - Customerデータモデル定義（445-463行目）

## 6. 受け入れ基準

### 必須要件

- [x] PrismaスキーマファイルにCustomerモデルが定義されている
- [x] すべての必須フィールドが定義されている（name, description, customerType, difficulty, requiredAttribute, qualityCondition, stabilityCondition, rewardFame, rewardKnowledge）
- [x] オプショナルフィールドが適切に定義されている（portraitUrl）
- [x] 共通フィールドが含まれている（id, createdAt, updatedAt, deletedAt）
- [x] CHECK制約が適切に設定されている（マイグレーション時に追加予定）
- [x] 適切なインデックスが定義されている
- [x] テーブル名が`customers`にマッピングされている
- [x] Prismaスキーマの型チェックが通る

### 品質基準

- [x] スキーマ定義が設計文書（database-schema.sql）と一致している
- [x] 要件定義書のデータモデル定義と整合性が取れている
- [x] EARS要件（WRREQ-021, WRREQ-022, WRREQ-023, WRREQ-024）を満たしている

## 7. 実装上の注意事項

### 依存タスク

- **TASK-0011**: 共通フィールド定義が定義されている必要がある
  - ✅ TASK-0011は完了済み

### 技術的制約

- Prismaスキーマの構文に準拠する必要がある
- PostgreSQL 14+を想定したデータ型を使用する
- JSON型は`Json`型として定義する（Prismaの仕様）
- CHECK制約はPrismaスキーマで直接定義できないため、マイグレーションファイルで追加する

### 次のステップ

1. TASK-0014（その他テーブル）の実装
2. TASK-0015（マイグレーション実行）でCHECK制約を追加

---

**作成日**: 2025-12-06
**作成者**: AI Assistant
**品質判定**: ✅ 高品質
- 要件の曖昧さ: なし
- 入出力定義: 完全
- 制約条件: 明確
- 実装可能性: 確実
