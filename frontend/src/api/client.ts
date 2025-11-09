/**
 * Axiosクライアントの基本設定
 * 注: TASK-0030でインターセプターとエラーハンドリングを実装予定
 */

import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
