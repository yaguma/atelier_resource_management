import { Customer, CreateCustomerRequest, UpdateCustomerRequest } from '../../types/customer';
import { PaginationOptions, PaginationResult } from '../../types/repository';

/**
 * 🔵 Customer Repository インターフェース
 * Prisma実装とIn-Memory実装の両方がこのインターフェースを実装する
 *
 * このインターフェースにより、データアクセス層を抽象化し、
 * テスト時にモックやIn-Memory実装に差し替えることが可能になる
 */
export interface ICustomerRepository {
  /**
   * 顧客を作成する
   * @param data 作成する顧客のデータ
   * @returns 作成された顧客
   */
  create(data: CreateCustomerRequest): Promise<Customer>;

  /**
   * IDで顧客を検索する
   * @param id 顧客ID
   * @returns 顧客（見つからない場合はnull）
   */
  findById(id: string): Promise<Customer | null>;

  /**
   * 顧客一覧を取得する（ページネーション付き）
   * @param options ページネーションオプション
   * @param filters フィルター条件（難易度、検索ワード）
   * @returns ページネーション結果
   */
  findMany(
    options: PaginationOptions,
    filters?: { difficulty?: number; search?: string }
  ): Promise<PaginationResult<Customer>>;

  /**
   * 顧客を更新する
   * @param id 顧客ID
   * @param data 更新する顧客のデータ
   * @returns 更新された顧客
   */
  update(id: string, data: UpdateCustomerRequest): Promise<Customer>;

  /**
   * 顧客を削除する（ソフトデリート）
   * @param id 顧客ID
   */
  delete(id: string): Promise<void>;

  /**
   * 顧客数をカウントする
   * @param filters フィルター条件
   * @returns 顧客数
   */
  count(filters?: { difficulty?: number }): Promise<number>;
}
