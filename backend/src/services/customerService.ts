import { ICustomerRepository } from '../repositories/interfaces/ICustomerRepository';
import { ICardRepository } from '../repositories/interfaces/ICardRepository';
import { Customer, CreateCustomerRequest, UpdateCustomerRequest } from '../types/customer';
import { PaginationOptions } from '../types/repository';
import { ResourceNotFoundError, ValidationError } from '../utils/errors';

/**
 * 🔵 Customer Service
 * Repository インターフェースに依存（実装には依存しない）
 * ビジネスロジックを実装し、Controllerから呼び出される
 */
export class CustomerService {
  constructor(
    private readonly customerRepository: ICustomerRepository,
    private readonly cardRepository: ICardRepository
  ) {}

  /**
   * 🔵 顧客を作成
   * @param data 作成する顧客のデータ
   * @returns 作成された顧客
   * @throws {ValidationError} 報酬カードIDが存在しない場合
   */
  async createCustomer(data: CreateCustomerRequest): Promise<Customer> {
    // 🔵 rewardCardIds の存在確認
    if (data.rewardCardIds && data.rewardCardIds.length > 0) {
      for (const cardId of data.rewardCardIds) {
        const card = await this.cardRepository.findById(cardId);
        if (!card) {
          throw new ValidationError(`報酬カードID ${cardId} が見つかりません`);
        }
      }
    }

    // 🔵 Repositoryで顧客作成
    return await this.customerRepository.create(data);
  }

  /**
   * 🔵 顧客一覧を取得
   * @param page ページ番号
   * @param limit 1ページあたりの件数
   * @param filters フィルター条件
   * @returns ページネーション結果
   */
  async getCustomers(
    page: number,
    limit: number,
    filters?: { difficulty?: number; search?: string }
  ) {
    return await this.customerRepository.findMany({ page, limit }, filters);
  }

  /**
   * 🔵 顧客詳細を取得
   * @param id 顧客ID
   * @returns 顧客
   * @throws {ResourceNotFoundError} 顧客が見つからない場合
   */
  async getCustomerById(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new ResourceNotFoundError('顧客');
    }
    return customer;
  }

  /**
   * 🔵 顧客を更新
   * @param id 顧客ID
   * @param data 更新する顧客のデータ
   * @returns 更新された顧客
   * @throws {ResourceNotFoundError} 顧客が見つからない場合
   * @throws {ValidationError} 報酬カードIDが存在しない場合
   */
  async updateCustomer(id: string, data: UpdateCustomerRequest): Promise<Customer> {
    // 🔵 顧客の存在チェック
    const existingCustomer = await this.customerRepository.findById(id);
    if (!existingCustomer) {
      throw new ResourceNotFoundError('顧客');
    }

    // 🔵 rewardCardIds の存在確認
    if (data.rewardCardIds && data.rewardCardIds.length > 0) {
      for (const cardId of data.rewardCardIds) {
        const card = await this.cardRepository.findById(cardId);
        if (!card) {
          throw new ValidationError(`報酬カードID ${cardId} が見つかりません`);
        }
      }
    }

    return await this.customerRepository.update(id, data);
  }

  /**
   * 🔵 顧客を削除
   * @param id 顧客ID
   * @throws {ResourceNotFoundError} 顧客が見つからない場合
   */
  async deleteCustomer(id: string): Promise<void> {
    // 🔵 顧客の存在チェック
    const existingCustomer = await this.customerRepository.findById(id);
    if (!existingCustomer) {
      throw new ResourceNotFoundError('顧客');
    }

    await this.customerRepository.delete(id);
  }

  /**
   * 🔵 顧客数をカウント
   * @param filters フィルター条件
   * @returns 顧客数
   */
  async countCustomers(filters?: { difficulty?: number }): Promise<number> {
    return await this.customerRepository.count(filters);
  }
}
