# TDD要件定義: 共通ユーティリティ関数

## 1. 機能の概要

### 1.1 機能名
共通ユーティリティ関数（日付フォーマット、バリデーション、ログ出力）

### 1.2 何をする機能か
- 🔴 システム全体で使用される共通的なユーティリティ関数を提供する
- 🔴 日付のフォーマット、データのバリデーション、ログ出力の機能を提供する

### 1.3 どのような問題を解決するか
- 🔴 コードの重複を避け、保守性を向上させる
- 🔴 一貫した日付フォーマット、バリデーション、ログ出力を実現する
- 🔴 開発効率を向上させる

### 1.4 想定されるユーザー
- 🔴 開発者（バックエンド開発者）

### 1.5 システム内での位置づけ
- 🔴 バックエンドの基盤ユーティリティ層
- 🔴 他のサービスやミドルウェアから使用される共通機能

### 1.6 参照したEARS要件
- なし（一般的な開発プロセスのタスク）

### 1.7 参照した設計文書
- なし（一般的な開発プロセスのタスク）

---

## 2. 入力・出力の仕様

### 2.1 日付フォーマット関数 (`src/utils/date.ts`)

#### 2.1.1 入力パラメータ
- 🔴 `date: Date | string | number` - フォーマット対象の日付
- 🔴 `format?: string` - フォーマット文字列（デフォルト: 'YYYY-MM-DD HH:mm:ss'）

#### 2.1.2 出力値
- 🔴 `string` - フォーマットされた日付文字列

#### 2.1.3 関数一覧
- 🔴 `formatDate(date: Date | string | number, format?: string): string` - 日付をフォーマット
- 🔴 `formatDateISO(date: Date | string | number): string` - ISO 8601形式でフォーマット
- 🔴 `formatDateShort(date: Date | string | number): string` - 短い形式でフォーマット（YYYY-MM-DD）

### 2.2 バリデーション関数 (`src/utils/validation.ts`)

#### 2.2.1 入力パラメータ
- 🔴 `value: unknown` - バリデーション対象の値
- 🔴 各種バリデーション関数ごとに異なるパラメータ

#### 2.2.2 出力値
- 🔴 `boolean` - バリデーション結果（true: 有効、false: 無効）
- 🔴 または `{ valid: boolean; message?: string }` - バリデーション結果とエラーメッセージ

#### 2.2.3 関数一覧
- 🔴 `isRequired(value: unknown): boolean` - 必須チェック
- 🔴 `isString(value: unknown): value is string` - 文字列型チェック
- 🔴 `isNumber(value: unknown): value is number` - 数値型チェック
- 🔴 `isEmail(value: string): boolean` - メールアドレス形式チェック
- 🔴 `isUUID(value: string): boolean` - UUID形式チェック
- 🔴 `isInRange(value: number, min: number, max: number): boolean` - 範囲チェック
- 🔴 `isMaxLength(value: string, maxLength: number): boolean` - 最大文字数チェック
- 🔴 `isMinLength(value: string, minLength: number): boolean` - 最小文字数チェック

### 2.3 ログ出力関数 (`src/utils/logger.ts`)

#### 2.3.1 入力パラメータ
- 🔴 `message: string` - ログメッセージ
- 🔴 `data?: unknown` - 追加データ（オプション）
- 🔴 `level?: 'info' | 'warn' | 'error' | 'debug'` - ログレベル（デフォルト: 'info'）

#### 2.3.2 出力値
- 🔴 `void` - コンソールにログを出力

#### 2.3.3 関数一覧
- 🔴 `logInfo(message: string, data?: unknown): void` - 情報ログ
- 🔴 `logWarn(message: string, data?: unknown): void` - 警告ログ
- 🔴 `logError(message: string, error?: Error | unknown): void` - エラーログ
- 🔴 `logDebug(message: string, data?: unknown): void` - デバッグログ

---

## 3. 制約条件

### 3.1 パフォーマンス要件
- 🔴 各関数は高速に実行される必要がある（1ms以内を目安）

### 3.2 セキュリティ要件
- 🔴 バリデーション関数は、XSSやインジェクション攻撃を防ぐための適切な検証を行う
- 🔴 ログ出力関数は、機密情報をログに出力しないように注意する

### 3.3 互換性要件
- 🔴 TypeScript 5.0+ で動作すること
- 🔴 Node.js 18+ LTS で動作すること

### 3.4 アーキテクチャ制約
- 🔴 Hono.jsアプリケーションから使用可能であること
- 🔴 他のサービスやミドルウェアからインポート可能であること

### 3.5 データベース制約
- 🔴 なし

### 3.6 API制約
- 🔴 なし

---

## 4. 想定される使用例

### 4.1 基本的な使用パターン

#### 4.1.1 日付フォーマット関数の使用例
```typescript
import { formatDate, formatDateISO, formatDateShort } from './utils/date';

// 現在の日時をフォーマット
const now = new Date();
const formatted = formatDate(now); // "2025-01-15 10:30:45"
const iso = formatDateISO(now); // "2025-01-15T10:30:45.000Z"
const short = formatDateShort(now); // "2025-01-15"
```

