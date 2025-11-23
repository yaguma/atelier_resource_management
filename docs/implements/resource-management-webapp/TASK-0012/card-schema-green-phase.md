# TDD Greenフェーズ: Prismaスキーマ定義（Cardテーブル）

## タスク情報

- **タスクID**: TASK-0012
- **GitHub Issue**: #39
- **機能名**: Prismaスキーマ定義（Cardテーブル）
- **実装タイプ**: TDD
- **Greenフェーズ実行日時**: 2025-01-XX

## Greenフェーズの目的

🔵 **信頼性レベル: 青信号** - TDDの標準的なGreenフェーズの目的

Redフェーズで確認したエラーを解決し、Prismaスキーマの検証が通るようにする：
1. ENUM型（CardType, Rarity）を定義する
2. CardモデルがENUM型を正しく参照することを確認する
3. Prismaスキーマの検証が成功することを確認する
4. Prisma Clientが正常に生成されることを確認する

## 実装内容

### 1. ENUM型の定義

🔵 **信頼性レベル: 青信号** - 要件定義書（WRREQ-012）から直接導出

```prisma
// CardType: 6種類のカード系統（素材、操作、触媒、知識、特殊、アーティファクト）
enum CardType {
  MATERIAL    // 素材カード
  OPERATION   // 操作カード
  CATALYST    // 触媒カード
  KNOWLEDGE   // 知識カード
  SPECIAL     // 特殊カード
  ARTIFACT    // アーティファクト
}

// Rarity: レア度（5段階）
enum Rarity {
  COMMON      // コモン
  UNCOMMON    // アンコモン
  RARE        // レア
  EPIC        // エピック
  LEGENDARY   // レジェンダリー
}
```

### 2. Cardモデルの完成

🔵 **信頼性レベル: 青信号** - 要件定義書（WRREQ-012, WRREQ-013, WRREQ-014, WRREQ-015）から直接導出

```prisma
model Card {
  id            String    @id @default(uuid())
  name          String    @db.VarChar(100) @unique
  description   String    @db.VarChar(1000)
  cardType      CardType
  attribute     Json
  stabilityValue Int
  reactionEffect String?  @db.VarChar(500)
  energyCost    Int
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

## テスト結果

### 1. Prismaスキーマの検証

🔵 **信頼性レベル: 青信号** - 実際に実行した結果

```bash
$ npx prisma validate
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
The schema at prisma/schema.prisma is valid 🚀
```

**結果**: ✅ 成功（exit code 0、エラーメッセージなし）

### 2. Prisma Client生成

🔵 **信頼性レベル: 青信号** - 実際に実行した結果

```bash
$ npx prisma generate
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma

