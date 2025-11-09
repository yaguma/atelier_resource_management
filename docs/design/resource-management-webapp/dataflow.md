# データフロー図

## 🔵 システム全体のデータフロー

### アーキテクチャ概要図

```mermaid
flowchart TB
    subgraph Frontend["🔵 フロントエンド (React SPA)"]
        UI[ユーザーインターフェース]
        Router[React Router]
        TQ[TanStack Query<br/>キャッシュ・状態管理]
        Axios[Axiosクライアント]
        Zod[Zodバリデーション]
    end

    subgraph Backend["🔵 バックエンド (Hono.js API)"]
        CORS[CORSミドルウェア]
        Valid[バリデーション<br/>ミドルウェア]
        Routes[APIルート]
        Controller[コントローラー]
        Service[サービス層]
    end

    subgraph Database["🔵 データベース (PostgreSQL)"]
        Prisma[Prisma ORM]
        DB[(PostgreSQL)]
    end

    User((🔵 ユーザー<br/>ゲーム開発者)) --> UI
    UI --> Router
    Router --> TQ
    TQ --> Axios
    Zod -.バリデーション.-> TQ

    Axios -->|🔵 HTTP Request| CORS
    CORS --> Valid
    Valid --> Routes
    Routes --> Controller
    Controller --> Service
    Service --> Prisma
    Prisma --> DB

    DB -->|🔵 Data| Prisma
    Prisma --> Service
    Service --> Controller
    Controller --> Routes
    Routes -->|🔵 JSON Response| Axios
    Axios --> TQ
    TQ --> UI
    UI --> User
```

---

## 🔵 ユーザーインタラクションフロー

### 1. カード作成フロー

```mermaid
flowchart TD
    A[🔵 ユーザーが<br/>「新規カード作成」<br/>ボタンをクリック] --> B[🟡 カード作成<br/>フォーム表示]
    B --> C{🟡 ユーザーが<br/>フォーム入力}
    C --> D[🔵 Zodで<br/>クライアント側<br/>バリデーション]
    D --> E{🟡 バリデーション<br/>成功?}
    E -->|No| F[🔴 エラーメッセージ<br/>フォーム下に表示]
    F --> C
    E -->|Yes| G[🔵 TanStack Query<br/>Mutation実行]
    G --> H[🔵 Axios POST<br/>/api/cards]
    H --> I[🔵 Hono.js<br/>バリデーション<br/>ミドルウェア]
    I --> J{🟡 バリデーション<br/>成功?}
    J -->|No| K[🔴 400 Bad Request<br/>エラーレスポンス]
    K --> L[🔴 フロントエンド<br/>エラー表示]
    J -->|Yes| M[🔵 Controller:<br/>cardController.create]
    M --> N[🔵 Service:<br/>cardService.create]
    N --> O[🔵 Prisma:<br/>card.create]
    O --> P[(🔵 PostgreSQL<br/>INSERT)]
    P --> Q[🔵 新規カードデータ<br/>返却]
    Q --> R[🔵 201 Created<br/>レスポンス]
    R --> S[🔵 TanStack Query<br/>キャッシュ無効化]
    S --> T[🔴 トースト通知<br/>「カードを作成しました」]
    T --> U[🟡 カード一覧画面に<br/>リダイレクト]
```

---

### 2. カード一覧取得・検索フロー

```mermaid
flowchart TD
    A[🔵 ユーザーが<br/>カード一覧画面に<br/>アクセス] --> B[🟡 TanStack Query<br/>キャッシュ確認]
    B --> C{🟡 キャッシュ有効?}
    C -->|Yes| D[🔵 キャッシュから<br/>データ表示]
    C -->|No| E[🔵 Axios GET<br/>/api/cards?page=1&limit=20]
    E --> F[🔵 Hono.js<br/>GET /api/cards]
    F --> G[🔵 Controller:<br/>cardController.list]
    G --> H[🔵 Service:<br/>cardService.findMany]
    H --> I[🔵 Prisma:<br/>card.findMany<br/>+ count]
    I --> J[(🔵 PostgreSQL<br/>SELECT)]
    J --> K[🔵 カードリスト<br/>+ 総件数]
    K --> L[🔵 200 OK<br/>ページネーション<br/>レスポンス]
    L --> M[🔵 TanStack Query<br/>キャッシュ保存]
    M --> N[🟡 UIにデータ表示]

    N --> O{🔵 ユーザーが<br/>検索条件入力?}
    O -->|Yes| P[🟡 React Router<br/>URLクエリ更新<br/>?search=炎&cardType=MATERIAL]
    P --> Q[🔵 TanStack Query<br/>再フェッチ]
    Q --> E
```

