# TDDテストケース: Prismaスキーマ定義（共通フィールド・基本型）

## タスク情報

- **タスクID**: TASK-0011
- **GitHub Issue**: #38
- **機能名**: Prismaスキーマ定義（共通フィールド・基本型）
- **実装タイプ**: TDD
- **テストケース作成日時**: 2025-01-XX

## テストケースの目的

🔵 **信頼性レベル: 青信号** - TDDの標準的なテストケース作成の目的

Prismaスキーマの共通フィールドとENUM型定義が正しく実装されていることを確認するためのテストケースを定義する。

## テストケース一覧

### TC-001: Prismaスキーマの構文検証

**目的**: Prismaスキーマファイルが正しい構文で記述されていることを確認

**前提条件**:
- Prismaがインストールされている
- `backend/prisma/schema.prisma`ファイルが存在する

**実行手順**:
1. `cd backend`
2. `npx prisma validate`を実行

**期待結果**:
- エラーが発生しない
- "The schema is valid"というメッセージが表示される

**重要度**: 🔴 高（必須）

---

### TC-002: CardType ENUM型の定義確認

**目的**: CardType ENUM型が正しく定義されていることを確認

**前提条件**:
- Prismaスキーマファイルが存在する

**実行手順**:
1. `backend/prisma/schema.prisma`を開く
2. `enum CardType`の定義を確認

**期待結果**:
- `enum CardType`が定義されている
- 以下の6つの値が定義されている：
  - `MATERIAL`
  - `OPERATION`
  - `CATALYST`
  - `KNOWLEDGE`
  - `SPECIAL`
  - `ARTIFACT`

**重要度**: 🔴 高（必須）

---

### TC-003: Rarity ENUM型の定義確認

**目的**: Rarity ENUM型が正しく定義されていることを確認

**前提条件**:
- Prismaスキーマファイルが存在する

**実行手順**:
1. `backend/prisma/schema.prisma`を開く
2. `enum Rarity`の定義を確認

**期待結果**:
- `enum Rarity`が定義されている
- 以下の5つの値が定義されている：
  - `COMMON`
  - `UNCOMMON`
  - `RARE`
  - `EPIC`
  - `LEGENDARY`

**重要度**: 🔴 高（必須）

---

### TC-004: NodeType ENUM型の定義確認

**目的**: NodeType ENUM型が正しく定義されていることを確認

**前提条件**:
- Prismaスキーマファイルが存在する

**実行手順**:
1. `backend/prisma/schema.prisma`を開く
2. `enum NodeType`の定義を確認

**期待結果**:
- `enum NodeType`が定義されている
- 以下の5つの値が定義されている：
  - `REQUEST`
  - `MERCHANT`
  - `EXPERIMENT`
  - `MONSTER`
  - `BOSS_REQUEST`

**重要度**: 🔴 高（必須）

---

### TC-005: CurrencyType ENUM型の定義確認

**目的**: CurrencyType ENUM型が正しく定義されていることを確認

**前提条件**:
- Prismaスキーマファイルが存在する

**実行手順**:
1. `backend/prisma/schema.prisma`を開く
2. `enum CurrencyType`の定義を確認

**期待結果**:
- `enum CurrencyType`が定義されている
- 以下の2つの値が定義されている：
  - `FAME`
  - `KNOWLEDGE`

**重要度**: 🔴 高（必須）

---

### TC-006: ContentType ENUM型の定義確認

**目的**: ContentType ENUM型が正しく定義されていることを確認

**前提条件**:
- Prismaスキーマファイルが存在する

**実行手順**:
1. `backend/prisma/schema.prisma`を開く
2. `enum ContentType`の定義を確認

**期待結果**:
- `enum ContentType`が定義されている
- 以下の3つの値が定義されている：
  - `CARD`
  - `CUSTOMER`
  - `MATERIAL`

**重要度**: 🔴 高（必須）

---

### TC-007: BalanceCategory ENUM型の定義確認

**目的**: BalanceCategory ENUM型が正しく定義されていることを確認

**前提条件**:
- Prismaスキーマファイルが存在する

**実行手順**:
1. `backend/prisma/schema.prisma`を開く
2. `enum BalanceCategory`の定義を確認

**期待結果**:
- `enum BalanceCategory`が定義されている
- 以下の4つの値が定義されている：
  - `ENERGY`
  - `HAND`
  - `STABILITY`
  - `PLAYTIME`

**重要度**: 🟡 中（推奨）

---

### TC-008: 共通フィールドのコメント定義確認

**目的**: 共通フィールドの定義がコメントとして記述されていることを確認

**前提条件**:
- Prismaスキーマファイルが存在する

**実行手順**:
1. `backend/prisma/schema.prisma`を開く
2. 共通フィールドのコメントを確認

**期待結果**:
- 以下の共通フィールドの定義がコメントとして記述されている：
  - `id`: String (UUID v4, 主キー)
  - `createdAt`: DateTime (作成日時、自動設定)
  - `updatedAt`: DateTime (更新日時、自動更新)
  - `deletedAt`: DateTime? (削除日時、ソフトデリート用、nullable)

**重要度**: 🟡 中（推奨）

---

### TC-009: Prisma Client生成確認

**目的**: Prisma Clientが正常に生成されることを確認

**前提条件**:
- Prismaスキーマファイルが存在する
- Prismaがインストールされている

**実行手順**:
1. `cd backend`
2. `npx prisma generate`を実行

**期待結果**:
- エラーが発生しない
- Prisma Clientが正常に生成される
- `node_modules/.prisma/client`ディレクトリが作成される

**重要度**: 🔴 高（必須）

---

### TC-010: ENUM型の型定義確認（TypeScript）

**目的**: 生成されたPrisma ClientにENUM型が正しく型定義されていることを確認

**前提条件**:
- Prisma Clientが生成されている

**実行手順**:
1. TypeScriptファイルでPrisma Clientをインポート
2. ENUM型の型定義を確認

**期待結果**:
- 以下のENUM型が型定義されている：
  - `CardType`
  - `Rarity`
  - `NodeType`
  - `CurrencyType`
  - `ContentType`
  - `BalanceCategory`

**重要度**: 🟡 中（推奨）

---

## テスト実行順序

1. TC-001: Prismaスキーマの構文検証
2. TC-002〜TC-007: 各ENUM型の定義確認
3. TC-008: 共通フィールドのコメント定義確認
4. TC-009: Prisma Client生成確認
5. TC-010: ENUM型の型定義確認（TypeScript）

## エッジケース

### EC-001: ENUM値の追加

**シナリオ**: 将来的にENUM値を追加する場合

**期待動作**:
- マイグレーションファイルが生成される
- データベースにENUM値が追加される

### EC-002: ENUM型の削除

**シナリオ**: 使用されていないENUM型を削除する場合

**期待動作**:
- そのENUM型を使用しているモデルがないことを確認
- マイグレーションファイルが生成される

## テストデータ

このテストケースでは、テストデータは不要です（スキーマ定義のみの確認）。

---

**作成日**: 2025-01-XX  
**作成者**: AI Assistant  
**品質判定**: ✅ 高品質
- テストケースの網羅性: 完全
- エッジケースの考慮: 適切
- 実装可能性: 確実

**次のお勧めステップ**: `/tdd-red` で失敗するテストを実装します。