✔ Generated Prisma Client (v5.22.0) to ./node_modules/@prisma/client in 76ms
```

**結果**: ✅ 成功（Prisma Clientが正常に生成された）

## 実装の詳細

### フィールド定義

🔵 **信頼性レベル: 青信号** - 要件定義書から直接導出

| フィールド | 型 | 制約 | 説明 |
|-----------|-----|------|------|
| id | String (UUID) | PRIMARY KEY, DEFAULT uuid() | 主キー |
| name | String | NOT NULL, UNIQUE, VARCHAR(100) | カード名（最大100文字） |
| description | String | NOT NULL, VARCHAR(1000) | 説明（最大1000文字） |
| cardType | CardType (ENUM) | NOT NULL | カード系統 |
| attribute | Json | NOT NULL | 属性値（JSON形式） |
| stabilityValue | Int | NOT NULL | 安定値（範囲: -100〜100、CHECK制約はマイグレーション時に追加） |
| reactionEffect | String? | NULLABLE, VARCHAR(500) | 反応効果（最大500文字） |
| energyCost | Int | NOT NULL | エネルギーコスト（範囲: 0〜5、CHECK制約はマイグレーション時に追加） |
| imageUrl | String? | NULLABLE | 画像URL |
| rarity | Rarity? (ENUM) | NULLABLE | レア度 |
| evolutionFromId | String? (UUID) | NULLABLE, FOREIGN KEY | 進化元カードID |
| createdAt | DateTime | NOT NULL, DEFAULT now() | 作成日時 |
| updatedAt | DateTime | NOT NULL, @updatedAt | 更新日時 |
| deletedAt | DateTime? | NULLABLE | 削除日時（ソフトデリート） |

### インデックス定義

🔴 **信頼性レベル: 赤信号** - 一般的なデータベース設計のベストプラクティスから推測

- `@@index([name])`: カード名検索用
- `@@index([cardType])`: カード系統フィルタリング用
- `@@index([rarity])`: レア度フィルタリング用
- `@@index([energyCost])`: エネルギーコストフィルタリング用
- `@@index([evolutionFromId])`: 進化元カード検索用
- `@@index([deletedAt])`: ソフトデリート用（WHERE deletedAt IS NULL）

### 制約定義

🔵 **信頼性レベル: 青信号** - 要件定義書から直接導出

- **UNIQUE制約**: `name`フィールドに`@unique`ディレクティブを設定（WRREQ-020対応）
- **FOREIGN KEY制約**: `evolutionFromId`フィールドに`@relation`ディレクティブを設定（WRREQ-015対応）
  - `onDelete: SetNull`: 進化元カードが削除された場合、NULLに設定される
- **CHECK制約**: Prismaスキーマでは直接定義できないため、マイグレーションファイルでSQLのCHECK制約を追加する必要がある
  - `stabilityValue`: -100〜100の範囲（WRREQ-013対応）
  - `energyCost`: 0〜5の範囲（WRREQ-014対応）

## 受け入れ基準の確認

### 必須要件

- [x] PrismaスキーマファイルにCardモデルが定義されている ✅
- [x] すべての必須フィールドが定義されている（name, description, cardType, attribute, stabilityValue, energyCost） ✅
- [x] オプショナルフィールドが適切に定義されている（reactionEffect, imageUrl, rarity, evolutionFromId） ✅
- [x] 共通フィールドが含まれている（id, createdAt, updatedAt, deletedAt） ✅
- [x] UNIQUE制約が`name`フィールドに設定されている ✅
- [x] FOREIGN KEY制約が`evolutionFromId`に設定されている（ON DELETE SET NULL） ✅
- [x] 適切なインデックスが定義されている ✅
- [x] テーブル名が`cards`にマッピングされている ✅
- [x] Prismaスキーマの型チェックが通る ✅
- [ ] CHECK制約が`stabilityValue`（-100〜100）と`energyCost`（0〜5）に設定されている ⚠️（マイグレーション時に追加予定）

### 品質基準

- [x] スキーマ定義が設計文書（database-schema.sql）と一致している ✅
- [x] 型定義（interfaces.ts）と整合性が取れている ✅
- [x] EARS要件（WRREQ-012, WRREQ-013, WRREQ-014, WRREQ-015）を満たしている ✅

## 課題・改善点

### Refactorフェーズで改善すべき点

1. **CHECK制約の追加**: マイグレーションファイルでSQLのCHECK制約を追加する必要がある
   - `stabilityValue`: -100〜100の範囲
   - `energyCost`: 0〜5の範囲

2. **コメントの追加**: 各フィールドに適切なコメントを追加して、可読性を向上させる

3. **ドキュメントの更新**: Prismaスキーマファイルに設計意図を記述する

## 品質判定

✅ **高品質**:
- テスト実行: 成功（Prismaスキーマの検証とPrisma Client生成が成功）
- 期待値: 明確で具体的（すべての必須要件を満たしている）
- アサーション: 適切（Prisma CLIコマンドを使用）
- 実装方針: 明確（ENUM型を定義してからCardモデルを完成させる）

## 関連ファイル

- **要件定義**: `docs/implements/resource-management-webapp/TASK-0012/card-schema-requirements.md`
- **テストケース定義**: `docs/implements/resource-management-webapp/TASK-0012/card-schema-testcases.md`
- **Redフェーズ**: `docs/implements/resource-management-webapp/TASK-0012/card-schema-red-phase.md`
- **Prismaスキーマファイル**: `backend/prisma/schema.prisma`

---

**作成日**: 2025-01-XX  
**作成者**: AI Assistant  
**品質判定**: ✅ 高品質
- テスト実行: 成功（Prismaスキーマの検証とPrisma Client生成が成功）
- 期待値: 明確で具体的
- アサーション: 適切
- 実装方針: 明確

**次のお勧めステップ**: `/tsumiki:tdd-refactor` でRefactorフェーズ（品質改善）を開始します。

