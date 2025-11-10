# TASK-0008: CORSミドルウェア実装（詳細設定） - TDDテストケース一覧

## 開発言語・フレームワーク

### 🔵 青信号（確実な技術選択）

- **プログラミング言語**: TypeScript 5.0+
  - **言語選択の理由**: プロジェクト全体でTypeScriptを使用しているため（要件WRREQ-002より）
  - **テストに適した機能**: 型安全性により、テストコードの品質が向上し、リファクタリングが容易

- **テストフレームワーク**: Vitest 1.0+
  - **フレームワーク選択の理由**: Vite/Hono.jsプロジェクトとの相性が良く、高速で設定が簡単
  - **テスト実行環境**: Node.js環境、開発環境（npm run test）

- **モックライブラリ**: Vitestの組み込みモック機能
  - **選択理由**: 追加ライブラリ不要で、環境変数のモックが容易

- **HTTPテストライブラリ**: Hono.jsのテストヘルパー
  - **選択理由**: Hono.jsの公式テストヘルパーを使用することで、実際のリクエスト・レスポンスをシミュレート可能

---

## テストケースの分類

### 1. 正常系テストケース（基本的な動作）

#### 🔵 TC-001: CORSミドルウェアが正しいヘッダーを設定する

- **テスト名**: CORSミドルウェアが正しいAccess-Control-*ヘッダーを設定する
  - **何をテストするか**: CORSミドルウェアが適用された後、レスポンスに正しいCORSヘッダーが含まれることを確認
  - **期待される動作**: `Access-Control-Allow-Origin`、`Access-Control-Allow-Credentials`、`Access-Control-Allow-Methods`、`Access-Control-Allow-Headers`、`Access-Control-Expose-Headers`、`Access-Control-Max-Age`ヘッダーが正しく設定される

- **入力値**:
  ```typescript
  - HTTPメソッド: GET
  - リクエストURL: /api/health
  - リクエストヘッダー:
    - Origin: 'http://localhost:5173'
  - 環境変数:
    - CORS_ORIGIN: 'http://localhost:5173'
  ```
  - **入力データの意味**: 開発環境で最も一般的なフロントエンドからのリクエストを想定

- **期待される結果**:
  ```typescript
  - レスポンスステータス: 200 OK
  - レスポンスヘッダー:
    - Access-Control-Allow-Origin: 'http://localhost:5173'
    - Access-Control-Allow-Credentials: 'true'
    - Access-Control-Allow-Methods: 'GET, POST, PUT, DELETE, OPTIONS'
    - Access-Control-Allow-Headers: 'Content-Type, Authorization, X-Requested-With'
    - Access-Control-Expose-Headers: 'X-Total-Count, X-Page, X-Limit'
    - Access-Control-Max-Age: '86400'
  ```
  - **期待結果の理由**: 設計文書（architecture.md）の「CORS設定項目の詳細」に基づく

- **テストの目的**: CORSミドルウェアが要件通りに動作することを確認
  - **確認ポイント**: 全ての必須CORSヘッダーが正しい値で設定されていること

- 🔵 **青信号**: 設計文書（architecture.md）に明記されている設定項目をそのままテスト

---

#### 🔵 TC-002: プリフライトリクエスト（OPTIONS）が正常に処理される

- **テスト名**: プリフライトリクエスト（OPTIONS）が200 OKを返し、CORSヘッダーが設定される
  - **何をテストするか**: ブラウザが自動的に送信するプリフライトリクエスト（OPTIONS）が正しく処理されることを確認
  - **期待される動作**: OPTIONSリクエストに対して200 OKを返し、適切なCORSヘッダーが設定される

- **入力値**:
  ```typescript
  - HTTPメソッド: OPTIONS
  - リクエストURL: /api/cards
  - リクエストヘッダー:
    - Origin: 'http://localhost:5173'
    - Access-Control-Request-Method: 'POST'
    - Access-Control-Request-Headers: 'Content-Type'
  - 環境変数:
    - CORS_ORIGIN: 'http://localhost:5173'
  ```
  - **入力データの意味**: フロントエンドからPOSTリクエストを送信する前にブラウザが自動的に送信するプリフライトリクエスト

