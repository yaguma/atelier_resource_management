# TASK-0031: Zodバリデーションスキーマ実装 - TDD要件定義書

## 機能名
**Zodバリデーションスキーマ実装（Card エンティティ向け）**

---

## 1. 機能の概要（EARS要件定義書・設計文書ベース）

### 何をする機能か
- 🔵 **カード作成・更新フォームのバリデーションスキーマをZodで定義する**
  - フロントエンドでカードデータの入力検証を行う
  - TypeScript型安全性を保証し、バリデーションエラーを日本語で表示する
  - react-hook-formと統合して、リアルタイムバリデーションを実現する

### どのような問題を解決するか
- 🔵 **データ品質の保証**: ユーザー入力のバリデーションにより、不正なデータがバックエンドに送信されるのを防ぐ（WRREQ-070より）
- 🔵 **型安全性の確保**: Zodスキーマから TypeScript 型を自動生成し、フロントエンド全体で型安全なコードを実現する（WRREQ-002より）
- 🔴 **ユーザビリティ向上**: 日本語のバリデーションエラーメッセージで、ユーザーに分かりやすいフィードバックを提供する（WRNFR-007より）

### 想定されるユーザー
- 🔵 **ゲーム開発者、ゲームデザイナー**: カード管理画面でカードを作成・編集するユーザー

### システム内での位置づけ
- 🔵 **フロントエンド基盤層**: React + Vite + TypeScript + Zod 技術スタックの一部（WRREQ-001-2, WRREQ-001-5より）
- 🔵 **バリデーション層**: フォーム入力→Zodバリデーション→API送信の流れの中核を担う
- 🔵 **型定義層**: `docs/design/resource-management-webapp/interfaces.ts` の Card 型定義を元に、フロントエンド専用の入力スキーマを定義する

### 参照したEARS要件
- **WRREQ-001-2**: システムのフロントエンドはViteをビルドツールとして使用しなければならない
- **WRREQ-001-5**: システムのフロントエンドはZodでスキーマバリデーションとTypeScript型生成を行わなければならない
- **WRREQ-002**: システムはTypeScriptで型安全に実装されなければならない
- **WRREQ-012**: システムは6種類のカード系統(素材、操作、触媒、知識、特殊、アーティファクト)を管理しなければならない
- **WRREQ-013**: 各カードは名前、説明、カード系統、属性値、安定値、反応効果を持たなければならない
- **WRREQ-014**: 各カードはエネルギーコスト(0〜5)を持たなければならない
- **WRREQ-055**: システムはフォームバリデーションエラーを分かりやすく表示しなければならない
- **WRREQ-070**: APIは入力データのバリデーションを行わなければならない
- **WREDGE-004**: カード名が100文字を超えた場合、システムはバリデーションエラーを表示しなければならない
- **WREDGE-005**: エネルギーコストがマイナス値の場合、システムはバリデーションエラーを表示しなければならない

### 参照した設計文書
- **interfaces.ts**: Card, CardType, CardRarity, CreateCardRequest, UpdateCardRequest 型定義
- **architecture.md**: フロントエンド技術スタック（React + Vite + TypeScript + Zod）
- **phase3-a-foundation.md**: TASK-0031の実装詳細、完了条件、テスト要件

---

## 2. 入力・出力の仕様（EARS機能要件・TypeScript型定義ベース）

### 入力パラメータ
#### Zodスキーマ定義対象フィールド（CreateCardRequest ベース）

| フィールド名 | 型 | 必須 | 制約条件 | デフォルト値 | 参照元 |
|------------|---|-----|---------|------------|-------|
| `name` | string | ✅ | 最小1文字、最大100文字、ユニーク制約 | - | WRREQ-013, interfaces.ts |
| `description` | string | ✅ | 最小1文字、最大1000文字 | - | WRREQ-013, interfaces.ts |
| `cardType` | CardType enum | ✅ | MATERIAL, OPERATION, CATALYST, KNOWLEDGE, SPECIAL, ARTIFACT のいずれか | - | WRREQ-012, interfaces.ts |
| `rarity` | CardRarity enum | ❌ | COMMON, UNCOMMON, RARE, EPIC, LEGENDARY のいずれか、nullable | null | interfaces.ts |
| `attribute` | Record<string, number> | ✅ | 属性キー(fire, water, earth等)と数値のペア、各属性値は 0〜100 | {} | WRREQ-013, interfaces.ts |
| `stabilityValue` | number | ✅ | 整数、範囲: -100〜100 | 0 | WRREQ-013, interfaces.ts |
| `energyCost` | number | ✅ | 整数、範囲: 0〜5 | 0 | WRREQ-014, interfaces.ts |
| `reactionEffect` | string | ❌ | 最大500文字、nullable | null | WRREQ-013, interfaces.ts |
| `imageUrl` | string | ❌ | URL形式、nullable | null | interfaces.ts |
| `evolutionFromId` | string | ❌ | UUID v4 形式、nullable | null | interfaces.ts |

