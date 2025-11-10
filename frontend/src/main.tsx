import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ToastProvider } from './contexts/ToastContext';

// QueryClient設定
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // リトライ回数を1回に制限
      refetchOnWindowFocus: false, // ウィンドウフォーカス時の自動再取得を無効化
      staleTime: 5 * 60 * 1000, // 5分間はデータを新鮮と見なす
    },
  },
});

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <App />
          <ReactQueryDevtools initialIsOpen={false} />
        </ToastProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
}
