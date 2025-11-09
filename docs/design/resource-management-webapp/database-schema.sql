-- ============================================
-- アトリエ錬金術ゲーム リソース管理Webアプリ
-- PostgreSQL データベーススキーマ
-- ============================================

-- 🔵 注意事項
-- このSQLスキーマは、Prismaに依存しない標準的なPostgreSQL DDLです。
-- テスト環境ではIn-Memory Repositoryを使用するため、データベース不要です。
-- 本番環境では、Prisma Migrateを使用してスキーマを管理することを推奨します。

-- ============================================
-- 🔵 Enum定義
-- ============================================

-- 🔵 カード系統（WRREQ-012より）
CREATE TYPE card_type AS ENUM (
  'MATERIAL',    -- 素材
  'OPERATION',   -- 操作
  'CATALYST',    -- 触媒
  'KNOWLEDGE',   -- 知識
  'SPECIAL',     -- 特殊
  'ARTIFACT'     -- アーティファクト
);

-- 🟡 カードレア度
CREATE TYPE card_rarity AS ENUM (
  'COMMON',
  'UNCOMMON',
  'RARE',
  'EPIC',
  'LEGENDARY'
);

-- 🔵 ノードタイプ（WRREQ-033より）
CREATE TYPE node_type AS ENUM (
  'REQUEST',       -- 依頼
  'MERCHANT',      -- 商人
  'EXPERIMENT',    -- 実験
  'MONSTER',       -- 魔物
  'BOSS_REQUEST'   -- ボス依頼
);

-- 🔵 メタ通貨タイプ（WRREQ-038より）
CREATE TYPE meta_currency_type AS ENUM (
  'FAME',       -- 名声
  'KNOWLEDGE'   -- 知識ポイント
);

-- 🔵 アンロック可能コンテンツタイプ（WRREQ-039より）
CREATE TYPE unlockable_content_type AS ENUM (
  'CARD',      -- 新カード
  'CUSTOMER',  -- 新顧客
  'MATERIAL'   -- 新素材
);

-- 🔵 ゲームバランス設定カテゴリ（WRREQ-048〜051より）
CREATE TYPE game_balance_category AS ENUM (
  'ENERGY',     -- エネルギーシステム
  'HAND',       -- 手札システム
  'STABILITY',  -- 安定値・暴発
  'PLAYTIME'    -- プレイ時間
);

-- ============================================
-- 🔵 テーブル定義
-- ============================================

-- 🔵 1. Card（カード）テーブル
-- WRREQ-012〜018より
CREATE TABLE cards (
  -- 🔵 共通フィールド
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ(3),

  -- 🔵 カード固有フィールド
  name VARCHAR(100) UNIQUE NOT NULL,              -- 🔵 カード名（ユニーク）
  description VARCHAR(1000) NOT NULL,             -- 🔵 説明
  card_type card_type NOT NULL,                   -- 🔵 カード系統
  attribute JSONB NOT NULL,                       -- 🔵 属性値（JSON形式）
  stability_value INTEGER NOT NULL,               -- 🔵 安定値（-100〜100）
  reaction_effect VARCHAR(500),                   -- 🔵 反応効果
  energy_cost INTEGER NOT NULL,                   -- 🔵 エネルギーコスト（0〜5）
  image_url VARCHAR(500),                         -- 🟡 カード画像URL
  rarity card_rarity,                             -- 🟡 レア度

  -- 🔵 リレーション: 進化関係（1:1, 1:N）
  evolution_from_id UUID REFERENCES cards(id) ON DELETE SET NULL,

  -- 🔵 制約
  CONSTRAINT check_stability_value CHECK (stability_value BETWEEN -100 AND 100),
  CONSTRAINT check_energy_cost CHECK (energy_cost BETWEEN 0 AND 5)
);

-- 🔵 2. Customer（顧客）テーブル
-- WRREQ-021〜028より
CREATE TABLE customers (
  -- 🔵 共通フィールド
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ(3),

  -- 🔵 顧客固有フィールド
  name VARCHAR(100) NOT NULL,                     -- 🔵 顧客名
  description VARCHAR(1000) NOT NULL,             -- 🔵 説明
  customer_type VARCHAR(50) NOT NULL,             -- 🔵 顧客タイプ
  difficulty INTEGER NOT NULL,                    -- 🔵 難易度（1〜5星）
  required_attribute JSONB NOT NULL,              -- 🔵 必要属性値（JSON形式）
  quality_condition INTEGER NOT NULL,             -- 🔵 品質条件（0〜100）
  stability_condition INTEGER NOT NULL,           -- 🔵 安定性条件（0〜100）
  reward_fame INTEGER NOT NULL,                   -- 🔵 報酬: 名声（0〜1000）
  reward_knowledge INTEGER NOT NULL,              -- 🔵 報酬: 知識ポイント（0〜1000）
  portrait_url VARCHAR(500),                      -- 🟡 顧客ポートレートURL

  -- 🔵 制約
  CONSTRAINT check_difficulty CHECK (difficulty BETWEEN 1 AND 5),
  CONSTRAINT check_quality_condition CHECK (quality_condition BETWEEN 0 AND 100),
  CONSTRAINT check_stability_condition CHECK (stability_condition BETWEEN 0 AND 100),
  CONSTRAINT check_reward_fame CHECK (reward_fame BETWEEN 0 AND 1000),
  CONSTRAINT check_reward_knowledge CHECK (reward_knowledge BETWEEN 0 AND 1000)
);