#### 日本語エラーメッセージ定義

| バリデーションルール | 日本語エラーメッセージ | 参照元 |
|--------------------|---------------------|-------|
| 必須フィールド未入力 | `{フィールド名}は必須です` | WRREQ-055 |
| 文字数超過（name） | `カード名は100文字以内で入力してください` | WREDGE-004 |
| 文字数超過（description） | `説明は1000文字以内で入力してください` | WREDGE-004 |
| 文字数超過（reactionEffect） | `反応効果は500文字以内で入力してください` | WREDGE-004 |
| 数値範囲外（energyCost） | `エネルギーコストは0〜5の範囲で入力してください` | WRREQ-014, WREDGE-005 |
| 数値範囲外（stabilityValue） | `安定値は-100〜100の範囲で入力してください` | WRREQ-013 |
| 数値範囲外（attribute） | `属性値は0〜100の範囲で入力してください` | WRREQ-013 |
| Enum型不一致 | `無効なカード系統です` | WRREQ-012 |
| URL形式不正 | `正しいURL形式で入力してください` | interfaces.ts |
| UUID形式不正 | `正しいUUID形式で入力してください` | interfaces.ts |

### 出力値
#### TypeScript型定義のエクスポート

1. 🔵 **createCardSchema**: Zodスキーマオブジェクト（バリデーションルール定義）
2. 🔵 **updateCardSchema**: createCardSchemaのpartial版（すべてのフィールドをオプショナル化）
3. 🔵 **CreateCardInput**: `z.infer<typeof createCardSchema>` で生成されるTypeScript型
4. 🔵 **UpdateCardInput**: `z.infer<typeof updateCardSchema>` で生成されるTypeScript型
5. 🔵 **CardType**: Zod enum スキーマ（cardTypeEnum）
6. 🔵 **CardRarity**: Zod enum スキーマ（cardRarityEnum）

#### react-hook-form統合出力

- 🟡 **zodResolver**: `@hookform/resolvers/zod` を使用して、Zodスキーマを react-hook-form に統合
- 🟡 **formState.errors**: バリデーションエラーを日本語メッセージで表示

### 入出力の関係性
```
ユーザー入力
  ↓
react-hook-form フォーム
  ↓
Zodスキーマバリデーション（createCardSchema / updateCardSchema）
  ↓（バリデーション成功）
CreateCardInput / UpdateCardInput 型
  ↓
Axios API呼び出し（src/api/cards.ts）
  ↓
バックエンドAPI（POST /api/cards, PUT /api/cards/:id）
```

### データフロー
- 🔵 **参照**: `docs/design/resource-management-webapp/dataflow.md` - フォーム送信フロー

---

## 3. 制約条件（EARS非機能要件・アーキテクチャ設計ベース）

### パフォーマンス要件
- 🟡 **バリデーション速度**: フォーム入力時のリアルタイムバリデーションは 100ms 以内に完了すべき（WRNFR-003: 検索・フィルタリング処理を500ms以内）

### セキュリティ要件
- 🔵 **XSS対策**: Zodスキーマで文字列のサニタイズを行う必要はない（React がデフォルトでエスケープ処理を行う）（WRNFR-005より）
- 🔵 **入力検証**: クライアントサイドバリデーション後も、バックエンドで再度検証を行う必要がある（WRREQ-070より）

### 互換性要件
- 🔵 **Zodバージョン**: Zod 3.0以上を使用する（WRREQ-001-5より）
- 🔵 **TypeScriptバージョン**: TypeScript 5.0以上を使用する（WRREQ-002より）
- 🔵 **react-hook-formバージョン**: react-hook-form 7以上、@hookform/resolvers対応（WRREQ-001-5より）

### アーキテクチャ制約
- 🔵 **ファイル配置**: `frontend/src/types/card.ts` に配置する（TASK-0031実装詳細より）
- 🔵 **命名規則**: スキーマ名は `createCardSchema`, `updateCardSchema`、型名は `CreateCardInput`, `UpdateCardInput` とする
- 🟡 **再利用性**: 他のエンティティ（Customer, AlchemyStyle等）でも同様のパターンを適用できるように設計する

