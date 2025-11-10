/**
 * AppLayout レイアウトコンポーネント
 * TASK-0036: レイアウトコンポーネント - Header/AppLayout実装
 */

import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Breadcrumbs } from './Breadcrumbs';

/**
 * AppLayout コンポーネント
 * Sidebar、Header、Breadcrumbs、メインコンテンツを配置するレイアウト
 */
export const AppLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* メインコンテンツエリア */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Breadcrumbs */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <Breadcrumbs />
        </div>

        {/* メインコンテンツ */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
