/**
 * 共通Modalコンポーネント
 * TASK-0033: 共通コンポーネント - Modal実装
 */

import { useEffect, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface ModalProps {
  /**
   * モーダルの表示状態
   */
  isOpen: boolean;

  /**
   * モーダルを閉じる時のコールバック
   */
  onClose: () => void;

  /**
   * モーダルのタイトル
   */
  title?: string;

  /**
   * モーダルの内容
   */
  children: ReactNode;

  /**
   * モーダルのフッター（ボタンなど）
   */
  footer?: ReactNode;

  /**
   * カスタムクラス
   */
  className?: string;
}

/**
 * 共通Modalコンポーネント
 */
export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className,
}: ModalProps) => {
  // スクロールロック
  useEffect(() => {
    if (isOpen) {
      // モーダルが開いている時はbodyのスクロールを無効化
      document.body.style.overflow = 'hidden';
    } else {
      // モーダルが閉じている時はbodyのスクロールを有効化
      document.body.style.overflow = '';
    }

    // クリーンアップ
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Escapeキーでモーダルを閉じる
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* 背景オーバーレイ */}
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* モーダルコンテンツ */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={cn(
            'relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all',
            'w-full max-w-lg',
            className,
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ヘッダー */}
          {title && (
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h3
                className="text-lg font-semibold text-gray-900"
                id="modal-title"
              >
                {title}
              </h3>
              <button
                type="button"
                className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={onClose}
                aria-label="閉じる"
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* ボディ */}
          <div className="px-6 py-4">{children}</div>

          {/* フッター */}
          {footer && (
            <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