### データベース制約
- 🔵 **Prismaスキーマとの整合性**: `backend/prisma/schema.prisma` の Card モデル定義と一致させる必要がある

### API制約
- 🔵 **APIリクエスト型との整合性**: `docs/design/resource-management-webapp/interfaces.ts` の CreateCardRequest, UpdateCardRequest と互換性を保つ

### 参照したEARS要件
- **WRREQ-001-5**: システムのフロントエンドはZodでスキーマバリデーションとTypeScript型生成を行わなければならない
- **WRREQ-002**: システムはTypeScriptで型安全に実装されなければならない
- **WRREQ-070**: APIは入力データのバリデーションを行わなければならない
- **WRNFR-003**: システムは検索・フィルタリング処理を500ms以内に完了しなければならない
- **WRNFR-005**: システムはXSS(クロスサイトスクリプティング)対策を実装しなければならない

### 参照した設計文書
- **architecture.md**: フロントエンド技術スタック制約
- **database-schema.prisma**: Cardモデル定義
- **interfaces.ts**: CreateCardRequest, UpdateCardRequest型定義

---

## 4. 想定される使用例（EARSEdgeケース・データフローベース）

### 基本的な使用パターン（通常要件REQ-XXXから抽出）

#### ケース1: カード新規作成フォームでのバリデーション
```typescript
// frontend/src/pages/cards/CardCreatePage.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCardSchema, CreateCardInput } from '@/types/card';

function CardCreatePage() {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateCardInput>({
    resolver: zodResolver(createCardSchema),
  });

  const onSubmit = (data: CreateCardInput) => {
    // API呼び出し
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      {errors.name && <p>{errors.name.message}</p>} {/* 日本語エラーメッセージ */}
      {/* ... */}
    </form>
  );
}
```

#### ケース2: カード編集フォームでの部分更新バリデーション
```typescript
// frontend/src/pages/cards/CardEditPage.tsx
import { updateCardSchema, UpdateCardInput } from '@/types/card';

function CardEditPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<UpdateCardInput>({
    resolver: zodResolver(updateCardSchema),
  });

  const onSubmit = (data: UpdateCardInput) => {
    // 部分更新API呼び出し
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* 編集可能フィールドのみ表示 */}
    </form>
  );
}
```

### データフロー（dataflow.mdから抽出）
1. 🔵 ユーザーがフォームにカード情報を入力
2. 🔵 react-hook-form が onChange/onBlur イベントで Zod バリデーションを実行
3. 🔵 バリデーションエラーがあれば、日本語メッセージを表示
4. 🔵 バリデーション成功後、送信ボタンが有効化
5. 🔵 送信時、CreateCardInput / UpdateCardInput 型のデータが API に送信される

### エッジケース（EDGE-XXXから抽出）

#### EDGE-1: 必須フィールドが空の場合
- 🔴 **入力**: `name: ""`
- 🔴 **期待動作**: バリデーションエラー「カード名は必須です」を表示
- 🔴 **テスト要件**: 必須フィールド（name, description, cardType, attribute, stabilityValue, energyCost）すべてでテスト

#### EDGE-2: 文字数制限を超えた場合
- 🔴 **入力**: `name: "a".repeat(101)` （101文字）
- 🔴 **期待動作**: バリデーションエラー「カード名は100文字以内で入力してください」を表示
- 🔴 **参照要件**: WREDGE-004

#### EDGE-3: 数値範囲外の場合（エネルギーコスト）
- 🔴 **入力**: `energyCost: -1`
- 🔴 **期待動作**: バリデーションエラー「エネルギーコストは0〜5の範囲で入力してください」を表示
- 🔴 **参照要件**: WRREQ-014, WREDGE-005

#### EDGE-4: 数値範囲外の場合（安定値）
- 🔴 **入力**: `stabilityValue: 150`
- 🔴 **期待動作**: バリデーションエラー「安定値は-100〜100の範囲で入力してください」を表示
- 🔴 **参照要件**: WRREQ-013

#### EDGE-5: Enum型不一致の場合
- 🔴 **入力**: `cardType: "INVALID_TYPE"`
- 🔴 **期待動作**: バリデーションエラー「無効なカード系統です」を表示
- 🔴 **参照要件**: WRREQ-012

#### EDGE-6: オプショナルフィールドがnullの場合
- 🔵 **入力**: `imageUrl: null`, `reactionEffect: null`, `rarity: null`
- 🔵 **期待動作**: バリデーション成功（nullableフィールドのため）
- 🔵 **参照要件**: interfaces.ts

