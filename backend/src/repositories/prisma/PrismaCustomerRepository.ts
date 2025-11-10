import { ICustomerRepository } from '../interfaces/ICustomerRepository';
import { Customer, CreateCustomerRequest, UpdateCustomerRequest } from '../../types/customer';
import { PaginationOptions, PaginationResult } from '../../types/repository';
import { prisma } from '../../utils/prisma';

/**
 * 🔵 Prisma Customer Repository実装（本番環境用）
 * ICustomerRepositoryインターフェースを実装し、PostgreSQLデータベースに接続する
 * ソフトデリート対応はPrismaミドルウェアで自動的に処理される
 */
export class PrismaCustomerRepository implements ICustomerRepository {
  /**
   * 顧客を作成する
   * @param data 作成する顧客のデータ
   * @returns 作成された顧客
   */
  async create(data: CreateCustomerRequest): Promise<Customer> {
    const createData: any = {
      name: data.name,
      description: data.description,
      customerType: data.customerType,
      difficulty: data.difficulty,
      requiredAttribute: data.requiredAttribute,
      qualityCondition: data.qualityCondition,
      stabilityCondition: data.stabilityCondition,
      rewardFame: data.rewardFame,
      rewardKnowledge: data.rewardKnowledge,
      portraitUrl: data.portraitUrl ?? null,
    };

    // 🔵 N:Mリレーション: rewardCards
    if (data.rewardCardIds && data.rewardCardIds.length > 0) {
      createData.rewardCards = {
        connect: data.rewardCardIds.map((id) => ({ id })),
      };
    }

    return await prisma.customer.create({
      data: createData,
      include: {
        rewardCards: true,
        mapNodes: true,
        unlockableContent: true,
      },
    }) as Customer;
  }

  /**
   * IDで顧客を検索する
   * @param id 顧客ID
   * @returns 顧客（見つからない場合はnull）
   */
  async findById(id: string): Promise<Customer | null> {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        rewardCards: true,
        mapNodes: true,
        unlockableContent: true,
      },
    });

    return customer as Customer | null;
  }

  /**
   * 顧客一覧を取得する（ページネーション付き）
   * @param options ページネーションオプション
   * @param filters フィルター条件（難易度、検索ワード）
   * @returns ページネーション結果
   */
  async findMany(
    options: PaginationOptions,
    filters?: { difficulty?: number; search?: string }
  ): Promise<PaginationResult<Customer>> {
    const where: any = {};

    if (filters?.difficulty) {
      where.difficulty = filters.difficulty;
    }

    if (filters?.search) {
      where.name = { contains: filters.search };
    }

    const [items, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip: (options.page - 1) * options.limit,
        take: options.limit,
        orderBy: { createdAt: 'desc' },
        include: {
          rewardCards: true,
        },
      }),
      prisma.customer.count({ where }),
    ]);

    return {
      items: items as Customer[],
      total,
      page: options.page,
      limit: options.limit,
      totalPages: Math.ceil(total / options.limit),
    };
  }

  /**
   * 顧客を更新する
   * @param id 顧客ID
   * @param data 更新する顧客のデータ
   * @returns 更新された顧客
   */
  async update(id: string, data: UpdateCustomerRequest): Promise<Customer> {
    // 🔵 rewardCardIds を分離して、顧客データのみを更新データとする
    const { rewardCardIds, ...customerData } = data;
    const updateData: any = { ...customerData };

    // 🔵 N:Mリレーション: rewardCards
    // rewardCardIdsが指定されている場合、既存の関連を全て削除して新しい関連を設定
    if (rewardCardIds !== undefined) {
      updateData.rewardCards = {
        set: rewardCardIds.map((id) => ({ id })),
      };
    }

    return await prisma.customer.update({
      where: { id },
      data: updateData,
      include: {
        rewardCards: true,
        mapNodes: true,
        unlockableContent: true,
      },
    }) as Customer;
  }

  /**
   * 顧客を削除する（ソフトデリート）
   * Prismaミドルウェアによって自動的にdeletedAtが設定される
   * @param id 顧客ID
   */
  async delete(id: string): Promise<void> {
    await prisma.customer.delete({
      where: { id },
    });
  }

  /**
   * 顧客数をカウントする
   * @param filters フィルター条件
   * @returns 顧客数
   */
  async count(filters?: { difficulty?: number }): Promise<number> {
    const where: any = {};

    if (filters?.difficulty) {
      where.difficulty = filters.difficulty;
    }

    return await prisma.customer.count({ where });
  }
}
