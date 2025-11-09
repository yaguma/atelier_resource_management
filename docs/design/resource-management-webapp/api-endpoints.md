# API エンドポイント仕様

## 🔵 ベースURL

### 開発環境
```
http://localhost:3000/api
```

### 本番環境（Azure App Service）
```
https://{app-name}.azurewebsites.net/api
```

---

## 🔵 共通仕様

### リクエストヘッダー

| ヘッダー | 値 | 必須 | 説明 |
|---------|------|------|------|
| Content-Type | application/json | Yes | リクエストボディ形式 |
| Accept | application/json | No | レスポンス形式 |
| Authorization | Bearer {token} | No | 🔴 将来的にJWT認証実装時に必須 |

### レスポンス形式

#### 🔵 成功時（データあり）
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "炎の素材"
  },
  "message": "Success"
}
```

#### 🔵 成功時（リストデータ + ページネーション）
```json
{
  "data": {
    "items": [
      { "id": "...", "name": "..." },
      { "id": "...", "name": "..." }
    ],
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

#### 🔴 エラー時
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "入力データが不正です",
    "details": [
      {
        "field": "energyCost",
        "message": "エネルギーコストは0〜5の範囲で入力してください"
      }
    ]
  }
}
```

### 🔵 HTTPステータスコード

| コード | 意味 | 使用場面 |
|--------|------|---------|
| 200 OK | 成功 | GET、PUT成功時 |
| 201 Created | リソース作成成功 | POST成功時 |
| 204 No Content | 削除成功 | DELETE成功時 |
| 400 Bad Request | バリデーションエラー | リクエストデータ不正 |
| 404 Not Found | リソース未検出 | 存在しないID指定 |
| 409 Conflict | 競合エラー | ユニーク制約違反 |
| 500 Internal Server Error | サーバーエラー | DB接続エラー等 |

### 🔴 エラーコード一覧

| コード | HTTPステータス | 説明 |
|--------|---------------|------|
| VALIDATION_ERROR | 400 | バリデーションエラー |
| NOT_FOUND | 404 | リソースが見つからない |
| DUPLICATE_ENTRY | 409 | ユニーク制約違反 |
| DEPENDENCY_ERROR | 409 | 依存関係エラー（削除時） |
| DATABASE_ERROR | 500 | データベースエラー |
| INTERNAL_ERROR | 500 | 内部サーバーエラー |

---

## 🔵 1. カード管理API

### GET /api/cards
**カード一覧取得**

#### クエリパラメータ
| パラメータ | 型 | デフォルト | 説明 |
|-----------|-----|----------|------|
| page | number | 1 | ページ番号 |
| limit | number | 20 | 1ページあたりの件数 |
| cardType | CardType | - | 🔵 カード系統でフィルタ |
| search | string | - | 🔵 名前で部分一致検索 |

#### リクエスト例
```
GET /api/cards?page=1&limit=20&cardType=MATERIAL&search=炎
```

#### レスポンス例（200 OK）
```json
{
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "炎の素材",
        "description": "強力な炎属性を持つ素材",
        "cardType": "MATERIAL",
        "attribute": { "fire": 5, "water": 0 },
        "stabilityValue": 50,
        "reactionEffect": "炎上効果",
        "energyCost": 2,
        "imageUrl": null,
        "rarity": "COMMON",
        "createdAt": "2025-11-09T00:00:00.000Z",
        "updatedAt": "2025-11-09T00:00:00.000Z",
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

### GET /api/cards/:id
**カード詳細取得**

#### パスパラメータ
| パラメータ | 型 | 説明 |
|-----------|-----|------|
| id | UUID | カードID |

#### リクエスト例
```
GET /api/cards/550e8400-e29b-41d4-a716-446655440000
```

#### レスポンス例（200 OK）
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "炎の素材",
    "description": "強力な炎属性を持つ素材",
    "cardType": "MATERIAL",
    "attribute": { "fire": 5, "water": 0 },
    "stabilityValue": 50,
    "reactionEffect": "炎上効果",
    "energyCost": 2,
    "imageUrl": null,
    "rarity": "COMMON",
    "evolutionFrom": null,
    "evolutionTo": [],
    "initialDeckStyles": [],
    "unlockableContent": null,
    "createdAt": "2025-11-09T00:00:00.000Z",
    "updatedAt": "2025-11-09T00:00:00.000Z",
    "deletedAt": null
  }
}
```

#### エラーレスポンス例（404 Not Found）
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "カードが見つかりません"
  }
}
```

