# Phase 3: フロントエンド基盤とカード管理画面

## フェーズ概要

### 要件名
resource-management-webapp

### 期間・目標
- **期間**: 10営業日（Week 3-4、Day 11-20）
- **総工数**: 80時間
- **タスク数**: 15タスク
- **目標**: フロントエンドの基盤を構築し、カード管理画面を実装する

### 成果物
- React Router 6設定・ルーティング実装
- TanStack Query v5設定・カスタムフック実装
- Axiosクライアント設定・API統合
- Zodバリデーションスキーマ
- 共通コンポーネント（Button、Modal、Toast）
- レイアウトコンポーネント（Sidebar、Header、Breadcrumbs）
- カード管理画面（一覧・作成・編集・詳細・削除）

---

## 週次計画

### Week 3（Day 11-15）: フロントエンド基盤構築
**目標**: React Router、TanStack Query、Axiosを設定し、共通コンポーネント・レイアウトを実装する

**成果物**:
- React Router 6設定
- TanStack Query設定
- Axiosクライアント設定
- Zodバリデーションスキーマ
- 共通コンポーネント（Button、Modal、Toast）
- レイアウトコンポーネント（Sidebar、Header、Breadcrumbs）

### Week 4（Day 16-20）: カード管理画面実装
**目標**: カード管理の全画面（一覧・作成・編集・詳細・削除）を実装する

**成果物**:
- カード一覧画面（ページネーション、検索、フィルタリング）
- カード作成画面（フォーム、バリデーション）
- カード編集画面（既存データ取得、更新）
- カード詳細画面（読み取り専用表示）
- カード削除機能（モーダル確認、削除実行）

---

## 日次タスク

### Day 11（8時間）: React Router・TanStack Query設定

#### ☑ TASK-0028: React Router設定
- **推定工数**: 4時間
- **タスクタイプ**: DIRECT
- **要件へのリンク**: WRREQ-001-2, WRREQ-005
- **依存タスク**: TASK-0001

**実装詳細**:
1. `src/router/index.tsx`作成
   ```typescript
   import { createBrowserRouter, RouterProvider } from 'react-router-dom';
   import AppLayout from '../components/layouts/AppLayout';
   import CardListPage from '../pages/cards/CardListPage';
   import CardCreatePage from '../pages/cards/CardCreatePage';
   import CardEditPage from '../pages/cards/CardEditPage';
   import CardDetailPage from '../pages/cards/CardDetailPage';

   const router = createBrowserRouter([
     {
       path: '/',
       element: <AppLayout />,
       children: [
         { path: '/', element: <CardListPage /> },
         { path: '/cards', element: <CardListPage /> },
         { path: '/cards/new', element: <CardCreatePage /> },
         { path: '/cards/:id', element: <CardDetailPage /> },
         { path: '/cards/:id/edit', element: <CardEditPage /> },
       ],
     },
   ]);

   export default router;
   ```

2. `src/App.tsx`更新
   ```typescript
   import { RouterProvider } from 'react-router-dom';
   import router from './router';

   function App() {
     return <RouterProvider router={router} />;
   }

   export default App;
   ```

3. ページコンポーネントのプレースホルダー作成
   - `src/pages/cards/CardListPage.tsx`
   - `src/pages/cards/CardCreatePage.tsx`
   - `src/pages/cards/CardEditPage.tsx`
   - `src/pages/cards/CardDetailPage.tsx`

**完了条件**:
- [ ] React Routerが動作する
- [ ] `/cards`にアクセスできる
- [ ] ページ遷移が正常に動作する
- [ ] プレースホルダーページが表示される

---

#### ☑ TASK-0029: TanStack Query設定
- **推定工数**: 4時間
- **タスクタイプ**: DIRECT
- **要件へのリンク**: WRREQ-001-2, WRREQ-005
- **依存タスク**: TASK-0001

**実装詳細**:
1. `src/main.tsx`更新
   ```typescript
   import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
   import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

   const queryClient = new QueryClient({
     defaultOptions: {
       queries: {
         retry: 1,
         refetchOnWindowFocus: false,
         staleTime: 5 * 60 * 1000, // 5分
       },
     },
   });

   ReactDOM.createRoot(document.getElementById('root')!).render(
     <React.StrictMode>
       <QueryClientProvider client={queryClient}>
         <App />
         <ReactQueryDevtools initialIsOpen={false} />
       </QueryClientProvider>
     </React.StrictMode>,
   );
   ```

