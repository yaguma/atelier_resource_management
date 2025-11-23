# TDD Refactorフェーズ: Prismaスキーマ定義（Cardテーブル）

## タスク情報

- **タスクID**: TASK-0012
- **GitHub Issue**: #39
- **機能名**: Prismaスキーマ定義（Cardテーブル）
- **実装タイプ**: TDD
- **Refactorフェーズ実行日時**: 2025-01-XX

## Refactorフェーズの目的

🔵 **信頼性レベル: 青信号** - TDDの標準的なRefactorフェーズの目的

Greenフェーズで実装したコードの品質を向上させる：
1. コメントの追加: 各フィールドに適切なコメントを追加して可読性を向上
2. ドキュメントの更新: Prismaスキーマファイルに設計意図を記述
3. コードの整理: セクション分けと構造化で保守性を向上

## 改善内容

### 1. コメントの追加

🔵 **信頼性レベル: 青信号** - 要件定義書から直接導出

各フィールドに以下のコメントを追加：
- **基本情報**: カード名、説明、カード系統、属性値
- **ゲームパラメータ**: 安定値、反応効果、エネルギーコスト
- **表示情報**: 画像URL、レア度
- **進化・合成システム**: 進化元カードID、進化先カード
- **共通フィールド**: 作成日時、更新日時、削除日時

### 2. ドキュメントの更新

🔵 **信頼性レベル: 青信号** - 要件定義書から直接導出

Prismaスキーマファイルの先頭に以下の情報を追加：
- タスク情報（TASK-0012, GitHub Issue #39）
- 要件定義への参照（WRREQ-012, WRREQ-013, WRREQ-014, WRREQ-015）
- セクション分け（ENUM型定義、モデル定義）

### 3. コードの整理

🔴 **信頼性レベル: 赤信号** - 一般的なコード品質向上のベストプラクティスから推測

- **セクション分け**: ENUM型定義とモデル定義を明確に分離
- **構造化**: フィールドを論理的なグループに分類（基本情報、ゲームパラメータ、表示情報、進化・合成システム、共通フィールド）
- **インデックスコメント**: 各インデックスの目的を明記

## 改善後のPrismaスキーマファイル

```prisma
// ============================================================================
// Prismaスキーマ定義: Cardテーブル
// ============================================================================
// TASK-0012: Prismaスキーマ定義（Cardテーブル）
// GitHub Issue: #39
// 
// 要件定義:
// - WRREQ-012: 6種類のカード系統を管理
// - WRREQ-013: 各カードは名前、説明、カード系統、属性値、安定値、反応効果を持つ
// - WRREQ-014: 各カードはエネルギーコスト(0〜5)を持つ
// - WRREQ-015: システムはカードの進化・合成ルールを定義できる
// ============================================================================

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================================================
// ENUM型定義
// ============================================================================

// カード系統型（WRREQ-012）
// 6種類のカード系統: 素材、操作、触媒、知識、特殊、アーティファクト
enum CardType {
  MATERIAL    // 素材カード
  OPERATION   // 操作カード
  CATALYST    // 触媒カード
  KNOWLEDGE   // 知識カード
  SPECIAL     // 特殊カード
  ARTIFACT    // アーティファクト
}

// レア度型
// 5段階のレア度: コモン、アンコモン、レア、エピック、レジェンダリー
enum Rarity {
  COMMON      // コモン
  UNCOMMON    // アンコモン
  RARE        // レア
  EPIC        // エピック
  LEGENDARY   // レジェンダリー
}

// ============================================================================
// モデル定義
// ============================================================================

// Cardモデル: カード管理機能のデータベース基盤
// 要件定義書（WRREQ-012, WRREQ-013, WRREQ-014, WRREQ-015）に基づいて定義
model Card {
  // 主キー
  id            String    @id @default(uuid())

  // 基本情報（WRREQ-013）
  name          String    @db.VarChar(100) @unique  // カード名（最大100文字、ユニーク制約）
  description   String    @db.VarChar(1000)        // 説明（最大1000文字）
  cardType      CardType                           // カード系統（ENUM）
  attribute     Json                               // 属性値（JSON形式、例: {"fire":5,"water":3}）

  // ゲームパラメータ（WRREQ-013, WRREQ-014）
  stabilityValue Int                                // 安定値（範囲: -100〜100、CHECK制約はマイグレーション時に追加）
  reactionEffect String?  @db.VarChar(500)         // 反応効果（最大500文字、オプショナル）
  energyCost    Int                                // エネルギーコスト（範囲: 0〜5、CHECK制約はマイグレーション時に追加）

  // 表示情報
  imageUrl      String?                            // 画像URL（オプショナル）
  rarity        Rarity?                            // レア度（ENUM、オプショナル）

  // 進化・合成システム（WRREQ-015）
  evolutionFromId String? @db.Uuid                 // 進化元カードID（オプショナル、FOREIGN KEY）
  evolutionFrom Card?     @relation("CardEvolution", fields: [evolutionFromId], references: [id], onDelete: SetNull)
  evolutionTo   Card[]    @relation("CardEvolution")  // 進化先カード（1:Nリレーション）

  // 共通フィールド（ソフトデリート対応）
  createdAt     DateTime  @default(now())          // 作成日時（自動設定）
  updatedAt     DateTime  @updatedAt               // 更新日時（自動更新）
  deletedAt     DateTime?                         // 削除日時（ソフトデリート用、オプショナル）

  // インデックス定義（検索・フィルタリング性能向上のため）
  @@index([name])              // カード名検索用
  @@index([cardType])          // カード系統フィルタリング用
  @@index([rarity])            // レア度フィルタリング用
  @@index([energyCost])        // エネルギーコストフィルタリング用
  @@index([evolutionFromId])  // 進化元カード検索用
  @@index([deletedAt])         // ソフトデリート用（WHERE deletedAt IS NULL）

  // テーブル名マッピング（スネークケース）
  @@map("cards")
}
```

