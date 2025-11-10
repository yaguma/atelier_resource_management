/**
 * 共通Buttonコンポーネント
 * TASK-0032: 共通コンポーネント - Button実装
 */

import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * ボタンのバリアント
   * - primary: プライマリーアクション（青）
   * - secondary: セカンダリーアクション（グレー）
   * - danger: 危険なアクション（赤）
   * - ghost: ゴーストスタイル（背景透明）
   */
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';

  /**
   * ボタンのサイズ
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * ローディング状態
   */
  isLoading?: boolean;
}

/**
 * 共通Buttonコンポーネント
 */
export const Button = ({
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  ...props
}: ButtonProps) => {
  // バリアント別のスタイル
  const variantStyles = {
    primary:
      'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300',
    secondary:
      'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 disabled:bg-gray-300',
    danger:
      'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300',
    ghost:
      'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500 disabled:text-gray-400',
  };

  // サイズ別のスタイル
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      type="button"
      className={cn(
        // 基本スタイル
        'rounded-md font-medium transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        // バリアントとサイズ
        variantStyles[variant],
        sizeStyles[size],
        // ローディング時のスタイル
        isLoading && 'cursor-wait',
        // カスタムクラス
        className,
      )}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      aria-disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>読み込み中...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};
