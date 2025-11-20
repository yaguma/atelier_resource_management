# API エンドポイント仕様

**【信頼性レベル】**:
- 🔵 **青信号**: 要件定義書から直接導出された確実なAPI仕様
- 🟡 **黄信号**: 要件定義書から妥当な推測によるAPI仕様
- 🔴 **赤信号**: 一般的なWebアプリ管理画面のベストプラクティスから推測

---

## ベースURL

- **開発環境**: `http://localhost:3000/api` 🔵
- **本番環境**: `https://{app-name}.azurewebsites.net/api` 🔵

---

## 共通仕様

### 共通レスポンス形式

#### 成功時 🔵

```json
{
  "data": { ... },
  "message": "Success"
}
```

#### エラー時 🔵

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "エラーメッセージ",
    "details": [ ... ]
  }
}
```

### HTTPステータスコード 🔵

- **200 OK**: 成功（GET, PUT）
- **201 Created**: リソース作成成功（POST）
- **204 No Content**: 削除成功（DELETE）
- **400 Bad Request**: バリデーションエラー
- **404 Not Found**: リソースが見つからない
- **409 Conflict**: 重複エラー（ユニーク制約違反）
- **500 Internal Server Error**: サーバーエラー

### エラーコード体系 🔵

- **AUTH_xxx**: 認証・認可エラー（将来実装）
- **VALID_xxx**: バリデーションエラー
- **RES_xxx**: リソースエラー（未検出、重複、依存関係）
- **DB_xxx**: データベースエラー
- **REPO_xxx**: Repositoryエラー
- **SYS_xxx**: システムエラー
- **NET_xxx**: ネットワークエラー

---

## カード管理API

### GET /api/cards - カード一覧取得 🔵

カードの一覧をページネーション付きで取得します。

**クエリパラメータ**:
- `page` (number, デフォルト: 1): ページ番号（1始まり）
- `limit` (number, デフォルト: 20): 1ページあたりの件数
- `search` (string, オプション): カード名での部分一致検索
- `cardType` (CardType, オプション): カード系統でフィルタリング
- `rarity` (Rarity, オプション): レア度でフィルタリング

**リクエスト例**:
```
GET /api/cards?page=1&limit=20&cardType=MATERIAL&search=炎
```

**レスポンス例** (200 OK):
```json
{
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "炎の素材",
        "description": "高温を発する赤い鉱石",
        "cardType": "MATERIAL",
        "attribute": { "fire": 5 },
        "stabilityValue": 80,
        "reactionEffect": null,
        "energyCost": 2,
        "imageUrl": null,
        "rarity": "COMMON",
        "evolutionFromId": null,
        "createdAt": "2025-01-01T00:00:00Z",
        "updatedAt": "2025-01-01T00:00:00Z",
        "deletedAt": null
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

---

### GET /api/cards/:id - カード詳細取得 🔵

指定されたIDのカード詳細を取得します。

**パスパラメータ**:
- `id` (UUID): カードID

**リクエスト例**:
```
GET /api/cards/550e8400-e29b-41d4-a716-446655440000
```

**レスポンス例** (200 OK):
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "炎の素材",
    "description": "高温を発する赤い鉱石",
    "cardType": "MATERIAL",
    "attribute": { "fire": 5 },
    "stabilityValue": 80,
    "reactionEffect": null,
    "energyCost": 2,
    "imageUrl": null,
    "rarity": "COMMON",
    "evolutionFromId": null,
    "evolutionFrom": null,
    "evolutionTo": [],
    "initialDeckStyles": [],
    "unlockableContent": null,
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z",
    "deletedAt": null
  }
}
```

**エラーレスポンス例** (404 Not Found):
```json
{
  "error": {
    "code": "RES_NOT_FOUND",
    "message": "カードが見つかりません"
  }
}
```

---

### POST /api/cards - カード新規作成 🔵

新しいカードを作成します。

**リクエストボディ**:
```json
{
  "name": "炎の素材",
  "description": "高温を発する赤い鉱石",
  "cardType": "MATERIAL",
  "attribute": { "fire": 5 },
  "stabilityValue": 80,
  "reactionEffect": null,
  "energyCost": 2,
  "imageUrl": null,
  "rarity": "COMMON",
  "evolutionFromId": null
}
```

**レスポンス例** (201 Created):
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "炎の素材",
    "description": "高温を発する赤い鉱石",
    "cardType": "MATERIAL",
    "attribute": { "fire": 5 },
    "stabilityValue": 80,
    "reactionEffect": null,
    "energyCost": 2,
    "imageUrl": null,
    "rarity": "COMMON",
    "evolutionFromId": null,
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z",
    "deletedAt": null
  },
  "message": "カードを作成しました"
}
```