---

### 3. カード更新フロー

```mermaid
sequenceDiagram
    participant U as 🔵 ユーザー
    participant UI as 🟡 React Component
    participant TQ as 🔵 TanStack Query
    participant API as 🔵 Hono.js API
    participant DB as 🔵 PostgreSQL

    U->>UI: カード編集ボタンクリック
    UI->>TQ: useCard(id) でデータ取得
    TQ-->>UI: 既存カードデータ表示
    UI->>U: フォームに既存値を表示

    U->>UI: フィールド編集
    UI->>UI: Zodバリデーション

    U->>UI: 保存ボタンクリック
    UI->>TQ: Mutation (PUT /api/cards/:id)
    TQ->>API: Axios PUT リクエスト
    API->>API: バリデーション
    API->>DB: Prisma card.update
    DB-->>API: 更新済みカード
    API-->>TQ: 200 OK + データ
    TQ->>TQ: キャッシュ更新
    TQ-->>UI: 成功レスポンス
    UI->>U: トースト通知「カードを更新しました」
    UI->>UI: カード詳細画面にリダイレクト
```

---

### 4. カード削除フロー（ソフトデリート）

```mermaid
flowchart TD
    A[🔵 ユーザーが<br/>削除ボタンクリック] --> B[🔴 確認ダイアログ表示<br/>「このカードを削除しますか?」]
    B --> C{🟡 ユーザーが<br/>確認?}
    C -->|No| D[🟡 ダイアログ閉じる]
    C -->|Yes| E[🔵 TanStack Query<br/>Mutation実行]
    E --> F[🔵 Axios DELETE<br/>/api/cards/:id]
    F --> G[🔵 Controller:<br/>cardController.delete]
    G --> H[🔵 Service:<br/>cardService.softDelete]
    H --> I{🔴 依存関係チェック<br/>このカードを使用中?}
    I -->|Yes| J[🔴 409 Conflict<br/>「他のリソースから<br/>参照されています」]
    J --> K[🔴 エラーモーダル表示]
    I -->|No| L[🔵 Prisma:<br/>card.update<br/>deletedAt = now]
    L --> M[(🔵 PostgreSQL<br/>UPDATE)]
    M --> N[🔵 204 No Content]
    N --> O[🔵 TanStack Query<br/>キャッシュ無効化]
    O --> P[🔴 トースト通知<br/>「カードを削除しました」]
    P --> Q[🟡 カード一覧を<br/>再取得]
```

---

## 🔵 データ処理フロー（詳細）

### カードデータの流れ

