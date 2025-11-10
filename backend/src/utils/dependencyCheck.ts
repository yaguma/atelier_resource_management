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
  const dependencies: DependencyInfo[] = [];

  // 1. 進化元として使用されているか（evolutionTo）
  const evolutionToCards = await prisma.card.findMany({
    where: {
      evolutionFromId: cardId,
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
    },
  });

  for (const card of evolutionToCards) {
    dependencies.push({
      type: 'evolution',
      resourceId: card.id,
      resourceName: card.name,
      description: `カード「${card.name}」の進化元として使用されています`,
    });
  }

  // 2. 初期デッキとして使用されているか（initialDeckStyles）
  const initialDeckStyles = await prisma.alchemyStyle.findMany({
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
  });

  for (const style of initialDeckStyles) {
    dependencies.push({
      type: 'initialDeck',
      resourceId: style.id,
      resourceName: style.name,
      description: `錬金スタイル「${style.name}」の初期デッキとして使用されています`,
    });
  }

  // 3. 報酬カードとして使用されているか（rewardCustomers）
  const rewardCustomers = await prisma.customer.findMany({
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
  });

  for (const customer of rewardCustomers) {
    dependencies.push({
      type: 'reward',
      resourceId: customer.id,
      resourceName: customer.name,
      description: `顧客「${customer.name}」の報酬カードとして使用されています`,
    });
  }

  // 4. アンロック可能コンテンツとして使用されているか（unlockableContent）
  const unlockableContent = await prisma.unlockableContent.findFirst({
    where: {
      unlockItemCardId: cardId,
      deletedAt: null,
    },
    select: {
      id: true,
      contentType: true,
    },
  });

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
