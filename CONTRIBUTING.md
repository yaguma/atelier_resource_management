# コントリビューションガイドライン

このプロジェクトへの貢献を歓迎します！このドキュメントは、プロジェクトに貢献するためのガイドラインを提供します。

## はじめに

このプロジェクトは、アトリエシリーズの世界観をベースとした資源管理Webアプリケーションです。カード管理、顧客管理、調合スタイル管理などの機能を提供します。

## 開発環境のセットアップ

詳細なセットアップ手順は [README.md](README.md) の「セットアップ」セクションを参照してください。

### 前提条件

- Node.js v20.x
- PostgreSQL
- npm または yarn
- Git

### セットアップ手順

1. リポジトリをクローン
```bash
git clone https://github.com/your-org/atelier_resource_management.git
cd atelier_resource_management
```

2. バックエンドのセットアップ
```bash
cd backend
npm install
cp .env.example .env
# .envファイルを編集してデータベース接続情報を設定
npx prisma migrate dev
```

3. フロントエンドのセットアップ
```bash
cd frontend
npm install
```

## 開発の流れ

### 1. ブランチの作成

新しい機能やバグ修正を実装する際は、必ず新しいブランチを作成してください。

```bash
# メインブランチから最新の変更を取得
git checkout main
git pull origin main

# 新しいブランチを作成
git checkout -b feature/your-feature-name
# または
git checkout -b fix/your-bug-fix-name
```

### 2. コーディング規約

#### TypeScript

- **strict mode**: TypeScript strict mode を有効にしています
- **型定義**: 可能な限り型を明示的に定義してください
- **命名規則**: 
  - 変数・関数: camelCase
  - クラス・インターフェース: PascalCase
  - 定数: UPPER_SNAKE_CASE

#### コードフォーマット

- **ESLint**: プロジェクト全体でESLintを使用しています
- **Prettier**: コードフォーマットはPrettierで自動化されています
- コミット前に必ず以下を実行してください：
```bash
# バックエンド
cd backend
npm run lint
npm run format

# フロントエンド
cd frontend
npm run lint
npm run format
```

#### コメント

- 関数・メソッドには日本語で機能概要を記載してください
- 複雑なロジックには説明コメントを追加してください
- 例:
```typescript
/**
 * 【機能概要】: カード情報を取得する
 * @param cardId - カードID
 * @returns カード情報
 */
async function getCard(cardId: string): Promise<Card> {
  // 実装
}
```

### 3. テスト

#### テストの実行

```bash
# バックエンドのテスト
cd backend
npm test

# テストカバレッジの確認
npm run test:coverage

# 特定のテストファイルのみ実行
npm test src/__tests__/services/cardService.test.ts
```

#### テストの書き方

- **ユニットテスト**: 各関数・メソッドの動作を確認
- **統合テスト**: APIエンドポイントの動作を確認
- **テストカバレッジ**: 可能な限り高いカバレッジを維持してください

#### Repository Patternのテスト

- **ユニットテスト**: In-Memory Repositoryを使用
- **統合テスト**: Prisma Repositoryを使用

```typescript
// ユニットテスト例
import { InMemoryCardRepository } from '@/repositories/memory/card-repository';
import { CardService } from '@/services/card-service';

const cardRepository = new InMemoryCardRepository();
const cardService = new CardService(cardRepository);
```

### 4. コミット

#### コミットメッセージの規約

コミットメッセージは以下の形式に従ってください：

```
<type>: <subject>

<body>

<footer>
```

**type**:
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメントの変更
- `style`: コードフォーマットの変更（動作に影響しない）
- `refactor`: リファクタリング
- `test`: テストの追加・修正
- `chore`: ビルドプロセスやツールの変更

**例**:
```
feat: カード一覧取得APIにページネーション機能を追加

- ページ番号とページサイズのパラメータを追加
- レスポンスに総件数と総ページ数を含めるように変更

Closes #123
```

#### コミット前のチェック

コミット前に必ず以下を実行してください：

```bash
# リンターの実行
npm run lint

# テストの実行
npm test

# 型チェック
npm run type-check
```

### 5. プルリクエスト

#### プルリクエストの作成

1. 変更をコミットしてプッシュ
```bash
git push origin feature/your-feature-name
```

2. GitHubでプルリクエストを作成
   - タイトル: 変更内容を簡潔に記述
   - 説明: 変更の詳細、関連するIssue番号を記載
   - レビュアーを指定

#### プルリクエストのテンプレート

```markdown
## 変更内容
- 変更点1
- 変更点2

## 関連Issue
Closes #123

## テスト
- [ ] ユニットテストを追加
- [ ] 統合テストを追加
- [ ] 手動テストを実施

## チェックリスト
- [ ] コードフォーマットを実行
- [ ] リンターエラーがない
- [ ] テストが全て通る
- [ ] ドキュメントを更新（必要に応じて）
```

#### レビューの基準

- コードがプロジェクトの規約に従っているか
- テストが適切に書かれているか
- ドキュメントが更新されているか（必要に応じて）
- パフォーマンスに問題がないか

## アーキテクチャ

### バックエンド

- **アーキテクチャ**: レイヤードアーキテクチャ
  - Controller層: リクエスト/レスポンスの処理
  - Service層: ビジネスロジック
  - Repository層: データアクセス
- **Repository Pattern**: データアクセス層を抽象化
  - インターフェース: `src/repositories/interfaces/`
  - Prisma実装: `src/repositories/prisma/`
  - In-Memory実装: `src/repositories/memory/`

### フロントエンド

- **アーキテクチャ**: コンポーネントベース
  - コンポーネント: `src/components/`
  - ページ: `src/pages/`
  - フック: `src/hooks/`
  - サービス: `src/services/`

## エラーハンドリング

### エラーコード体系

- **AUTH_xxx**: 認証・認可エラー
- **VALID_xxx**: バリデーションエラー
- **RES_xxx**: リソースエラー（未検出、重複、依存関係）
- **DB_xxx**: データベースエラー
- **REPO_xxx**: Repositoryエラー
- **SYS_xxx**: システムエラー
- **NET_xxx**: ネットワークエラー

### エラーレスポンス形式

```json
{
  "success": false,
  "error": {
    "code": "RES_001",
    "message": "リソースが見つかりません",
    "details": {}
  }
}
```

## 質問・提案

プロジェクトに関する質問や提案は、GitHubのIssueでお願いします。

- バグ報告: [Bug Report](https://github.com/your-org/atelier_resource_management/issues/new?template=bug_report.md)
- 機能要望: [Feature Request](https://github.com/your-org/atelier_resource_management/issues/new?template=feature_request.md)
- 質問: [Question](https://github.com/your-org/atelier_resource_management/issues/new?template=question.md)

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。貢献する際は、このライセンスに同意したものとみなされます。

