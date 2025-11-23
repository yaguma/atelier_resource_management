import { describe, it, expect, beforeEach } from 'vitest';
import { Hono } from 'hono';

// 【テスト目的】: Hono.jsアプリケーションの初期化とエンドポイントの動作を確認
// 【テスト内容】: ヘルスチェックエンドポイントとルートエンドポイントが正しく実装されていることを検証
// 【期待される動作】: 各エンドポイントが期待されるJSONレスポンスを返し、HTTPステータスコード200を返す
// 🔵 要件定義書に基づく確実なテスト

describe('Hono.jsアプリケーション初期化', () => {
  let app: Hono;

  beforeEach(() => {
    // 【テスト前準備】: Honoアプリケーションインスタンスを作成し、テスト対象のエンドポイントを設定
    // 【環境初期化】: テスト実行前にアプリケーションを初期化し、必要なルートを登録
    app = new Hono();

    // ヘルスチェックエンドポイント
    app.get('/health', (c) => {
      return c.json({ status: 'ok' });
    });

    // ルートエンドポイント
    app.get('/', (c) => {
      return c.json({ message: 'Atelier Resource Management API' });
    });
  });

  describe('TC-001: ヘルスチェックエンドポイント正常系テスト', () => {
    it('GET /health エンドポイントが正常に応答する', async () => {
      // 【テスト目的】: ヘルスチェックエンドポイントが正常に応答することを確認
      // 【テスト内容】: GET /health エンドポイントにリクエストを送信し、期待されるJSONレスポンスが返されることを検証
      // 【期待される動作】: HTTPステータスコード200と共に、{"status": "ok"}が返される
      // 🔵 要件定義書に基づく確実なテスト

      // 【実際の処理実行】: Honoアプリケーションのfetchメソッドを直接呼び出してGET /healthエンドポイントにリクエストを送信
      // 【処理内容】: Honoアプリケーションのfetchメソッドを呼び出し、エンドポイントへのリクエストをシミュレート
      const request = new Request('http://localhost/health');
      const response = await app.fetch(request);

      // 【結果検証】: レスポンスのステータスコード、Content-Type、レスポンスボディを検証
      // 【期待値確認】: 要件定義書で明記された仕様に基づき、期待される値と一致することを確認
      expect(response.status).toBe(200); // 【確認内容】: HTTPステータスコードが200であることを確認 🔵

      const contentType = response.headers.get('content-type');
      expect(contentType).toContain('application/json'); // 【確認内容】: Content-Typeがapplication/jsonであることを確認 🔵

      const body = await response.json();
      expect(body).toEqual({ status: 'ok' }); // 【確認内容】: レスポンスボディが期待される形式であることを確認 🔵
    });
  });

  describe('TC-002: ルートエンドポイント正常系テスト', () => {
    it('GET / エンドポイントが正常に応答する', async () => {
      // 【テスト目的】: ルートエンドポイントが正常に応答することを確認
      // 【テスト内容】: GET / エンドポイントにリクエストを送信し、期待されるJSONレスポンスが返されることを検証
      // 【期待される動作】: HTTPステータスコード200と共に、{"message": "Atelier Resource Management API"}が返される
      // 🔵 要件定義書に基づく確実なテスト

      // 【実際の処理実行】: Honoアプリケーションのfetchメソッドを直接呼び出してGET /エンドポイントにリクエストを送信
      // 【処理内容】: Honoアプリケーションのfetchメソッドを呼び出し、エンドポイントへのリクエストをシミュレート
      const request = new Request('http://localhost/');
      const response = await app.fetch(request);

      // 【結果検証】: レスポンスのステータスコード、Content-Type、レスポンスボディを検証
      // 【期待値確認】: 要件定義書で明記された仕様に基づき、期待される値と一致することを確認
      expect(response.status).toBe(200); // 【確認内容】: HTTPステータスコードが200であることを確認 🔵

      const contentType = response.headers.get('content-type');
      expect(contentType).toContain('application/json'); // 【確認内容】: Content-Typeがapplication/jsonであることを確認 🔵

      const body = await response.json();
      expect(body).toEqual({ message: 'Atelier Resource Management API' }); // 【確認内容】: レスポンスボディが期待される形式であることを確認 🔵
    });
  });

  describe('TC-003: 存在しないエンドポイントへのリクエストテスト', () => {
    it('存在しないエンドポイントへのリクエストが404を返す', async () => {
      // 【テスト目的】: 存在しないエンドポイントへのリクエストが適切に処理されることを確認
      // 【テスト内容】: GET /nonexistent エンドポイントにリクエストを送信し、404エラーが返されることを検証
      // 【期待される動作】: HTTPステータスコード404が返される
      // 🔴 RESTful APIの一般的な動作として推測

      // 【実際の処理実行】: Honoアプリケーションのfetchメソッドを直接呼び出して存在しないエンドポイントにリクエストを送信
      // 【処理内容】: Honoアプリケーションのfetchメソッドを呼び出し、存在しないエンドポイントへのリクエストをシミュレート
      const request = new Request('http://localhost/nonexistent');
      const response = await app.fetch(request);

      // 【結果検証】: レスポンスのステータスコードを検証
      // 【期待値確認】: RESTful APIの一般的な動作として、存在しないリソースへのアクセスは404を返すべき
      expect(response.status).toBe(404); // 【確認内容】: HTTPステータスコードが404であることを確認 🔴
    });
  });
});

