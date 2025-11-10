# TASK-0009: バリデーションミドルウェア実装 - 要件定義書

## 1. タスク概要

**タスク名**: バリデーションミドルウェア実装
**タスクID**: TASK-0009
**タスクタイプ**: TDD
**推定工数**: 4時間
**担当フェーズ**: Phase 1-B（Day 7）

### 目的
Hono.jsとZodを使用して、APIリクエストのバリデーションを行うミドルウェアを実装する。バリデーションエラーが発生した場合は、体系的なエラーコード（VALID_001〜VALID_004）を含む構造化されたエラーレスポンスを返す。

### 背景
フロントエンドからのリクエストデータを検証し、データ品質を保証するため、サーバー側バリデーションが必要である。Zodスキーマを使用することで、型安全かつ明確なバリデーションルールを定義できる。

---

## 2. 要件マッピング

### 機能要件
- 🔴 **WRREQ-070**: APIは入力データのバリデーションを行わなければならない
- 🟡 **WRREQ-070-2**: APIはHono.jsのミドルウェアを活用してバリデーション、ロギング、エラーハンドリングを実装しなければならない

### 設計文書
- 🔵 **api-endpoints.md**: バリデーションエラーコード（VALID_xxx）の定義
- 🔵 **architecture.md**: バリデーションミドルウェアの役割と構成

### 依存タスク
- **TASK-0007**: Hono.js APIセットアップ（完了済み）
- **TASK-0008A**: エラーコード定数定義（完了済み）

---

## 3. 機能要件

### 3.1 バリデーション対象
🔵 以下のリクエストデータをバリデーションする：
- **リクエストボディ（body）**: POST/PUTリクエストのJSONデータ
- **クエリパラメータ（query）**: GETリクエストのクエリ文字列

### 3.2 バリデーションエラーコード
🔵 設計文書（api-endpoints.md）に基づくエラーコード：

| コード | HTTPステータス | 説明 | 発生条件 |
|--------|---------------|------|---------|
| VALID_001 | 400 | バリデーションエラー | リクエストデータの形式・範囲が不正 |
| VALID_002 | 400 | 型不一致 | 期待される型と異なる |
| VALID_003 | 400 | 必須フィールド不足 | 必須フィールドが未入力 |
| VALID_004 | 400 | 範囲外の値 | 数値が許容範囲外（例: energyCost > 5） |

### 3.3 エラーレスポンスフォーマット
🔵 ZodErrorを以下の構造化レスポンスに変換する：

```typescript
{
  error: {
    code: "VALID_001",           // 親エラーコード
    message: "入力データが不正です",  // 親エラーメッセージ
    details: [                    // 各フィールドのエラー詳細
      {
        field: "energyCost",
        message: "エネルギーコストは0〜5の範囲で入力してください",
        code: "VALID_004"
      },
      {
        field: "name",
        message: "名前は必須です",
        code: "VALID_003"
      }
    ]
  }
}
```

### 3.4 バリデーション成功時の動作
🟡 バリデーション済みデータをHonoコンテキストに設定：
```typescript
c.set('validated', validatedData);
```

これにより、後続のハンドラーで型安全なデータにアクセスできる。

---

## 4. 入力仕様

### 4.1 ミドルウェア関数のシグネチャ
```typescript
function validate(
  schema: z.ZodSchema,     // Zodバリデーションスキーマ
  target: 'body' | 'query' // バリデーション対象
): MiddlewareHandler
```

### 4.2 使用例
```typescript
import { validate } from './middlewares/validation';
import { createCardSchema } from './types/validation';

// POSTリクエストのbodyをバリデーション
app.post('/api/cards', validate(createCardSchema, 'body'), async (c) => {
  const validated = c.get('validated');  // 型安全なデータ取得
  // ...
});

// GETリクエストのqueryをバリデーション
app.get('/api/cards', validate(paginationSchema, 'query'), async (c) => {
  const validated = c.get('validated');
  // ...
});
```

### 4.3 Zodスキーマ例
🟡 `src/types/validation.ts` で定義：

```typescript
import { z } from 'zod';

// カード作成スキーマ例
export const createCardSchema = z.object({
  name: z.string().min(1, '名前は必須です'),
  cardType: z.enum(['素材カード', '調合カード', '参考書'], {
    errorMap: () => ({ message: 'カード種別が不正です' })
  }),
  energyCost: z.number().min(0).max(5, 'エネルギーコストは0〜5の範囲で入力してください'),
  stabilityValue: z.number().min(-100).max(100).optional(),
});

// ページネーションスキーマ例
export const paginationSchema = z.object({
  page: z.string().transform(Number).pipe(z.number().min(1)).optional(),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional(),
});
```

