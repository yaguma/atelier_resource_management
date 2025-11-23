# TDD Redフェーズ: Prismaスキーマ定義（共通フィールド・基本型）

## タスク情報

- **タスクID**: TASK-0011
- **GitHub Issue**: #38
- **機能名**: Prismaスキーマ定義（共通フィールド・基本型）
- **実装タイプ**: TDD
- **Redフェーズ実行日時**: 2025-01-XX

## Redフェーズの目的

🔵 **信頼性レベル: 青信号** - TDDの標準的なRedフェーズの目的

必要なENUM型が定義されていない状態を確認し、後続のタスクで必要なENUM型が不足していることを検証する。

## 現在の状態確認

### 既に定義されているENUM型

現在のPrismaスキーマファイル（`backend/prisma/schema.prisma`）には、以下のENUM型が定義されています：

- ✅ `CardType` - カード系統型（6種類）
- ✅ `Rarity` - レア度型（5種類）

### 不足しているENUM型

TASK-0011の要件に基づき、以下のENUM型が不足しています：

- ❌ `NodeType` - ノードタイプ型（5種類: REQUEST, MERCHANT, EXPERIMENT, MONSTER, BOSS_REQUEST）
- ❌ `CurrencyType` - 通貨タイプ型（2種類: FAME, KNOWLEDGE）
- ❌ `ContentType` - コンテンツタイプ型（3種類: CARD, CUSTOMER, MATERIAL）
- ❌ `BalanceCategory` - バランス設定カテゴリ型（4種類: ENERGY, HAND, STABILITY, PLAYTIME）

## 検証テスト

### テスト1: Prismaスキーマの検証

**実行コマンド**:
```bash
cd backend
npx prisma validate
```

**期待結果**: 
- スキーマの構文は正しい（既存のENUM型とCardモデルは正しく定義されている）
- ただし、後続のタスク（TASK-0013, TASK-0014）で必要なENUM型が不足している

### テスト2: 不足しているENUM型の確認

**確認内容**:
- `NodeType` ENUM型が定義されていない
- `CurrencyType` ENUM型が定義されていない
- `ContentType` ENUM型が定義されていない
- `BalanceCategory` ENUM型が定義されていない

**期待結果**:
- これらのENUM型が定義されていないことを確認
- 後続のタスクでこれらのENUM型を使用する際にエラーが発生することを想定

## 次のステップ（Greenフェーズ）

Greenフェーズでは、以下のENUM型を追加します：

1. `NodeType` ENUM型の定義
2. `CurrencyType` ENUM型の定義
3. `ContentType` ENUM型の定義
4. `BalanceCategory` ENUM型の定義
5. 共通フィールドのコメント定義

---

**作成日**: 2025-01-XX  
**作成者**: AI Assistant  
**品質判定**: ✅ 高品質
- Redフェーズの目的: 明確
- 不足しているENUM型: 特定済み
- 次のステップ: 明確

**次のお勧めステップ**: `/tdd-green` で不足しているENUM型を追加します。

