# Phase 3-A: フロントエンド基盤

## フェーズ概要

### 要件名
resource-management-webapp

### 期間・目標
- **期間**: 5営業日（Week 4、Day 19-23）
- **総工数**: 40時間
- **タスク数**: 10タスク
- **目標**: フロントエンドの基盤を構築し、共通コンポーネント・レイアウトを実装する

### 成果物
- React Router 6設定・ルーティング実装
- TanStack Query v5設定・カスタムフック実装
- Axiosクライアント設定・API統合
- Zodバリデーションスキーマ
- 共通コンポーネント（Button、Modal、Toast）
- レイアウトコンポーネント（Sidebar、Header、Breadcrumbs）

---

## 週次計画

### Week 4（Day 19-21）: フロントエンド基盤構築
**目標**: React Router、TanStack Query、Axiosを設定し、Zodバリデーションを実装する

**成果物**:
- React Router 6設定
- TanStack Query設定
- Axiosクライアント設定
- Zodバリデーションスキーマ

### Week 4（Day 22-23）: 共通コンポーネント・レイアウト実装
**目標**: 共通コンポーネント（Button、Modal、Toast）とレイアウトコンポーネント（Sidebar、Header、Breadcrumbs）を実装する

**成果物**:
- 共通コンポーネント（Button、Modal、Toast）
- レイアウトコンポーネント（Sidebar、Header、Breadcrumbs）

---

## 日次タスク

### Day 19（8時間）: React Router・TanStack Query設定

#### ☑ TASK-0028: React Router設定
- **推定工数**: 4時間
- **タスクタイプ**: DIRECT
- **要件へのリンク**: WRREQ-001-2, WRREQ-005
- **依存タスク**: TASK-0001

**実装詳細**:
1. `src/router/index.tsx`作成（createBrowserRouterでルート定義: `/`, `/cards`, `/cards/new`, `/cards/:id`, `/cards/:id/edit`）
2. `src/App.tsx`更新（RouterProvider使用）
3. ページコンポーネントのプレースホルダー作成（CardListPage, CardCreatePage, CardEditPage, CardDetailPage）

**完了条件**: React Router動作、ページ遷移、プレースホルダー表示を確認

---

#### ☑ TASK-0029: TanStack Query設定
- **推定工数**: 4時間
- **タスクタイプ**: DIRECT
- **要件へのリンク**: WRREQ-001-2, WRREQ-005
- **依存タスク**: TASK-0001

**実装詳細**:
1. `src/main.tsx`更新（QueryClient設定: retry=1, refetchOnWindowFocus=false, staleTime=5分、QueryClientProvider/ReactQueryDevtools追加）
2. `src/hooks/useCards.ts`作成（useQuery/useMutationテンプレート、queryKey/mutationFn/onSuccessでinvalidateQueries）

**完了条件**: TanStack Query動作、QueryClientProvider適用、React Query Devtools表示、カスタムフックテンプレート作成を確認

---

### Day 20（8時間）: Axios・Zodバリデーション設定

#### ☑ TASK-0030: Axiosクライアント設定
- **推定工数**: 4時間
- **タスクタイプ**: DIRECT
- **要件へのリンク**: WRREQ-001-2, WRREQ-005, WRREQ-067
- **依存タスク**: TASK-0001, TASK-0007

**実装詳細**:
1. `src/api/client.ts`作成（axios.create、baseURL=VITE_API_BASE_URL、Content-Type、レスポンスインターセプターでエラーメッセージ表示）
2. `src/api/cards.ts`作成（getCards, getCard, createCard, updateCard, deleteCard関数、型付きレスポンス）

**完了条件**: Axiosクライアント設定、インターセプター動作、API関数実装、エラーハンドリング動作を確認

---

#### ☑ TASK-0031: Zodバリデーションスキーマ実装
- **推定工数**: 4時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-001-2, WRREQ-012〜027
- **依存タスク**: TASK-0001

**実装詳細**:
1. `src/types/card.ts`作成（cardTypeEnum, cardRarityEnum、createCardSchema定義: name/description/cardType/rarity/attribute/stabilityValue/energyCost/unlockCondition/tags/imageUrl、日本語エラーメッセージ、updateCardSchemaはpartial化、TypeScript型エクスポート）
2. react-hook-formと統合（zodResolver使用、formState.errorsで日本語エラー表示）

**完了条件**: Zodスキーマ定義、TypeScript型生成、react-hook-form統合、日本語バリデーションエラーメッセージを確認

**テスト要件**: 必須フィールド、文字数制限、数値範囲のバリデーション動作を確認

---

### Day 21（8時間）: 共通コンポーネント（Button、Modal）

#### ☑ TASK-0032: 共通コンポーネント - Button
- **推定工数**: 4時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-005, WRNFR-007, WRNFR-008
- **依存タスク**: TASK-0001

