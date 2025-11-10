import { ICardRepository } from '../repositories/interfaces/ICardRepository';
import { Card, CardType, CreateCardRequest, UpdateCardRequest } from '../types/card';
import { PaginationOptions } from '../types/repository';
import { RES_001, RES_002, RES_003 } from '../constants/errorCodes';
import { checkCardDependencies } from '../utils/dependencyCheck';

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
   * @throws 同名のカードが既に存在する場合（RES_002エラー）
   */
  async createCard(data: CreateCardRequest): Promise<Card> {
    // 🔵 重複チェック
    const existing = await this.cardRepository.findByName(data.name);
    if (existing) {
      const error: any = new Error('同名のカードが既に存在します');
      error.code = RES_002;
      throw error;
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
   * @throws カードが見つからない場合（RES_001エラー）
   */
  async getCardById(id: string): Promise<Card> {
    const card = await this.cardRepository.findById(id);
    if (!card) {
      const error: any = new Error('カードが見つかりません');
      error.code = RES_001;
      throw error;
    }
    return card;
  }

  /**
   * 🔵 カードを更新
   * @param id カードID
   * @param data 更新するカードのデータ
   * @returns 更新されたカード
   * @throws カードが見つからない場合（RES_001エラー）、または同名のカードが既に存在する場合（RES_002エラー）
   */
  async updateCard(id: string, data: UpdateCardRequest): Promise<Card> {
    // 🔵 カードの存在チェック
    const existingCard = await this.cardRepository.findById(id);
    if (!existingCard) {
      const error: any = new Error('カードが見つかりません');
      error.code = RES_001;
      throw error;
    }

    // 🔵 名前の重複チェック（名前が変更される場合のみ）
    if (data.name && data.name !== existingCard.name) {
      const duplicateCard = await this.cardRepository.findByName(data.name);
      if (duplicateCard && duplicateCard.id !== id) {
        const error: any = new Error('同名のカードが既に存在します');
        error.code = RES_002;
        throw error;
      }
    }

    return await this.cardRepository.update(id, data);
  }

  /**
   * 🔵 カードを削除
   * @param id カードID
   * @throws カードが見つからない場合（RES_001エラー）、または依存関係がある場合（RES_003エラー）
   */
  async deleteCard(id: string): Promise<void> {
    // 🔵 カードの存在チェック
    const existingCard = await this.cardRepository.findById(id);
    if (!existingCard) {
      const error: any = new Error('カードが見つかりません');
      error.code = RES_001;
      throw error;
    }

    // 🔵 依存関係チェック
    const dependencies = await checkCardDependencies(id);
    if (dependencies.length > 0) {
      const error: any = new Error('他のリソースから参照されているため削除できません');
      error.code = RES_003;
      error.dependencies = dependencies;
      throw error;
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