- **期待される結果**:
  ```typescript
  - レスポンスステータス: 200 OK（または204 No Content）
  - レスポンスヘッダー:
    - Access-Control-Allow-Origin: 'http://localhost:5173'
    - Access-Control-Allow-Methods: 'GET, POST, PUT, DELETE, OPTIONS'
    - Access-Control-Allow-Headers: 'Content-Type, Authorization, X-Requested-With'
    - Access-Control-Max-Age: '86400'
  ```
  - **期待結果の理由**: プリフライトリクエストが成功することで、実際のPOSTリクエストがブラウザによって許可される

- **テストの目的**: プリフライトリクエストが正しく処理されることを確認
  - **確認ポイント**: ブラウザのCORSポリシーチェックを通過できること

- 🔵 **青信号**: CORSの標準仕様（MDN、W3C仕様）に基づく動作

---

#### 🔵 TC-003: exposeHeadersでページネーションヘッダーが公開される

- **テスト名**: exposeHeadersによってページネーションヘッダー（X-Total-Count、X-Page、X-Limit）が公開される
  - **何をテストするか**: `Access-Control-Expose-Headers`にページネーションヘッダーが含まれていることを確認
  - **期待される動作**: フロントエンドがページネーションヘッダー（X-Total-Count、X-Page、X-Limit）を読み取れる

- **入力値**:
  ```typescript
  - HTTPメソッド: GET
  - リクエストURL: /api/cards?page=1&limit=10
  - リクエストヘッダー:
    - Origin: 'http://localhost:5173'
  - 環境変数:
    - CORS_ORIGIN: 'http://localhost:5173'
  ```
  - **入力データの意味**: ページネーション機能を持つAPIエンドポイントへのリクエスト

- **期待される結果**:
  ```typescript
  - レスポンスヘッダー:
    - Access-Control-Expose-Headers: 'X-Total-Count, X-Page, X-Limit'
  ```
  - **期待結果の理由**: フロントエンドがページネーション情報を取得するために必須（設計文書architecture.mdより）

- **テストの目的**: ページネーションヘッダーがフロントエンドに公開されることを確認
  - **確認ポイント**: `Access-Control-Expose-Headers`にX-Total-Count、X-Page、X-Limitが含まれていること

- 🔵 **青信号**: 設計文書（architecture.md）の「CORS設定項目の詳細」に明記されている

---

#### 🟡 TC-004: 全てのHTTPメソッドでCORSヘッダーが設定される

- **テスト名**: GET、POST、PUT、DELETE、OPTIONSの全てのメソッドでCORSヘッダーが設定される
  - **何をテストするか**: CORSミドルウェアが全てのHTTPメソッドに対して一貫してCORSヘッダーを設定することを確認
  - **期待される動作**: どのHTTPメソッドでも同じCORSヘッダーが設定される

- **入力値**:
  ```typescript
  - HTTPメソッド: GET, POST, PUT, DELETE, OPTIONS（それぞれテスト）
  - リクエストURL: /api/health
  - リクエストヘッダー:
    - Origin: 'http://localhost:5173'
  - 環境変数:
    - CORS_ORIGIN: 'http://localhost:5173'
  ```
  - **入力データの意味**: API操作で使用される全てのHTTPメソッドをカバー

- **期待される結果**:
  ```typescript
  - 全てのメソッドで以下のヘッダーが設定される:
    - Access-Control-Allow-Origin: 'http://localhost:5173'
    - Access-Control-Allow-Credentials: 'true'
  ```
  - **期待結果の理由**: CORSミドルウェアは`app.use('*', corsMiddleware)`で全ルートに適用されるため

- **テストの目的**: CORSミドルウェアが全てのHTTPメソッドで一貫して動作することを確認
  - **確認ポイント**: メソッドによって動作が変わらないこと

- 🟡 **黄信号**: 設計文書に明示されていないが、ミドルウェアの一般的な動作から妥当な推測

---

### 2. 境界値テストケース（最小値、最大値、null等）

#### 🔵 TC-005: 環境変数CORS_ORIGINが未設定の場合、デフォルト値が使用される

- **テスト名**: 環境変数CORS_ORIGINが未設定の場合、デフォルト値'http://localhost:5173'が使用される
  - **境界値の意味**: 環境変数が設定されていない場合の動作を確認
  - **境界値での動作保証**: 環境変数未設定でも正常に動作すること