2. カスタムフック例（`src/hooks/useCards.ts`）
   ```typescript
   import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
   import { getCards, createCard, updateCard, deleteCard } from '../api/cards';

   export const useCards = (params?: { page?: number; limit?: number }) => {
     return useQuery({
       queryKey: ['cards', params],
       queryFn: () => getCards(params),
     });
   };

   export const useCreateCard = () => {
     const queryClient = useQueryClient();
     return useMutation({
       mutationFn: createCard,
       onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['cards'] });
       },
     });
   };
   ```

**完了条件**:
- [ ] TanStack Queryが動作する
- [ ] QueryClientProviderが適用される
- [ ] React Query Devtoolsが表示される
- [ ] カスタムフックのテンプレートが作成される

---

### Day 12（8時間）: Axios・Zodバリデーション設定

#### ☑ TASK-0030: Axiosクライアント設定
- **推定工数**: 4時間
- **タスクタイプ**: DIRECT
- **要件へのリンク**: WRREQ-001-2, WRREQ-005, WRREQ-067
- **依存タスク**: TASK-0001, TASK-0007

**実装詳細**:
1. `src/api/client.ts`作成
   ```typescript
   import axios from 'axios';

   const apiClient = axios.create({
     baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
     headers: {
       'Content-Type': 'application/json',
     },
   });

   apiClient.interceptors.response.use(
     (response) => response,
     (error) => {
       const message = error.response?.data?.error?.message || 'エラーが発生しました';
       console.error('API Error:', message);
       return Promise.reject(error);
     }
   );

   export default apiClient;
   ```

2. API関数例（`src/api/cards.ts`）
   ```typescript
   import apiClient from './client';
   import { Card, CreateCardInput, UpdateCardInput } from '../types/card';

   export const getCards = async (params?: { page?: number; limit?: number }) => {
     const response = await apiClient.get<{ data: { items: Card[]; total: number } }>('/cards', { params });
     return response.data.data;
   };

   export const getCard = async (id: string) => {
     const response = await apiClient.get<{ data: Card }>(`/cards/${id}`);
     return response.data.data;
   };

   export const createCard = async (data: CreateCardInput) => {
     const response = await apiClient.post<{ data: Card }>('/cards', data);
     return response.data.data;
   };

   export const updateCard = async (id: string, data: UpdateCardInput) => {
     const response = await apiClient.put<{ data: Card }>(`/cards/${id}`, data);
     return response.data.data;
   };

   export const deleteCard = async (id: string) => {
     await apiClient.delete(`/cards/${id}`);
   };
   ```

**完了条件**:
- [ ] Axiosクライアントが設定される
- [ ] インターセプターが動作する
- [ ] API関数が実装される
- [ ] エラーハンドリングが動作する

---

#### ☑ TASK-0031: Zodバリデーションスキーマ実装
- **推定工数**: 4時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-001-2, WRREQ-012〜027
- **依存タスク**: TASK-0001

**実装詳細**:
1. `src/types/card.ts`作成
   ```typescript
   import { z } from 'zod';

   export const cardTypeEnum = z.enum(['MATERIAL', 'OPERATION', 'CATALYST', 'KNOWLEDGE', 'SPECIAL', 'ARTIFACT']);
   export const cardRarityEnum = z.enum(['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY']);

   export const createCardSchema = z.object({
     name: z.string().min(1, 'カード名を入力してください').max(100, 'カード名は100文字以内で入力してください'),
     description: z.string().min(1, '説明を入力してください').max(1000, '説明は1000文字以内で入力してください'),
     cardType: cardTypeEnum,
     rarity: cardRarityEnum,
     attribute: z.record(z.number()).optional(),
     stabilityValue: z.number().min(-100).max(100),
     energyCost: z.number().min(0).max(5),
     unlockCondition: z.string().max(500).optional(),
     tags: z.array(z.string()).optional(),
     imageUrl: z.string().url().optional(),
   });

   export const updateCardSchema = createCardSchema.partial();

   export type Card = z.infer<typeof createCardSchema> & { id: string; createdAt: string; updatedAt: string };
   export type CreateCardInput = z.infer<typeof createCardSchema>;
   export type UpdateCardInput = z.infer<typeof updateCardSchema>;
   ```

2. react-hook-formとの統合
   ```typescript
   import { useForm } from 'react-hook-form';
   import { zodResolver } from '@hookform/resolvers/zod';
   import { createCardSchema } from '../types/card';

   const { register, handleSubmit, formState: { errors } } = useForm({
     resolver: zodResolver(createCardSchema),
   });
   ```

**完了条件**:
- [ ] Zodスキーマが定義される
- [ ] TypeScript型が生成される
- [ ] react-hook-formと統合できる
- [ ] バリデーションエラーメッセージが日本語化される