-- 🔵 3. AlchemyStyle（錬金スタイル）テーブル
-- WRREQ-029〜032より
CREATE TABLE alchemy_styles (
  -- 🔵 共通フィールド
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ(3),

  -- 🔵 錬金スタイル固有フィールド
  name VARCHAR(100) UNIQUE NOT NULL,              -- 🔵 スタイル名（ユニーク）
  description VARCHAR(1000) NOT NULL,             -- 🔵 説明
  characteristics VARCHAR(500) NOT NULL,          -- 🔵 特徴
  icon_url VARCHAR(500)                           -- 🟡 アイコンURL
);

-- 🔵 4. MapTemplate（マップテンプレート）テーブル
-- WRREQ-035〜036より
CREATE TABLE map_templates (
  -- 🔵 共通フィールド
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ(3),

  -- 🔵 マップテンプレート固有フィールド
  name VARCHAR(100) NOT NULL,                     -- 🔵 マップ名
  description VARCHAR(1000) NOT NULL,             -- 🔵 説明
  difficulty INTEGER NOT NULL,                    -- 🔵 難易度（1〜5）
  node_count INTEGER NOT NULL,                    -- 🔵 ノード数（30〜50）
  icon_url VARCHAR(500),                          -- 🟡 アイコンURL

  -- 🔵 制約
  CONSTRAINT check_map_difficulty CHECK (difficulty BETWEEN 1 AND 5),
  CONSTRAINT check_node_count CHECK (node_count BETWEEN 30 AND 50)
);

-- 🔵 5. MapNode（マップノード）テーブル
-- WRREQ-033〜037より
CREATE TABLE map_nodes (
  -- 🔵 共通フィールド
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ(3),

  -- 🔵 マップノード固有フィールド
  name VARCHAR(100) NOT NULL,                     -- 🔵 ノード名
  node_type node_type NOT NULL,                   -- 🔵 ノードタイプ
  description VARCHAR(1000) NOT NULL,             -- 🔵 説明
  event_content JSONB NOT NULL,                   -- 🔵 イベント内容（JSON形式）
  rewards JSONB,                                  -- 🔵 報酬（JSON形式）
  icon_url VARCHAR(500),                          -- 🟡 アイコンURL

  -- 🔵 リレーション
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  map_template_id UUID REFERENCES map_templates(id) ON DELETE SET NULL,

  -- 🟡 ノードの座標位置（JSON形式: {x: number, y: number}）
  position JSONB
);

-- 🔵 6. MetaCurrency（メタ通貨）テーブル
-- WRREQ-038より
CREATE TABLE meta_currencies (
  -- 🔵 共通フィールド
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ(3),

  -- 🔵 メタ通貨固有フィールド
  currency_type meta_currency_type UNIQUE NOT NULL, -- 🔵 通貨タイプ（ユニーク）
  description VARCHAR(500) NOT NULL,                -- 🔵 説明
  icon_url VARCHAR(500)                             -- 🟡 アイコンURL
);

-- 🔵 7. UnlockableContent（アンロック可能コンテンツ）テーブル
-- WRREQ-039〜040より
CREATE TABLE unlockable_contents (
  -- 🔵 共通フィールド
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ(3),

  -- 🔵 アンロック可能コンテンツ固有フィールド
  content_type unlockable_content_type NOT NULL,  -- 🔵 コンテンツタイプ
  required_fame INTEGER NOT NULL DEFAULT 0,       -- 🔵 必要名声（0〜10000）
  required_knowledge INTEGER NOT NULL DEFAULT 0,  -- 🔵 必要知識ポイント（0〜10000）

  -- 🔵 リレーション: アンロック対象（1:1）
  card_id UUID UNIQUE REFERENCES cards(id) ON DELETE CASCADE,
  customer_id UUID UNIQUE REFERENCES customers(id) ON DELETE CASCADE,

  -- 🔵 制約
  CONSTRAINT check_required_fame CHECK (required_fame BETWEEN 0 AND 10000),
  CONSTRAINT check_required_knowledge CHECK (required_knowledge BETWEEN 0 AND 10000),
  CONSTRAINT check_unlock_target CHECK (
    (card_id IS NOT NULL AND customer_id IS NULL) OR
    (card_id IS NULL AND customer_id IS NOT NULL)
  )
);

