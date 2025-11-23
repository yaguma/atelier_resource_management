# TDD Redフェーズ: Prismaスキーマ定義（Cardテーブル）

## タスク情報

- **タスクID**: TASK-0012
- **GitHub Issue**: #39
- **機能名**: Prismaスキーマ定義（Cardテーブル）
- **実装タイプ**: TDD
- **Redフェーズ実行日時**: 2025-01-XX

## Redフェーズの目的

🔵 **信頼性レベル: 青信号** - TDDの標準的なRedフェーズの目的

Prismaスキーマ定義のテストとして、以下のことを確認する：
1. PrismaスキーマファイルにCardモデルを定義する
2. 依存タスクTASK-0011が未完了の状態（ENUM型が定義されていない）でCardモデルを作成する
3. Prismaの検証コマンド（`prisma validate`）を実行して、エラーが発生することを確認する

## 作成したPrismaスキーマファイル

**ファイルパス**: `backend/prisma/schema.prisma`

```prisma
// Prismaスキーマ定義（Cardテーブル）
// TASK-0012: Prismaスキーマ定義（Cardテーブル）
// GitHub Issue: #39

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// 🔴 Redフェーズ: ENUM型が定義されていない状態でCardモデルを作成
// 依存タスクTASK-0011が未完了のため、ENUM型（CardType, Rarity）が定義されていない
// この状態でCardモデルを作成すると、Prismaの検証でエラーが発生することを確認する

model Card {
  id            String    @id @default(uuid())
  name          String    @db.VarChar(100) @unique
  description   String    @db.VarChar(1000)
  cardType      CardType  // 🔴 エラー: CardType ENUMが定義されていない
  attribute     Json
  stabilityValue Int
  reactionEffect String?  @db.VarChar(500)
  energyCost    Int
  imageUrl      String?
  rarity        Rarity?   // 🔴 エラー: Rarity ENUMが定義されていない
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

## テスト実行コマンド

```bash
cd backend
npx prisma validate
```

## 期待される失敗メッセージ

🔵 **信頼性レベル: 青信号** - 実際に実行した結果

### 実行結果

```bash
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma

Error: Prisma schema validation - (validate wasm)
Error code: P1012
error: Type "CardType" is neither a built-in type, nor refers to another model, composite type, or enum.
  -->  prisma/schema.prisma:22
   | 
21 |   description   String    @db.VarChar(1000)
22 |   cardType      CardType  // 🔴 エラー: CardType ENUMが定義されていない
   | 
error: Type "Rarity" is neither a built-in type, nor refers to another model, composite type, or enum.
  -->  prisma/schema.prisma:28
   | 
27 |   imageUrl      String?
28 |   rarity        Rarity?   // 🔴 エラー: Rarity ENUMが定義されていない
   | 
error: Error validating model "Card": The index definition refers to the relation fields cardType. Index definitions must reference only scalar fields.
  -->  prisma/schema.prisma:37
   | 
36 |   @@index([name])
37 |   @@index([cardType])
   | 
error: Error validating model "Card": The index definition refers to the relation fields rarity. Index definitions must reference only scalar fields.
  -->  prisma/schema.prisma:38
   | 
37 |   @@index([cardType])
38 |   @@index([rarity])
   | 

Validation Error Count: 4
[Context: validate]

Prisma CLI Version : 5.22.0
```

### エラー内容の説明

🔵 **信頼性レベル: 青信号** - Prisma公式ドキュメントに基づく標準的なエラーメッセージ

1. **CardType ENUM未定義エラー**:
   - `Type "CardType" is neither a built-in type, nor refers to another model, composite type, or enum.`
   - Cardモデルの`cardType`フィールドが`CardType`型を参照しているが、`CardType` ENUMが定義されていない

2. **Rarity ENUM未定義エラー**:
   - `Type "Rarity" is neither a built-in type, nor refers to another model, composite type, or enum.`
   - Cardモデルの`rarity`フィールドが`Rarity?`型を参照しているが、`Rarity` ENUMが定義されていない

3. **インデックス定義エラー（cardType）**:
   - `The index definition refers to the relation fields cardType. Index definitions must reference only scalar fields.`
   - `cardType`フィールドにインデックスを設定しようとしているが、ENUM型が定義されていないため、スカラー型として認識されていない

4. **インデックス定義エラー（rarity）**:
   - `The index definition refers to the relation fields rarity. Index definitions must reference only scalar fields.`
   - `rarity`フィールドにインデックスを設定しようとしているが、ENUM型が定義されていないため、スカラー型として認識されていない

## テスト結果の確認

✅ **Redフェーズ成功**: Prismaスキーマの検証で期待通りのエラーが発生した

- **エラー数**: 4個
- **エラーの種類**: ENUM型未定義エラー（2個）、インデックス定義エラー（2個）
- **エラーの原因**: 依存タスクTASK-0011で定義されるべきENUM型（CardType, Rarity）が定義されていない

## 次のフェーズ（Greenフェーズ）への要求事項

🔵 **信頼性レベル: 青信号** - 要件定義書から直接導出

Greenフェーズで実装すべき内容：

1. **ENUM型の定義**:
   - `CardType` ENUMを定義（値: `MATERIAL`, `OPERATION`, `CATALYST`, `KNOWLEDGE`, `SPECIAL`, `ARTIFACT`）
   - `Rarity` ENUMを定義（値: `COMMON`, `UNCOMMON`, `RARE`, `EPIC`, `LEGENDARY`）

2. **Cardモデルの修正**:
   - `cardType`フィールドが`CardType` ENUMを正しく参照することを確認
   - `rarity`フィールドが`Rarity?` ENUMを正しく参照することを確認
   - インデックス定義が正しく動作することを確認

3. **検証コマンドの成功確認**:
   - `prisma validate`コマンドが正常に完了する（exit code 0）
   - エラーメッセージが出力されない

4. **Prisma Client生成の確認**:
   - `prisma generate`コマンドが正常に完了する
   - Card型が利用可能になる

## 品質判定

✅ **高品質**:
- テスト実行: 成功（期待通りのエラーが発生した）
- 期待値: 明確で具体的（ENUM型未定義エラーが発生することを確認）
- アサーション: 適切（Prismaの検証コマンドを使用）
- 実装方針: 明確（ENUM型を定義してからCardモデルを完成させる）

## 関連ファイル

- **要件定義**: `docs/implements/resource-management-webapp/TASK-0012/card-schema-requirements.md`
- **テストケース定義**: `docs/implements/resource-management-webapp/TASK-0012/card-schema-testcases.md`
- **Prismaスキーマファイル**: `backend/prisma/schema.prisma`

---

**作成日**: 2025-01-XX  
**作成者**: AI Assistant  
**品質判定**: ✅ 高品質
- テスト実行: 成功（期待通りのエラーが発生した）
- 期待値: 明確で具体的
- アサーション: 適切
- 実装方針: 明確

**次のお勧めステップ**: `/tsumiki:tdd-green` でGreenフェーズ（最小実装）を開始します。