**エラーレスポンス例** (400 Bad Request):
```json
{
  "error": {
    "code": "VALID_REQUIRED",
    "message": "必須項目が不足しています",
    "details": [
      {
        "field": "name",
        "message": "カード名は必須です"
      }
    ]
  }
}
```

**エラーレスポンス例** (409 Conflict):
```json
{
  "error": {
    "code": "RES_DUPLICATE",
    "message": "このカード名は既に使用されています"
  }
}
```

---

### PUT /api/cards/:id - カード更新 🔵

指定されたIDのカードを更新します（部分更新可）。

**パスパラメータ**:
- `id` (UUID): カードID

**リクエストボディ** (部分更新可):
```json
{
  "name": "炎の素材（強化版）",
  "energyCost": 3
}
```

**レスポンス例** (200 OK):
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "炎の素材（強化版）",
    "description": "高温を発する赤い鉱石",
    "cardType": "MATERIAL",
    "attribute": { "fire": 5 },
    "stabilityValue": 80,
    "reactionEffect": null,
    "energyCost": 3,
    "imageUrl": null,
    "rarity": "COMMON",
    "evolutionFromId": null,
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T01:00:00Z",
    "deletedAt": null
  },
  "message": "カードを更新しました"
}
```

---

### DELETE /api/cards/:id - カード削除（ソフトデリート） 🔵

指定されたIDのカードを削除します（ソフトデリート）。

**パスパラメータ**:
- `id` (UUID): カードID

**レスポンス例** (204 No Content):
```
(レスポンスボディなし)
```

**エラーレスポンス例** (409 Conflict):
```json
{
  "error": {
    "code": "RES_DEPENDENCY_EXISTS",
    "message": "このカードは他のリソースから参照されているため削除できません",
    "details": [
      {
        "resource": "AlchemyStyle",
        "id": "660e8400-e29b-41d4-a716-446655440000",
        "name": "火の錬金術師"
      }
    ]
  }
}
```

---

## 顧客管理API

### GET /api/customers - 顧客一覧取得 🔵

顧客の一覧をページネーション付きで取得します。

**クエリパラメータ**:
- `page` (number, デフォルト: 1): ページ番号
- `limit` (number, デフォルト: 20): 1ページあたりの件数
- `search` (string, オプション): 顧客名での部分一致検索
- `difficulty` (number, オプション): 難易度でフィルタリング（1〜5）
- `customerType` (string, オプション): 顧客タイプでフィルタリング

**リクエスト例**:
```
GET /api/customers?page=1&limit=20&difficulty=3&search=商人
```

**レスポンス例** (200 OK):
```json
{
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "薬屋のおばあちゃん",
        "description": "村の薬屋を営む老婦人",
        "customerType": "村人",
        "difficulty": 1,
        "requiredAttribute": { "fire": 3, "water": 2 },
        "qualityCondition": 30,
        "stabilityCondition": 20,
        "rewardFame": 50,
        "rewardKnowledge": 10,
        "portraitUrl": null,
        "createdAt": "2025-01-01T00:00:00Z",
        "updatedAt": "2025-01-01T00:00:00Z",
        "deletedAt": null
      }
    ],
    "total": 50,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

---

### GET /api/customers/:id - 顧客詳細取得 🔵

指定されたIDの顧客詳細を取得します。

**パスパラメータ**:
- `id` (UUID): 顧客ID