- **入力値**:
  ```typescript
  - HTTPメソッド: GET
  - リクエストURL: /api/health
  - リクエストヘッダー:
    - Origin: 'http://localhost:5173'
  - 環境変数:
    - CORS_ORIGIN: undefined（未設定）
  ```
  - **境界値選択の根拠**: 開発環境で環境変数が未設定の場合でも動作する必要がある
  - **実際の使用場面**: 初めてプロジェクトをクローンした開発者が環境変数を設定し忘れた場合

- **期待される結果**:
  ```typescript
  - レスポンスヘッダー:
    - Access-Control-Allow-Origin: 'http://localhost:5173'（デフォルト値）
  ```
  - **境界での正確性**: デフォルト値が正しく適用されること
  - **一貫した動作**: 環境変数設定時と同じ動作をすること

- **テストの目的**: 環境変数未設定時のフォールバック動作を確認
  - **堅牢性の確認**: 設定ミスがあっても開発環境では動作すること

- 🔵 **青信号**: タスクファイル（phase1-b-middleware.md）のTASK-0008実装詳細に`process.env.CORS_ORIGIN || 'http://localhost:5173'`と明記されている

---

#### 🟡 TC-006: 環境変数CORS_ORIGINが空文字列の場合、デフォルト値が使用される

- **テスト名**: 環境変数CORS_ORIGINが空文字列の場合、デフォルト値が使用される
  - **境界値の意味**: 空文字列が設定された場合の動作を確認
  - **境界値での動作保証**: 無効な設定値でも安全に動作すること

- **入力値**:
  ```typescript
  - HTTPメソッド: GET
  - リクエストURL: /api/health
  - リクエストヘッダー:
    - Origin: 'http://localhost:5173'
  - 環境変数:
    - CORS_ORIGIN: ''（空文字列）
  ```
  - **境界値選択の根拠**: 環境変数が意図せず空文字列に設定された場合の安全性を確認
  - **実際の使用場面**: .envファイルで`CORS_ORIGIN=`と誤って記載された場合

- **期待される結果**:
  ```typescript
  - レスポンスヘッダー:
    - Access-Control-Allow-Origin: 'http://localhost:5173'（デフォルト値）
  ```
  - **境界での正確性**: 空文字列がfalsy値として扱われ、デフォルト値が適用されること
  - **一貫した動作**: 未設定時と同じ動作をすること

- **テストの目的**: 無効な環境変数設定時の安全性を確認
  - **堅牢性の確認**: 設定ミスがあってもシステムが安全に動作すること

- 🟡 **黄信号**: 設計文書に明示されていないが、JavaScriptのfalsyな値の扱いから妥当な推測

---

#### 🟡 TC-007: maxAgeが86400秒（24時間）に設定される

- **テスト名**: Access-Control-Max-Ageが86400秒（24時間）に設定される
  - **境界値の意味**: プリフライトリクエストのキャッシュ時間が正しく設定されることを確認
  - **境界値での動作保証**: ブラウザがプリフライトリクエストを適切にキャッシュできること

- **入力値**:
  ```typescript
  - HTTPメソッド: OPTIONS
  - リクエストURL: /api/cards
  - リクエストヘッダー:
    - Origin: 'http://localhost:5173'
  - 環境変数:
    - CORS_ORIGIN: 'http://localhost:5173'
  ```
  - **境界値選択の根拠**: maxAgeの設定値が正しいことを確認
  - **実際の使用場面**: ブラウザがプリフライトリクエストをキャッシュし、パフォーマンスを向上させる

- **期待される結果**:
  ```typescript
  - レスポンスヘッダー:
    - Access-Control-Max-Age: '86400'
  ```
  - **境界での正確性**: 設計文書で指定された値（86400秒 = 24時間）が設定されること
  - **一貫した動作**: プリフライトリクエストが24時間キャッシュされること

- **テストの目的**: プリフライトキャッシュ時間が正しく設定されることを確認
  - **堅牢性の確認**: パフォーマンス最適化のための設定が正しく適用されること

- 🔵 **青信号**: 設計文書（architecture.md）の「CORS設定項目の詳細」に`maxAge: 86400`と明記されている