**実装詳細**:
1. `src/components/common/Button.tsx`作成（variant: primary/secondary/danger/ghost、size: sm/md/lg、isLoading、TailwindCSSスタイル、focus:ring、アクセシビリティ対応）
2. `src/utils/cn.ts`作成（clsx + twMergeでクラス名統合）

**完了条件**: Buttonコンポーネント実装、variant/size/isLoadingプロパティ動作、TailwindCSSスタイル適用、アクセシビリティ考慮を確認

**テスト要件**: 各variantスタイル適用、isLoading/disabled時の無効化を確認

---

#### ☑ TASK-0033: 共通コンポーネント - Modal
- **推定工数**: 4時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-005, WRNFR-008
- **依存タスク**: TASK-0032

**実装詳細**:
1. `src/components/common/Modal.tsx`作成（isOpen/onClose/title/children/footerプロパティ、背景オーバーレイ、スクロールロック、閉じるボタン）

**完了条件**: Modalコンポーネント実装、isOpenで表示切替、背景クリック閉じ、スクロールロック動作を確認

**テスト要件**: isOpen true/falseで表示切替、背景クリックでonClose呼び出しを確認

---

### Day 22（8時間）: 共通コンポーネント（Toast）・レイアウト（Sidebar）

#### ☑ TASK-0034: 共通コンポーネント - Toast
- **推定工数**: 4時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-005, WRNFR-008
- **依存タスク**: TASK-0032

**実装詳細**:
1. `src/contexts/ToastContext.tsx`作成（ToastProvider/useToastフック、addToast/removeToast関数、5秒自動削除、ToastContainer統合）
2. `src/components/common/ToastContainer.tsx`作成（toast配列表示、type別色分け: success/error/info/warning、閉じるボタン）

**完了条件**: ToastProvider実装、useToastフック動作、Toast通知表示、5秒自動削除を確認

**テスト要件**: addToastで表示、removeToastで削除、各type色変化を確認

---

#### ☑ TASK-0035: レイアウトコンポーネント - Sidebar
- **推定工数**: 4時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-005, WRNFR-007
- **依存タスク**: TASK-0028

**実装詳細**:
1. `src/components/layouts/Sidebar.tsx`作成（menuItems配列: cards/customers/alchemy-styles/settings、useLocationでアクティブハイライト、React Router Link、アイコン表示）

**完了条件**: Sidebarコンポーネント実装、メニューアイテム表示、アクティブハイライト、React Routerリンク動作を確認

**テスト要件**: メニュークリック可能、現在パスに応じたハイライト変化を確認

---

### Day 23（8時間）: レイアウト（Header、Breadcrumbs）

#### ☑ TASK-0036: レイアウトコンポーネント - Header
- **推定工数**: 4時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-005, WRNFR-007
- **依存タスク**: TASK-0028

**実装詳細**:
1. `src/components/layouts/Header.tsx`作成（タイトル表示、ユーザー情報表示、border-bottom）
2. `src/components/layouts/AppLayout.tsx`作成（Sidebar/Header/Breadcrumbs/main配置、Outletで子コンポーネント表示、flex レスポンシブレイアウト）

**完了条件**: Header/AppLayoutコンポーネント実装、Sidebar/Header/Breadcrumbs/メインコンテンツ配置、レスポンシブレイアウト動作を確認

**テスト要件**: レイアウト正しく表示、Outletで子コンポーネント表示を確認

---

#### ☑ TASK-0037: レイアウトコンポーネント - Breadcrumbs
- **推定工数**: 4時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-005, WRNFR-007
- **依存タスク**: TASK-0028

**実装詳細**:
1. `src/components/layouts/Breadcrumbs.tsx`作成（pathNameMapで日本語マッピング、useLocationでパス取得、ホーム → 中間パス → 現在パス、最後はリンクなし、スラッシュ区切り）

**完了条件**: Breadcrumbsコンポーネント実装、パンくずリスト表示、現在パスに応じた変化、リンク動作を確認

**テスト要件**: パスに応じたパンくず表示、最後アイテムはリンクなし、途中アイテムクリック可能を確認

---

## Phase 3-A 完了条件

### 必須条件
- React Router/TanStack Query/Axiosクライアント設定完了
- Zodバリデーションスキーマ実装
- 共通コンポーネント（Button、Modal、Toast）実装
- レイアウトコンポーネント（Sidebar、Header、Breadcrumbs）実装

### 品質基準
- ESLint・Prettier整形、TypeScriptコンパイルエラーなし、全テスト通過
- TanStack Query Devtools状態確認、Toast通知正常表示

### マイルストーン
- **M3-A: フロントエンド基盤完成** - Phase 3-A完了時点で達成

---

## 変更履歴

| 日付 | バージョン | 変更内容 |
|------|----------|---------|
| 2025-11-09 | 1.0 | 初版作成。10タスク、48時間 |
| 2025-11-09 | 1.1 | Phase 3を3-Aと3-Bに分割。Day 21-26、6営業日 |
| 2025-11-09 | 1.2 | コード例削除、実装詳細・完了条件・テスト要件を簡潔化。771行→500行以下に削減 |