**レスポンス例** (200 OK):
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "薬屋のおばあちゃん",
    "description": "村の薬屋を営む老婦人",
    "customerType": "村人",
    "difficulty": 1,
    "requiredAttribute": { "fire": 3, "water": 2 },
    "qualityCondition": 30,
    "stabilityCondition": 20,
    "rewardFame": 50,
    "rewardKnowledge": 10,
    "portraitUrl": null,
    "rewardCards": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "炎の素材"
      }
    ],
    "mapNodes": [],
    "unlockableContent": null,
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z",
    "deletedAt": null
  }
}
```

---

### POST /api/customers - 顧客新規作成 🔵

新しい顧客を作成します。

**リクエストボディ**:
```json
{
  "name": "薬屋のおばあちゃん",
  "description": "村の薬屋を営む老婦人",
  "customerType": "村人",
  "difficulty": 1,
  "requiredAttribute": { "fire": 3, "water": 2 },
  "qualityCondition": 30,
  "stabilityCondition": 20,
  "rewardFame": 50,
  "rewardKnowledge": 10,
  "portraitUrl": null,
  "rewardCardIds": ["550e8400-e29b-41d4-a716-446655440000"]
}
```

**レスポンス例** (201 Created):
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "薬屋のおばあちゃん",
    "description": "村の薬屋を営む老婦人",
    "customerType": "村人",
    "difficulty": 1,
    "requiredAttribute": { "fire": 3, "water": 2 },
    "qualityCondition": 30,
    "stabilityCondition": 20,
    "rewardFame": 50,
    "rewardKnowledge": 10,
    "portraitUrl": null,
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z",
    "deletedAt": null
  },
  "message": "顧客を作成しました"
}
```

---

### PUT /api/customers/:id - 顧客更新 🔵

指定されたIDの顧客を更新します（部分更新可）。

**パスパラメータ**:
- `id` (UUID): 顧客ID

**リクエストボディ** (部分更新可):
```json
{
  "name": "薬屋のおばあちゃん（強化版）",
  "difficulty": 2,
  "rewardCardIds": ["550e8400-e29b-41d4-a716-446655440000", "550e8400-e29b-41d4-a716-446655440002"]
}
```

**レスポンス例** (200 OK):
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "薬屋のおばあちゃん（強化版）",
    "description": "村の薬屋を営む老婦人",
    "customerType": "村人",
    "difficulty": 2,
    "requiredAttribute": { "fire": 3, "water": 2 },
    "qualityCondition": 30,
    "stabilityCondition": 20,
    "rewardFame": 50,
    "rewardKnowledge": 10,
    "portraitUrl": null,
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T01:00:00Z",
    "deletedAt": null
  },
  "message": "顧客を更新しました"
}
```

---

### DELETE /api/customers/:id - 顧客削除（ソフトデリート） 🔵

指定されたIDの顧客を削除します（ソフトデリート）。

**パスパラメータ**:
- `id` (UUID): 顧客ID

**レスポンス例** (204 No Content):
```
(レスポンスボディなし)
```

---

## 錬金スタイル管理API

### GET /api/alchemy-styles - 錬金スタイル一覧取得 🔵

錬金スタイルの一覧を取得します。

**レスポンス例** (200 OK):
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "name": "火の錬金術師",
      "description": "炎の力を操る錬金術師",
      "characteristics": "火属性カードに特化",
      "iconUrl": null,
      "initialDeckCards": [],
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T00:00:00Z",
      "deletedAt": null
    }
  ]
}
```

---

### GET /api/alchemy-styles/:id - 錬金スタイル詳細取得 🔵

指定されたIDの錬金スタイル詳細を取得します。

**パスパラメータ**:
- `id` (UUID): 錬金スタイルID

**レスポンス例** (200 OK):
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "name": "火の錬金術師",
    "description": "炎の力を操る錬金術師",
    "characteristics": "火属性カードに特化",
    "iconUrl": null,
    "initialDeckCards": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "炎の素材"
      }
    ],
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z",
    "deletedAt": null
  }
}
```

---

### POST /api/alchemy-styles - 錬金スタイル新規作成 🔵

新しい錬金スタイルを作成します。

**リクエストボディ**:
```json
{
  "name": "火の錬金術師",
  "description": "炎の力を操る錬金術師",
  "characteristics": "火属性カードに特化",
  "iconUrl": null,
  "initialDeckCardIds": ["550e8400-e29b-41d4-a716-446655440000"]
}
```

**レスポンス例** (201 Created):
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "name": "火の錬金術師",
    "description": "炎の力を操る錬金術師",
    "characteristics": "火属性カードに特化",
    "iconUrl": null,
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z",
    "deletedAt": null
  },
  "message": "錬金スタイルを作成しました"
}
```

---

### PUT /api/alchemy-styles/:id - 錬金スタイル更新 🔵

指定されたIDの錬金スタイルを更新します（部分更新可）。

**パスパラメータ**:
- `id` (UUID): 錬金スタイルID

