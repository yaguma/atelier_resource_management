/**
 * Toast通知のContext
 * TASK-0034: 共通コンポーネント - Toast実装
 */

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { ToastContainer } from '../components/common/ToastContainer';

/**
 * Toastの型
 */
export type ToastType = 'success' | 'error' | 'info' | 'warning';

/**
 * Toast型定義
 */
export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

/**
 * ToastContextの型定義
 */
interface ToastContextType {
  toasts: Toast[];
  addToast: (type: ToastType, message: string) => void;
  removeToast: (id: string) => void;
}

/**
 * ToastContext
 */
const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * ToastProviderのProps
 */
interface ToastProviderProps {
  children: ReactNode;
}

/**
 * ToastProvider
 */
export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  /**
   * Toastを追加
   */
  const addToast = useCallback((type: ToastType, message: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: Toast = { id, type, message };

    setToasts((prev) => [...prev, newToast]);

    // 5秒後に自動削除
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, []);

  /**
   * Toastを削除
   */
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
};

/**
 * useToastフック
 */
export const useToast = () => {
  const context = useContext(ToastContext);

  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
};
