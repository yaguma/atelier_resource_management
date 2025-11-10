import { ICustomerRepository } from '../interfaces/ICustomerRepository';
import { Customer, CreateCustomerRequest, UpdateCustomerRequest } from '../../types/customer';
import { PaginationOptions, PaginationResult } from '../../types/repository';
import { v4 as uuidv4 } from 'uuid';

/**
 * 🔵 In-Memory Customer Repository実装（テスト用）
 * データベース不要でテストが実行可能
 * メモリ内で顧客データを保持・操作する
 */
export class InMemoryCustomerRepository implements ICustomerRepository {
  private customers: Customer[] = [];
  // 🔵 N:Mリレーション用: 顧客IDとカードIDのマッピング
  private rewardCardRelations: Map<string, string[]> = new Map();

  /**
   * 顧客を作成する
   * @param data 作成する顧客のデータ
   * @returns 作成された顧客
   */
  async create(data: CreateCustomerRequest): Promise<Customer> {
    const customer: Customer = {
      id: uuidv4(),
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
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      rewardCards: [],
      mapNodes: [],
      unlockableContent: null,
    };

    // 🔵 N:Mリレーション: rewardCards
    if (data.rewardCardIds && data.rewardCardIds.length > 0) {
      this.rewardCardRelations.set(customer.id, data.rewardCardIds);
      // メモリ内でシミュレート（実際のCardオブジェクトは持たない）
      customer.rewardCards = data.rewardCardIds.map((cardId) => ({ id: cardId }));
    }

    this.customers.push(customer);
    return customer;
  }

  /**
   * IDで顧客を検索する
   * @param id 顧客ID
   * @returns 顧客（見つからない場合はnull）
   */
  async findById(id: string): Promise<Customer | null> {
    const customer = this.customers.find((c) => c.id === id && !c.deletedAt);
    if (!customer) {
      return null;
    }

    // 🔵 N:Mリレーションを復元
    const rewardCardIds = this.rewardCardRelations.get(id) || [];
    customer.rewardCards = rewardCardIds.map((cardId) => ({ id: cardId }));

    return customer;
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
    let filtered = this.customers.filter((c) => !c.deletedAt);

    // フィルタリング
    if (filters?.difficulty) {
      filtered = filtered.filter((c) => c.difficulty === filters.difficulty);
    }

    if (filters?.search) {
      filtered = filtered.filter((c) => c.name.includes(filters.search!));
    }

    // 🔵 N:Mリレーションを復元
    filtered = filtered.map((customer) => {
      const rewardCardIds = this.rewardCardRelations.get(customer.id) || [];
      return {
        ...customer,
        rewardCards: rewardCardIds.map((cardId) => ({ id: cardId })),
      };
    });

    // ソート（新しい順）
    filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // ページネーション
    const start = (options.page - 1) * options.limit;
    const items = filtered.slice(start, start + options.limit);

    return {
      items,
      total: filtered.length,
      page: options.page,
      limit: options.limit,
      totalPages: Math.ceil(filtered.length / options.limit),
    };
  }

  /**
   * 顧客を更新する
   * @param id 顧客ID
   * @param data 更新する顧客のデータ
   * @returns 更新された顧客
   */
  async update(id: string, data: UpdateCustomerRequest): Promise<Customer> {
    const index = this.customers.findIndex((c) => c.id === id && !c.deletedAt);

    if (index === -1) {
      throw new Error('Customer not found');
    }

    this.customers[index] = {
      ...this.customers[index],
      ...data,
      updatedAt: new Date(),
    };

    // 🔵 N:Mリレーション: rewardCards
    if (data.rewardCardIds !== undefined) {
      this.rewardCardRelations.set(id, data.rewardCardIds);
      this.customers[index].rewardCards = data.rewardCardIds.map((cardId) => ({ id: cardId }));
    }

    return this.customers[index];
  }

  /**
   * 顧客を削除する（ソフトデリート）
   * @param id 顧客ID
   */
  async delete(id: string): Promise<void> {
    const index = this.customers.findIndex((c) => c.id === id && !c.deletedAt);

    if (index === -1) {
      throw new Error('Customer not found');
    }

    this.customers[index].deletedAt = new Date();
    // 🔵 N:Mリレーションも削除
    this.rewardCardRelations.delete(id);
  }

  /**
   * 顧客数をカウントする
   * @param filters フィルター条件
   * @returns 顧客数
   */
  async count(filters?: { difficulty?: number }): Promise<number> {
    let filtered = this.customers.filter((c) => !c.deletedAt);

    if (filters?.difficulty) {
      filtered = filtered.filter((c) => c.difficulty === filters.difficulty);
    }

    return filtered.length;
  }

  /**
   * 🔵 テスト用ヘルパーメソッド
   * メモリ内のデータをクリアする
   */
  clear(): void {
    this.customers = [];
    this.rewardCardRelations.clear();
  }
}