**リクエストボディ** (部分更新可):
```json
{
  "name": "火の錬金術師（強化版）",
  "initialDeckCardIds": ["550e8400-e29b-41d4-a716-446655440000", "550e8400-e29b-41d4-a716-446655440003"]
}
```

**レスポンス例** (200 OK):
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "name": "火の錬金術師（強化版）",
    "description": "炎の力を操る錬金術師",
    "characteristics": "火属性カードに特化",
    "iconUrl": null,
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T01:00:00Z",
    "deletedAt": null
  },
  "message": "錬金スタイルを更新しました"
}
```

---

### DELETE /api/alchemy-styles/:id - 錬金スタイル削除（ソフトデリート） 🔵

指定されたIDの錬金スタイルを削除します（ソフトデリート）。

**パスパラメータ**:
- `id` (UUID): 錬金スタイルID

**レスポンス例** (204 No Content):
```
(レスポンスボディなし)
```

---

## マップノード管理API

### GET /api/map-nodes - マップノード一覧取得 🔵

マップノードの一覧をページネーション付きで取得します。

**クエリパラメータ**:
- `page` (number, デフォルト: 1): ページ番号
- `limit` (number, デフォルト: 20): 1ページあたりの件数
- `search` (string, オプション): ノード名での部分一致検索
- `nodeType` (NodeType, オプション): ノードタイプでフィルタリング

**リクエスト例**:
```
GET /api/map-nodes?nodeType=REQUEST&page=1&limit=20
```

**レスポンス例** (200 OK):
```json
{
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440003",
        "name": "依頼ノード1",
        "nodeType": "REQUEST",
        "description": "顧客からの依頼",
        "eventContent": { "type": "request", "description": "..." },
        "rewards": { "fame": 50, "knowledge": 10 },
        "iconUrl": null,
        "customerId": "550e8400-e29b-41d4-a716-446655440001",
        "createdAt": "2025-01-01T00:00:00Z",
        "updatedAt": "2025-01-01T00:00:00Z",
        "deletedAt": null
      }
    ],
    "total": 30,
    "page": 1,
    "limit": 20,
    "totalPages": 2
  }
}
```

---

### GET /api/map-nodes/:id - マップノード詳細取得 🔵

指定されたIDのマップノード詳細を取得します。

**パスパラメータ**:
- `id` (UUID): マップノードID

**レスポンス例** (200 OK):
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440003",
    "name": "依頼ノード1",
    "nodeType": "REQUEST",
    "description": "顧客からの依頼",
    "eventContent": { "type": "request", "description": "..." },
    "rewards": { "fame": 50, "knowledge": 10 },
    "iconUrl": null,
    "customerId": "550e8400-e29b-41d4-a716-446655440001",
    "customer": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "薬屋のおばあちゃん"
    },
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z",
    "deletedAt": null
  }
}
```

---

### POST /api/map-nodes - マップノード新規作成 🔵

新しいマップノードを作成します。

**リクエストボディ**:
```json
{
  "name": "依頼ノード1",
  "nodeType": "REQUEST",
  "description": "顧客からの依頼",
  "eventContent": { "type": "request", "description": "..." },
  "rewards": { "fame": 50, "knowledge": 10 },
  "iconUrl": null,
  "customerId": "550e8400-e29b-41d4-a716-446655440001"
}
```

**レスポンス例** (201 Created):
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440003",
    "name": "依頼ノード1",
    "nodeType": "REQUEST",
    "description": "顧客からの依頼",
    "eventContent": { "type": "request", "description": "..." },
    "rewards": { "fame": 50, "knowledge": 10 },
    "iconUrl": null,
    "customerId": "550e8400-e29b-41d4-a716-446655440001",
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z",
    "deletedAt": null
  },
  "message": "マップノードを作成しました"
}
```

---

### PUT /api/map-nodes/:id - マップノード更新 🔵

指定されたIDのマップノードを更新します（部分更新可）。

**パスパラメータ**:
- `id` (UUID): マップノードID

**リクエストボディ** (部分更新可):
```json
{
  "name": "依頼ノード1（更新）",
  "rewards": { "fame": 100, "knowledge": 20 }
}
```

**レスポンス例** (200 OK):
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440003",
    "name": "依頼ノード1（更新）",
    "nodeType": "REQUEST",
    "description": "顧客からの依頼",
    "eventContent": { "type": "request", "description": "..." },
    "rewards": { "fame": 100, "knowledge": 20 },
    "iconUrl": null,
    "customerId": "550e8400-e29b-41d4-a716-446655440001",
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T01:00:00Z",
    "deletedAt": null
  },
  "message": "マップノードを更新しました"
}
```

