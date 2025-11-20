# データフロー図

## ユーザーインタラクションフロー

```mermaid
flowchart TD
    A[ユーザー] -->|操作| B[React Component]
    B -->|状態更新| C[TanStack Query]
    C -->|API呼び出し| D[Axios HTTP Client]
    D -->|HTTP Request| E[Hono.js API]
    E -->|ルーティング| F[Controller]
    F -->|ビジネスロジック| G[Service Layer]
    G -->|データアクセス| H[Repository]
    H -->|ORM| I[Prisma]
    I -->|SQL| J[PostgreSQL]
    J -->|データ| I
    I -->|結果| H
    H -->|結果| G
    G -->|結果| F
    F -->|HTTP Response| E
    E -->|JSON| D
    D -->|データ| C
    C -->|キャッシュ更新| C
    C -->|UI更新| B
    B -->|表示| A
```

**【信頼性レベル】**:
- 🔵 **青信号**: 要件定義書から直接導出された確実な設計
- 🟡 **黄信号**: 要件定義書から妥当な推測による設計
- 🔴 **赤信号**: 一般的なWebアプリ管理画面のベストプラクティスから推測

---

## データ処理フロー（シーケンス図）

### カード一覧取得フロー

```mermaid
sequenceDiagram
    participant U as ユーザー
    participant C as React Component
    participant Q as TanStack Query
    participant A as Axios
    participant H as Hono.js
    participant Ctrl as Controller
    participant Svc as Service
    participant Repo as Repository
    participant P as Prisma
    participant DB as PostgreSQL

    U->>C: 画面表示
    C->>Q: useQuery('cards')
    alt キャッシュにデータがある
        Q-->>C: キャッシュデータ返却
    else キャッシュにデータがない
        Q->>A: GET /api/cards
        A->>H: HTTP Request
        H->>Ctrl: ルーティング
        Ctrl->>Svc: getCards(params)
        Svc->>Repo: findAll(params)
        Repo->>P: prisma.card.findMany()
        P->>DB: SELECT * FROM cards
        DB-->>P: データ返却
        P-->>Repo: Card[]
        Repo-->>Svc: Card[]
        Svc-->>Ctrl: Card[]
        Ctrl-->>H: JSON Response
        H-->>A: HTTP 200 OK
        A-->>Q: データ返却
        Q->>Q: キャッシュに保存
        Q-->>C: データ返却
    end
    C->>U: 画面表示
```

### カード作成フロー

```mermaid
sequenceDiagram
    participant U as ユーザー
    participant C as React Component
    participant F as React Hook Form
    participant Z as Zod
    participant Q as TanStack Query
    participant A as Axios
    participant H as Hono.js
    participant Ctrl as Controller
    participant Svc as Service
    participant Repo as Repository
    participant P as Prisma
    participant DB as PostgreSQL

    U->>C: フォーム入力
    C->>F: フォーム送信
    F->>Z: バリデーション
    alt バリデーション成功
        Z-->>F: 成功
        F->>Q: useMutation('createCard')
        Q->>A: POST /api/cards
        A->>H: HTTP Request + JSON Body
        H->>Ctrl: ルーティング
        Ctrl->>Z: リクエストバリデーション
        alt バリデーション成功
            Z-->>Ctrl: 成功
            Ctrl->>Svc: createCard(data)
            Svc->>Svc: 重複チェック
            Svc->>Repo: create(data)
            Repo->>P: prisma.card.create()
            P->>DB: INSERT INTO cards
            DB-->>P: 作成されたデータ
            P-->>Repo: Card
            Repo-->>Svc: Card
            Svc-->>Ctrl: Card
            Ctrl-->>H: JSON Response (201 Created)
            H-->>A: HTTP 201 Created
            A-->>Q: データ返却
            Q->>Q: キャッシュ無効化
            Q->>Q: 一覧再取得
            Q-->>C: 成功通知
            C->>U: トースト通知 + 画面遷移
        else バリデーション失敗
            Z-->>Ctrl: エラー
            Ctrl-->>H: JSON Response (400 Bad Request)
            H-->>A: HTTP 400
            A-->>Q: エラー返却
            Q-->>C: エラー通知
            C->>U: エラーメッセージ表示
        end
    else バリデーション失敗
        Z-->>F: エラー
        F-->>C: エラー表示
        C->>U: フォームエラー表示
    end
```