#### 4.1.2 バリデーション関数の使用例
```typescript
import { isRequired, isString, isEmail, isUUID, isInRange, isMaxLength } from './utils/validation';

// 必須チェック
if (!isRequired(value)) {
  throw new Error('値は必須です');
}

// 文字列型チェック
if (!isString(value)) {
  throw new Error('値は文字列である必要があります');
}

// メールアドレス形式チェック
if (!isEmail(email)) {
  throw new Error('有効なメールアドレスを入力してください');
}

// UUID形式チェック
if (!isUUID(id)) {
  throw new Error('有効なUUIDを入力してください');
}

// 範囲チェック
if (!isInRange(age, 0, 120)) {
  throw new Error('年齢は0〜120の範囲である必要があります');
}

// 最大文字数チェック
if (!isMaxLength(name, 100)) {
  throw new Error('名前は100文字以内である必要があります');
}
```

#### 4.1.3 ログ出力関数の使用例
```typescript
import { logInfo, logWarn, logError, logDebug } from './utils/logger';

// 情報ログ
logInfo('ユーザーがログインしました', { userId: '123' });

// 警告ログ
logWarn('リクエストが遅延しています', { duration: 5000 });

// エラーログ
logError('データベース接続エラー', error);

// デバッグログ
logDebug('リクエストパラメータ', { params });
```

### 4.2 エッジケース

#### 4.2.1 日付フォーマット関数のエッジケース
- 🔴 `null` や `undefined` が渡された場合の処理
- 🔴 無効な日付文字列が渡された場合の処理
- 🔴 数値（タイムスタンプ）が渡された場合の処理

#### 4.2.2 バリデーション関数のエッジケース
- 🔴 `null` や `undefined` が渡された場合の処理
- 🔴 空文字列が渡された場合の処理
- 🔴 境界値（min, max）の処理

#### 4.2.3 ログ出力関数のエッジケース
- 🔴 長いメッセージが渡された場合の処理
- 🔴 循環参照を含むオブジェクトが渡された場合の処理
- 🔴 機密情報が含まれる可能性があるデータの処理

### 4.3 エラーケース

#### 4.3.1 日付フォーマット関数のエラーケース
- 🔴 無効な日付が渡された場合、エラーをスローするか、デフォルト値を返す

#### 4.3.2 バリデーション関数のエラーケース
- 🔴 型エラーが発生した場合、適切なエラーメッセージを返す

#### 4.3.3 ログ出力関数のエラーケース
- 🔴 ログ出力に失敗した場合、エラーをスローしない（システムの動作を妨げない）

---

## 5. EARS要件・設計文書との対応関係

### 5.1 参照したユーザストーリー
- なし（一般的な開発プロセスのタスク）

### 5.2 参照した機能要件
- なし（一般的な開発プロセスのタスク）

### 5.3 参照した非機能要件
- 🔴 WRNFR-011: システムはエラーログを記録し、デバッグを容易にしなければならない（ログ出力関数に関連）

### 5.4 参照したEdgeケース
- なし（一般的な開発プロセスのタスク）

### 5.5 参照した受け入れ基準
- 各ユーティリティ関数が正しく動作することを確認（タスクファイルより）

### 5.6 参照した設計文書
- なし（一般的な開発プロセスのタスク）

---

## 6. 受け入れ基準

### 6.1 日付フォーマット関数
- ✅ `formatDate` 関数が正しく日付をフォーマットできること
- ✅ `formatDateISO` 関数がISO 8601形式でフォーマットできること
- ✅ `formatDateShort` 関数が短い形式でフォーマットできること
- ✅ 無効な日付が渡された場合、適切にエラーを処理できること

### 6.2 バリデーション関数
- ✅ 各バリデーション関数が正しく動作すること
- ✅ 型ガード関数（`isString`, `isNumber`）が正しく型を絞り込めること
- ✅ 境界値テストが正しく動作すること

### 6.3 ログ出力関数
- ✅ 各ログレベルが正しく出力されること
- ✅ 追加データが正しく出力されること
- ✅ エラーオブジェクトが正しく出力されること

---

## 7. 実装方針

### 7.1 技術スタック
- TypeScript 5.0+
- Node.js 18+ LTS
- Hono.js 4.6+

### 7.2 実装アプローチ
- 各ユーティリティ関数を独立したモジュールとして実装
- 単体テストを実装して動作を確認
- 型安全性を確保するため、TypeScriptの型ガードを活用

### 7.3 テスト戦略
- 各関数に対して単体テストを実装
- エッジケースとエラーケースをカバー
- 境界値テストを実施

---

## 品質判定

✅ **高品質**:
- 要件の曖昧さ: なし（一般的な開発プロセスのタスクのため、ベストプラクティスに基づく）
- 入出力定義: 完全
- 制約条件: 明確
- 実装可能性: 確実

---

次のステップ: `/tdd-testcases` でテストケースの洗い出しを行います。