---

### 3. 異常系テストケース（エラーハンドリング）

#### 🔴 TC-008: Originヘッダーがないリクエストでもエラーにならない

- **テスト名**: Originヘッダーがないリクエスト（同一オリジンからのリクエスト等）でもエラーにならない
  - **エラーケースの概要**: Originヘッダーがない場合でもミドルウェアがエラーを発生させないことを確認
  - **エラー処理の重要性**: 同一オリジンからのリクエストやツールからのリクエストでも動作する必要がある

- **入力値**:
  ```typescript
  - HTTPメソッド: GET
  - リクエストURL: /api/health
  - リクエストヘッダー:
    - （Originヘッダーなし）
  - 環境変数:
    - CORS_ORIGIN: 'http://localhost:5173'
  ```
  - **不正な理由**: 厳密には「不正」ではなく、同一オリジンからのリクエストやcurlなどのツールからのリクエストではOriginヘッダーが送信されない
  - **実際の発生シナリオ**: 同一オリジンからのリクエスト、curlやPostmanなどのツールからのAPIテスト

- **期待される結果**:
  ```typescript
  - レスポンスステータス: 200 OK
  - エラーが発生しない
  ```
  - **エラーメッセージの内容**: エラーメッセージは表示されない（正常動作）
  - **システムの安全性**: Originヘッダーがなくてもリクエストが正常に処理されること

- **テストの目的**: Originヘッダーがない場合の堅牢性を確認
  - **品質保証の観点**: 同一オリジンからのリクエストやツールからのテストが正常に動作すること

- 🔴 **赤信号**: 設計文書に明示されていないが、CORSの一般的な動作として重要なテストケース

---

#### 🔴 TC-009: 許可されていないオリジンからのリクエストでもサーバーエラーにならない

- **テスト名**: 許可されていないオリジンからのリクエストでもサーバーがエラーを返さない（ブラウザがCORSエラーを表示）
  - **エラーケースの概要**: 許可されていないオリジンからのリクエストの場合、サーバーは200 OKを返すがブラウザが拒否することを確認
  - **エラー処理の重要性**: サーバー側でCORSエラーを返す必要はなく、ブラウザのCORSポリシーに任せる

- **入力値**:
  ```typescript
  - HTTPメソッド: GET
  - リクエストURL: /api/health
  - リクエストヘッダー:
    - Origin: 'http://malicious-site.com'
  - 環境変数:
    - CORS_ORIGIN: 'http://localhost:5173'
  ```
  - **不正な理由**: CORS_ORIGINで許可されていないオリジンからのリクエスト
  - **実際の発生シナリオ**: 悪意のあるサイトや、誤って異なるオリジンからAPIを呼び出した場合

- **期待される結果**:
  ```typescript
  - レスポンスステータス: 200 OK（または通常のレスポンス）
  - レスポンスヘッダー:
    - Access-Control-Allow-Origin: 'http://localhost:5173'（許可されたオリジンのみ）
  - ブラウザ側でCORSエラーが表示される
  ```
  - **エラーメッセージの内容**: サーバーはエラーを返さず、ブラウザが「CORS policy: No 'Access-Control-Allow-Origin' header is present」エラーを表示
  - **システムの安全性**: サーバーは通常通り動作し、ブラウザのCORSポリシーがセキュリティを担保する

- **テストの目的**: 許可されていないオリジンからのリクエスト時のサーバー動作を確認
  - **品質保証の観点**: サーバー側でエラーを発生させず、ブラウザのCORSポリシーに任せること

- 🟡 **黄信号**: CORSの標準動作として一般的だが、設計文書には明示されていない

---

## テストケース実装時の日本語コメント指針

各テストケースの実装時には以下の日本語コメントを必ず含めてください：

### テストケース開始時のコメント

```typescript
// 【テスト目的】: CORSミドルウェアが正しいAccess-Control-*ヘッダーを設定することを確認
// 【テスト内容】: GETリクエストを送信し、レスポンスヘッダーにCORS関連ヘッダーが含まれることをテスト
// 【期待される動作】: Access-Control-Allow-Origin、Allow-Credentials、Allow-Methods、Allow-Headers、Expose-Headers、Max-Ageヘッダーが正しく設定される
// 🔵 青信号: 設計文書（architecture.md）に基づくテスト
```