```mermaid
sequenceDiagram
    participant User as 🔵 ユーザー
    participant Form as 🟡 CardForm<br/>Component
    participant Zod as 🔵 Zodスキーマ
    participant TQ as 🔵 TanStack Query
    participant Axios as 🔵 Axiosクライアント
    participant Hono as 🔵 Hono.js API
    participant Controller as 🔵 CardController
    participant Service as 🔵 CardService
    participant Prisma as 🔵 Prisma ORM
    participant DB as 🔵 PostgreSQL

    User->>Form: フォーム入力<br/>(name, cardType, energyCost...)
    Form->>Zod: クライアント側バリデーション

    alt 🔴 バリデーションエラー
        Zod-->>Form: バリデーションエラー
        Form-->>User: エラーメッセージ表示
    else 🟡 バリデーション成功
        Zod-->>Form: OK
        Form->>TQ: useMutation.mutate(cardData)
        TQ->>Axios: POST /api/cards
        Axios->>Hono: HTTP Request<br/>Content-Type: application/json

        Hono->>Hono: CORSミドルウェア
        Hono->>Hono: バリデーションミドルウェア（Zod）

        alt 🔴 サーバー側バリデーションエラー
            Hono-->>Axios: 400 Bad Request
            Axios-->>TQ: Error
            TQ-->>Form: onError
            Form-->>User: エラーメッセージ表示
        else 🟡 バリデーション成功
            Hono->>Controller: cardController.create(req)
            Controller->>Service: cardService.create(data)

            Service->>Service: ビジネスロジック<br/>（重複チェック等）

            alt 🔴 ビジネスエラー（重複）
                Service-->>Controller: Conflict Error
                Controller-->>Hono: 409 Conflict
                Hono-->>Axios: 409 Conflict
                Axios-->>TQ: Error
                TQ-->>Form: onError
                Form-->>User: 「同名カードが存在します」
            else 🟡 OK
                Service->>Prisma: prisma.card.create(data)
                Prisma->>DB: INSERT INTO cards
                DB-->>Prisma: 新規カードレコード
                Prisma-->>Service: Card オブジェクト
                Service-->>Controller: Card オブジェクト
                Controller-->>Hono: 201 Created<br/>{ data: Card, message: "..." }
                Hono-->>Axios: HTTP Response
                Axios-->>TQ: Success
                TQ->>TQ: キャッシュ無効化<br/>queryClient.invalidateQueries('cards')
                TQ-->>Form: onSuccess
                Form-->>User: トースト通知<br/>「カードを作成しました」
                Form->>Form: リダイレクト<br/>/cards
            end
        end
    end
```

---

## 🔵 顧客依頼の報酬設定フロー

### N:Mリレーション（Customer ←→ Card）の処理

```mermaid
flowchart TD
    A[🔵 ユーザーが顧客作成<br/>フォームで報酬カード選択] --> B[🟡 Card一覧から<br/>複数選択UI]
    B --> C[🔵 選択したカードIDの配列<br/>rewardCardIds: string[]]
    C --> D[🔵 POST /api/customers<br/>{ name, difficulty,<br/>rewardCardIds: [...] }]
    D --> E[🔵 customerController.create]
    E --> F[🔵 customerService.create]
    F --> G[🔵 Prisma:<br/>customer.create]
    G --> H[🔵 Prisma connect:<br/>rewardCards: {<br/>  connect: rewardCardIds.map<br/>    id => ({ id })<br/>}]
    H --> I[(🔵 PostgreSQL<br/>トランザクション開始)]
    I --> J[🔵 INSERT INTO customers]
    J --> K[🔵 INSERT INTO<br/>_CustomerRewardCards<br/>中間テーブル]
    K --> L[(🔵 COMMIT)]
    L --> M[🔵 顧客データ返却<br/>include: { rewardCards: true }]
    M --> N[🔵 TanStack Query<br/>キャッシュ保存]
    N --> O[🔴 トースト通知<br/>顧客作成成功]
```

---

## 🔵 データエクスポート/インポートフロー

### エクスポートフロー

```mermaid
sequenceDiagram
    participant User as 🔵 ユーザー
    participant UI as 🟡 Export Component
    participant API as 🔵 Hono.js API
    participant Service as 🔵 ExportService
    participant DB as 🔵 PostgreSQL

    User->>UI: エクスポートボタンクリック
    UI->>UI: リソース選択UI表示<br/>(cards, customers, ...)
    User->>UI: エクスポート対象を選択
    UI->>API: GET /api/export?resources=cards,customers
    API->>Service: exportService.exportData(resources)
    Service->>DB: Prismaで複数テーブル取得<br/>(findMany)
    DB-->>Service: 全データ（リレーション含む）
    Service->>Service: JSON形式に変換<br/>+ メタデータ追加<br/>(exportedAt, version)
    Service-->>API: JSON データ
    API-->>UI: Content-Type: application/json<br/>Content-Disposition: attachment
    UI->>User: ファイルダウンロード<br/>atelier_export_20251109.json
```

### インポートフロー

