# リソース管理Webアプリ タスク概要

## プロジェクト概要

**要件名**: resource-management-webapp  
**プロジェクト名**: アトリエ錬金術ゲーム リソース管理Webアプリ  
**目的**: ゲーム内リソース（カード、顧客、錬金スタイル、マップノード、メタ進行データなど）を効率的に管理するための管理画面を提供する

### 技術スタック

- **フロントエンド**: React 18+ + Vite + TypeScript + TailwindCSS + React Router + TanStack Query + Zod + Axios
- **バックエンド**: Hono.js + TypeScript + Prisma + PostgreSQL
- **データベース**: PostgreSQL 14+ (開発環境) / Azure Database for PostgreSQL (本番環境)

### プロジェクト期間・工数

- **総フェーズ数**: 11フェーズ
- **総期間**: 約51日（約408時間）
- **総タスク数**: 220タスク（TASK-0001 〜 TASK-0220）
- **開始タスクID**: TASK-0001
- **終了タスクID**: TASK-0220

---

## フェーズ構成

| フェーズ | 期間 | 成果物 | タスク数 | 工数 | ファイル |
|---------|------|--------|---------|------|----------|
| Phase 1 | 5日 | 基盤構築（環境構築、DB設定、共通基盤） | 35 | 40時間 | [phase1.md](./resource-management-webapp-phase1.md) |
| Phase 2 | 5日 | バックエンド基盤（Repository Pattern、Service層、共通API） | 21 | 40時間 | [phase2.md](./resource-management-webapp-phase2.md) |
| Phase 3 | 5日 | カード管理API（CRUD、バリデーション、エラーハンドリング） | 21 | 40時間 | [phase3.md](./resource-management-webapp-phase3.md) |
| Phase 4 | 5日 | 顧客管理API（CRUD、N:Mリレーション） | 22 | 40時間 | [phase4.md](./resource-management-webapp-phase4.md) |
| Phase 5 | 5日 | 錬金スタイル・マップノード・ゲームバランスAPI | 18 | 40時間 | [phase5.md](./resource-management-webapp-phase5.md) |
| Phase 6 | 3日 | エクスポート/インポートAPI | 12 | 24時間 | [phase6.md](./resource-management-webapp-phase6.md) |
| Phase 7 | 5日 | フロントエンド基盤（ルーティング、レイアウト、共通コンポーネント） | 21 | 40時間 | [phase7.md](./resource-management-webapp-phase7.md) |
| Phase 8 | 5日 | カード管理UI（一覧、作成、編集、詳細） | 21 | 40時間 | [phase8.md](./resource-management-webapp-phase8.md) |
| Phase 9 | 5日 | 顧客管理UI（一覧、作成、編集、詳細） | 21 | 40時間 | [phase9.md](./resource-management-webapp-phase9.md) |
| Phase 10 | 5日 | 錬金スタイル管理UI、ダッシュボード | 17 | 40時間 | [phase10.md](./resource-management-webapp-phase10.md) |
| Phase 11 | 3日 | エクスポート/インポートUI、統合テスト | 11 | 24時間 | [phase11.md](./resource-management-webapp-phase11.md) |
| **合計** | **51日** | - | **220** | **408時間** | - |

---

## タスク番号管理

### 使用済みタスク番号

- **使用済みタスクID**: TASK-0001 〜 TASK-0220（220タスク）

### 次回開始番号

- **次回開始タスクID**: TASK-0221

---

## 全体進捗

### フェーズ進捗

- [ ] Phase 1: 基盤構築
- [ ] Phase 2: バックエンド基盤
- [ ] Phase 3: カード管理API
- [ ] Phase 4: 顧客管理API
- [ ] Phase 5: 錬金スタイル・マップノード・ゲームバランスAPI
- [ ] Phase 6: エクスポート/インポートAPI
- [ ] Phase 7: フロントエンド基盤
- [ ] Phase 8: カード管理UI
- [ ] Phase 9: 顧客管理UI
- [ ] Phase 10: 錬金スタイル管理UI、ダッシュボード
- [ ] Phase 11: エクスポート/インポートUI、統合テスト

---

## マイルストーン

### マイルストーン1: MVP基盤完成（Phase 1-2完了）

- **目標日**: Phase 2完了時
- **成果物**: 
  - 開発環境構築完了
  - データベース設定完了
  - Repository Pattern実装完了
  - Service層基盤実装完了
- **要件**: WRREQ-001〜008-2, WRREQ-067〜070-2

### マイルストーン2: バックエンドAPI完成（Phase 3-6完了）

- **目標日**: Phase 6完了時
- **成果物**: 
  - カード管理API完成
  - 顧客管理API完成
  - 錬金スタイル・マップノード・ゲームバランスAPI完成
  - エクスポート/インポートAPI完成
- **要件**: WRREQ-012〜018, WRREQ-021〜026, WRREQ-029〜031, WRREQ-033〜037, WRREQ-038〜042, WRREQ-043〜047, WRREQ-048〜051

### マイルストーン3: フロントエンド基盤完成（Phase 7完了）

- **目標日**: Phase 7完了時
- **成果物**: 
  - ルーティング設定完了
  - レイアウト実装完了
  - 共通コンポーネント実装完了
  - APIクライアント実装完了
- **要件**: WRREQ-001〜006, WRREQ-052〜054

### マイルストーン4: MVP完成（Phase 8-9完了）

- **目標日**: Phase 9完了時
- **成果物**: 
  - カード管理UI完成
  - 顧客管理UI完成
- **要件**: WRREQ-016〜017, WRREQ-025〜026, WRREQ-055〜057, WRREQ-059〜063

### マイルストーン5: 正式リリース準備完了（Phase 10-11完了）

- **目標日**: Phase 11完了時
- **成果物**: 
  - 錬金スタイル管理UI完成
  - ダッシュボード完成
  - エクスポート/インポートUI完成
  - 統合テスト完成
- **要件**: WRREQ-031, WRREQ-052, WRREQ-043〜047, WRNFR-012〜014

---

## 関連文書

- **要件定義書**: [docs/requirements/resource-management-webapp-requirements.md](../requirements/resource-management-webapp-requirements.md)
- **設計文書**: [docs/design/resource-management-webapp/](../design/resource-management-webapp/)
  - [アーキテクチャ設計](./architecture.md)
  - [データベーススキーマ](./database-schema.sql)
  - [APIエンドポイント仕様](./api-endpoints.md)
  - [型定義](./interfaces.ts)
  - [データフロー](./dataflow.md)
  - [画面設計](./screens.md)
  - [画面遷移図](./screen-trans.md)

---

## 変更履歴

| 日付 | バージョン | 変更内容 |
|------|----------|---------|
| 2025-01-XX | 1.0 | 初版作成 |