#### EDGE-7: URL形式不正の場合
- 🔴 **入力**: `imageUrl: "not-a-url"`
- 🔴 **期待動作**: バリデーションエラー「正しいURL形式で入力してください」を表示
- 🔴 **参照要件**: interfaces.ts

#### EDGE-8: UUID形式不正の場合
- 🔴 **入力**: `evolutionFromId: "not-a-uuid"`
- 🔴 **期待動作**: バリデーションエラー「正しいUUID形式で入力してください」を表示
- 🔴 **参照要件**: interfaces.ts

#### EDGE-9: 属性値が範囲外の場合
- 🔴 **入力**: `attribute: { fire: 150 }`
- 🔴 **期待動作**: バリデーションエラー「属性値は0〜100の範囲で入力してください」を表示
- 🔴 **参照要件**: WRREQ-013

### エラーケース（EDGE-XXXエラー処理から抽出）

#### ERROR-1: Zodスキーマが定義されていない場合
- 🔴 **状況**: `createCardSchema` が undefined
- 🔴 **期待動作**: TypeScript コンパイルエラー

#### ERROR-2: react-hook-form統合失敗の場合
- 🔴 **状況**: zodResolver が正しく設定されていない
- 🔴 **期待動作**: フォーム送信時にバリデーションが実行されない（実装不備を検出）

### 参照したEARS要件
- **WREDGE-004**: カード名が100文字を超えた場合、システムはバリデーションエラーを表示しなければならない
- **WREDGE-005**: エネルギーコストがマイナス値の場合、システムはバリデーションエラーを表示しなければならない

### 参照した設計文書
- **dataflow.md**: フォーム送信データフロー

---

## 5. EARS要件・設計文書との対応関係

### 参照したユーザストーリー
- **US-001**: ゲーム開発者として、カードを作成・編集したい。そのために、直感的なフォームと明確なバリデーションが必要だ。

### 参照した機能要件
- **WRREQ-001-2**: Viteをビルドツールとして使用
- **WRREQ-001-5**: Zodでスキーマバリデーションと TypeScript型生成
- **WRREQ-002**: TypeScriptで型安全に実装
- **WRREQ-012**: 6種類のカード系統を管理
- **WRREQ-013**: カードの属性定義（名前、説明、属性値、安定値、反応効果）
- **WRREQ-014**: エネルギーコスト(0〜5)
- **WRREQ-055**: フォームバリデーションエラーを分かりやすく表示
- **WRREQ-070**: APIは入力データのバリデーションを行う

### 参照した非機能要件
- **WRNFR-003**: 検索・フィルタリング処理を500ms以内
- **WRNFR-005**: XSS対策を実装
- **WRNFR-007**: 直感的で学習コストの低いUI

### 参照したEdgeケース
- **WREDGE-004**: カード名が100文字を超えた場合のバリデーション
- **WREDGE-005**: エネルギーコストがマイナス値の場合のバリデーション

### 参照した受け入れ基準
- ✅ Zodスキーマが定義されている
- ✅ TypeScript型が自動生成される
- ✅ react-hook-formと統合されている
- ✅ 日本語バリデーションエラーメッセージが表示される
- ✅ 必須フィールド、文字数制限、数値範囲のバリデーションが動作する

### 参照した設計文書

#### アーキテクチャ
- **architecture.md**: フロントエンド技術スタック（React + Vite + TypeScript + Zod）

#### データフロー
- **dataflow.md**: フォーム送信フロー図

#### 型定義
- **interfaces.ts**: Card, CardType, CardRarity, CreateCardRequest, UpdateCardRequest

#### データベース
- **database-schema.prisma**: Cardモデル定義

#### API仕様
- なし（このタスクはフロントエンドのみ）

---

## 品質判定

### ✅ 高品質要件
- ✅ **要件の曖昧さ**: なし（EARS要件定義書と設計文書から明確に導出）
- ✅ **入出力定義**: 完全（すべてのフィールド、制約、エラーメッセージが定義済み）
- ✅ **制約条件**: 明確（Zodバージョン、TypeScriptバージョン、ファイル配置が明確）
- ✅ **実装可能性**: 確実（Zod、react-hook-form、TypeScriptの組み合わせは実績のある技術スタック）

---

## 次のステップ

**お勧めコマンド**: `/tdd-testcases` でテストケースの洗い出しを行います。

---

## 変更履歴

| 日付 | バージョン | 変更内容 |
|------|----------|---------|
| 2025-11-09 | 1.0 | 初版作成。TASK-0031のTDD要件定義書を作成 |