```mermaid
flowchart TD
    A[🔵 ユーザーが<br/>JSONファイル選択] --> B[🟡 ファイルアップロード<br/>フォーム]
    B --> C[🔵 POST /api/import<br/>multipart/form-data]
    C --> D[🔵 importController.import]
    D --> E[🔵 importService.validateJSON]
    E --> F{🔴 スキーマ<br/>バリデーション?}
    F -->|Error| G[🔴 400 Bad Request<br/>詳細なエラーメッセージ]
    G --> H[🔴 エラーモーダル表示<br/>「行10: energyCostが不正」]
    F -->|OK| I[🔵 トランザクション開始]
    I --> J[🔵 既存データ削除<br/>または上書き確認]
    J --> K[🔵 Prisma createMany<br/>バルクインサート]
    K --> L{🔴 DB制約<br/>エラー?}
    L -->|Error| M[🔴 ROLLBACK]
    M --> N[🔴 409 Conflict<br/>「ユニーク制約違反」]
    N --> H
    L -->|OK| O[🔵 COMMIT]
    O --> P[🔵 インポート統計<br/>cards: 50, customers: 10]
    P --> Q[🔵 200 OK<br/>{ imported: {...} }]
    Q --> R[🔴 トースト通知<br/>「データをインポートしました」]
    R --> S[🟡 全リストを<br/>再取得・表示]
```

---

## 🔵 TanStack Query キャッシング戦略

### キャッシュライフサイクル

```mermaid
stateDiagram-v2
    [*] --> Fresh: データ取得成功
    Fresh --> Stale: staleTime経過<br/>(5分)
    Stale --> Fetching: ユーザーが画面表示
    Fetching --> Fresh: 新データ取得成功
    Fetching --> Error: エラー発生
    Error --> Stale: 古いデータを保持
    Stale --> GarbageCollected: cacheTime経過<br/>(10分)
    GarbageCollected --> [*]

    note right of Fresh
        🔵 キャッシュが新鮮
        バックグラウンド取得なし
    end note

    note right of Stale
        🟡 キャッシュが古い
        表示時に再取得
    end note
```

### キャッシュ設定

```typescript
// 🔵 TanStack Query 設定例
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 🔵 5分間は新鮮
      cacheTime: 10 * 60 * 1000,     // 🔵 10分間キャッシュ保持
      refetchOnWindowFocus: false,   // 🟡 ウィンドウフォーカス時は再取得しない
      retry: 1,                      // 🟡 エラー時1回リトライ
    },
  },
});
```

---

## 🟡 エラー伝播フロー

### エラーハンドリングの流れ

```mermaid
flowchart TD
    A[(🔵 PostgreSQL<br/>エラー発生)] --> B[🔵 Prisma<br/>PrismaClientKnownRequestError]
    B --> C[🔵 Service層で<br/>エラーキャッチ]
    C --> D{🟡 エラー種別判定}
    D -->|P2002<br/>Unique制約| E[🔴 ConflictError<br/>409]
    D -->|P2025<br/>Not Found| F[🔴 NotFoundError<br/>404]
    D -->|その他| G[🔴 InternalServerError<br/>500]

    E --> H[🔵 Controller で<br/>エラーハンドリング]
    F --> H
    G --> H

    H --> I[🔵 Hono.js<br/>エラーレスポンス]
    I --> J[🔵 構造化エラー<br/>{ error: { code, message, details } }]
    J --> K[🔵 Axios<br/>エラーレスポンス受信]
    K --> L[🔵 TanStack Query<br/>onError コールバック]
    L --> M{🟡 エラー種別}
    M -->|400, 409| N[🔴 フォーム内エラー表示]
    M -->|404| O[🔴 「データが見つかりません」<br/>トースト]
    M -->|500| P[🔴 エラーモーダル<br/>「サーバーエラーが発生しました」]
    M -->|Network Error| Q[🔴 「ネットワークエラー」<br/>トースト]
```

---

## 🗓️ 変更履歴

| 日付 | バージョン | 変更内容 |
|------|----------|---------|
| 2025-11-09 | 1.0 | 初版作成。React+Hono.js+TanStack Query+Prismaのデータフロー図 |