---

## 5. 出力仕様

### 5.1 成功時
- **ステータスコード**: なし（次のミドルウェア/ハンドラーに処理を渡す）
- **Honoコンテキスト**: `c.set('validated', validatedData)` でデータを設定

### 5.2 失敗時
- **ステータスコード**: 400 Bad Request
- **レスポンスボディ**:
```typescript
{
  error: {
    code: "VALID_001",
    message: string,
    details: Array<{
      field: string,
      message: string,
      code: string  // VALID_002, VALID_003, VALID_004
    }>
  }
}
```

---

## 6. 制約条件

### 6.1 技術制約
- 🔵 **Zod 3.0+** を使用する
- 🔵 **Hono.js** のミドルウェアパターンに準拠する
- 🔵 **エラーコード定数**（src/constants/errorCodes.ts）を使用する

### 6.2 パフォーマンス制約
- 🟡 バリデーション処理は **10ms以内** に完了すること
- 🟡 大量のフィールド（50個以上）でも効率的にバリデーションできること

### 6.3 エラーメッセージ制約
- 🔴 エラーメッセージは **日本語** で記述すること
- 🔴 ユーザーに分かりやすい表現を使用すること（例: 「nameは必須です」ではなく「名前は必須です」）

---

## 7. エラーコード詳細マッピング

### 7.1 ZodErrorからエラーコードへの変換ロジック

| Zodエラータイプ | エラーコード | 説明 |
|----------------|------------|------|
| `invalid_type` | VALID_002 | 型不一致（例: 数値を期待しているが文字列が来た） |
| `too_small` (string) | VALID_003 | 必須フィールド不足（min(1)の文字列） |
| `too_small` (number) | VALID_004 | 範囲外の値（最小値未満） |
| `too_big` | VALID_004 | 範囲外の値（最大値超過） |
| `invalid_enum_value` | VALID_002 | 型不一致（列挙型の値が不正） |
| その他 | VALID_001 | 一般的なバリデーションエラー |

---

## 8. 実装ファイル

### 8.1 作成するファイル
1. 🔵 **src/middlewares/validation.ts**: バリデーションミドルウェア本体
2. 🟡 **src/types/validation.ts**: Zodスキーマ定義（例: createCardSchema, paginationSchema）

### 8.2 既存ファイルの参照
- **src/constants/errorCodes.ts**: エラーコード定数（TASK-0008Aで作成済み）
- **src/types/index.ts**: 型定義（ApiError, ValidationErrorDetailなど）

---

## 9. テスト要件

### 9.1 正常系テスト
- ✅ 有効なbodyデータでバリデーション成功
- ✅ 有効なqueryデータでバリデーション成功
- ✅ バリデーション済みデータが `c.get('validated')` で取得できる

### 9.2 異常系テスト
- ✅ 必須フィールド不足時にVALID_003エラーが返る
- ✅ 型不一致時にVALID_002エラーが返る
- ✅ 範囲外の値でVALID_004エラーが返る
- ✅ 複数フィールドエラー時にdetails配列に全エラーが含まれる

### 9.3 境界値テスト
- ✅ 最小値・最大値でバリデーション成功
- ✅ 最小値-1、最大値+1でVALID_004エラーが返る

---

## 10. 完了条件

- [ ] バリデーションミドルウェアが動作する
- [ ] bodyとqueryの両方をバリデーションできる
- [ ] 🔵 ZodエラーがVALID_001〜VALID_004コード付きレスポンスに変換される
- [ ] バリデーションエラー時に400ステータスが返る
- [ ] エラーレスポンスが正しい形式である（code, message, details）
- [ ] バリデーション済みデータが `c.get('validated')` で取得できる
- [ ] 全テストケースが合格する
- [ ] TypeScriptのコンパイルエラーがない

---

## 11. 信号インジケータ凡例

- 🔵: 設計文書から確認された要件
- 🟡: 設計文書から合理的に推測される要件
- 🔴: 一般的なベストプラクティスに基づく要件

---

## 12. 参考資料

### 設計文書
- `docs/design/resource-management-webapp/api-endpoints.md`: エラーコード定義
- `docs/design/resource-management-webapp/architecture.md`: ミドルウェア構成

### 要件文書
- `docs/requirements/resource-management-webapp-requirements.md`: WRREQ-070, WRREQ-070-2

### タスクファイル
- `docs/tasks/resource-management-webapp-phase1-b-middleware.md`: TASK-0009詳細

---

**作成日**: 2025-11-10
**作成者**: Claude (TDDプロセス: Requirements Phase)