## テスト結果

### Prismaスキーマの検証

🔵 **信頼性レベル: 青信号** - 実際に実行した結果

```bash
$ npx prisma validate
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
The schema at prisma/schema.prisma is valid 🚀
```

**結果**: ✅ 成功（exit code 0、エラーメッセージなし）

## 改善の効果

### 可読性の向上

🔴 **信頼性レベル: 赤信号** - 一般的なコード品質向上のベストプラクティスから推測

- **コメント追加**: 各フィールドの目的と制約が明確になった
- **セクション分け**: ENUM型定義とモデル定義が明確に分離された
- **構造化**: フィールドが論理的なグループに分類され、理解しやすくなった

### 保守性の向上

🔴 **信頼性レベル: 赤信号** - 一般的なコード品質向上のベストプラクティスから推測

- **ドキュメント追加**: 要件定義への参照が明確になった
- **設計意図の記述**: 各フィールドの設計意図が明確になった
- **インデックスコメント**: 各インデックスの目的が明確になった

## 品質判定

✅ **高品質**:
- テスト実行: 成功（Prismaスキーマの検証が成功）
- 可読性: 向上（コメント追加、セクション分け、構造化）
- 保守性: 向上（ドキュメント追加、設計意図の記述）
- 実装方針: 明確（品質向上のための改善が完了）

## 関連ファイル

- **要件定義**: `docs/implements/resource-management-webapp/TASK-0012/card-schema-requirements.md`
- **テストケース定義**: `docs/implements/resource-management-webapp/TASK-0012/card-schema-testcases.md`
- **Redフェーズ**: `docs/implements/resource-management-webapp/TASK-0012/card-schema-red-phase.md`
- **Greenフェーズ**: `docs/implements/resource-management-webapp/TASK-0012/card-schema-green-phase.md`
- **Prismaスキーマファイル**: `backend/prisma/schema.prisma`

---

**作成日**: 2025-01-XX  
**作成者**: AI Assistant  
**品質判定**: ✅ 高品質
- テスト実行: 成功（Prismaスキーマの検証が成功）
- 可読性: 向上
- 保守性: 向上
- 実装方針: 明確

**次のお勧めステップ**: `/tsumiki:tdd-verify-complete` で品質確認フェーズを開始します。

