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

**完了条件**:
- [ ] `src/router/index.tsx`が作成され、createBrowserRouterが使用されている
- [ ] 以下のルートが定義されている: `/`, `/cards`, `/cards/new`, `/cards/:id`, `/cards/:id/edit`
- [ ] `src/App.tsx`でRouterProviderが使用されている
- [ ] プレースホルダーページコンポーネントが作成されている（CardListPage, CardCreatePage, CardEditPage, CardDetailPage）
- [ ] ブラウザで各ルートにアクセスでき、対応するページが表示される
- [ ] ページ遷移が正常に動作し、ブラウザの戻る/進むボタンが機能する
- [ ] TypeScriptコンパイルエラーがない
- [ ] ESLintエラーがない

---

#### ☑ TASK-0029: TanStack Query設定
- **推定工数**: 4時間
- **タスクタイプ**: DIRECT
- **要件へのリンク**: WRREQ-001-2, WRREQ-005
- **依存タスク**: TASK-0001

**実装詳細**:
1. `src/main.tsx`更新（QueryClient設定: retry=1, refetchOnWindowFocus=false, staleTime=5分、QueryClientProvider/ReactQueryDevtools追加）
2. `src/hooks/useCards.ts`作成（useQuery/useMutationテンプレート、queryKey/mutationFn/onSuccessでinvalidateQueries）

**完了条件**:
- [ ] `src/main.tsx`でQueryClientが設定されている（retry=1, refetchOnWindowFocus=false, staleTime=5分）
- [ ] QueryClientProviderがアプリケーション全体をラップしている
- [ ] ReactQueryDevtoolsが開発環境で表示される
- [ ] `src/hooks/useCards.ts`が作成されている
- [ ] useQueryとuseMutationのテンプレートが実装されている
- [ ] queryKeyが適切に設定されている
- [ ] mutationのonSuccessでinvalidateQueriesが呼び出されている
- [ ] ブラウザでReact Query Devtoolsが開き、クエリの状態が確認できる
- [ ] TypeScriptコンパイルエラーがない
- [ ] ESLintエラーがない

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

**完了条件**:
- [ ] `src/api/client.ts`が作成され、axios.createが使用されている
- [ ] baseURLがVITE_API_BASE_URLから取得されている
- [ ] Content-Typeヘッダーがapplication/jsonに設定されている
- [ ] レスポンスインターセプターが実装されている
- [ ] エラーレスポンスで適切なエラーメッセージが表示される
- [ ] `src/api/cards.ts`が作成されている
- [ ] 以下のAPI関数が実装されている: getCards, getCard, createCard, updateCard, deleteCard
- [ ] 各API関数に適切な型定義がされている
- [ ] エラー発生時にインターセプターが動作し、エラーメッセージが表示される
- [ ] TypeScriptコンパイルエラーがない
- [ ] ESLintエラーがない

---

#### ☑ TASK-0031: Zodバリデーションスキーマ実装
- **推定工数**: 4時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-001-2, WRREQ-012〜027
- **依存タスク**: TASK-0001

**実装詳細**:
1. `src/types/card.ts`作成（cardTypeEnum, cardRarityEnum、createCardSchema定義: name/description/cardType/rarity/attribute/stabilityValue/energyCost/unlockCondition/tags/imageUrl、日本語エラーメッセージ、updateCardSchemaはpartial化、TypeScript型エクスポート）
2. react-hook-formと統合（zodResolver使用、formState.errorsで日本語エラー表示）

**完了条件**:
- [ ] `src/types/card.ts`が作成されている
- [ ] cardTypeEnumとcardRarityEnumが定義されている
- [ ] createCardSchemaが以下のフィールドを持つ: name, description, cardType, rarity, attribute, stabilityValue, energyCost, unlockCondition, tags, imageUrl
- [ ] 各フィールドに適切なバリデーションルールが設定されている
- [ ] 日本語のエラーメッセージが設定されている
- [ ] updateCardSchemaがpartial化されている
- [ ] TypeScript型がエクスポートされている（CreateCardInput, UpdateCardInput等）
- [ ] react-hook-formでzodResolverが使用できる
- [ ] formState.errorsで日本語エラーメッセージが表示される
- [ ] TypeScriptコンパイルエラーがない
- [ ] ESLintエラーがない

