/**
 * Breadcrumbs レイアウトコンポーネント
 * TASK-0037: レイアウトコンポーネント - Breadcrumbs実装
 */

import { Link, useLocation } from 'react-router-dom';

/**
 * パスと日本語名のマッピング
 */
const pathNameMap: Record<string, string> = {
  '': 'ホーム',
  cards: 'カード管理',
  customers: '顧客管理',
  'alchemy-styles': '錬金スタイル管理',
  settings: '設定',
  new: '新規作成',
  edit: '編集',
};

/**
 * Breadcrumbs コンポーネント
 */
export const Breadcrumbs = () => {
  const location = useLocation();

  // パスをセグメントに分割
  const pathSegments = location.pathname.split('/').filter((segment) => segment);

  // ホームを先頭に追加
  const breadcrumbs = [
    { path: '/', label: 'ホーム' },
    ...pathSegments.map((segment, index) => {
      const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
      const label = pathNameMap[segment] || segment;
      return { path, label };
    }),
  ];

  return (
    <nav className="flex items-center space-x-2 text-sm" aria-label="パンくずリスト">
      {breadcrumbs.map((breadcrumb, index) => {
        const isLast = index === breadcrumbs.length - 1;

        return (
          <div key={breadcrumb.path} className="flex items-center">
            {index > 0 && (
              <svg
                className="h-4 w-4 text-gray-400 mx-2"
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}

            {isLast ? (
              <span
                className="font-medium text-gray-900"
                aria-current="page"
              >
                {breadcrumb.label}
              </span>
            ) : (
              <Link
                to={breadcrumb.path}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {breadcrumb.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};
