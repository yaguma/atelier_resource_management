import { ICardRepository } from '../interfaces/ICardRepository';
import { Card, CardType, CreateCardRequest, UpdateCardRequest } from '../../types/card';
import { PaginationOptions, PaginationResult } from '../../types/repository';
import { prisma } from '../../utils/prisma';

/**
 * 🔵 Prisma Card Repository実装（本番環境用）
 * ICardRepositoryインターフェースを実装し、PostgreSQLデータベースに接続する
 * ソフトデリート対応はPrismaミドルウェアで自動的に処理される
 */
export class PrismaCardRepository implements ICardRepository {
  /**
   * カードを作成する
   * @param data 作成するカードのデータ
   * @returns 作成されたカード
   */
  async create(data: CreateCardRequest): Promise<Card> {
    return await prisma.card.create({
      data: {
        name: data.name,
        description: data.description,
        cardType: data.cardType,
        attribute: data.attribute,
        stabilityValue: data.stabilityValue,
        reactionEffect: data.reactionEffect ?? null,
        energyCost: data.energyCost,
        imageUrl: data.imageUrl ?? null,
        rarity: data.rarity ?? null,
        evolutionFromId: data.evolutionFromId ?? null,
      },
    }) as Card;
  }

  /**
   * IDでカードを検索する
   * @param id カードID
   * @returns カード（見つからない場合はnull）
   */
  async findById(id: string): Promise<Card | null> {
    const card = await prisma.card.findUnique({
      where: { id },
      include: {
        evolutionFrom: true,
        evolutionTo: true,
        initialDeckStyles: true,
        unlockableContent: true,
        rewardCustomers: true,
      },
    });

    return card as Card | null;
  }

  /**
   * 名前でカードを検索する
   * @param name カード名
   * @returns カード（見つからない場合はnull）
   */
  async findByName(name: string): Promise<Card | null> {
    const card = await prisma.card.findFirst({
      where: { name },
    });

    return card as Card | null;
  }

  /**
   * カード一覧を取得する（ページネーション付き）
   * @param options ページネーションオプション
   * @param filters フィルター条件（カード系統、検索ワード）
   * @returns ページネーション結果
   */
  async findMany(
    options: PaginationOptions,
    filters?: { cardType?: CardType; search?: string }
  ): Promise<PaginationResult<Card>> {
    const where: any = {};

    if (filters?.cardType) {
      where.cardType = filters.cardType;
    }

    if (filters?.search) {
      where.name = { contains: filters.search };
    }

    const [items, total] = await Promise.all([
      prisma.card.findMany({
        where,
        skip: (options.page - 1) * options.limit,
        take: options.limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.card.count({ where }),
    ]);

    return {
      items: items as Card[],
      total,
      page: options.page,
      limit: options.limit,
      totalPages: Math.ceil(total / options.limit),
    };
  }

  /**
   * カードを更新する
   * @param id カードID
   * @param data 更新するカードのデータ
   * @returns 更新されたカード
   */
  async update(id: string, data: UpdateCardRequest): Promise<Card> {
    return await prisma.card.update({
      where: { id },
      data,
    }) as Card;
  }

  /**
   * カードを削除する（ソフトデリート）
   * Prismaミドルウェアによって自動的にdeletedAtが設定される
   * @param id カードID
   */
  async delete(id: string): Promise<void> {
    await prisma.card.delete({
      where: { id },
    });
  }

  /**
   * カード数をカウントする
   * @param filters フィルター条件
   * @returns カード数
   */
  async count(filters?: { cardType?: CardType }): Promise<number> {
    const where: any = {};

    if (filters?.cardType) {
      where.cardType = filters.cardType;
    }

    return await prisma.card.count({ where });
  }
}
