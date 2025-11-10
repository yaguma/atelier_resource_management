/**
 * Header レイアウトコンポーネント
 * TASK-0036: レイアウトコンポーネント - Header実装
 */

export const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* タイトル */}
        <h1 className="text-2xl font-bold text-gray-900">
          アトリエ錬金術ゲーム 管理画面
        </h1>

        {/* ユーザー情報 */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
              <svg
                className="h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700">管理者</span>
          </div>
        </div>
      </div>
    </header>
  );
};