---

### POST /api/cards
**カード新規作成**

#### リクエストボディ
```json
{
  "name": "炎の素材",
  "description": "強力な炎属性を持つ素材",
  "cardType": "MATERIAL",
  "attribute": { "fire": 5, "water": 0 },
  "stabilityValue": 50,
  "reactionEffect": "炎上効果",
  "energyCost": 2,
  "imageUrl": null,
  "rarity": "COMMON",
  "evolutionFromId": null
}
```

#### バリデーションルール
| フィールド | 必須 | 型 | 制約 |
|-----------|------|-----|------|
| name | Yes | string | 最大100文字、ユニーク |
| description | Yes | string | 最大1000文字 |
| cardType | Yes | enum | MATERIAL\|OPERATION\|CATALYST\|KNOWLEDGE\|SPECIAL\|ARTIFACT |
| attribute | Yes | object | JSON形式 |
| stabilityValue | Yes | number | -100〜100 |
| reactionEffect | No | string | 最大500文字 |
| energyCost | Yes | number | 0〜5 |
| imageUrl | No | string | 最大500文字、URL形式 |
| rarity | No | enum | COMMON\|UNCOMMON\|RARE\|EPIC\|LEGENDARY |
| evolutionFromId | No | UUID | 存在するカードID |

#### レスポンス例（201 Created）
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "炎の素材",
    ...
  },
  "message": "カードを作成しました"
}
```

#### エラーレスポンス例（400 Bad Request）
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "入力データが不正です",
    "details": [
      {
        "field": "energyCost",
        "message": "エネルギーコストは0〜5の範囲で入力してください"
      }
    ]
  }
}
```

#### エラーレスポンス例（409 Conflict）
```json
{
  "error": {
    "code": "DUPLICATE_ENTRY",
    "message": "同名のカードが既に存在します"
  }
}
```

---

### PUT /api/cards/:id
**カード更新（部分更新可能）**

#### パスパラメータ
| パラメータ | 型 | 説明 |
|-----------|-----|------|
| id | UUID | カードID |

#### リクエストボディ（部分更新可能）
```json
{
  "name": "炎の素材・改",
  "description": "さらに強力な炎属性を持つ素材",
  "stabilityValue": 60
}
```

