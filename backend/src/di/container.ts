import { ICardRepository } from '../repositories/interfaces/ICardRepository';
import { PrismaCardRepository } from '../repositories/prisma/PrismaCardRepository';
import { InMemoryCardRepository } from '../repositories/memory/InMemoryCardRepository';
import { ICustomerRepository } from '../repositories/interfaces/ICustomerRepository';
import { PrismaCustomerRepository } from '../repositories/prisma/PrismaCustomerRepository';
import { InMemoryCustomerRepository } from '../repositories/memory/InMemoryCustomerRepository';
// 将来的に他のRepositoryもimport
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
  customerRepository: ICustomerRepository;
  // 将来的に追加
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
 * @throws Error 実装がまだ利用できない場合、または不正な環境変数が指定された場合
 *
 * 使用例:
 * ```typescript
 * const container = createRepositoryContainer();
 * const card = await container.cardRepository.findById('xxx');
 * ```
 */
export function createRepositoryContainer(): IRepositoryContainer {
  const repositoryType = process.env.REPOSITORY_TYPE || 'prisma';

  // 🔵 環境変数のバリデーション
  if (repositoryType !== 'prisma' && repositoryType !== 'memory') {
    throw new Error(
      `Invalid REPOSITORY_TYPE: "${repositoryType}". ` +
      `Expected 'prisma' or 'memory'.`
    );
  }

  if (repositoryType === 'memory') {
    // 🔵 テスト環境: In-Memory実装
    return {
      cardRepository: new InMemoryCardRepository(),
      customerRepository: new InMemoryCustomerRepository(),
    };
  }

  // 🔵 本番環境: Prisma実装
  return {
    cardRepository: new PrismaCardRepository(),
    customerRepository: new PrismaCustomerRepository(),
  };
}
