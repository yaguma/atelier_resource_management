import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * クラス名を統合するユーティリティ関数
 * clsxで条件付きクラス名を処理し、tailwind-mergeでTailwindクラスの競合を解決
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