#### レスポンス例（200 OK）
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "炎の素材・改",
    "description": "さらに強力な炎属性を持つ素材",
    "stabilityValue": 60,
    ...
  },
  "message": "カードを更新しました"
}
```

---

### DELETE /api/cards/:id
**カード削除（ソフトデリート）**

#### パスパラメータ
| パラメータ | 型 | 説明 |
|-----------|-----|------|
| id | UUID | カードID |

#### レスポンス例（204 No Content）
```
（ボディなし）
```

#### エラーレスポンス例（409 Conflict - 依存関係エラー）
```json
{
  "error": {
    "code": "DEPENDENCY_ERROR",
    "message": "このカードは他のリソースから参照されているため削除できません",
    "details": [
      {
        "field": "initialDeckStyles",
        "message": "錬金スタイル「火の錬金術」で使用中"
      }
    ]
  }
}
```

---

## 🔵 2. 顧客管理API

### GET /api/customers
**顧客一覧取得**

#### クエリパラメータ
| パラメータ | 型 | デフォルト | 説明 |
|-----------|-----|----------|------|
| page | number | 1 | ページ番号 |
| limit | number | 20 | 1ページあたりの件数 |
| difficulty | number | - | 🔵 難易度でフィルタ（1〜5） |
| search | string | - | 🔵 名前で部分一致検索 |

#### リクエスト例
```
GET /api/customers?page=1&limit=20&difficulty=3&search=商人
```

#### レスポンス例（200 OK）
```json
{
  "data": {
    "items": [
      {
        "id": "660e8400-e29b-41d4-a716-446655440000",
        "name": "火の商人",
        "description": "炎属性のアイテムを求める商人",
        "customerType": "MERCHANT",
        "difficulty": 3,
        "requiredAttribute": { "fire": 10 },
        "qualityCondition": 50,
        "stabilityCondition": 30,
        "rewardFame": 100,
        "rewardKnowledge": 50,
        "portraitUrl": null,
        "createdAt": "2025-11-09T00:00:00.000Z",
        "updatedAt": "2025-11-09T00:00:00.000Z",
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

### POST /api/customers
**顧客新規作成**

#### リクエストボディ
```json
{
  "name": "火の商人",
  "description": "炎属性のアイテムを求める商人",
  "customerType": "MERCHANT",
  "difficulty": 3,
  "requiredAttribute": { "fire": 10 },
  "qualityCondition": 50,
  "stabilityCondition": 30,
  "rewardFame": 100,
  "rewardKnowledge": 50,
  "portraitUrl": null,
  "rewardCardIds": [
    "550e8400-e29b-41d4-a716-446655440000",
    "660e8400-e29b-41d4-a716-446655440001"
  ]
}
```

#### バリデーションルール
| フィールド | 必須 | 型 | 制約 |
|-----------|------|-----|------|
| name | Yes | string | 最大100文字 |
| description | Yes | string | 最大1000文字 |
| customerType | Yes | string | 最大50文字 |
| difficulty | Yes | number | 1〜5 |
| requiredAttribute | Yes | object | JSON形式 |
| qualityCondition | Yes | number | 0〜100 |
| stabilityCondition | Yes | number | 0〜100 |
| rewardFame | Yes | number | 0〜1000 |
| rewardKnowledge | Yes | number | 0〜1000 |
| portraitUrl | No | string | 最大500文字、URL形式 |
| rewardCardIds | No | array | UUIDの配列 |

#### レスポンス例（201 Created）
```json
{
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "name": "火の商人",
    ...
  },
  "message": "顧客を作成しました"
}
```

---

## 🔵 3. 錬金スタイル管理API

### GET /api/alchemy-styles
**錬金スタイル一覧取得**

#### リクエスト例
```
GET /api/alchemy-styles
```

#### レスポンス例（200 OK）
```json
{
  "data": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440000",
      "name": "火の錬金術",
      "description": "炎属性を中心とした錬金術スタイル",
      "characteristics": "高火力・低安定",
      "iconUrl": null,
      "initialDeckCards": [
        {
          "id": "550e8400-e29b-41d4-a716-446655440000",
          "name": "炎の素材"
        }
      ],
      "createdAt": "2025-11-09T00:00:00.000Z",
      "updatedAt": "2025-11-09T00:00:00.000Z",
      "deletedAt": null
    }
  ]
}
```

---

### POST /api/alchemy-styles
**錬金スタイル新規作成**

#### リクエストボディ
```json
{
  "name": "火の錬金術",
  "description": "炎属性を中心とした錬金術スタイル",
  "characteristics": "高火力・低安定",
  "iconUrl": null,
  "initialDeckCardIds": [
    "550e8400-e29b-41d4-a716-446655440000",
    "660e8400-e29b-41d4-a716-446655440001"
  ]
}
```

#### バリデーションルール
| フィールド | 必須 | 型 | 制約 |
|-----------|------|-----|------|
| name | Yes | string | 最大100文字、ユニーク |
| description | Yes | string | 最大1000文字 |
| characteristics | Yes | string | 最大500文字 |
| iconUrl | No | string | 最大500文字、URL形式 |
| initialDeckCardIds | Yes | array | UUIDの配列 |

---

## 🔵 4. マップノード管理API

### GET /api/map-nodes
**マップノード一覧取得**

#### クエリパラメータ
| パラメータ | 型 | デフォルト | 説明 |
|-----------|-----|----------|------|
| page | number | 1 | ページ番号 |
| limit | number | 20 | 1ページあたりの件数 |
| nodeType | NodeType | - | 🔵 ノードタイプでフィルタ |

#### リクエスト例
```
GET /api/map-nodes?nodeType=REQUEST&page=1&limit=20
```

---

### POST /api/map-nodes
**マップノード新規作成**

#### リクエストボディ
```json
{
  "name": "火の依頼ノード",
  "nodeType": "REQUEST",
  "description": "炎属性の依頼が発生するノード",
  "eventContent": {
    "type": "customer_request",
    "customerId": "660e8400-e29b-41d4-a716-446655440000"
  },
  "rewards": {
    "cards": ["550e8400-e29b-41d4-a716-446655440000"],
    "fame": 100
  },
  "iconUrl": null,
  "customerId": "660e8400-e29b-41d4-a716-446655440000",
  "mapTemplateId": "aa0e8400-e29b-41d4-a716-446655440000",
  "position": { "x": 100, "y": 200 }
}
```

---

## 🔵 5. マップテンプレート管理API

### GET /api/map-templates
**マップテンプレート一覧取得**

#### クエリパラメータ
| パラメータ | 型 | デフォルト | 説明 |
|-----------|-----|----------|------|
| page | number | 1 | ページ番号 |
| limit | number | 20 | 1ページあたりの件数 |
| difficulty | number | - | 🔵 難易度でフィルタ（1〜5） |
| search | string | - | 🔵 名前で部分一致検索 |

#### リクエスト例
```
GET /api/map-templates?page=1&limit=20&difficulty=3
```

#### レスポンス例（200 OK）
```json
{
  "data": {
    "items": [
      {
        "id": "aa0e8400-e29b-41d4-a716-446655440000",
        "name": "初級者向けマップ",
        "description": "初心者に優しい30ノードのマップテンプレート",
        "difficulty": 2,
        "nodeCount": 30,
        "iconUrl": null,
        "createdAt": "2025-11-09T00:00:00.000Z",
        "updatedAt": "2025-11-09T00:00:00.000Z",
        "deletedAt": null
      }
    ],
    "total": 20,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

---

### GET /api/map-templates/:id
**マップテンプレート詳細取得**

#### パスパラメータ
| パラメータ | 型 | 説明 |
|-----------|-----|------|
| id | UUID | マップテンプレートID |

#### リクエスト例
```
GET /api/map-templates/aa0e8400-e29b-41d4-a716-446655440000
```

#### レスポンス例（200 OK）
```json
{
  "data": {
    "id": "aa0e8400-e29b-41d4-a716-446655440000",
    "name": "初級者向けマップ",
    "description": "初心者に優しい30ノードのマップテンプレート",
    "difficulty": 2,
    "nodeCount": 30,
    "iconUrl": null,
    "nodes": [
      {
        "id": "bb0e8400-e29b-41d4-a716-446655440000",
        "name": "スタートノード",
        "nodeType": "REQUEST",
        "position": { "x": 0, "y": 0 }
      }
    ],
    "createdAt": "2025-11-09T00:00:00.000Z",
    "updatedAt": "2025-11-09T00:00:00.000Z",
    "deletedAt": null
  }
}
```

---

### POST /api/map-templates
**マップテンプレート新規作成**

#### リクエストボディ
```json
{
  "name": "初級者向けマップ",
  "description": "初心者に優しい30ノードのマップテンプレート",
  "difficulty": 2,
  "nodeCount": 30,
  "iconUrl": null,
  "nodeIds": [
    "bb0e8400-e29b-41d4-a716-446655440000",
    "cc0e8400-e29b-41d4-a716-446655440001"
  ]
}
```

#### バリデーションルール
| フィールド | 必須 | 型 | 制約 |
|-----------|------|-----|------|
| name | Yes | string | 最大100文字 |
| description | Yes | string | 最大1000文字 |
| difficulty | Yes | number | 1〜5 |
| nodeCount | Yes | number | 30〜50 |
| iconUrl | No | string | 最大500文字、URL形式 |
| nodeIds | No | array | UUIDの配列 |

#### レスポンス例（201 Created）
```json
{
  "data": {
    "id": "aa0e8400-e29b-41d4-a716-446655440000",
    "name": "初級者向けマップ",
    ...
  },
  "message": "マップテンプレートを作成しました"
}
```

---

### PUT /api/map-templates/:id
**マップテンプレート更新（部分更新可能）**

#### パスパラメータ
| パラメータ | 型 | 説明 |
|-----------|-----|------|
| id | UUID | マップテンプレートID |

#### リクエストボディ（部分更新可能）
```json
{
  "name": "改良版初級者向けマップ",
  "nodeCount": 35
}
```

#### レスポンス例（200 OK）
```json
{
  "data": {
    "id": "aa0e8400-e29b-41d4-a716-446655440000",
    "name": "改良版初級者向けマップ",
    "nodeCount": 35,
    ...
  },
  "message": "マップテンプレートを更新しました"
}
```

---

### DELETE /api/map-templates/:id
**マップテンプレート削除（ソフトデリート）**

#### パスパラメータ
| パラメータ | 型 | 説明 |
|-----------|-----|------|
| id | UUID | マップテンプレートID |

#### レスポンス例（204 No Content）
```
（ボディなし）
```

---

## 🔵 6. ゲームバランス管理API

### GET /api/game-balance
**ゲームバランス設定一覧取得**

#### クエリパラメータ
| パラメータ | 型 | デフォルト | 説明 |
|-----------|-----|----------|------|
| category | GameBalanceCategory | - | 🔵 カテゴリでフィルタ |

#### リクエスト例
```
GET /api/game-balance?category=ENERGY
```

#### レスポンス例（200 OK）
```json
{
  "data": [
    {
      "id": "880e8400-e29b-41d4-a716-446655440000",
      "settingKey": "energy_initial_value",
      "settingValue": "3",
      "description": "初期エネルギー値",
      "category": "ENERGY",
      "createdAt": "2025-11-09T00:00:00.000Z",
      "updatedAt": "2025-11-09T00:00:00.000Z",
      "deletedAt": null
    },
    {
      "id": "990e8400-e29b-41d4-a716-446655440000",
      "settingKey": "energy_max_value",
      "settingValue": "10",
      "description": "最大エネルギー値",
      "category": "ENERGY",
      "createdAt": "2025-11-09T00:00:00.000Z",
      "updatedAt": "2025-11-09T00:00:00.000Z",
      "deletedAt": null
    },
    {
      "id": "aa1e8400-e29b-41d4-a716-446655440000",
      "settingKey": "ascension_max_level",
      "settingValue": "20",
      "description": "🔵 最大アセンションレベル（WRREQ-042より）",
      "category": "PLAYTIME",
      "createdAt": "2025-11-09T00:00:00.000Z",
      "updatedAt": "2025-11-09T00:00:00.000Z",
      "deletedAt": null
    },
    {
      "id": "bb1e8400-e29b-41d4-a716-446655440000",
      "settingKey": "ascension_level_1_modifier",
      "settingValue": "{\"enemyHealth\":1.1,\"rewardMultiplier\":1.1}",
      "description": "🔵 アセンションレベル1の難易度修正値",
      "category": "PLAYTIME",
      "createdAt": "2025-11-09T00:00:00.000Z",
      "updatedAt": "2025-11-09T00:00:00.000Z",
      "deletedAt": null
    }
  ]
}
```

---

### PUT /api/game-balance/:id
**ゲームバランス設定更新**

#### パスパラメータ
| パラメータ | 型 | 説明 |
|-----------|-----|------|
| id | UUID | ゲームバランス設定ID |

#### リクエストボディ
```json
{
  "settingValue": "5",
  "description": "初期エネルギー値（調整済み）"
}
```

#### レスポンス例（200 OK）
```json
{
  "data": {
    "id": "880e8400-e29b-41d4-a716-446655440000",
    "settingKey": "energy_initial_value",
    "settingValue": "5",
    "description": "初期エネルギー値（調整済み）",
    "category": "ENERGY",
    "createdAt": "2025-11-09T00:00:00.000Z",
    "updatedAt": "2025-11-09T01:00:00.000Z",
    "deletedAt": null
  },
  "message": "設定を更新しました"
}
```

---

## 🔵 7. データエクスポート/インポートAPI

### GET /api/export
**全データエクスポート**

#### クエリパラメータ
| パラメータ | 型 | デフォルト | 説明 |
|-----------|-----|----------|------|
| resources | string | - | 🔵 エクスポート対象（カンマ区切り）<br/>例: cards,customers |

#### リクエスト例
```
GET /api/export?resources=cards,customers
```

#### レスポンス（JSONファイルダウンロード）
```json
{
  "exportedAt": "2025-11-09T12:00:00.000Z",
  "version": "1.0",
  "cards": [
    { "id": "...", "name": "炎の素材", ... }
  ],
  "customers": [
    { "id": "...", "name": "火の商人", ... }
  ]
}
```

#### レスポンスヘッダー
```
Content-Type: application/json
Content-Disposition: attachment; filename="atelier_export_20251109.json"
```

---

### POST /api/import
**データインポート**

#### リクエスト
```
Content-Type: multipart/form-data

file: <JSONファイル>
```

#### レスポンス例（200 OK）
```json
{
  "message": "データをインポートしました",
  "imported": {
    "cards": 10,
    "customers": 5,
    "alchemyStyles": 3,
    "mapNodes": 20,
    "gameBalance": 10
  }
}
```

#### エラーレスポンス例（400 Bad Request - スキーマエラー）
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "インポートデータが不正です",
    "details": [
      {
        "field": "cards[10].energyCost",
        "message": "エネルギーコストは0〜5の範囲で入力してください"
      }
    ]
  }
}
```

---

## 🔵 Hono.js 実装例

### ルート定義例

```typescript
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { validator } from 'hono/validator';
import { cardRoutes } from './routes/cards';
import { customerRoutes } from './routes/customers';
import { alchemyStyleRoutes } from './routes/alchemyStyles';
import { mapNodeRoutes } from './routes/mapNodes';
import { gameBalanceRoutes } from './routes/gameBalance';
import { exportRoutes } from './routes/export';

const app = new Hono();

// 🔴 CORSミドルウェア
app.use('*', cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// 🔵 ルート登録
app.route('/api/cards', cardRoutes);
app.route('/api/customers', customerRoutes);
app.route('/api/alchemy-styles', alchemyStyleRoutes);
app.route('/api/map-nodes', mapNodeRoutes);
app.route('/api/game-balance', gameBalanceRoutes);
app.route('/api', exportRoutes);

// 🔴 エラーハンドリング
app.onError((err, c) => {
  console.error(err);
  return c.json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'サーバーエラーが発生しました',
    },
  }, 500);
});

export default app;
```

---

## 🗓️ 変更履歴

| 日付 | バージョン | 変更内容 |
|------|----------|---------|
| 2025-11-09 | 1.0 | 初版作成。Hono.js + Prisma + PostgreSQLベースのAPI設計 |
