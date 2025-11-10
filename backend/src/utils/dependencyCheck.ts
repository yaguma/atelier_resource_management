import { prisma } from './prisma';

/**
 * 依存関係の詳細情報
 */
export interface DependencyInfo {
  type: string;
  resourceId: string;
  resourceName: string;
  description: string;
}

/**
 * 🔵 カードの依存関係をチェック
 * カードが他のリソースから参照されているかを確認する
 *
 * @param cardId カードID
 * @returns 依存関係の配列（依存がない場合は空配列）
 */
export async function checkCardDependencies(cardId: string): Promise<DependencyInfo[]> {
  // 🔵 並列実行でパフォーマンス向上
  const [evolutionToCards, initialDeckStyles, rewardCustomers, unlockableContent] =
    await Promise.all([
      // 1. 進化元として使用されているか（evolutionTo）
      prisma.card.findMany({
        where: {
          evolutionFromId: cardId,
          deletedAt: null,
        },
        select: {
          id: true,
          name: true,
        },
      }),
      // 2. 初期デッキとして使用されているか（initialDeckStyles）
      prisma.alchemyStyle.findMany({
        where: {
          initialDeckCards: {
            some: {
              id: cardId,
            },
          },
          deletedAt: null,
        },
        select: {
          id: true,
          name: true,
        },
      }),
      // 3. 報酬カードとして使用されているか（rewardCustomers）
      prisma.customer.findMany({
        where: {
          rewardCards: {
            some: {
              id: cardId,
            },
          },
          deletedAt: null,
        },
        select: {
          id: true,
          name: true,
        },
      }),
      // 4. アンロック可能コンテンツとして使用されているか（unlockableContent）
      prisma.unlockableContent.findFirst({
        where: {
          unlockItemCardId: cardId,
          deletedAt: null,
        },
        select: {
          id: true,
          contentType: true,
        },
      }),
    ]);

  const dependencies: DependencyInfo[] = [];

  // 進化元の依存関係
  for (const card of evolutionToCards) {
    dependencies.push({
      type: 'evolution',
      resourceId: card.id,
      resourceName: card.name,
      description: `カード「${card.name}」の進化元として使用されています`,
    });
  }

  // 初期デッキの依存関係
  for (const style of initialDeckStyles) {
    dependencies.push({
      type: 'initialDeck',
      resourceId: style.id,
      resourceName: style.name,
      description: `錬金スタイル「${style.name}」の初期デッキとして使用されています`,
    });
  }

  // 報酬カードの依存関係
  for (const customer of rewardCustomers) {
    dependencies.push({
      type: 'reward',
      resourceId: customer.id,
      resourceName: customer.name,
      description: `顧客「${customer.name}」の報酬カードとして使用されています`,
    });
  }

  // アンロック可能コンテンツの依存関係
  if (unlockableContent) {
    dependencies.push({
      type: 'unlockable',
      resourceId: unlockableContent.id,
      resourceName: `${unlockableContent.contentType}`,
      description: `アンロック可能コンテンツとして使用されています`,
    });
  }

  return dependencies;
}