**テスト要件**:
- [ ] 必須フィールドのバリデーションが動作する
- [ ] 文字数制限のバリデーションが動作する
- [ ] 数値範囲のバリデーションが動作する

---

### Day 13（8時間）: 共通コンポーネント（Button、Modal）

#### ☑ TASK-0032: 共通コンポーネント - Button
- **推定工数**: 4時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-005, WRNFR-007, WRNFR-008
- **依存タスク**: TASK-0001

**実装詳細**:
1. `src/components/common/Button.tsx`作成
   ```typescript
   import { ButtonHTMLAttributes, FC } from 'react';
   import { cn } from '../../utils/cn';

   interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
     variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
     size?: 'sm' | 'md' | 'lg';
     isLoading?: boolean;
   }

   const Button: FC<ButtonProps> = ({
     variant = 'primary',
     size = 'md',
     isLoading = false,
     className,
     disabled,
     children,
     ...props
   }) => {
     const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

     const variants = {
       primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
       secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
       danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
       ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
     };

     const sizes = {
       sm: 'px-3 py-1.5 text-sm',
       md: 'px-4 py-2 text-base',
       lg: 'px-6 py-3 text-lg',
     };

     return (
       <button
         className={cn(baseStyles, variants[variant], sizes[size], className)}
         disabled={disabled || isLoading}
         {...props}
       >
         {isLoading ? <span>読み込み中...</span> : children}
       </button>
     );
   };

   export default Button;
   ```

2. `src/utils/cn.ts`作成（クラス名統合ユーティリティ）
   ```typescript
   import { clsx, ClassValue } from 'clsx';
   import { twMerge } from 'tailwind-merge';

   export function cn(...inputs: ClassValue[]) {
     return twMerge(clsx(inputs));
   }
   ```

**完了条件**:
- [ ] Buttonコンポーネントが実装される
- [ ] variant、size、isLoadingプロパティが動作する
- [ ] TailwindCSSスタイルが適用される
- [ ] アクセシビリティが考慮されている

**テスト要件**:
- [ ] 各variantでスタイルが正しく適用される
- [ ] isLoading時にボタンが無効化される
- [ ] disabled時にボタンが無効化される

---

#### ☑ TASK-0033: 共通コンポーネント - Modal
- **推定工数**: 4時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-005, WRNFR-008
- **依存タスク**: TASK-0032

**実装詳細**:
1. `src/components/common/Modal.tsx`作成
   ```typescript
   import { FC, ReactNode, useEffect } from 'react';
   import Button from './Button';

   interface ModalProps {
     isOpen: boolean;
     onClose: () => void;
     title?: string;
     children: ReactNode;
     footer?: ReactNode;
   }

   const Modal: FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
     useEffect(() => {
       if (isOpen) {
         document.body.style.overflow = 'hidden';
       } else {
         document.body.style.overflow = 'unset';
       }
       return () => {
         document.body.style.overflow = 'unset';
       };
     }, [isOpen]);

     if (!isOpen) return null;

     return (
       <div className="fixed inset-0 z-50 flex items-center justify-center">
         <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
         <div className="relative z-10 w-full max-w-lg bg-white rounded-lg shadow-xl">
           {title && (
             <div className="flex items-center justify-between p-4 border-b">
               <h2 className="text-xl font-semibold">{title}</h2>
               <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
             </div>
           )}
           <div className="p-6">{children}</div>
           {footer && <div className="flex justify-end gap-2 p-4 border-t">{footer}</div>}
         </div>
       </div>
     );
   };

   export default Modal;
   ```

**完了条件**:
- [ ] Modalコンポーネントが実装される
- [ ] isOpenでモーダルの表示/非表示が切り替わる
- [ ] 背景クリックでモーダルが閉じる
- [ ] スクロールロックが動作する

**テスト要件**:
- [ ] isOpen=trueでモーダルが表示される
- [ ] isOpen=falseでモーダルが非表示になる
- [ ] 背景クリックでonCloseが呼ばれる

---

### Day 14（8時間）: 共通コンポーネント（Toast）・レイアウト（Sidebar）

#### ☑ TASK-0034: 共通コンポーネント - Toast
- **推定工数**: 4時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-005, WRNFR-008
- **依存タスク**: TASK-0032

