-- ============================================================================
-- リソース管理Webアプリ データベーススキーマ
-- ============================================================================
-- PostgreSQL 14+ 用のスキーマ定義
-- Prisma Migrate で管理される想定
--
-- 【信頼性レベル】:
-- - 🔵 青信号: 要件定義書から直接導出された確実なスキーマ
-- - 🟡 黄信号: 要件定義書から妥当な推測によるスキーマ
-- - 🔴 赤信号: 一般的なWebアプリ管理画面のベストプラクティスから推測
-- ============================================================================

-- ============================================================================
-- 拡張機能
-- ============================================================================

-- UUID生成用
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 共通型定義
-- ============================================================================

-- カード系統型 🔵
CREATE TYPE card_type AS ENUM (
  'MATERIAL',    -- 素材カード
  'OPERATION',   -- 操作カード
  'CATALYST',    -- 触媒カード
  'KNOWLEDGE',   -- 知識カード
  'SPECIAL',     -- 特殊カード
  'ARTIFACT'     -- アーティファクト
);

-- レア度型 🔵
CREATE TYPE rarity AS ENUM (
  'COMMON',      -- コモン
  'UNCOMMON',    -- アンコモン
  'RARE',        -- レア
  'EPIC',        -- エピック
  'LEGENDARY'    -- レジェンダリー
);

-- ノードタイプ型 🔵
CREATE TYPE node_type AS ENUM (
  'REQUEST',      -- 依頼
  'MERCHANT',     -- 商人
  'EXPERIMENT',   -- 実験
  'MONSTER',      -- 魔物
  'BOSS_REQUEST'  -- ボス依頼
);

-- 通貨タイプ型 🔵
CREATE TYPE currency_type AS ENUM (
  'FAME',        -- 名声
  'KNOWLEDGE'    -- 知識ポイント
);

-- コンテンツタイプ型 🔵
CREATE TYPE content_type AS ENUM (
  'CARD',        -- カード
  'CUSTOMER',    -- 顧客
  'MATERIAL'     -- 素材
);

-- バランス設定カテゴリ型 🔵
CREATE TYPE balance_category AS ENUM (
  'ENERGY',      -- エネルギー
  'HAND',        -- 手札
  'STABILITY',   -- 安定性
  'PLAYTIME'     -- プレイ時間
);

