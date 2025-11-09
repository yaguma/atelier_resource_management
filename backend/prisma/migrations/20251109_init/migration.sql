-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('MATERIAL', 'OPERATION', 'CATALYST', 'KNOWLEDGE', 'SPECIAL', 'ARTIFACT');

-- CreateEnum
CREATE TYPE "CardRarity" AS ENUM ('COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY');

-- CreateEnum
CREATE TYPE "NodeType" AS ENUM ('REQUEST', 'MERCHANT', 'EXPERIMENT', 'MONSTER', 'BOSS_REQUEST');

-- CreateEnum
CREATE TYPE "MetaCurrencyType" AS ENUM ('FAME', 'KNOWLEDGE');

-- CreateEnum
CREATE TYPE "UnlockableContentType" AS ENUM ('CARD', 'CUSTOMER', 'MATERIAL');

-- CreateEnum
CREATE TYPE "GameBalanceCategory" AS ENUM ('ENERGY', 'HAND', 'STABILITY', 'PLAYTIME');

-- CreateTable
CREATE TABLE "cards" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "deletedAt" TIMESTAMPTZ(3),
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(1000) NOT NULL,
    "cardType" "CardType" NOT NULL,
    "attribute" JSONB NOT NULL,
    "stabilityValue" INTEGER NOT NULL,
    "reactionEffect" VARCHAR(500),
    "energyCost" INTEGER NOT NULL,
    "imageUrl" VARCHAR(500),
    "rarity" "CardRarity",
    "evolutionFromId" UUID,

    CONSTRAINT "cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "deletedAt" TIMESTAMPTZ(3),
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(1000) NOT NULL,
    "customerType" VARCHAR(50) NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "requiredAttribute" JSONB NOT NULL,
    "qualityCondition" INTEGER NOT NULL,
    "stabilityCondition" INTEGER NOT NULL,
    "rewardFame" INTEGER NOT NULL,
    "rewardKnowledge" INTEGER NOT NULL,
    "portraitUrl" VARCHAR(500),

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alchemy_styles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "deletedAt" TIMESTAMPTZ(3),
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(1000) NOT NULL,
    "characteristics" VARCHAR(500) NOT NULL,
    "iconUrl" VARCHAR(500),

    CONSTRAINT "alchemy_styles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "map_nodes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "deletedAt" TIMESTAMPTZ(3),
    "name" VARCHAR(100) NOT NULL,
    "nodeType" "NodeType" NOT NULL,
    "description" VARCHAR(1000) NOT NULL,
    "eventContent" JSONB NOT NULL,
    "rewards" JSONB,
    "iconUrl" VARCHAR(500),
    "customerId" UUID,
    "mapTemplateId" UUID,
    "position" JSONB,

    CONSTRAINT "map_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "map_templates" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "deletedAt" TIMESTAMPTZ(3),
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(1000) NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "nodeCount" INTEGER NOT NULL,
    "iconUrl" VARCHAR(500),

    CONSTRAINT "map_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meta_currencies" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "deletedAt" TIMESTAMPTZ(3),
    "currencyType" "MetaCurrencyType" NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "iconUrl" VARCHAR(500),

    CONSTRAINT "meta_currencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unlockable_contents" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "deletedAt" TIMESTAMPTZ(3),
    "contentType" "UnlockableContentType" NOT NULL,
    "requiredFame" INTEGER NOT NULL DEFAULT 0,
    "requiredKnowledge" INTEGER NOT NULL DEFAULT 0,
    "cardId" UUID,
    "customerId" UUID,

    CONSTRAINT "unlockable_contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_balance" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "deletedAt" TIMESTAMPTZ(3),
    "settingKey" VARCHAR(100) NOT NULL,
    "settingValue" VARCHAR(500) NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "category" "GameBalanceCategory" NOT NULL,

    CONSTRAINT "game_balance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AlchemyStyleInitialDeck" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_CustomerRewardCards" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "cards_name_key" ON "cards"("name");

-- CreateIndex
CREATE INDEX "cards_cardType_idx" ON "cards"("cardType");

