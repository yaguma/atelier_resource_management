/**
 * TASK-0008: CORSミドルウェア実装（詳細設定） - テストコード
 *
 * このテストファイルは、CORSミドルウェアが正しく動作することを検証します。
 * 全てのテストケースは、設計文書（architecture.md）およびテストケース定義書に基づいています。
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Hono } from 'hono';
import { corsMiddleware } from '../../src/middlewares/cors';

// 【テスト前準備】: 各テスト実行前に環境変数をクリアし、テストごとに設定
// 【環境初期化】: 前のテストの環境変数設定が影響しないようにクリーンな状態にする
beforeEach(() => {
  delete process.env.CORS_ORIGIN;
});

// 【テスト後処理】: 各テスト実行後に環境変数を元に戻す
// 【状態復元】: 次のテストや他のテストスイートに影響しないよう環境変数をリセット
afterEach(() => {
  delete process.env.CORS_ORIGIN;
});

describe('CORSミドルウェアテスト', () => {
  // ==========================================
  // 正常系テストケース
  // ==========================================

  describe('正常系: CORSミドルウェアの基本動作', () => {
    // 【テスト目的】: CORSミドルウェアが正しいAccess-Control-*ヘッダーを設定することを確認
    // 【テスト内容】: GETリクエストを送信し、レスポンスヘッダーにCORS関連ヘッダーが含まれることをテスト
    // 【期待される動作】: Access-Control-Allow-Origin、Allow-Credentials、Allow-Methods、Allow-Headers、Expose-Headers、Max-Ageヘッダーが正しく設定される
    // 🔵 青信号: 設計文書（architecture.md）に基づくテスト
    it('TC-001: CORSミドルウェアが正しいAccess-Control-*ヘッダーを設定する', async () => {
      // 【テストデータ準備】: 開発環境の典型的なフロントエンドオリジン（http://localhost:5173）を使用
      // 【初期条件設定】: 環境変数CORS_ORIGINを'http://localhost:5173'に設定
      // 【前提条件確認】: CORSミドルウェアがHonoアプリに適用されていること
      process.env.CORS_ORIGIN = 'http://localhost:5173';

      // 【実際の処理実行】: /api/healthエンドポイントにGETリクエストを送信
      // 【処理内容】: CORSミドルウェアがリクエストを処理し、CORSヘッダーを追加
      // 【実行タイミング】: ミドルウェアチェーンの最初に実行される
      const app = new Hono();
      app.use('*', corsMiddleware);
      app.get('/api/health', (c) => c.json({ status: 'ok' }));

      const req = new Request('http://localhost:3000/api/health', {
        headers: {
          Origin: 'http://localhost:5173',
        },
      });
      const res = await app.fetch(req);

      // 【結果検証】: レスポンスヘッダーに正しいCORS関連ヘッダーが含まれることを確認
      // 【期待値確認】: Access-Control-Allow-Originが'http://localhost:5173'であることを確認
      // 【品質保証】: フロントエンドからのAPIアクセスがブラウザのCORSポリシーを通過できることを保証

      // 【検証項目】: Access-Control-Allow-Originヘッダーの値を確認
      // 🔵 青信号: 設計文書に基づく検証
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:5173'); // 【確認内容】: 許可されたオリジンが正しく設定されることを確認

      // 【検証項目】: Access-Control-Allow-Credentialsヘッダーの値を確認
      // 🔵 青信号: 設計文書に基づく検証
      expect(res.headers.get('Access-Control-Allow-Credentials')).toBe('true'); // 【確認内容】: Cookie・認証情報の送信が許可されることを確認

      // 注意: Access-Control-Allow-MethodsとAccess-Control-Allow-Headersは
      // プリフライトリクエスト（OPTIONS）でのみ返されるため、GETリクエストではテストしない
      // これらのヘッダーはTC-002でテストされる

      // 【検証項目】: Access-Control-Expose-Headersヘッダーにページネーションヘッダーが含まれることを確認
      // 🔵 青信号: 設計文書に基づく検証
      const exposeHeaders = res.headers.get('Access-Control-Expose-Headers');
      expect(exposeHeaders).toContain('X-Total-Count'); // 【確認内容】: ページネーションヘッダーがフロントエンドに公開されることを確認
      expect(exposeHeaders).toContain('X-Page'); // 【確認内容】: ページネーションヘッダーがフロントエンドに公開されることを確認
      expect(exposeHeaders).toContain('X-Limit'); // 【確認内容】: ページネーションヘッダーがフロントエンドに公開されることを確認
    });

    // 【テスト目的】: プリフライトリクエスト（OPTIONS）が正しく処理されることを確認
    // 【テスト内容】: OPTIONSリクエストを送信し、200 OKを返し、適切なCORSヘッダーが設定されることをテスト
    // 【期待される動作】: プリフライトリクエストが成功し、ブラウザが実際のリクエストを許可する
    // 🔵 青信号: CORSの標準仕様に基づく動作
    it('TC-002: プリフライトリクエスト（OPTIONS）が200 OKを返し、CORSヘッダーが設定される', async () => {
      // 【テストデータ準備】: プリフライトリクエストをシミュレート
      // 【初期条件設定】: 環境変数CORS_ORIGINを'http://localhost:5173'に設定
      // 【前提条件確認】: CORSミドルウェアがOPTIONSリクエストを処理できること
      process.env.CORS_ORIGIN = 'http://localhost:5173';

      // 【実際の処理実行】: /api/cardsエンドポイントにOPTIONSリクエストを送信
      // 【処理内容】: CORSミドルウェアがプリフライトリクエストを処理
      // 【実行タイミング】: ブラウザが実際のPOSTリクエスト前に自動的に送信
      const app = new Hono();
      app.use('*', corsMiddleware);
      app.get('/api/cards', (c) => c.json({ cards: [] }));

      const req = new Request('http://localhost:3000/api/cards', {
        method: 'OPTIONS',
        headers: {
          Origin: 'http://localhost:5173',
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type',
        },
      });
      const res = await app.fetch(req);

      // 【結果検証】: プリフライトリクエストが成功し、適切なCORSヘッダーが設定されることを確認
      // 【期待値確認】: ステータスコードが200または204であることを確認
      // 【品質保証】: ブラウザのCORSポリシーチェックを通過できることを保証

      // 【検証項目】: ステータスコードを確認
      // 🔵 青信号: CORSの標準動作
      expect([200, 204]).toContain(res.status); // 【確認内容】: プリフライトリクエストが成功することを確認

      // 【検証項目】: Access-Control-Allow-Originヘッダーの値を確認
      // 🔵 青信号: 設計文書に基づく検証
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:5173'); // 【確認内容】: 許可されたオリジンが正しく設定されることを確認

      // 【検証項目】: Access-Control-Allow-Methodsヘッダーに必要なメソッドが含まれることを確認
      // 🔵 青信号: 設計文書に基づく検証
      const allowMethods = res.headers.get('Access-Control-Allow-Methods');
      expect(allowMethods).toContain('POST'); // 【確認内容】: リクエストされたPOSTメソッドが許可されることを確認

      // 【検証項目】: Access-Control-Max-Ageヘッダーの値を確認
      // 🔵 青信号: 設計文書に基づく検証
      expect(res.headers.get('Access-Control-Max-Age')).toBe('86400'); // 【確認内容】: プリフライトリクエストのキャッシュ時間が24時間に設定されることを確認
    });

    // 【テスト目的】: exposeHeadersによってページネーションヘッダーがフロントエンドに公開されることを確認
    // 【テスト内容】: ページネーション機能を持つAPIエンドポイントにリクエストを送信し、Expose-Headersを確認
    // 【期待される動作】: Access-Control-Expose-HeadersにX-Total-Count、X-Page、X-Limitが含まれる
    // 🔵 青信号: 設計文書（architecture.md）に基づくテスト
    it('TC-003: exposeHeadersでページネーションヘッダー（X-Total-Count、X-Page、X-Limit）が公開される', async () => {
      // 【テストデータ準備】: ページネーション機能を持つAPIエンドポイントへのリクエスト
      // 【初期条件設定】: 環境変数CORS_ORIGINを'http://localhost:5173'に設定
      // 【前提条件確認】: CORSミドルウェアがExposeHeadersを設定していること
      process.env.CORS_ORIGIN = 'http://localhost:5173';

      // 【実際の処理実行】: /api/cards?page=1&limit=10エンドポイントにGETリクエストを送信
      // 【処理内容】: CORSミドルウェアがExposeHeadersを設定
      // 【実行タイミング】: ページネーションAPIへのアクセス時
      const app = new Hono();
      app.use('*', corsMiddleware);
      app.get('/api/cards', (c) => {
        c.header('X-Total-Count', '100');
        c.header('X-Page', '1');
        c.header('X-Limit', '10');
        return c.json({ cards: [] });
      });

      const req = new Request('http://localhost:3000/api/cards?page=1&limit=10', {
        headers: {
          Origin: 'http://localhost:5173',
        },
      });
      const res = await app.fetch(req);

      // 【結果検証】: Access-Control-Expose-Headersにページネーションヘッダーが含まれることを確認
      // 【期待値確認】: X-Total-Count、X-Page、X-Limitが含まれることを確認
      // 【品質保証】: フロントエンドがページネーション情報を取得できることを保証

      // 【検証項目】: Access-Control-Expose-Headersヘッダーにページネーションヘッダーが含まれることを確認
      // 🔵 青信号: 設計文書に基づく検証
      const exposeHeaders = res.headers.get('Access-Control-Expose-Headers');
      expect(exposeHeaders).toContain('X-Total-Count'); // 【確認内容】: X-Total-Countが公開されることを確認
      expect(exposeHeaders).toContain('X-Page'); // 【確認内容】: X-Pageが公開されることを確認
      expect(exposeHeaders).toContain('X-Limit'); // 【確認内容】: X-Limitが公開されることを確認
    });

    // 【テスト目的】: CORSミドルウェアが全てのHTTPメソッドで一貫して動作することを確認
    // 【テスト内容】: GET、POST、PUT、DELETE、OPTIONSの全てのメソッドでCORSヘッダーが設定されることをテスト
    // 【期待される動作】: どのHTTPメソッドでも同じCORSヘッダーが設定される
    // 🟡 黄信号: ミドルウェアの一般的な動作から妥当な推測
    it('TC-004: 全てのHTTPメソッド（GET、POST、PUT、DELETE、OPTIONS）でCORSヘッダーが設定される', async () => {
      // 【テストデータ準備】: API操作で使用される全てのHTTPメソッドをカバー
      // 【初期条件設定】: 環境変数CORS_ORIGINを'http://localhost:5173'に設定
      // 【前提条件確認】: CORSミドルウェアが全メソッドに適用されること
      process.env.CORS_ORIGIN = 'http://localhost:5173';

      // 【実際の処理実行】: 各HTTPメソッドでリクエストを送信
      // 【処理内容】: CORSミドルウェアが全メソッドで一貫して動作
      // 【実行タイミング】: 全リクエストタイプでテスト
      const app = new Hono();
      app.use('*', corsMiddleware);
      app.get('/api/health', (c) => c.json({ status: 'ok' }));
      app.post('/api/health', (c) => c.json({ status: 'ok' }));
      app.put('/api/health', (c) => c.json({ status: 'ok' }));
      app.delete('/api/health', (c) => c.json({ status: 'ok' }));

      const methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];

      for (const method of methods) {
        const req = new Request('http://localhost:3000/api/health', {
          method,
          headers: {
            Origin: 'http://localhost:5173',
          },
        });
        const res = await app.fetch(req);

        // 【結果検証】: 全てのメソッドで同じCORSヘッダーが設定されることを確認
        // 【期待値確認】: Access-Control-Allow-Originが一貫していることを確認
        // 【品質保証】: メソッドによって動作が変わらないことを保証

        // 【検証項目】: Access-Control-Allow-Originヘッダーの値を確認
        // 🟡 黄信号: ミドルウェアの一般的な動作から推測
        expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:5173'); // 【確認内容】: 全メソッドで許可されたオリジンが設定されることを確認

        // 【検証項目】: Access-Control-Allow-Credentialsヘッダーの値を確認
        // 🟡 黄信号: ミドルウェアの一般的な動作から推測
        expect(res.headers.get('Access-Control-Allow-Credentials')).toBe('true'); // 【確認内容】: 全メソッドでCredentialsが許可されることを確認
      }
    });
  });

  // ==========================================
  // 境界値テストケース
  // ==========================================

  describe('境界値: 環境変数未設定・デフォルト値', () => {
    // 【テスト目的】: 環境変数未設定時のフォールバック動作を確認
    // 【テスト内容】: CORS_ORIGIN環境変数が未設定の場合、デフォルト値が使用されることをテスト
    // 【期待される動作】: デフォルト値'http://localhost:5173'が使用される
    // 🔵 青信号: タスクファイル（phase1-b-middleware.md）に基づくテスト
    it('TC-005: 環境変数CORS_ORIGINが未設定の場合、デフォルト値が使用される', async () => {
      // 【テストデータ準備】: 環境変数を未設定の状態でテスト
      // 【初期条件設定】: CORS_ORIGINを明示的に削除（未設定状態）
      // 【前提条件確認】: デフォルト値が正しく適用されること
      delete process.env.CORS_ORIGIN;

      // 【実際の処理実行】: 環境変数未設定の状態でリクエストを送信
      // 【処理内容】: CORSミドルウェアがデフォルト値を使用
      // 【実行タイミング】: 環境変数未設定時
      const app = new Hono();
      app.use('*', corsMiddleware);
      app.get('/api/health', (c) => c.json({ status: 'ok' }));

      const req = new Request('http://localhost:3000/api/health', {
        headers: {
          Origin: 'http://localhost:5173',
        },
      });
      const res = await app.fetch(req);

      // 【結果検証】: デフォルト値が正しく適用されることを確認
      // 【期待値確認】: Access-Control-Allow-Originがデフォルト値'http://localhost:5173'であることを確認
      // 【品質保証】: 設定ミスがあっても開発環境では動作することを保証

      // 【検証項目】: Access-Control-Allow-Originヘッダーにデフォルト値が設定されることを確認
      // 🔵 青信号: タスクファイルに基づく検証
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:5173'); // 【確認内容】: デフォルト値が使用されることを確認
    });

    // 【テスト目的】: 無効な環境変数設定時の安全性を確認
    // 【テスト内容】: CORS_ORIGIN環境変数が空文字列の場合、デフォルト値が使用されることをテスト
    // 【期待される動作】: 空文字列がfalsy値として扱われ、デフォルト値が適用される
    // 🟡 黄信号: JavaScriptのfalsyな値の扱いから妥当な推測
    it('TC-006: 環境変数CORS_ORIGINが空文字列の場合、デフォルト値が使用される', async () => {
      // 【テストデータ準備】: 環境変数を空文字列に設定
      // 【初期条件設定】: CORS_ORIGINを空文字列に設定
      // 【前提条件確認】: 空文字列がfalsy値として扱われること
      process.env.CORS_ORIGIN = '';

      // 【実際の処理実行】: 環境変数が空文字列の状態でリクエストを送信
      // 【処理内容】: CORSミドルウェアがデフォルト値を使用
      // 【実行タイミング】: 環境変数が誤って空文字列に設定された時
      const app = new Hono();
      app.use('*', corsMiddleware);
      app.get('/api/health', (c) => c.json({ status: 'ok' }));

      const req = new Request('http://localhost:3000/api/health', {
        headers: {
          Origin: 'http://localhost:5173',
        },
      });
      const res = await app.fetch(req);

      // 【結果検証】: 空文字列がfalsy値として扱われ、デフォルト値が適用されることを確認
      // 【期待値確認】: Access-Control-Allow-Originがデフォルト値'http://localhost:5173'であることを確認
      // 【品質保証】: 設定ミスがあってもシステムが安全に動作することを保証

      // 【検証項目】: Access-Control-Allow-Originヘッダーにデフォルト値が設定されることを確認
      // 🟡 黄信号: JavaScriptのfalsyな値の扱いから推測
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:5173'); // 【確認内容】: 空文字列の場合でもデフォルト値が使用されることを確認
    });

    // 【テスト目的】: プリフライトキャッシュ時間が正しく設定されることを確認
    // 【テスト内容】: Access-Control-Max-Ageが86400秒（24時間）に設定されることをテスト
    // 【期待される動作】: ブラウザがプリフライトリクエストを適切にキャッシュできる
    // 🔵 青信号: 設計文書（architecture.md）に基づくテスト
    it('TC-007: maxAgeが86400秒（24時間）に設定される', async () => {
      // 【テストデータ準備】: プリフライトリクエストをシミュレート
      // 【初期条件設定】: 環境変数CORS_ORIGINを'http://localhost:5173'に設定
      // 【前提条件確認】: maxAgeが正しく設定されること
      process.env.CORS_ORIGIN = 'http://localhost:5173';

      // 【実際の処理実行】: OPTIONSリクエストを送信
      // 【処理内容】: CORSミドルウェアがAccess-Control-Max-Ageを設定
      // 【実行タイミング】: プリフライトリクエスト時
      const app = new Hono();
      app.use('*', corsMiddleware);
      app.get('/api/cards', (c) => c.json({ cards: [] }));

      const req = new Request('http://localhost:3000/api/cards', {
        method: 'OPTIONS',
        headers: {
          Origin: 'http://localhost:5173',
        },
      });
      const res = await app.fetch(req);

      // 【結果検証】: Access-Control-Max-Ageが24時間（86400秒）に設定されることを確認
      // 【期待値確認】: maxAgeが86400であることを確認
      // 【品質保証】: パフォーマンス最適化のための設定が正しく適用されることを保証

      // 【検証項目】: Access-Control-Max-Ageヘッダーの値を確認
      // 🔵 青信号: 設計文書に基づく検証
      expect(res.headers.get('Access-Control-Max-Age')).toBe('86400'); // 【確認内容】: プリフライトキャッシュ時間が24時間に設定されることを確認
    });
  });

  // ==========================================
  // 異常系テストケース
  // ==========================================

  describe('異常系: エラーハンドリングと堅牢性', () => {
    // 【テスト目的】: Originヘッダーがない場合の堅牢性を確認
    // 【テスト内容】: Originヘッダーがないリクエスト（同一オリジンからのリクエスト等）でもエラーにならないことをテスト
    // 【期待される動作】: Originヘッダーがなくてもリクエストが正常に処理される
    // 🔴 赤信号: CORSの一般的な動作として重要だが設計文書に明示されていない
    it('TC-008: Originヘッダーがないリクエストでもエラーにならない', async () => {
      // 【テストデータ準備】: Originヘッダーなしでリクエストを送信
      // 【初期条件設定】: 環境変数CORS_ORIGINを'http://localhost:5173'に設定
      // 【前提条件確認】: Originヘッダーがなくても動作すること
      process.env.CORS_ORIGIN = 'http://localhost:5173';

      // 【実際の処理実行】: Originヘッダーなしでリクエストを送信
      // 【処理内容】: CORSミドルウェアがエラーを発生させない
      // 【実行タイミング】: 同一オリジンからのリクエストやツールからのテスト時
      const app = new Hono();
      app.use('*', corsMiddleware);
      app.get('/api/health', (c) => c.json({ status: 'ok' }));

      const req = new Request('http://localhost:3000/api/health', {
        headers: {
          // Originヘッダーなし
        },
      });
      const res = await app.fetch(req);

      // 【結果検証】: Originヘッダーがなくてもリクエストが正常に処理されることを確認
      // 【期待値確認】: ステータスコードが200であることを確認
      // 【品質保証】: 同一オリジンからのリクエストやツールからのテストが正常に動作することを保証

      // 【検証項目】: ステータスコードを確認
      // 🔴 赤信号: CORSの一般的な動作から推測
      expect(res.status).toBe(200); // 【確認内容】: Originヘッダーがなくてもエラーにならないことを確認
    });

    // 【テスト目的】: 許可されていないオリジンからのリクエスト時のサーバー動作を確認
    // 【テスト内容】: 許可されていないオリジンからのリクエストでもサーバーがエラーを返さないことをテスト
    // 【期待される動作】: サーバーは通常通り動作し、ブラウザのCORSポリシーがセキュリティを担保する
    // 🟡 黄信号: CORSの標準動作として一般的だが設計文書には明示されていない
    it('TC-009: 許可されていないオリジンからのリクエストでもサーバーエラーにならない', async () => {
      // 【テストデータ準備】: 許可されていないオリジンからのリクエストをシミュレート
      // 【初期条件設定】: 環境変数CORS_ORIGINを'http://localhost:5173'に設定
      // 【前提条件確認】: サーバー側でエラーを返さないこと
      process.env.CORS_ORIGIN = 'http://localhost:5173';

      // 【実際の処理実行】: 許可されていないオリジンからリクエストを送信
      // 【処理内容】: CORSミドルウェアが通常通り動作する
      // 【実行タイミング】: 悪意のあるサイトや誤って異なるオリジンからAPIを呼び出した場合
      const app = new Hono();
      app.use('*', corsMiddleware);
      app.get('/api/health', (c) => c.json({ status: 'ok' }));

      const req = new Request('http://localhost:3000/api/health', {
        headers: {
          Origin: 'http://malicious-site.com',
        },
      });
      const res = await app.fetch(req);

      // 【結果検証】: サーバーは通常通り動作し、許可されていないオリジンに対してはCORSヘッダーを返さないことを確認
      // 【期待値確認】: ステータスコードが200であることを確認
      // 【品質保証】: サーバー側でエラーを発生させず、ブラウザのCORSポリシーに任せることを保証

      // 【検証項目】: ステータスコードを確認
      // 🟡 黄信号: CORSの標準動作から推測
      expect(res.status).toBe(200); // 【確認内容】: サーバーがエラーを返さないことを確認

      // 【検証項目】: Access-Control-Allow-Originヘッダーが返されないことを確認
      // 🟡 黄信号: CORSの標準動作から推測
      // 許可されていないオリジンに対しては、CORSヘッダーを返さないのが標準動作
      // これによりブラウザがCORSエラーを表示する
      expect(res.headers.get('Access-Control-Allow-Origin')).toBeNull(); // 【確認内容】: 許可されていないオリジンに対してはCORSヘッダーを返さないことを確認
    });
  });
});
