# TDD要件定義: Prismaスキーマ定義（共通フィールド・基本型）

## タスク情報

- **タスクID**: TASK-0011
- **GitHub Issue**: #38
- **機能名**: Prismaスキーマ定義（共通フィールド・基本型）
- **実装タイプ**: TDD
- **推定工数**: 2時間
- **依存タスク**: TASK-0010（Prisma初期化）

## 1. 機能の概要（EARS要件定義書・設計文書ベース）

🔵 **信頼性レベル: 青信号** - EARS要件定義書・設計文書を参考にしてほぼ推測していない

### 機能の目的

Prismaスキーマに共通フィールドとENUM型を定義し、後続のテーブル定義の基盤を構築する。

### 解決する問題

- 全エンティティで使用する共通フィールド（id, createdAt, updatedAt, deletedAt）の定義が不足している
- 複数のテーブルで使用するENUM型（CardType, Rarity, NodeType, CurrencyType, ContentType, BalanceCategory）の定義が不足している

### システム内での位置づけ

- **レイヤー**: データベース層（Prismaスキーマ）
- **依存関係**: TASK-0010でPrismaが初期化されている必要がある
- **後続タスク**: TASK-0012（Cardテーブル）、TASK-0013（Customerテーブル）、TASK-0014（その他テーブル）

### 参照したEARS要件

- **WRREQ-003**: システムは共通フィールド（id, createdAt, updatedAt, deletedAt）を持つ全エンティティを管理しなければならない 🔵
- **WRREQ-004**: システムはPrismaを使用してデータベーススキーマを管理しなければならない 🔵

### 参照した設計文書

- `docs/design/resource-management-webapp/database-schema.sql` - 共通型定義（20-71行目）
- `docs/requirements/resource-management-webapp-requirements.md` - データモデル概要（413-422行目）

## 2. 機能の詳細仕様

### 2.1 共通フィールド定義

🔵 **信頼性レベル: 青信号** - 要件定義書から直接導出

全てのエンティティで使用する共通フィールドを定義する：

- **id**: String (UUID v4, 主キー)
  - Prisma型: `String @id @default(uuid())`
  - データベース型: `UUID PRIMARY KEY DEFAULT uuid_generate_v4()`
- **createdAt**: DateTime (作成日時、自動設定)
  - Prisma型: `DateTime @default(now())`
  - データベース型: `TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP`
- **updatedAt**: DateTime (更新日時、自動更新)
  - Prisma型: `DateTime @updatedAt`
  - データベース型: `TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP`
- **deletedAt**: DateTime? (削除日時、ソフトデリート用、nullable)
  - Prisma型: `DateTime?`
  - データベース型: `TIMESTAMP`

### 2.2 ENUM型定義

🔵 **信頼性レベル: 青信号** - 要件定義書・設計文書から直接導出

#### CardType（カード系統型）

- **定義元**: WRREQ-012
- **値**: MATERIAL, OPERATION, CATALYST, KNOWLEDGE, SPECIAL, ARTIFACT
- **用途**: CardテーブルのcardTypeフィールド

#### Rarity（レア度型）

- **定義元**: ゲーム要件（一般的なレア度システム）
- **値**: COMMON, UNCOMMON, RARE, EPIC, LEGENDARY
- **用途**: Cardテーブルのrarityフィールド

#### NodeType（ノードタイプ型）

- **定義元**: WRREQ-033
- **値**: REQUEST, MERCHANT, EXPERIMENT, MONSTER, BOSS_REQUEST
- **用途**: MapNodeテーブルのnodeTypeフィールド

#### CurrencyType（通貨タイプ型）

- **定義元**: WRREQ-038
- **値**: FAME, KNOWLEDGE
- **用途**: MetaCurrencyテーブルのcurrencyTypeフィールド

#### ContentType（コンテンツタイプ型）

- **定義元**: WRREQ-039
- **値**: CARD, CUSTOMER, MATERIAL
- **用途**: UnlockableContentテーブルのcontentTypeフィールド

#### BalanceCategory（バランス設定カテゴリ型）

- **定義元**: WRREQ-041
- **値**: ENERGY, HAND, STABILITY, PLAYTIME
- **用途**: GameBalanceテーブルのcategoryフィールド（将来的に使用）

## 3. 入力・出力定義

### 入力

- なし（スキーマ定義のみ）

### 出力

- Prismaスキーマファイル（`backend/prisma/schema.prisma`）に以下を追加：
  - 共通フィールドの定義（コメントとして）
  - ENUM型定義（CardType, Rarity, NodeType, CurrencyType, ContentType, BalanceCategory）

## 4. エッジケース・エラー処理

### エッジケース

- **ENUM値の追加**: 将来的にENUM値を追加する場合は、マイグレーションが必要
- **共通フィールドの変更**: 共通フィールドを変更する場合は、全テーブルに影響

### エラー処理

- Prismaスキーマの構文エラー: `prisma validate`で検証
- ENUM型の重複定義: Prismaが自動的に検出

## 5. 受け入れ基準

### 必須要件

- [ ] PrismaスキーマファイルにENUM型が定義されている
  - [ ] CardType（6種類）
  - [ ] Rarity（5種類）
  - [ ] NodeType（5種類）
  - [ ] CurrencyType（2種類）
  - [ ] ContentType（3種類）
  - [ ] BalanceCategory（4種類）
- [ ] 共通フィールドの定義がコメントとして記述されている
- [ ] Prismaスキーマの型チェックが通る（`prisma validate`）

### 品質基準

- [ ] スキーマ定義が設計文書（database-schema.sql）と一致している
- [ ] EARS要件（WRREQ-003, WRREQ-004）を満たしている
- [ ] 各ENUM型に適切なコメントが付いている

## 6. 実装上の注意事項

### 依存タスク

- **TASK-0010**: Prismaが初期化され、`schema.prisma`ファイルが存在している必要がある

### 技術的制約

- Prismaスキーマの構文に準拠する必要がある
- PostgreSQL 14+を想定したENUM型を使用する
- ENUM型の値は大文字で定義する（Prismaの慣習）

### 次のステップ

1. PrismaスキーマファイルにENUM型を定義
2. 共通フィールドの定義をコメントとして記述
3. 型チェックを実行して構文エラーがないことを確認
4. 後続タスク（TASK-0012, TASK-0013, TASK-0014）でこれらのENUM型を使用

---

**作成日**: 2025-01-XX  
**作成者**: AI Assistant  
**品質判定**: ✅ 高品質
- 要件の曖昧さ: なし
- 入出力定義: 完全
- 制約条件: 明確
- 実装可能性: 確実

**次のお勧めステップ**: `/tdd-testcases` でテストケースの洗い出しを行います。