---

### DELETE /api/map-nodes/:id - マップノード削除（ソフトデリート） 🔵

指定されたIDのマップノードを削除します（ソフトデリート）。

**パスパラメータ**:
- `id` (UUID): マップノードID

**レスポンス例** (204 No Content):
```
(レスポンスボディなし)
```

---

## ゲームバランス管理API

### GET /api/game-balance - ゲームバランス設定一覧取得 🔵

ゲームバランス設定の一覧を取得します。

**クエリパラメータ**:
- `category` (BalanceCategory, オプション): カテゴリでフィルタリング

**リクエスト例**:
```
GET /api/game-balance?category=ENERGY
```

**レスポンス例** (200 OK):
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440004",
      "settingKey": "energy_initial_value",
      "settingValue": "3",
      "description": "初期エネルギー値",
      "category": "ENERGY",
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T00:00:00Z",
      "deletedAt": null
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440005",
      "settingKey": "energy_max_value",
      "settingValue": "10",
      "description": "最大エネルギー値",
      "category": "ENERGY",
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T00:00:00Z",
      "deletedAt": null
    }
  ]
}
```

---

### GET /api/game-balance/:id - ゲームバランス設定詳細取得 🔵

指定されたIDのゲームバランス設定詳細を取得します。

**パスパラメータ**:
- `id` (UUID): ゲームバランス設定ID

**レスポンス例** (200 OK):
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440004",
    "settingKey": "energy_initial_value",
    "settingValue": "3",
    "description": "初期エネルギー値",
    "category": "ENERGY",
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z",
    "deletedAt": null
  }
}
```

---

### PUT /api/game-balance/:id - ゲームバランス設定更新 🔵

指定されたIDのゲームバランス設定を更新します。

**パスパラメータ**:
- `id` (UUID): ゲームバランス設定ID

**リクエストボディ**:
```json
{
  "settingValue": "5",
  "description": "初期エネルギー値（更新）"
}
```

**レスポンス例** (200 OK):
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440004",
    "settingKey": "energy_initial_value",
    "settingValue": "5",
    "description": "初期エネルギー値（更新）",
    "category": "ENERGY",
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T01:00:00Z",
    "deletedAt": null
  },
  "message": "設定を更新しました"
}
```

---

## データエクスポート/インポートAPI

### GET /api/export - 全データエクスポート 🔵

全てのゲームデータをJSON形式でエクスポートします。

**クエリパラメータ**:
- `resources` (string[], オプション): エクスポート対象リソース（省略時は全データ）
  - 例: `?resources=cards,customers`

**リクエスト例**:
```
GET /api/export?resources=cards,customers
```

**レスポンス例** (200 OK):
```
Content-Type: application/json
Content-Disposition: attachment; filename="export-2025-01-01.json"

{
  "cards": [ ... ],
  "customers": [ ... ],
  "alchemyStyles": [ ... ],
  "mapNodes": [ ... ],
  "metaCurrencies": [ ... ],
  "unlockableContents": [ ... ],
  "gameBalances": [ ... ],
  "exportedAt": "2025-01-01T00:00:00Z"
}
```

---

### POST /api/import - データインポート 🔵

JSON形式のデータをインポートします。

**リクエスト**:
- Content-Type: `multipart/form-data`
- ボディ: JSONファイル

**リクエスト例**:
```
POST /api/import
Content-Type: multipart/form-data

file: (JSONファイル)
```

**レスポンス例** (200 OK):
```json
{
  "message": "データをインポートしました",
  "imported": {
    "cards": 10,
    "customers": 5,
    "alchemyStyles": 2,
    "mapNodes": 8
  }
}
```

**エラーレスポンス例** (400 Bad Request):
```json
{
  "error": {
    "code": "VALID_SCHEMA_ERROR",
    "message": "インポートデータのスキーマが不正です",
    "details": [
      {
        "path": "cards[0].name",
        "message": "カード名は必須です"
      }
    ]
  }
}
```

---

## 変更履歴

| 日付 | バージョン | 変更内容 |
|------|----------|---------|
| 2025-01-XX | 1.0 | 初版作成 |

