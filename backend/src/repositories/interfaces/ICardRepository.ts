import { Card, CreateCardRequest, UpdateCardRequest } from '../../types/card';
import { PaginationOptions, PaginationResult } from '../../types/repository';

/**
 * 🔵 Card Repository インターフェース
 * Prisma実装とIn-Memory実装の両方がこのインターフェースを実装する
 *
 * このインターフェースにより、データアクセス層を抽象化し、
 * テスト時にモックやIn-Memory実装に差し替えることが可能になる
 */
export interface ICardRepository {
  /**
   * カードを作成する
   * @param data 作成するカードのデータ
   * @returns 作成されたカード
   */
  create(data: CreateCardRequest): Promise<Card>;

  /**
   * IDでカードを検索する
   * @param id カードID
   * @returns カード（見つからない場合はnull）
   */
  findById(id: string): Promise<Card | null>;

  /**
   * 名前でカードを検索する
   * @param name カード名
   * @returns カード（見つからない場合はnull）
   */
  findByName(name: string): Promise<Card | null>;

  /**
   * カード一覧を取得する（ページネーション付き）
   * @param options ページネーションオプション
   * @param filters フィルター条件（カード系統、検索ワード）
   * @returns ページネーション結果
   */
  findMany(
    options: PaginationOptions,
    filters?: { cardType?: string; search?: string }
  ): Promise<PaginationResult<Card>>;

  /**
   * カードを更新する
   * @param id カードID
   * @param data 更新するカードのデータ
   * @returns 更新されたカード
   */
  update(id: string, data: UpdateCardRequest): Promise<Card>;

  /**
   * カードを削除する（ソフトデリート）
   * @param id カードID
   */
  delete(id: string): Promise<void>;

  /**
   * カード数をカウントする
   * @param filters フィルター条件
   * @returns カード数
   */
  count(filters?: { cardType?: string }): Promise<number>;
}