**テスト要件**:
- [ ] 必須フィールドが空の場合、エラーメッセージが表示される
- [ ] 文字数制限を超えた場合、エラーメッセージが表示される
- [ ] 数値範囲外の値を入力した場合、エラーメッセージが表示される
- [ ] すべてのバリデーションエラーメッセージが日本語で表示される

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

**完了条件**:
- [ ] `src/components/common/Button.tsx`が作成されている
- [ ] variantプロパティが実装されている（primary, secondary, danger, ghost）
- [ ] sizeプロパティが実装されている（sm, md, lg）
- [ ] isLoadingプロパティが実装されている
- [ ] TailwindCSSでスタイルが適用されている
- [ ] focus:ringでフォーカス時のアクセシビリティが考慮されている
- [ ] disabledプロパティが実装されている
- [ ] `src/utils/cn.ts`が作成されている（clsx + twMerge）
- [ ] TypeScriptコンパイルエラーがない
- [ ] ESLintエラーがない

**テスト要件**:
- [ ] 各variant（primary, secondary, danger, ghost）でスタイルが正しく適用される
- [ ] 各size（sm, md, lg）でサイズが正しく適用される
- [ ] isLoadingがtrueの場合、ボタンが無効化される
- [ ] disabledがtrueの場合、ボタンが無効化される
- [ ] クリックイベントが正常に動作する

---

#### ☑ TASK-0033: 共通コンポーネント - Modal
- **推定工数**: 4時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-005, WRNFR-008
- **依存タスク**: TASK-0032

**実装詳細**:
1. `src/components/common/Modal.tsx`作成（isOpen/onClose/title/children/footerプロパティ、背景オーバーレイ、スクロールロック、閉じるボタン）

**完了条件**:
- [ ] `src/components/common/Modal.tsx`が作成されている
- [ ] isOpenプロパティで表示/非表示が切り替わる
- [ ] onCloseプロパティが実装されている
- [ ] titleプロパティでタイトルが表示される
- [ ] childrenプロパティでコンテンツが表示される
- [ ] footerプロパティでフッターが表示される
- [ ] 背景オーバーレイが実装されている
- [ ] モーダル表示時にスクロールがロックされる
- [ ] 閉じるボタンが実装されている
- [ ] TypeScriptコンパイルエラーがない
- [ ] ESLintエラーがない

**テスト要件**:
- [ ] isOpenがtrueの場合、モーダルが表示される
- [ ] isOpenがfalseの場合、モーダルが非表示になる
- [ ] 背景オーバーレイをクリックするとonCloseが呼び出される
- [ ] 閉じるボタンをクリックするとonCloseが呼び出される
- [ ] モーダル表示中はbodyのスクロールがロックされる
- [ ] モーダルを閉じるとスクロールロックが解除される

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

**完了条件**:
- [ ] `src/contexts/ToastContext.tsx`が作成されている
- [ ] ToastProviderが実装されている
- [ ] useToastフックが実装されている
- [ ] addToast関数が実装されている
- [ ] removeToast関数が実装されている
- [ ] Toastが5秒後に自動削除される
- [ ] ToastContainerが統合されている
- [ ] `src/components/common/ToastContainer.tsx`が作成されている
- [ ] toast配列が表示される
- [ ] type別に色分けされる（success, error, info, warning）
- [ ] 閉じるボタンが実装されている
- [ ] TypeScriptコンパイルエラーがない
- [ ] ESLintエラーがない