### カード削除フロー

```mermaid
sequenceDiagram
    participant U as ユーザー
    participant C as React Component
    participant D as 確認ダイアログ
    participant Q as TanStack Query
    participant A as Axios
    participant H as Hono.js
    participant Ctrl as Controller
    participant Svc as Service
    participant Repo as Repository
    participant P as Prisma
    participant DB as PostgreSQL

    U->>C: 削除ボタンクリック
    C->>D: 確認ダイアログ表示
    U->>D: OK
    D->>C: 削除確定
    C->>Q: useMutation('deleteCard')
    Q->>A: DELETE /api/cards/:id
    A->>H: HTTP Request
    H->>Ctrl: ルーティング
    Ctrl->>Svc: deleteCard(id)
    Svc->>Svc: 依存関係チェック
    alt 依存関係なし
        Svc->>Repo: softDelete(id)
        Repo->>P: prisma.card.update({ deletedAt: now })
        P->>DB: UPDATE cards SET deleted_at = NOW()
        DB-->>P: 更新完了
        P-->>Repo: 成功
        Repo-->>Svc: 成功
        Svc-->>Ctrl: 成功
        Ctrl-->>H: JSON Response (204 No Content)
        H-->>A: HTTP 204 No Content
        A-->>Q: 成功
        Q->>Q: キャッシュ無効化
        Q->>Q: 一覧再取得
        Q-->>C: 成功通知
        C->>U: トースト通知 + 一覧更新
    else 依存関係あり
        Svc-->>Ctrl: エラー (RES_DEPENDENCY_EXISTS)
        Ctrl-->>H: JSON Response (409 Conflict)
        H-->>A: HTTP 409 Conflict
        A-->>Q: エラー返却
        Q-->>C: エラー通知
        C->>U: エラーメッセージ表示
    end
```

---

## 状態管理フロー

### サーバー状態（TanStack Query）

```mermaid
flowchart LR
    A[API Response] -->|キャッシュ| B[TanStack Query Cache]
    B -->|staleTime: 5分| C[Fresh Data]
    B -->|cacheTime: 10分| D[Stale Data]
    C -->|即座に返却| E[React Component]
    D -->|バックグラウンド再取得| F[Refetch]
    F -->|更新| B
    B -->|無効化| G[Invalidation]
    G -->|再取得| F
```

### クライアント状態（React Hooks）

```mermaid
flowchart TD
    A[React Component] -->|useState| B[フォーム入力値]
    A -->|useState| C[検索文字列]
    A -->|useState| D[フィルタ条件]
    A -->|useState| E[ページ番号]
    B -->|送信時| F[TanStack Query Mutation]
    C -->|変更時| G[TanStack Query Refetch]
    D -->|変更時| G
    E -->|変更時| G
```

---

## エラーハンドリングフロー

```mermaid
flowchart TD
    A[API呼び出し] -->|成功| B[正常レスポンス]
    A -->|エラー| C{エラータイプ}
    C -->|400 Bad Request| D[バリデーションエラー]
    C -->|404 Not Found| E[リソース未検出]
    C -->|409 Conflict| F[重複エラー]
    C -->|500 Internal Server Error| G[サーバーエラー]
    C -->|ネットワークエラー| H[ネットワークエラー]
    D -->|エラーメッセージ表示| I[React Component]
    E -->|エラーメッセージ表示| I
    F -->|エラーメッセージ表示| I
    G -->|エラーログ記録| J[サーバーログ]
    G -->|エラーメッセージ表示| I
    H -->|リトライ| K[TanStack Query Retry]
    K -->|再試行| A
    K -->|最大リトライ回数| L[エラーメッセージ表示]
    L --> I
```