-- 🔵 8. GameBalance（ゲームバランス）テーブル
-- WRREQ-041〜042、WRREQ-048〜051より
CREATE TABLE game_balance (
  -- 🔵 共通フィールド
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ(3),

  -- 🔵 ゲームバランス固有フィールド
  setting_key VARCHAR(100) UNIQUE NOT NULL,       -- 🔵 設定キー（ユニーク）
  setting_value VARCHAR(500) NOT NULL,            -- 🔵 設定値
  description VARCHAR(500) NOT NULL,              -- 🔵 説明
  category game_balance_category NOT NULL         -- 🔵 カテゴリ
);

-- ============================================
-- 🔵 中間テーブル（N:M リレーション）
-- ============================================

-- 🔵 AlchemyStyle ←→ Card（初期デッキ）
CREATE TABLE _alchemy_style_initial_deck (
  alchemy_style_id UUID NOT NULL REFERENCES alchemy_styles(id) ON DELETE CASCADE,
  card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  PRIMARY KEY (alchemy_style_id, card_id)
);

-- 🔵 Customer ←→ Card（報酬カード）
CREATE TABLE _customer_reward_cards (
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  PRIMARY KEY (customer_id, card_id)
);

-- ============================================
-- 🔵 インデックス定義
-- ============================================

-- 🔵 Card テーブルのインデックス
CREATE INDEX idx_cards_card_type ON cards(card_type) WHERE deleted_at IS NULL;
CREATE INDEX idx_cards_energy_cost ON cards(energy_cost) WHERE deleted_at IS NULL;
CREATE INDEX idx_cards_deleted_at ON cards(deleted_at);
CREATE INDEX idx_cards_name ON cards(name) WHERE deleted_at IS NULL;

-- 🔵 Customer テーブルのインデックス
CREATE INDEX idx_customers_customer_type ON customers(customer_type) WHERE deleted_at IS NULL;
CREATE INDEX idx_customers_difficulty ON customers(difficulty) WHERE deleted_at IS NULL;
CREATE INDEX idx_customers_deleted_at ON customers(deleted_at);

-- 🔵 AlchemyStyle テーブルのインデックス
CREATE INDEX idx_alchemy_styles_deleted_at ON alchemy_styles(deleted_at);

-- 🔵 MapNode テーブルのインデックス
CREATE INDEX idx_map_nodes_node_type ON map_nodes(node_type) WHERE deleted_at IS NULL;
CREATE INDEX idx_map_nodes_customer_id ON map_nodes(customer_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_map_nodes_map_template_id ON map_nodes(map_template_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_map_nodes_deleted_at ON map_nodes(deleted_at);

-- 🔵 MapTemplate テーブルのインデックス
CREATE INDEX idx_map_templates_difficulty ON map_templates(difficulty) WHERE deleted_at IS NULL;
CREATE INDEX idx_map_templates_deleted_at ON map_templates(deleted_at);

-- 🔵 MetaCurrency テーブルのインデックス
CREATE INDEX idx_meta_currencies_deleted_at ON meta_currencies(deleted_at);

-- 🔵 UnlockableContent テーブルのインデックス
CREATE INDEX idx_unlockable_contents_content_type ON unlockable_contents(content_type) WHERE deleted_at IS NULL;
CREATE INDEX idx_unlockable_contents_deleted_at ON unlockable_contents(deleted_at);

-- 🔵 GameBalance テーブルのインデックス
CREATE INDEX idx_game_balance_category ON game_balance(category) WHERE deleted_at IS NULL;
CREATE INDEX idx_game_balance_deleted_at ON game_balance(deleted_at);

-- ============================================
-- 🔵 トリガー（updated_at自動更新）
-- ============================================

-- 🔵 updated_at自動更新関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 🔵 各テーブルにトリガーを設定
CREATE TRIGGER update_cards_updated_at BEFORE UPDATE ON cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alchemy_styles_updated_at BEFORE UPDATE ON alchemy_styles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_map_nodes_updated_at BEFORE UPDATE ON map_nodes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_map_templates_updated_at BEFORE UPDATE ON map_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meta_currencies_updated_at BEFORE UPDATE ON meta_currencies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_unlockable_contents_updated_at BEFORE UPDATE ON unlockable_contents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_game_balance_updated_at BEFORE UPDATE ON game_balance
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 🔵 ソフトデリート戦略
-- ============================================

-- - 全エンティティに`deleted_at`フィールドを追加
-- - DELETE操作時は`deleted_at`に現在時刻を設定
-- - SELECT時は`deleted_at IS NULL`でフィルタリング
-- - Repositoryパターンでソフトデリートを実装

-- ============================================
-- 🔵 バリデーション戦略
-- ============================================

-- データベースレベル:
-- - CHECK制約で範囲制約を実装
-- - UNIQUE制約で重複を防止
-- - NOT NULL制約で必須フィールドを保証
--
-- アプリケーションレベル:
-- - Zodスキーマでクライアント・サーバー側バリデーション
-- - サービス層でビジネスロジック固有の制約チェック

-- ============================================
-- 🔵 使用方法
-- ============================================

-- このSQLファイルを使ってデータベースを作成:
-- psql -U postgres -d atelier_resource_mgmt -f database-schema.sql

-- Prisma Migrateを使用する場合:
-- npx prisma migrate dev --name init
