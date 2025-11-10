/**
 * Axiosクライアントの基本設定
 * TASK-0030: レスポンスインターセプターとエラーハンドリング実装
 */

import axios, { type AxiosError } from 'axios';

/**
 * エラーレスポンスの型定義
 */
interface ErrorResponse {
  code?: string;
  message?: string;
  details?: unknown;
}

/**
 * Axiosクライアントインスタンス
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30秒タイムアウト
});

/**
 * レスポンスインターセプター
 * 成功時はそのまま返却、エラー時はエラーメッセージを整形して返却
 */
apiClient.interceptors.response.use(
  (response) => {
    // 成功レスポンスはそのまま返却
    return response;
  },
  (error: AxiosError<ErrorResponse>) => {
    // エラーレスポンスの処理
    let errorMessage = 'エラーが発生しました';

    if (error.response) {
      // サーバーからのエラーレスポンス
      const { status, data } = error.response;

      if (data?.message) {
        errorMessage = data.message;
      } else {
        // ステータスコード別のデフォルトメッセージ
        switch (status) {
          case 400:
            errorMessage = '不正なリクエストです';
            break;
          case 401:
            errorMessage = '認証が必要です';
            break;
          case 403:
            errorMessage = 'アクセスが拒否されました';
            break;
          case 404:
            errorMessage = 'リソースが見つかりません';
            break;
          case 409:
            errorMessage = '競合が発生しました';
            break;
          case 500:
            errorMessage = 'サーバーエラーが発生しました';
            break;
          default:
            errorMessage = `エラーが発生しました (${status})`;
        }
      }
    } else if (error.request) {
      // リクエストは送信されたがレスポンスがない
      errorMessage = 'サーバーに接続できません';
    } else {
      // リクエスト設定時のエラー
      errorMessage = error.message || 'エラーが発生しました';
    }

    // エラーオブジェクトにメッセージを追加
    error.message = errorMessage;

    // コンソールにエラーログを出力
    console.error('API Error:', {
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });

    return Promise.reject(error);
  },
);

export default apiClient;
