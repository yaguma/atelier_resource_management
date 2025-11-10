import { ICardRepository } from '../interfaces/ICardRepository';
import { Card, CardType, CreateCardRequest, UpdateCardRequest } from '../../types/card';
import { PaginationOptions, PaginationResult } from '../../types/repository';
import { v4 as uuidv4 } from 'uuid';

/**
 * 🔵 In-Memory Card Repository実装（テスト用）
 * データベース不要でテストが実行可能
 * メモリ内でカードデータを保持・操作する
 */
export class InMemoryCardRepository implements ICardRepository {
  private cards: Card[] = [];

  /**
   * カードを作成する
   * @param data 作成するカードのデータ
   * @returns 作成されたカード
   */
  async create(data: CreateCardRequest): Promise<Card> {
    const card: Card = {
      id: uuidv4(),
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
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      evolutionFrom: null,
      evolutionTo: [],
      initialDeckStyles: [],
      unlockableContent: null,
      rewardCustomers: [],
    };

    this.cards.push(card);
    return card;
  }

  /**
   * IDでカードを検索する
   * @param id カードID
   * @returns カード（見つからない場合はnull）
   */
  async findById(id: string): Promise<Card | null> {
    const card = this.cards.find((c) => c.id === id && !c.deletedAt);
    return card || null;
  }

  /**
   * 名前でカードを検索する
   * @param name カード名
   * @returns カード（見つからない場合はnull）
   */
  async findByName(name: string): Promise<Card | null> {
    const card = this.cards.find((c) => c.name === name && !c.deletedAt);
    return card || null;
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
    let filtered = this.cards.filter((c) => !c.deletedAt);

    // フィルタリング
    if (filters?.cardType) {
      filtered = filtered.filter((c) => c.cardType === filters.cardType);
    }

    if (filters?.search) {
      filtered = filtered.filter((c) => c.name.includes(filters.search!));
    }

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
   * カードを更新する
   * @param id カードID
   * @param data 更新するカードのデータ
   * @returns 更新されたカード
   */
  async update(id: string, data: UpdateCardRequest): Promise<Card> {
    const index = this.cards.findIndex((c) => c.id === id && !c.deletedAt);

    if (index === -1) {
      throw new Error('Card not found');
    }

    this.cards[index] = {
      ...this.cards[index],
      ...data,
      updatedAt: new Date(),
    };

    return this.cards[index];
  }

  /**
   * カードを削除する（ソフトデリート）
   * @param id カードID
   */
  async delete(id: string): Promise<void> {
    const index = this.cards.findIndex((c) => c.id === id && !c.deletedAt);

    if (index === -1) {
      throw new Error('Card not found');
    }

    this.cards[index].deletedAt = new Date();
  }

  /**
   * カード数をカウントする
   * @param filters フィルター条件
   * @returns カード数
   */
  async count(filters?: { cardType?: CardType }): Promise<number> {
    let filtered = this.cards.filter((c) => !c.deletedAt);

    if (filters?.cardType) {
      filtered = filtered.filter((c) => c.cardType === filters.cardType);
    }

    return filtered.length;
  }

  /**
   * 🔵 テスト用ヘルパーメソッド
   * メモリ内のデータをクリアする
   */
  clear(): void {
    this.cards = [];
  }
}