---

## データエクスポート/インポートフロー

### エクスポートフロー

```mermaid
sequenceDiagram
    participant U as ユーザー
    participant C as React Component
    participant A as Axios
    participant H as Hono.js
    participant Ctrl as Controller
    participant Svc as Service
    participant Repo as Repository
    participant DB as PostgreSQL

    U->>C: エクスポートボタンクリック
    C->>A: GET /api/export?resources=cards,customers
    A->>H: HTTP Request
    H->>Ctrl: ルーティング
    Ctrl->>Svc: exportData(resources)
    Svc->>Repo: findAll(resources)
    Repo->>DB: SELECT * FROM ...
    DB-->>Repo: データ返却
    Repo-->>Svc: データ配列
    Svc->>Svc: JSON形式に変換
    Svc->>Svc: バリデーション
    Svc-->>Ctrl: JSON文字列
    Ctrl-->>H: Response (application/json)
    H-->>A: HTTP 200 OK + JSON
    A-->>C: JSONデータ
    C->>C: ファイルダウンロード
    C->>U: ダウンロード完了
```

### インポートフロー

```mermaid
sequenceDiagram
    participant U as ユーザー
    participant C as React Component
    participant F as File Input
    participant A as Axios
    participant H as Hono.js
    participant Ctrl as Controller
    participant Svc as Service
    participant Z as Zod
    participant Repo as Repository
    participant DB as PostgreSQL

    U->>C: ファイル選択
    C->>F: ファイル読み込み
    F->>C: JSON文字列
    C->>A: POST /api/import (multipart/form-data)
    A->>H: HTTP Request + File
    H->>Ctrl: ルーティング
    Ctrl->>Svc: importData(jsonString)
    Svc->>Z: スキーマバリデーション
    alt バリデーション成功
        Z-->>Svc: 成功
        Svc->>Svc: データ整合性チェック
        alt 整合性OK
            Svc->>Repo: bulkCreate(data)
            Repo->>DB: INSERT INTO ... (トランザクション)
            DB-->>Repo: 作成完了
            Repo-->>Svc: 成功
            Svc-->>Ctrl: インポート結果
            Ctrl-->>H: JSON Response (200 OK)
            H-->>A: HTTP 200 OK
            A-->>C: 成功通知
            C->>U: トースト通知
        else 整合性NG
            Svc-->>Ctrl: エラー (RES_INTEGRITY_ERROR)
            Ctrl-->>H: JSON Response (400 Bad Request)
            H-->>A: HTTP 400
            A-->>C: エラー通知
            C->>U: エラーメッセージ表示
        end
    else バリデーション失敗
        Z-->>Svc: エラー詳細
        Svc-->>Ctrl: エラー (VALID_SCHEMA_ERROR)
        Ctrl-->>H: JSON Response (400 Bad Request)
        H-->>A: HTTP 400
        A-->>C: エラー通知
        C->>U: エラーメッセージ表示
    end
```

---

## 検索・フィルタリングフロー

```mermaid
flowchart TD
    A[ユーザー入力] -->|検索文字列| B[React Component]
    B -->|useState| C[検索状態]
    C -->|デバウンス 500ms| D[TanStack Query]
    D -->|useQuery| E[API呼び出し]
    E -->|GET /api/cards?search=...| F[Hono.js]
    F -->|Controller| G[Service]
    G -->|Repository| H[Prisma]
    H -->|WHERE name LIKE '%...%'| I[PostgreSQL]
    I -->|結果| H
    H -->|データ| G
    G -->|データ| F
    F -->|JSON| E
    E -->|キャッシュ更新| D
    D -->|UI更新| B
    B -->|表示| A
```

---

## 変更履歴

| 日付 | バージョン | 変更内容 |
|------|----------|---------|
| 2025-01-XX | 1.0 | 初版作成 |

