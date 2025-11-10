import { ICardRepository } from '../repositories/interfaces/ICardRepository';
// 将来的に他のRepositoryもimport
// import { ICustomerRepository } from '../repositories/interfaces/ICustomerRepository';
// import { IAlchemyStyleRepository } from '../repositories/interfaces/IAlchemyStyleRepository';

/**
 * 🔵 Repository コンテナインターフェース
 * 全てのRepositoryをまとめて管理
 *
 * このコンテナにより、アプリケーション全体で一貫した方法で
 * Repositoryにアクセスできるようになる
 */
export interface IRepositoryContainer {
  cardRepository: ICardRepository;
  // 将来的に追加
  // customerRepository: ICustomerRepository;
  // alchemyStyleRepository: IAlchemyStyleRepository;
  // mapNodeRepository: IMapNodeRepository;
  // metaProgressionRepository: IMetaProgressionRepository;
  // gameBalanceRepository: IGameBalanceRepository;
}

/**
 * 🔵 Repository コンテナを作成
 * 環境変数REPOSITORY_TYPEに応じてPrisma実装またはIn-Memory実装を返す
 *
 * @returns Repositoryコンテナ
 * @throws Error 実装がまだ利用できない場合
 *
 * 使用例:
 * ```typescript
 * const container = createRepositoryContainer();
 * const card = await container.cardRepository.findById('xxx');
 * ```
 */
export function createRepositoryContainer(): IRepositoryContainer {
  const repositoryType = process.env.REPOSITORY_TYPE || 'prisma';

  if (repositoryType === 'memory') {
    // 🔵 テスト環境: In-Memory実装
    // TODO: Phase 2でIn-Memory実装を追加（TASK-0015C）
    throw new Error('In-Memory implementation not yet available. Will be implemented in TASK-0015C.');
  }

  // 🔵 本番環境: Prisma実装
  // TODO: Phase 2でPrisma実装を追加（TASK-0015B）
  throw new Error('Prisma implementation not yet available. Will be implemented in TASK-0015B.');
}
