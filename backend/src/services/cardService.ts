import { ICardRepository } from '../repositories/interfaces/ICardRepository';
import { Card, CardType, CreateCardRequest, UpdateCardRequest } from '../types/card';
import { PaginationOptions } from '../types/repository';
import { checkCardDependencies } from '../utils/dependencyCheck';
import { ResourceNotFoundError, DuplicateResourceError, DependencyError } from '../utils/errors';

/**
 * 🔵 Card Service
 * Repository インターフェースに依存（実装には依存しない）
 * ビジネスロジックを実装し、Controllerから呼び出される
 */
export class CardService {
  constructor(private readonly cardRepository: ICardRepository) {}

  /**
   * 🔵 カードを作成
   * @param data 作成するカードのデータ
   * @returns 作成されたカード
   * @throws {DuplicateResourceError} 同名のカードが既に存在する場合
   */
  async createCard(data: CreateCardRequest): Promise<Card> {
    // 🔵 重複チェック
    const existing = await this.cardRepository.findByName(data.name);
    if (existing) {
      throw new DuplicateResourceError('カード');
    }

    // 🔵 Repositoryでカード作成
    return await this.cardRepository.create(data);
  }

  /**
   * 🔵 カード一覧を取得
   * @param page ページ番号
   * @param limit 1ページあたりの件数
   * @param filters フィルター条件
   * @returns ページネーション結果
   */
  async getCards(
    page: number,
    limit: number,
    filters?: { cardType?: CardType; search?: string }
  ) {
    return await this.cardRepository.findMany({ page, limit }, filters);
  }

  /**
   * 🔵 カード詳細を取得
   * @param id カードID
   * @returns カード
   * @throws {ResourceNotFoundError} カードが見つからない場合
   */
  async getCardById(id: string): Promise<Card> {
    const card = await this.cardRepository.findById(id);
    if (!card) {
      throw new ResourceNotFoundError('カード');
    }
    return card;
  }

  /**
   * 🔵 カードを更新
   * @param id カードID
   * @param data 更新するカードのデータ
   * @returns 更新されたカード
   * @throws {ResourceNotFoundError} カードが見つからない場合
   * @throws {DuplicateResourceError} 同名のカードが既に存在する場合
   */
  async updateCard(id: string, data: UpdateCardRequest): Promise<Card> {
    // 🔵 カードの存在チェック
    const existingCard = await this.cardRepository.findById(id);
    if (!existingCard) {
      throw new ResourceNotFoundError('カード');
    }

    // 🔵 名前の重複チェック（名前が変更される場合のみ）
    if (data.name && data.name !== existingCard.name) {
      const duplicateCard = await this.cardRepository.findByName(data.name);
      if (duplicateCard && duplicateCard.id !== id) {
        throw new DuplicateResourceError('カード');
      }
    }

    return await this.cardRepository.update(id, data);
  }

  /**
   * 🔵 カードを削除
   * @param id カードID
   * @throws {ResourceNotFoundError} カードが見つからない場合
   * @throws {DependencyError} 依存関係がある場合
   */
  async deleteCard(id: string): Promise<void> {
    // 🔵 カードの存在チェック
    const existingCard = await this.cardRepository.findById(id);
    if (!existingCard) {
      throw new ResourceNotFoundError('カード');
    }

    // 🔵 依存関係チェック
    const dependencies = await checkCardDependencies(id);
    if (dependencies.length > 0) {
      throw new DependencyError(dependencies);
    }

    await this.cardRepository.delete(id);
  }

  /**
   * 🔵 カード数をカウント
   * @param filters フィルター条件
   * @returns カード数
   */
  async countCards(filters?: { cardType?: CardType }): Promise<number> {
    return await this.cardRepository.count(filters);
  }
}