### Given（準備フェーズ）のコメント

```typescript
// 【テストデータ準備】: 開発環境の典型的なフロントエンドオリジン（http://localhost:5173）を使用
// 【初期条件設定】: 環境変数CORS_ORIGINを'http://localhost:5173'に設定
// 【前提条件確認】: CORSミドルウェアがHonoアプリに適用されていること
```

### When（実行フェーズ）のコメント

```typescript
// 【実際の処理実行】: /api/healthエンドポイントにGETリクエストを送信
// 【処理内容】: CORSミドルウェアがリクエストを処理し、CORSヘッダーを追加
// 【実行タイミング】: ミドルウェアチェーンの最初に実行される
```

### Then（検証フェーズ）のコメント

```typescript
// 【結果検証】: レスポンスヘッダーに正しいCORS関連ヘッダーが含まれることを確認
// 【期待値確認】: Access-Control-Allow-Originが'http://localhost:5173'であることを確認
// 【品質保証】: フロントエンドからのAPIアクセスがブラウザのCORSポリシーを通過できることを保証
```

### 各expectステートメントのコメント

```typescript
// 【検証項目】: Access-Control-Allow-Originヘッダーの値を確認
// 🔵 青信号: 設計文書に基づく検証
expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:5173'); // 【確認内容】: 許可されたオリジンが正しく設定されることを確認

// 【検証項目】: Access-Control-Allow-Credentialsヘッダーの値を確認
// 🔵 青信号: 設計文書に基づく検証
expect(response.headers.get('Access-Control-Allow-Credentials')).toBe('true'); // 【確認内容】: Cookie・認証情報の送信が許可されることを確認

// 【検証項目】: Access-Control-Expose-Headersヘッダーにページネーションヘッダーが含まれることを確認
// 🔵 青信号: 設計文書に基づく検証
expect(response.headers.get('Access-Control-Expose-Headers')).toContain('X-Total-Count'); // 【確認内容】: ページネーションヘッダーがフロントエンドに公開されることを確認
```

### セットアップ・クリーンアップのコメント

```typescript
beforeEach(() => {
  // 【テスト前準備】: 各テスト実行前に環境変数をクリアし、テストごとに設定
  // 【環境初期化】: 前のテストの環境変数設定が影響しないようにクリーンな状態にする
  delete process.env.CORS_ORIGIN;
});

afterEach(() => {
  // 【テスト後処理】: 各テスト実行後に環境変数を元に戻す
  // 【状態復元】: 次のテストや他のテストスイートに影響しないよう環境変数をリセット
  delete process.env.CORS_ORIGIN;
});
```

---

## テストケースサマリー

### テストケース数

- **正常系**: 4テストケース（TC-001〜TC-004）
- **境界値**: 3テストケース（TC-005〜TC-007）
- **異常系**: 2テストケース（TC-008〜TC-009）
- **合計**: 9テストケース

### 要件網羅率

- **WRREQ-070-1（CORS設定）**: 100%カバー（TC-001〜TC-009で全側面をテスト）
- **WRREQ-070-2（ミドルウェア活用）**: 100%カバー（Hono.jsのCORSミドルウェアを使用）

### 設計文書カバレッジ

- **architecture.md（CORS設定詳細）**: 100%カバー（全設定項目をテスト）
- **environment-variables.md（CORS_ORIGIN）**: 100%カバー（設定・未設定両方をテスト）
- **api-endpoints.md（CORS適用方法）**: 100%カバー（実装方法に基づくテスト）

---

## 品質判定

✅ **高品質**:
- **テストケース分類**: 正常系・異常系・境界値が網羅されている
- **期待値定義**: 各テストケースの期待値が明確
- **技術選択**: プログラミング言語（TypeScript）・テストフレームワーク（Vitest）が確定
- **実装可能性**: 現在の技術スタック（Hono.js、TypeScript）で実現可能
- **要件網羅率**: WRREQ-070-1、WRREQ-070-2を100%カバー
- **信頼性レベル**: 多くのテストケースが🔵青信号（設計文書ベース）

---

## 次のステップ

次のお勧めステップ: `/tdd-red` でRedフェーズ（失敗テスト作成）を開始します。