**実装詳細**:
1. `src/contexts/ToastContext.tsx`作成
   ```typescript
   import { createContext, FC, ReactNode, useContext, useState } from 'react';

   type ToastType = 'success' | 'error' | 'info' | 'warning';

   interface Toast {
     id: string;
     type: ToastType;
     message: string;
   }

   interface ToastContextType {
     toasts: Toast[];
     addToast: (type: ToastType, message: string) => void;
     removeToast: (id: string) => void;
   }

   const ToastContext = createContext<ToastContextType | undefined>(undefined);

   export const ToastProvider: FC<{ children: ReactNode }> = ({ children }) => {
     const [toasts, setToasts] = useState<Toast[]>([]);

     const addToast = (type: ToastType, message: string) => {
       const id = Math.random().toString(36).substr(2, 9);
       setToasts((prev) => [...prev, { id, type, message }]);
       setTimeout(() => removeToast(id), 5000);
     };

     const removeToast = (id: string) => {
       setToasts((prev) => prev.filter((toast) => toast.id !== id));
     };

     return (
       <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
         {children}
         <ToastContainer toasts={toasts} onClose={removeToast} />
       </ToastContext.Provider>
     );
   };

   export const useToast = () => {
     const context = useContext(ToastContext);
     if (!context) throw new Error('useToast must be used within ToastProvider');
     return context;
   };
   ```

2. `src/components/common/ToastContainer.tsx`作成
   ```typescript
   import { FC } from 'react';

   const ToastContainer: FC<{ toasts: Toast[]; onClose: (id: string) => void }> = ({ toasts, onClose }) => {
     return (
       <div className="fixed top-4 right-4 z-50 space-y-2">
         {toasts.map((toast) => (
           <div
             key={toast.id}
             className={`p-4 rounded-lg shadow-lg ${
               toast.type === 'success' ? 'bg-green-500 text-white' :
               toast.type === 'error' ? 'bg-red-500 text-white' :
               toast.type === 'warning' ? 'bg-yellow-500 text-white' :
               'bg-blue-500 text-white'
             }`}
           >
             <div className="flex items-center justify-between">
               <span>{toast.message}</span>
               <button onClick={() => onClose(toast.id)} className="ml-4">✕</button>
             </div>
           </div>
         ))}
       </div>
     );
   };

   export default ToastContainer;
   ```

**完了条件**:
- [ ] ToastProviderが実装される
- [ ] useToastフックが動作する
- [ ] Toast通知が表示される
- [ ] 5秒後に自動で消える

**テスト要件**:
- [ ] addToastでトーストが表示される
- [ ] removeToastでトーストが削除される
- [ ] 各type（success, error, info, warning）で色が変わる

---

#### ☑ TASK-0035: レイアウトコンポーネント - Sidebar
- **推定工数**: 4時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-005, WRNFR-007
- **依存タスク**: TASK-0028