**テスト要件**:
- [ ] addToast関数を呼び出すとToastが表示される
- [ ] removeToast関数を呼び出すとToastが削除される
- [ ] 各type（success, error, info, warning）で色が変化する
- [ ] 5秒後に自動的にToastが削除される
- [ ] 閉じるボタンをクリックするとToastが削除される
- [ ] 複数のToastを同時に表示できる

---

#### ☑ TASK-0035: レイアウトコンポーネント - Sidebar
- **推定工数**: 4時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-005, WRNFR-007
- **依存タスク**: TASK-0028

**実装詳細**:
1. `src/components/layouts/Sidebar.tsx`作成（menuItems配列: cards/customers/alchemy-styles/settings、useLocationでアクティブハイライト、React Router Link、アイコン表示）

**完了条件**:
- [ ] `src/components/layouts/Sidebar.tsx`が作成されている
- [ ] menuItems配列が定義されている（cards, customers, alchemy-styles, settings）
- [ ] useLocationで現在のパスが取得されている
- [ ] 現在のパスに応じてアクティブなメニューがハイライトされる
- [ ] React RouterのLinkコンポーネントが使用されている
- [ ] 各メニューアイテムにアイコンが表示される
- [ ] TypeScriptコンパイルエラーがない
- [ ] ESLintエラーがない

**テスト要件**:
- [ ] 各メニューアイテムをクリックすると対応するページに遷移する
- [ ] 現在のパスに応じて対応するメニューがハイライトされる
- [ ] ページ遷移してもハイライトが正しく更新される
- [ ] すべてのメニューアイテム（cards, customers, alchemy-styles, settings）が表示される

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

**完了条件**:
- [ ] `src/components/layouts/Header.tsx`が作成されている
- [ ] タイトルが表示される
- [ ] ユーザー情報が表示される
- [ ] border-bottomが適用されている
- [ ] `src/components/layouts/AppLayout.tsx`が作成されている
- [ ] Sidebarが配置されている
- [ ] Headerが配置されている
- [ ] Breadcrumbsが配置されている
- [ ] mainコンテンツエリアが配置されている
- [ ] Outletで子コンポーネントが表示される
- [ ] flexレイアウトが適用されている
- [ ] レスポンシブレイアウトが実装されている
- [ ] TypeScriptコンパイルエラーがない
- [ ] ESLintエラーがない

**テスト要件**:
- [ ] Headerにタイトルとユーザー情報が表示される
- [ ] AppLayoutで各コンポーネント（Sidebar, Header, Breadcrumbs）が正しく配置される
- [ ] Outletでページコンポーネントが正しく表示される
- [ ] ブラウザのウィンドウサイズを変更してもレイアウトが崩れない

---

#### ☑ TASK-0037: レイアウトコンポーネント - Breadcrumbs
- **推定工数**: 4時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-005, WRNFR-007
- **依存タスク**: TASK-0028

**実装詳細**:
1. `src/components/layouts/Breadcrumbs.tsx`作成（pathNameMapで日本語マッピング、useLocationでパス取得、ホーム → 中間パス → 現在パス、最後はリンクなし、スラッシュ区切り）

**完了条件**:
- [ ] `src/components/layouts/Breadcrumbs.tsx`が作成されている
- [ ] pathNameMapで日本語のパスマッピングが定義されている
- [ ] useLocationで現在のパスが取得されている
- [ ] パンくずリストが表示される（ホーム → 中間パス → 現在パス）
- [ ] 最後のアイテムはリンクではなくテキストとして表示される
- [ ] 途中のアイテムはリンクとして表示される
- [ ] スラッシュ（/）で区切られている
- [ ] TypeScriptコンパイルエラーがない
- [ ] ESLintエラーがない

**テスト要件**:
- [ ] パスに応じて適切なパンくずリストが表示される
- [ ] 最後のアイテムはリンクではなくテキストとして表示される
- [ ] 途中のアイテムをクリックすると対応するページに遷移する
- [ ] 各パスが日本語で表示される
- [ ] ページ遷移に応じてパンくずリストが更新される

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