-- CreateIndex
CREATE INDEX "cards_energyCost_idx" ON "cards"("energyCost");

-- CreateIndex
CREATE INDEX "cards_deletedAt_idx" ON "cards"("deletedAt");

-- CreateIndex
CREATE INDEX "customers_customerType_idx" ON "customers"("customerType");

-- CreateIndex
CREATE INDEX "customers_difficulty_idx" ON "customers"("difficulty");

-- CreateIndex
CREATE INDEX "customers_deletedAt_idx" ON "customers"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "alchemy_styles_name_key" ON "alchemy_styles"("name");

-- CreateIndex
CREATE INDEX "alchemy_styles_deletedAt_idx" ON "alchemy_styles"("deletedAt");

-- CreateIndex
CREATE INDEX "map_nodes_nodeType_idx" ON "map_nodes"("nodeType");

-- CreateIndex
CREATE INDEX "map_nodes_customerId_idx" ON "map_nodes"("customerId");

-- CreateIndex
CREATE INDEX "map_nodes_mapTemplateId_idx" ON "map_nodes"("mapTemplateId");

-- CreateIndex
CREATE INDEX "map_nodes_deletedAt_idx" ON "map_nodes"("deletedAt");

-- CreateIndex
CREATE INDEX "map_templates_difficulty_idx" ON "map_templates"("difficulty");

-- CreateIndex
CREATE INDEX "map_templates_deletedAt_idx" ON "map_templates"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "meta_currencies_currencyType_key" ON "meta_currencies"("currencyType");

-- CreateIndex
CREATE INDEX "meta_currencies_deletedAt_idx" ON "meta_currencies"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "unlockable_contents_cardId_key" ON "unlockable_contents"("cardId");

-- CreateIndex
CREATE UNIQUE INDEX "unlockable_contents_customerId_key" ON "unlockable_contents"("customerId");

-- CreateIndex
CREATE INDEX "unlockable_contents_contentType_idx" ON "unlockable_contents"("contentType");

-- CreateIndex
CREATE INDEX "unlockable_contents_deletedAt_idx" ON "unlockable_contents"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "game_balance_settingKey_key" ON "game_balance"("settingKey");

-- CreateIndex
CREATE INDEX "game_balance_category_idx" ON "game_balance"("category");

-- CreateIndex
CREATE INDEX "game_balance_deletedAt_idx" ON "game_balance"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "_AlchemyStyleInitialDeck_AB_unique" ON "_AlchemyStyleInitialDeck"("A", "B");

-- CreateIndex
CREATE INDEX "_AlchemyStyleInitialDeck_B_index" ON "_AlchemyStyleInitialDeck"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CustomerRewardCards_AB_unique" ON "_CustomerRewardCards"("A", "B");

-- CreateIndex
CREATE INDEX "_CustomerRewardCards_B_index" ON "_CustomerRewardCards"("B");

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_evolutionFromId_fkey" FOREIGN KEY ("evolutionFromId") REFERENCES "cards"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "map_nodes" ADD CONSTRAINT "map_nodes_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "map_nodes" ADD CONSTRAINT "map_nodes_mapTemplateId_fkey" FOREIGN KEY ("mapTemplateId") REFERENCES "map_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unlockable_contents" ADD CONSTRAINT "unlockable_contents_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unlockable_contents" ADD CONSTRAINT "unlockable_contents_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AlchemyStyleInitialDeck" ADD CONSTRAINT "_AlchemyStyleInitialDeck_A_fkey" FOREIGN KEY ("A") REFERENCES "alchemy_styles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AlchemyStyleInitialDeck" ADD CONSTRAINT "_AlchemyStyleInitialDeck_B_fkey" FOREIGN KEY ("B") REFERENCES "cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CustomerRewardCards" ADD CONSTRAINT "_CustomerRewardCards_A_fkey" FOREIGN KEY ("A") REFERENCES "cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CustomerRewardCards" ADD CONSTRAINT "_CustomerRewardCards_B_fkey" FOREIGN KEY ("B") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