**実装詳細**:
1. `src/components/layouts/Sidebar.tsx`作成
   ```typescript
   import { FC } from 'react';
   import { Link, useLocation } from 'react-router-dom';

   const menuItems = [
     { path: '/cards', label: 'カード管理', icon: '🃏' },
     { path: '/customers', label: '顧客管理', icon: '👥' },
     { path: '/alchemy-styles', label: '錬金スタイル', icon: '⚗️' },
     { path: '/settings', label: '設定', icon: '⚙️' },
   ];

   const Sidebar: FC = () => {
     const location = useLocation();

     return (
       <aside className="w-64 h-screen bg-gray-800 text-white flex flex-col">
         <div className="p-4 text-xl font-bold border-b border-gray-700">
           リソース管理
         </div>
         <nav className="flex-1 p-4 space-y-2">
           {menuItems.map((item) => (
             <Link
               key={item.path}
               to={item.path}
               className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                 location.pathname.startsWith(item.path)
                   ? 'bg-blue-600 text-white'
                   : 'text-gray-300 hover:bg-gray-700'
               }`}
             >
               <span className="text-xl">{item.icon}</span>
               <span>{item.label}</span>
             </Link>
           ))}
         </nav>
       </aside>
     );
   };

   export default Sidebar;
   ```

**完了条件**:
- [ ] Sidebarコンポーネントが実装される
- [ ] メニューアイテムが表示される
- [ ] アクティブなメニューがハイライトされる
- [ ] React Routerのリンクが動作する

**テスト要件**:
- [ ] メニューアイテムがクリックできる
- [ ] 現在のパスに応じてハイライトが変わる

---

### Day 15（8時間）: レイアウト（Header、Breadcrumbs）

#### ☑ TASK-0036: レイアウトコンポーネント - Header
- **推定工数**: 4時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-005, WRNFR-007
- **依存タスク**: TASK-0028

**実装詳細**:
1. `src/components/layouts/Header.tsx`作成
   ```typescript
   import { FC } from 'react';

   const Header: FC = () => {
     return (
       <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
         <div className="flex items-center gap-4">
           <h1 className="text-xl font-semibold">アトリエ錬金術ゲーム</h1>
         </div>
         <div className="flex items-center gap-4">
           <span className="text-sm text-gray-600">管理者</span>
         </div>
       </header>
     );
   };

   export default Header;
   ```

2. `src/components/layouts/AppLayout.tsx`作成
   ```typescript
   import { FC } from 'react';
   import { Outlet } from 'react-router-dom';
   import Sidebar from './Sidebar';
   import Header from './Header';
   import Breadcrumbs from './Breadcrumbs';

   const AppLayout: FC = () => {
     return (
       <div className="flex h-screen">
         <Sidebar />
         <div className="flex-1 flex flex-col overflow-hidden">
           <Header />
           <Breadcrumbs />
           <main className="flex-1 overflow-auto p-6">
             <Outlet />
           </main>
         </div>
       </div>
     );
   };

   export default AppLayout;
   ```

**完了条件**:
- [ ] Headerコンポーネントが実装される
- [ ] AppLayoutコンポーネントが実装される
- [ ] Sidebar、Header、Breadcrumbs、メインコンテンツが配置される
- [ ] レスポンシブレイアウトが動作する

**テスト要件**:
- [ ] レイアウトが正しく表示される
- [ ] Outletで子コンポーネントが表示される

---

#### ☑ TASK-0037: レイアウトコンポーネント - Breadcrumbs
- **推定工数**: 4時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-005, WRNFR-007
- **依存タスク**: TASK-0028

**実装詳細**:
1. `src/components/layouts/Breadcrumbs.tsx`作成
   ```typescript
   import { FC } from 'react';
   import { Link, useLocation } from 'react-router-dom';

   const pathNameMap: Record<string, string> = {
     cards: 'カード管理',
     customers: '顧客管理',
     'alchemy-styles': '錬金スタイル',
     new: '新規作成',
     edit: '編集',
   };

   const Breadcrumbs: FC = () => {
     const location = useLocation();
     const pathnames = location.pathname.split('/').filter((x) => x);

     return (
       <nav className="h-12 bg-gray-50 border-b border-gray-200 flex items-center px-6">
         <ol className="flex items-center space-x-2 text-sm">
           <li>
             <Link to="/" className="text-blue-600 hover:underline">ホーム</Link>
           </li>
           {pathnames.map((name, index) => {
             const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
             const isLast = index === pathnames.length - 1;
             const displayName = pathNameMap[name] || name;

             return (
               <li key={routeTo} className="flex items-center">
                 <span className="mx-2 text-gray-400">/</span>
                 {isLast ? (
                   <span className="text-gray-700">{displayName}</span>
                 ) : (
                   <Link to={routeTo} className="text-blue-600 hover:underline">
                     {displayName}
                   </Link>
                 )}
               </li>
             );
           })}
         </ol>
       </nav>
     );
   };

   export default Breadcrumbs;
   ```

**完了条件**:
- [ ] Breadcrumbsコンポーネントが実装される
- [ ] パンくずリストが表示される
- [ ] 現在のパスに応じてパンくずが変わる
- [ ] リンクが動作する

**テスト要件**:
- [ ] パスに応じたパンくずが表示される
- [ ] 最後のアイテムがリンクでない
- [ ] 途中のアイテムがクリックできる

---

### Day 16（8時間）: カード一覧画面

#### ☑ TASK-0038: カード一覧画面実装
- **推定工数**: 8時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-053, WRREQ-053-1, WRREQ-053-2
- **依存タスク**: TASK-0029, TASK-0030, TASK-0035, TASK-0036, TASK-0037

**実装詳細**:
1. `src/pages/cards/CardListPage.tsx`作成
   ```typescript
   import { FC, useState } from 'react';
   import { Link } from 'react-router-dom';
   import { useCards } from '../../hooks/useCards';
   import Button from '../../components/common/Button';

   const CardListPage: FC = () => {
     const [page, setPage] = useState(1);
     const [search, setSearch] = useState('');
     const { data, isLoading, error } = useCards({ page, limit: 20, search });

     if (isLoading) return <div>読み込み中...</div>;
     if (error) return <div>エラーが発生しました</div>;

     return (
       <div>
         <div className="flex items-center justify-between mb-6">
           <h1 className="text-2xl font-bold">カード一覧</h1>
           <Link to="/cards/new">
             <Button variant="primary">新規作成</Button>
           </Link>
         </div>

         <div className="mb-4">
           <input
             type="text"
             placeholder="カード名で検索..."
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             className="w-full px-4 py-2 border border-gray-300 rounded-lg"
           />
         </div>

         <div className="bg-white shadow rounded-lg overflow-hidden">
           <table className="min-w-full divide-y divide-gray-200">
             <thead className="bg-gray-50">
               <tr>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">名前</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">タイプ</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">レアリティ</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
               </tr>
             </thead>
             <tbody className="bg-white divide-y divide-gray-200">
               {data?.items.map((card) => (
                 <tr key={card.id}>
                   <td className="px-6 py-4">{card.name}</td>
                   <td className="px-6 py-4">{card.cardType}</td>
                   <td className="px-6 py-4">{card.rarity}</td>
                   <td className="px-6 py-4 space-x-2">
                     <Link to={`/cards/${card.id}`}>
                       <Button variant="ghost" size="sm">詳細</Button>
                     </Link>
                     <Link to={`/cards/${card.id}/edit`}>
                       <Button variant="secondary" size="sm">編集</Button>
                     </Link>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>

         <div className="mt-4 flex justify-between items-center">
           <Button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>前へ</Button>
           <span>ページ {page} / {data?.totalPages || 1}</span>
           <Button onClick={() => setPage((p) => p + 1)} disabled={page >= (data?.totalPages || 1)}>次へ</Button>
         </div>
       </div>
     );
   };

   export default CardListPage;
   ```

**完了条件**:
- [ ] カード一覧が表示される
- [ ] ページネーションが動作する
- [ ] 検索機能が動作する
- [ ] 新規作成ボタンが動作する
- [ ] 詳細・編集リンクが動作する

**テスト要件**:
- [ ] データ取得時にカードが表示される
- [ ] 検索入力でフィルタリングされる
- [ ] ページネーションボタンでページが切り替わる

---

### Day 17（8時間）: カード作成画面

#### ☑ TASK-0039: カード作成画面実装
- **推定工数**: 8時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-053, WRREQ-053-3
- **依存タスク**: TASK-0029, TASK-0030, TASK-0031, TASK-0032, TASK-0034

**実装詳細**:
1. `src/pages/cards/CardCreatePage.tsx`作成
   ```typescript
   import { FC } from 'react';
   import { useNavigate } from 'react-router-dom';
   import { useForm } from 'react-hook-form';
   import { zodResolver } from '@hookform/resolvers/zod';
   import { createCardSchema, CreateCardInput } from '../../types/card';
   import { useCreateCard } from '../../hooks/useCards';
   import { useToast } from '../../contexts/ToastContext';
   import Button from '../../components/common/Button';

   const CardCreatePage: FC = () => {
     const navigate = useNavigate();
     const { mutate: createCard, isLoading } = useCreateCard();
     const { addToast } = useToast();
     const { register, handleSubmit, formState: { errors } } = useForm<CreateCardInput>({
       resolver: zodResolver(createCardSchema),
     });

     const onSubmit = (data: CreateCardInput) => {
       createCard(data, {
         onSuccess: () => {
           addToast('success', 'カードを作成しました');
           navigate('/cards');
         },
         onError: () => {
           addToast('error', 'カードの作成に失敗しました');
         },
       });
     };

     return (
       <div>
         <h1 className="text-2xl font-bold mb-6">カード新規作成</h1>
         <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow rounded-lg p-6 space-y-4">
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">カード名</label>
             <input {...register('name')} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
             {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">説明</label>
             <textarea {...register('description')} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
             {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">カードタイプ</label>
             <select {...register('cardType')} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
               <option value="MATERIAL">素材</option>
               <option value="OPERATION">操作</option>
               <option value="CATALYST">触媒</option>
               <option value="KNOWLEDGE">知識</option>
               <option value="SPECIAL">特殊</option>
               <option value="ARTIFACT">アーティファクト</option>
             </select>
             {errors.cardType && <p className="text-red-500 text-sm mt-1">{errors.cardType.message}</p>}
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">レアリティ</label>
             <select {...register('rarity')} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
               <option value="COMMON">コモン</option>
               <option value="UNCOMMON">アンコモン</option>
               <option value="RARE">レア</option>
               <option value="EPIC">エピック</option>
               <option value="LEGENDARY">レジェンダリー</option>
             </select>
             {errors.rarity && <p className="text-red-500 text-sm mt-1">{errors.rarity.message}</p>}
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">安定性値</label>
             <input type="number" {...register('stabilityValue', { valueAsNumber: true })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
             {errors.stabilityValue && <p className="text-red-500 text-sm mt-1">{errors.stabilityValue.message}</p>}
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">エネルギーコスト</label>
             <input type="number" {...register('energyCost', { valueAsNumber: true })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
             {errors.energyCost && <p className="text-red-500 text-sm mt-1">{errors.energyCost.message}</p>}
           </div>

           <div className="flex gap-4">
             <Button type="submit" variant="primary" isLoading={isLoading}>作成</Button>
             <Button type="button" variant="secondary" onClick={() => navigate('/cards')}>キャンセル</Button>
           </div>
         </form>
       </div>
     );
   };

   export default CardCreatePage;
   ```

**完了条件**:
- [ ] カード作成フォームが表示される
- [ ] バリデーションが動作する
- [ ] カード作成が成功する
- [ ] Toast通知が表示される
- [ ] 作成後に一覧画面に遷移する

**テスト要件**:
- [ ] フォーム送信でAPIが呼ばれる
- [ ] バリデーションエラーが表示される
- [ ] 作成成功でToast通知が表示される

---

### Day 18（8時間）: カード編集画面

#### ☑ TASK-0040: カード編集画面実装
- **推定工数**: 8時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-053, WRREQ-053-4
- **依存タスク**: TASK-0039

**実装詳細**:
1. `src/pages/cards/CardEditPage.tsx`作成（CardCreatePageと類似、既存データ取得・更新処理が追加）
   ```typescript
   import { FC, useEffect } from 'react';
   import { useNavigate, useParams } from 'react-router-dom';
   import { useForm } from 'react-hook-form';
   import { zodResolver } from '@hookform/resolvers/zod';
   import { updateCardSchema, UpdateCardInput } from '../../types/card';
   import { useCard, useUpdateCard } from '../../hooks/useCards';
   import { useToast } from '../../contexts/ToastContext';
   import Button from '../../components/common/Button';

   const CardEditPage: FC = () => {
     const { id } = useParams<{ id: string }>();
     const navigate = useNavigate();
     const { data: card, isLoading: isLoadingCard } = useCard(id!);
     const { mutate: updateCard, isLoading } = useUpdateCard();
     const { addToast } = useToast();
     const { register, handleSubmit, reset, formState: { errors } } = useForm<UpdateCardInput>({
       resolver: zodResolver(updateCardSchema),
     });

     useEffect(() => {
       if (card) {
         reset(card);
       }
     }, [card, reset]);

     const onSubmit = (data: UpdateCardInput) => {
       updateCard({ id: id!, data }, {
         onSuccess: () => {
           addToast('success', 'カードを更新しました');
           navigate('/cards');
         },
         onError: () => {
           addToast('error', 'カードの更新に失敗しました');
         },
       });
     };

     if (isLoadingCard) return <div>読み込み中...</div>;

     return (
       <div>
         <h1 className="text-2xl font-bold mb-6">カード編集</h1>
         {/* フォーム実装（CardCreatePageと同様） */}
       </div>
     );
   };

   export default CardEditPage;
   ```

**完了条件**:
- [ ] 既存カードデータが取得される
- [ ] フォームに既存データが表示される
- [ ] カード更新が成功する
- [ ] Toast通知が表示される
- [ ] 更新後に一覧画面に遷移する

**テスト要件**:
- [ ] 既存データでフォームが初期化される
- [ ] フォーム送信で更新APIが呼ばれる
- [ ] 更新成功でToast通知が表示される

---

### Day 19（8時間）: カード詳細画面

#### ☑ TASK-0041: カード詳細画面実装
- **推定工数**: 8時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-053, WRREQ-053-5
- **依存タスク**: TASK-0029, TASK-0030

**実装詳細**:
1. `src/pages/cards/CardDetailPage.tsx`作成
   ```typescript
   import { FC } from 'react';
   import { Link, useParams } from 'react-router-dom';
   import { useCard } from '../../hooks/useCards';
   import Button from '../../components/common/Button';

   const CardDetailPage: FC = () => {
     const { id } = useParams<{ id: string }>();
     const { data: card, isLoading, error } = useCard(id!);

     if (isLoading) return <div>読み込み中...</div>;
     if (error) return <div>エラーが発生しました</div>;
     if (!card) return <div>カードが見つかりません</div>;

     return (
       <div>
         <div className="flex items-center justify-between mb-6">
           <h1 className="text-2xl font-bold">カード詳細</h1>
           <div className="flex gap-2">
             <Link to={`/cards/${id}/edit`}>
               <Button variant="primary">編集</Button>
             </Link>
             <Link to="/cards">
               <Button variant="secondary">一覧に戻る</Button>
             </Link>
           </div>
         </div>

         <div className="bg-white shadow rounded-lg p-6 space-y-4">
           <div>
             <h2 className="text-sm font-medium text-gray-500">カード名</h2>
             <p className="text-lg">{card.name}</p>
           </div>
           <div>
             <h2 className="text-sm font-medium text-gray-500">説明</h2>
             <p className="text-lg">{card.description}</p>
           </div>
           <div className="grid grid-cols-2 gap-4">
             <div>
               <h2 className="text-sm font-medium text-gray-500">カードタイプ</h2>
               <p className="text-lg">{card.cardType}</p>
             </div>
             <div>
               <h2 className="text-sm font-medium text-gray-500">レアリティ</h2>
               <p className="text-lg">{card.rarity}</p>
             </div>
             <div>
               <h2 className="text-sm font-medium text-gray-500">安定性値</h2>
               <p className="text-lg">{card.stabilityValue}</p>
             </div>
             <div>
               <h2 className="text-sm font-medium text-gray-500">エネルギーコスト</h2>
               <p className="text-lg">{card.energyCost}</p>
             </div>
           </div>
         </div>
       </div>
     );
   };

   export default CardDetailPage;
   ```

**完了条件**:
- [ ] カード詳細が表示される
- [ ] 全フィールドが正しく表示される
- [ ] 編集ボタンが動作する
- [ ] 一覧に戻るボタンが動作する

**テスト要件**:
- [ ] データ取得時にカード詳細が表示される
- [ ] 存在しないIDでエラーメッセージが表示される

---

### Day 20（8時間）: カード削除機能

#### ☑ TASK-0042: カード削除機能実装
- **推定工数**: 8時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-053, WRREQ-053-6
- **依存タスク**: TASK-0033, TASK-0034, TASK-0041

**実装詳細**:
1. `src/hooks/useCards.ts`に削除機能追加
   ```typescript
   export const useDeleteCard = () => {
     const queryClient = useQueryClient();
     return useMutation({
       mutationFn: deleteCard,
       onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['cards'] });
       },
     });
   };
   ```

2. `src/pages/cards/CardDetailPage.tsx`に削除ボタン追加
   ```typescript
   import { useState } from 'react';
   import Modal from '../../components/common/Modal';

   const CardDetailPage: FC = () => {
     const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
     const { mutate: deleteCard, isLoading: isDeleting } = useDeleteCard();
     const { addToast } = useToast();
     const navigate = useNavigate();

     const handleDelete = () => {
       deleteCard(id!, {
         onSuccess: () => {
           addToast('success', 'カードを削除しました');
           navigate('/cards');
         },
         onError: () => {
           addToast('error', 'カードの削除に失敗しました');
         },
       });
     };

     return (
       <div>
         {/* ... 既存コード ... */}
         <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)}>削除</Button>

         <Modal
           isOpen={isDeleteModalOpen}
           onClose={() => setIsDeleteModalOpen(false)}
           title="カードの削除"
           footer={
             <>
               <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>キャンセル</Button>
               <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>削除</Button>
             </>
           }
         >
           <p>本当にこのカードを削除しますか？この操作は取り消せません。</p>
         </Modal>
       </div>
     );
   };
   ```

**完了条件**:
- [ ] 削除ボタンが表示される
- [ ] 削除確認モーダルが表示される
- [ ] カード削除が成功する
- [ ] Toast通知が表示される
- [ ] 削除後に一覧画面に遷移する

**テスト要件**:
- [ ] 削除ボタンクリックでモーダルが表示される
- [ ] モーダル内の削除ボタンで削除APIが呼ばれる
- [ ] 削除成功でToast通知が表示される
- [ ] キャンセルボタンでモーダルが閉じる

---

## Phase 3 完了条件

### 必須条件
- [ ] React Router設定が完了している
- [ ] TanStack Query設定が完了している
- [ ] Axiosクライアント設定が完了している
- [ ] Zodバリデーションスキーマが実装されている
- [ ] 共通コンポーネント（Button、Modal、Toast）が実装されている
- [ ] レイアウトコンポーネント（Sidebar、Header、Breadcrumbs）が実装されている
- [ ] カード一覧画面が動作する
- [ ] カード作成画面が動作する
- [ ] カード編集画面が動作する
- [ ] カード詳細画面が動作する
- [ ] カード削除機能が動作する

### 品質基準
- [ ] ESLint・Prettierでコード整形されている
- [ ] TypeScriptのコンパイルエラーがない
- [ ] 全テストが通る
- [ ] TanStack Query Devtoolsで状態確認できる
- [ ] Toast通知が正しく表示される
- [ ] ページネーションが正しく動作する
- [ ] フォームバリデーションが正しく動作する

### マイルストーン
- [x] **M3: フロントエンド基盤・カード管理画面完成** - Phase 3完了時点で達成

---

## 変更履歴

| 日付 | バージョン | 変更内容 |
|------|----------|---------|
| 2025-11-09 | 1.0 | 初版作成。15タスク、80時間 |