-- ============================================================================
-- テーブル定義
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Cards テーブル（カード） 🔵
-- ----------------------------------------------------------------------------
CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(1000) NOT NULL,
  card_type card_type NOT NULL,
  attribute JSONB NOT NULL, -- 属性値（JSON形式）
  stability_value INTEGER NOT NULL CHECK (stability_value >= -100 AND stability_value <= 100),
  reaction_effect VARCHAR(500),
  energy_cost INTEGER NOT NULL CHECK (energy_cost >= 0 AND energy_cost <= 5),
  image_url TEXT,
  rarity rarity,
  evolution_from_id UUID REFERENCES cards(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

-- インデックス 🔴
CREATE INDEX idx_cards_name ON cards(name);
CREATE INDEX idx_cards_card_type ON cards(card_type);
CREATE INDEX idx_cards_rarity ON cards(rarity);
CREATE INDEX idx_cards_energy_cost ON cards(energy_cost);
CREATE INDEX idx_cards_evolution_from_id ON cards(evolution_from_id);
CREATE INDEX idx_cards_deleted_at ON cards(deleted_at) WHERE deleted_at IS NULL; -- ソフトデリート用

-- ----------------------------------------------------------------------------
-- Customers テーブル（顧客） 🔵
-- ----------------------------------------------------------------------------
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description VARCHAR(1000) NOT NULL,
  customer_type VARCHAR(50) NOT NULL,
  difficulty INTEGER NOT NULL CHECK (difficulty >= 1 AND difficulty <= 5),
  required_attribute JSONB NOT NULL, -- 必要属性値（JSON形式）
  quality_condition INTEGER NOT NULL CHECK (quality_condition >= 0 AND quality_condition <= 100),
  stability_condition INTEGER NOT NULL CHECK (stability_condition >= 0 AND stability_condition <= 100),
  reward_fame INTEGER NOT NULL CHECK (reward_fame >= 0 AND reward_fame <= 1000),
  reward_knowledge INTEGER NOT NULL CHECK (reward_knowledge >= 0 AND reward_knowledge <= 1000),
  portrait_url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

-- インデックス 🔴
CREATE INDEX idx_customers_name ON customers(name);
CREATE INDEX idx_customers_customer_type ON customers(customer_type);
CREATE INDEX idx_customers_difficulty ON customers(difficulty);
CREATE INDEX idx_customers_deleted_at ON customers(deleted_at) WHERE deleted_at IS NULL; -- ソフトデリート用

-- ----------------------------------------------------------------------------
-- AlchemyStyles テーブル（錬金スタイル） 🔵
-- ----------------------------------------------------------------------------
CREATE TABLE alchemy_styles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(1000) NOT NULL,
  characteristics VARCHAR(500) NOT NULL,
  icon_url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

-- インデックス 🔴
CREATE INDEX idx_alchemy_styles_name ON alchemy_styles(name);
CREATE INDEX idx_alchemy_styles_deleted_at ON alchemy_styles(deleted_at) WHERE deleted_at IS NULL; -- ソフトデリート用

-- ----------------------------------------------------------------------------
-- MapNodes テーブル（マップノード） 🔵
-- ----------------------------------------------------------------------------
CREATE TABLE map_nodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  node_type node_type NOT NULL,
  description VARCHAR(1000) NOT NULL,
  event_content JSONB NOT NULL, -- イベント内容（JSON形式）
  rewards JSONB, -- 報酬（JSON形式、nullable）
  icon_url TEXT,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

-- インデックス 🔴
CREATE INDEX idx_map_nodes_name ON map_nodes(name);
CREATE INDEX idx_map_nodes_node_type ON map_nodes(node_type);
CREATE INDEX idx_map_nodes_customer_id ON map_nodes(customer_id);
CREATE INDEX idx_map_nodes_deleted_at ON map_nodes(deleted_at) WHERE deleted_at IS NULL; -- ソフトデリート用

-- ----------------------------------------------------------------------------
-- MetaCurrencies テーブル（メタ通貨） 🔵
-- ----------------------------------------------------------------------------
CREATE TABLE meta_currencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  currency_type currency_type NOT NULL UNIQUE,
  description VARCHAR(500) NOT NULL,
  icon_url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

-- インデックス 🔴
CREATE INDEX idx_meta_currencies_currency_type ON meta_currencies(currency_type);
CREATE INDEX idx_meta_currencies_deleted_at ON meta_currencies(deleted_at) WHERE deleted_at IS NULL; -- ソフトデリート用

-- ----------------------------------------------------------------------------
-- UnlockableContents テーブル（アンロック可能コンテンツ） 🔵
-- ----------------------------------------------------------------------------
CREATE TABLE unlockable_contents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_type content_type NOT NULL,
  required_fame INTEGER NOT NULL DEFAULT 0 CHECK (required_fame >= 0 AND required_fame <= 10000),
  required_knowledge INTEGER NOT NULL DEFAULT 0 CHECK (required_knowledge >= 0 AND required_knowledge <= 10000),
  card_id UUID UNIQUE REFERENCES cards(id) ON DELETE CASCADE,
  customer_id UUID UNIQUE REFERENCES customers(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  CONSTRAINT unlockable_contents_card_or_customer CHECK (
    (card_id IS NOT NULL AND customer_id IS NULL) OR
    (card_id IS NULL AND customer_id IS NOT NULL)
  )
);

-- インデックス 🔴
CREATE INDEX idx_unlockable_contents_content_type ON unlockable_contents(content_type);
CREATE INDEX idx_unlockable_contents_card_id ON unlockable_contents(card_id);
CREATE INDEX idx_unlockable_contents_customer_id ON unlockable_contents(customer_id);
CREATE INDEX idx_unlockable_contents_deleted_at ON unlockable_contents(deleted_at) WHERE deleted_at IS NULL; -- ソフトデリート用

-- ----------------------------------------------------------------------------
-- GameBalances テーブル（ゲームバランス） 🔵
-- ----------------------------------------------------------------------------
CREATE TABLE game_balances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value VARCHAR(500) NOT NULL,
  description VARCHAR(500) NOT NULL,
  category balance_category NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

-- インデックス 🔴
CREATE INDEX idx_game_balances_setting_key ON game_balances(setting_key);
CREATE INDEX idx_game_balances_category ON game_balances(category);
CREATE INDEX idx_game_balances_deleted_at ON game_balances(deleted_at) WHERE deleted_at IS NULL; -- ソフトデリート用

-- ============================================================================
-- 中間テーブル（N:Mリレーション）
-- ============================================================================

-- ----------------------------------------------------------------------------
-- CustomerRewardCards テーブル（顧客-報酬カード N:M） 🔵
-- ----------------------------------------------------------------------------
CREATE TABLE customer_reward_cards (
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (customer_id, card_id)
);

-- インデックス 🔴
CREATE INDEX idx_customer_reward_cards_customer_id ON customer_reward_cards(customer_id);
CREATE INDEX idx_customer_reward_cards_card_id ON customer_reward_cards(card_id);

-- ----------------------------------------------------------------------------
-- AlchemyStyleInitialDeckCards テーブル（錬金スタイル-初期デッキカード N:M） 🔵
-- ----------------------------------------------------------------------------
CREATE TABLE alchemy_style_initial_deck_cards (
  alchemy_style_id UUID NOT NULL REFERENCES alchemy_styles(id) ON DELETE CASCADE,
  card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (alchemy_style_id, card_id)
);

-- インデックス 🔴
CREATE INDEX idx_alchemy_style_initial_deck_cards_alchemy_style_id ON alchemy_style_initial_deck_cards(alchemy_style_id);
CREATE INDEX idx_alchemy_style_initial_deck_cards_card_id ON alchemy_style_initial_deck_cards(card_id);

-- ============================================================================
-- トリガー（updated_at自動更新） 🔴
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 各テーブルにトリガーを設定
CREATE TRIGGER update_cards_updated_at BEFORE UPDATE ON cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alchemy_styles_updated_at BEFORE UPDATE ON alchemy_styles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_map_nodes_updated_at BEFORE UPDATE ON map_nodes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meta_currencies_updated_at BEFORE UPDATE ON meta_currencies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_unlockable_contents_updated_at BEFORE UPDATE ON unlockable_contents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_game_balances_updated_at BEFORE UPDATE ON game_balances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 初期データ（オプション）
-- ============================================================================

-- メタ通貨の初期データ 🔴
INSERT INTO meta_currencies (currency_type, description) VALUES
  ('FAME', '名声 - 依頼達成時に獲得できるメタ通貨'),
  ('KNOWLEDGE', '知識ポイント - ゲームクリア時に獲得できるメタ通貨')
ON CONFLICT (currency_type) DO NOTHING;

-- ゲームバランス設定の初期データ 🔴
INSERT INTO game_balances (setting_key, setting_value, description, category) VALUES
  ('energy_initial_value', '3', '初期エネルギー値', 'ENERGY'),
  ('energy_max_value', '10', '最大エネルギー値', 'ENERGY'),
  ('hand_initial_count', '5', '初期手札枚数', 'HAND'),
  ('hand_draw_count', '5', '毎ターン開始時のドロー枚数', 'HAND'),
  ('stability_explosion_threshold', '0', '暴発発生閾値（安定値がこの値を下回ると暴発）', 'STABILITY')
ON CONFLICT (setting_key) DO NOTHING;

-- ============================================================================
-- コメント
-- ============================================================================

COMMENT ON TABLE cards IS 'カードテーブル - ゲーム内で使用されるカード情報';
COMMENT ON TABLE customers IS '顧客テーブル - ゲーム内の顧客（依頼主）情報';
COMMENT ON TABLE alchemy_styles IS '錬金スタイルテーブル - プレイヤーが選択できる初期デッキタイプ';
COMMENT ON TABLE map_nodes IS 'マップノードテーブル - ゲームマップ上のノード情報';
COMMENT ON TABLE meta_currencies IS 'メタ通貨テーブル - 名声・知識ポイントなどのメタ通貨定義';
COMMENT ON TABLE unlockable_contents IS 'アンロック可能コンテンツテーブル - メタ通貨でアンロック可能なコンテンツ';
COMMENT ON TABLE game_balances IS 'ゲームバランステーブル - ゲームバランス調整用の設定値';
COMMENT ON TABLE customer_reward_cards IS '顧客-報酬カード中間テーブル - 顧客が報酬として提供するカード（N:M）';
COMMENT ON TABLE alchemy_style_initial_deck_cards IS '錬金スタイル-初期デッキカード中間テーブル - 各錬金スタイルの初期デッキ構成（N:M）';

-- ============================================================================
-- 変更履歴
-- ============================================================================

-- | 日付 | バージョン | 変更内容 |
-- |------|----------|---------|
-- | 2025-01-XX | 1.0 | 初版作成 |

