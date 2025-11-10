# Phase 2: カード・顧客管理API実装（Repository Pattern対応）

## フェーズ概要

### 要件名
resource-management-webapp

### 期間・目標
- **期間**: 10営業日（Week 3-4: Day 12-21）
- **総工数**: 80時間
- **タスク数**: 16タスク
- **目標**: 🔵 Repository Pattern実装 + カード管理API・顧客管理APIの実装

### 成果物
- 🔵 **Card Repository実装**（Prisma + In-Memory）
- 🔵 **Customer Repository実装**（Prisma + In-Memory）
- 🔵 **CardService層実装**（Repository使用）
- 🔵 **CustomerService層実装**（Repository使用）
- カード管理API（GET一覧・詳細、POST、PUT、DELETE）
- 顧客管理API（GET一覧・詳細、POST、PUT、DELETE）
- N:Mリレーション処理（顧客報酬カード）
- 依存関係チェック機能
- APIバリデーションスキーマ

---

## 週次計画

### Week 3（Day 12-16）: 🔵 Repository実装 + カード管理API実装
**目標**: Card Repositoryを実装し、カード管理APIの全CRUDエンドポイントを実装する

**成果物**:
- 🔵 Card Repository実装（Prisma + In-Memory）
- 🔵 CardService層実装
- カード一覧・詳細取得エンドポイント（GET /api/cards, GET /api/cards/:id）
- カード作成エンドポイント（POST /api/cards）
- カード更新エンドポイント（PUT /api/cards/:id）
- カード削除エンドポイント（DELETE /api/cards/:id）
- 依存関係チェック機能

### Week 4（Day 17-21）: 🔵 Repository実装 + 顧客管理API実装
**目標**: Customer Repositoryを実装し、顧客管理APIの全CRUDエンドポイントを実装する

**成果物**:
- 🔵 Customer Repository実装（Prisma + In-Memory）
- 🔵 CustomerService層実装
- 顧客一覧・詳細取得エンドポイント（GET /api/customers, GET /api/customers/:id）
- 顧客作成エンドポイント（POST /api/customers）
- 顧客更新エンドポイント（PUT /api/customers/:id）
- 顧客削除エンドポイント（DELETE /api/customers/:id）
- N:Mリレーション処理（報酬カード関連）

---

## 日次タスク

### Day 12（8時間）: 🔵 Card Repository実装（Prisma）

#### ☑ TASK-0015B: 🔵 Card Repository実装（Prisma実装）
- **推定工数**: 8時間
- **タスクタイプ**: TDD
- **要件へのリンク**: 設計書 architecture.md（Repository Pattern）
- **依存タスク**: TASK-0015A

**実装詳細**:
1. **Prisma Card Repository実装**（`src/repositories/prisma/PrismaCardRepository.ts`）
   ```typescript
   import { PrismaClient } from '@prisma/client';
   import { ICardRepository } from '../interfaces/ICardRepository';
   import { Card, CreateCardRequest, UpdateCardRequest } from '../../types/card';
   import { PaginationOptions, PaginationResult } from '../../types/repository';
   import { prisma } from '../../utils/prisma';

   /**
    * 🔵 Prisma Card Repository実装（本番環境用）
    */
   export class PrismaCardRepository implements ICardRepository {
     async create(data: CreateCardRequest): Promise<Card> {
       return await prisma.card.create({
         data: {
           name: data.name,
           description: data.description,
           cardType: data.cardType,
           attribute: data.attribute,
           stabilityValue: data.stabilityValue,
           reactionEffect: data.reactionEffect,
           energyCost: data.energyCost,
           imageUrl: data.imageUrl,
           rarity: data.rarity,
           evolutionFromId: data.evolutionFromId,
         },
       });
     }

     async findById(id: string): Promise<Card | null> {
       return await prisma.card.findUnique({
         where: { id, deletedAt: null },
         include: {
           evolutionFrom: true,
           evolutionTo: true,
           initialDeckStyles: true,
           rewardCustomers: true,
         },
       });
     }

     async findByName(name: string): Promise<Card | null> {
       return await prisma.card.findFirst({
         where: { name, deletedAt: null },
       });
     }

     async findMany(
       options: PaginationOptions,
       filters?: { cardType?: string; search?: string }
     ): Promise<PaginationResult<Card>> {
       const where: any = { deletedAt: null };
       if (filters?.cardType) where.cardType = filters.cardType;
       if (filters?.search) where.name = { contains: filters.search };

       const [items, total] = await Promise.all([
         prisma.card.findMany({
           where,
           skip: (options.page - 1) * options.limit,
           take: options.limit,
           orderBy: { createdAt: 'desc' },
         }),
         prisma.card.count({ where }),
       ]);

       return {
         items,
         total,
         page: options.page,
         limit: options.limit,
         totalPages: Math.ceil(total / options.limit),
       };
     }

     async update(id: string, data: UpdateCardRequest): Promise<Card> {
       return await prisma.card.update({
         where: { id, deletedAt: null },
         data,
       });
     }

     async delete(id: string): Promise<void> {
       await prisma.card.update({
         where: { id, deletedAt: null },
         data: { deletedAt: new Date() },
       });
     }

     async count(filters?: { cardType?: string }): Promise<number> {
       const where: any = { deletedAt: null };
       if (filters?.cardType) where.cardType = filters.cardType;
       return await prisma.card.count({ where });
     }
   }
   ```

2. **型定義**（`src/types/card.ts`）
   - Card型、CreateCardRequest型、UpdateCardRequest型を定義

**完了条件**:
- [ ] 🔵 PrismaCardRepositoryが実装される
- [ ] 🔵 ICardRepositoryインターフェースを実装している
- [ ] 全メソッド（create, findById, findByName, findMany, update, delete, count）が実装される
- [ ] ソフトデリート対応（deletedAt IS NULL）
- [ ] TypeScriptのコンパイルエラーがない

**テスト要件**:
- [ ] 🔵 In-Memory実装を使ったユニットテストで動作確認（Phase 2完了後）
- [ ] create/findById/findMany/update/delete が正しく動作する
- [ ] ソフトデリートが正しく動作する

---

### Day 13（8時間）: 🔵 Card Repository実装（In-Memory）

#### ☑ TASK-0015C: 🔵 Card Repository実装（In-Memory実装）
- **推定工数**: 8時間
- **タスクタイプ**: TDD
- **要件へのリンク**: 設計書 architecture.md（Repository Pattern、テスト戦略）
- **依存タスク**: TASK-0015B

**実装詳細**:
1. **In-Memory Card Repository実装**（`src/repositories/memory/InMemoryCardRepository.ts`）
   ```typescript
   import { ICardRepository } from '../interfaces/ICardRepository';
   import { Card, CreateCardRequest, UpdateCardRequest } from '../../types/card';
   import { PaginationOptions, PaginationResult } from '../../types/repository';
   import { v4 as uuidv4 } from 'uuid';

   /**
    * 🔵 In-Memory Card Repository実装（テスト用）
    * データベース不要でテストが実行可能
    */
   export class InMemoryCardRepository implements ICardRepository {
     private cards: Card[] = [];

     async create(data: CreateCardRequest): Promise<Card> {
       const card: Card = {
         id: uuidv4(),
         ...data,
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

     async findById(id: string): Promise<Card | null> {
       return this.cards.find(c => c.id === id && !c.deletedAt) || null;
     }

     async findByName(name: string): Promise<Card | null> {
       return this.cards.find(c => c.name === name && !c.deletedAt) || null;
     }

     async findMany(
       options: PaginationOptions,
       filters?: { cardType?: string; search?: string }
     ): Promise<PaginationResult<Card>> {
       let filtered = this.cards.filter(c => !c.deletedAt);

       // フィルタリング
       if (filters?.cardType) {
         filtered = filtered.filter(c => c.cardType === filters.cardType);
       }
       if (filters?.search) {
         filtered = filtered.filter(c => c.name.includes(filters.search));
       }

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

     async update(id: string, data: UpdateCardRequest): Promise<Card> {
       const index = this.cards.findIndex(c => c.id === id && !c.deletedAt);
       if (index === -1) throw new Error('Card not found');

       this.cards[index] = {
         ...this.cards[index],
         ...data,
         updatedAt: new Date(),
       };
       return this.cards[index];
     }

     async delete(id: string): Promise<void> {
       const index = this.cards.findIndex(c => c.id === id && !c.deletedAt);
       if (index === -1) throw new Error('Card not found');

       this.cards[index].deletedAt = new Date();
     }

     async count(filters?: { cardType?: string }): Promise<number> {
       let filtered = this.cards.filter(c => !c.deletedAt);
       if (filters?.cardType) {
         filtered = filtered.filter(c => c.cardType === filters.cardType);
       }
       return filtered.length;
     }

     // 🔵 テスト用ヘルパーメソッド
     clear() {
       this.cards = [];
     }
   }
   ```

2. **依存性注入コンテナ更新**（`src/di/container.ts`）
   - PrismaCardRepository、InMemoryCardRepositoryをimport
   - createRepositoryContainer関数を更新してCardRepositoryを返す

**完了条件**:
- [ ] 🔵 InMemoryCardRepositoryが実装される
- [ ] 🔵 ICardRepositoryインターフェースを実装している
- [ ] メモリ内でデータを保持・操作できる
- [ ] clear()メソッドでテストデータをクリアできる
- [ ] 🔵 依存性注入コンテナが更新される
- [ ] TypeScriptのコンパイルエラーがない

**テスト要件**:
- [ ] 🔵 ユニットテストでIn-Memory実装が動作する
- [ ] create/findById/findMany/update/delete が正しく動作する
- [ ] ソフトデリートが正しく動作する
- [ ] clear()でデータがクリアされる

---

### Day 14（8時間）: 🔵 CardService実装 + カード一覧取得API

#### ☑ TASK-0015D: 🔵 CardService層実装
- **推定工数**: 4時間
- **タスクタイプ**: TDD
- **要件へのリンク**: 設計書 architecture.md（Service層）
- **依存タスク**: TASK-0015B, TASK-0015C

**実装詳細**:
1. **CardService実装**（`src/services/cardService.ts`）
   ```typescript
   import { ICardRepository } from '../repositories/interfaces/ICardRepository';
   import { Card, CreateCardRequest, UpdateCardRequest } from '../types/card';
   import { PaginationOptions } from '../types/repository';
   import { RES_002 } from '../constants/errorCodes';

   /**
    * 🔵 Card Service
    * Repository インターフェースに依存（実装には依存しない）
    */
   export class CardService {
     constructor(private readonly cardRepository: ICardRepository) {}

     /**
      * 🔵 カードを作成
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
      */
     async getCards(page: number, limit: number, filters?: any) {
       return await this.cardRepository.findMany({ page, limit }, filters);
     }

     /**
      * 🔵 カード詳細を取得
      */
     async getCardById(id: string): Promise<Card> {
       const card = await this.cardRepository.findById(id);
       if (!card) {
         const error: any = new Error('カードが見つかりません');
         error.code = 'RES_001';
         throw error;
       }
       return card;
     }

     /**
      * 🔵 カードを更新
      */
     async updateCard(id: string, data: UpdateCardRequest): Promise<Card> {
       // 🔵 名前の重複チェック
       if (data.name) {
         const existing = await this.cardRepository.findByName(data.name);
         if (existing && existing.id !== id) {
           const error: any = new Error('同名のカードが既に存在します');
           error.code = RES_002;
           throw error;
         }
       }

       return await this.cardRepository.update(id, data);
     }

     /**
      * 🔵 カードを削除
      */
     async deleteCard(id: string): Promise<void> {
       await this.cardRepository.delete(id);
     }
   }
   ```

**完了条件**:
- [ ] 🔵 CardServiceが実装される
- [ ] 🔵 コンストラクタでICardRepositoryを注入する
- [ ] ビジネスロジック（重複チェック等）が実装される
- [ ] エラーコード定数を使用する
- [ ] TypeScriptのコンパイルエラーがない

**テスト要件**:
- [ ] 🔵 In-Memory Repositoryを使ったユニットテストが動作する
- [ ] 重複チェックが正しく動作する
- [ ] エラー時に適切なエラーコードが返る

---

#### ☑ TASK-0016: 🔵 カード一覧取得API実装（GET /api/cards）
- **推定工数**: 4時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-012, WRREQ-013, WRREQ-016
- **依存タスク**: TASK-0015D

**実装詳細**:
1. **Controller実装**（`src/controllers/cardController.ts`）
   ```typescript
   import { Context } from 'hono';
   import { CardService } from '../services/cardService';
   import { IRepositoryContainer } from '../types';

   /**
    * 🔵 Card Controller
    * Repository コンテナからCardServiceを生成
    */
   export class CardController {
     /**
      * 🔵 カード一覧取得
      */
     static async list(c: Context) {
       // 🔵 Repository コンテナを取得
       const repositories = c.get('repositories') as IRepositoryContainer;

       // 🔵 Service を初期化（Repositoryを注入）
       const cardService = new CardService(repositories.cardRepository);

       try {
         const page = Number(c.req.query('page')) || 1;
         const limit = Number(c.req.query('limit')) || 20;
         const cardType = c.req.query('cardType');
         const search = c.req.query('search');

         const result = await cardService.getCards(page, limit, { cardType, search });

         return c.json({
           data: result,
         });
       } catch (error) {
         return c.json({
           error: {
             code: error.code || 'SYS_001',
             message: error.message,
           },
         }, 500);
       }
     }
   }
   ```

2. **ルート定義**（`src/routes/cards.ts`）
   - GET /api/cards エンドポイント実装

3. **型定義**（`src/types/card.ts`）
   - CardType, CardRarity, listCardsQueryスキーマ定義

**完了条件**:
- [ ] GET /api/cards が動作する
- [ ] 🔵 Repository コンテナからCardServiceを生成する
- [ ] ページネーション（page, limit）が動作する
- [ ] フィルタリング（cardType, search）が動作する
- [ ] レスポンスに total, page, limit, totalPages が含まれる
- [ ] 削除済みカード（deletedAt != NULL）が除外される

**テスト要件**: パラメータなしで全カード取得、cardType/searchフィルタリング、ページネーション、削除済みカード除外を確認

---

### Day 15（8時間）: カード詳細取得API・作成API実装

#### ☑ TASK-0017: 🔵 カード詳細取得API実装（GET /api/cards/:id）
- **推定工数**: 4時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-012, WRREQ-013, WRREQ-015, WRREQ-016
- **依存タスク**: TASK-0016

**実装詳細**:
1. GET /api/cards/:id エンドポイント実装
2. 🔵 CardController.getById実装（CardService使用）
3. UUID検証ミドルウェア適用
4. 🔵 エラー時にRES_001コード返却

**完了条件**:
- [ ] GET /api/cards/:id が動作する
- [ ] 🔵 CardServiceを使用してカード取得する
- [ ] 存在するIDで詳細データ取得できる
- [ ] 存在しないIDで404エラー + 🔵 RES_001コードが返る
- [ ] 不正なUUID形式で400エラーが返る
- [ ] リレーションデータ（evolutionFrom, evolutionTo等）が含まれる

**テスト要件**: 正常UUID詳細取得、不正/存在しないUUIDで400/404エラー、削除済みカード除外、リレーションデータ含有を確認

---

#### ☑ TASK-0018: 🔵 カード作成API実装（POST /api/cards）
- **推定工数**: 4時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-012, WRREQ-013, WRREQ-014, WRREQ-017, WRREQ-020
- **依存タスク**: TASK-0017

**実装詳細**:
1. POST /api/cards エンドポイント実装
2. 🔵 CardController.create実装（CardService使用）
3. バリデーションミドルウェア適用（createCardSchema）
4. 🔵 重複エラー時にRES_002コード返却

**完了条件**:
- [ ] POST /api/cards が動作する
- [ ] 🔵 CardService.createCardを使用する
- [ ] 正常なデータでカード作成できる
- [ ] バリデーションエラー時に400エラー + 🔵 VALID_001コードが返る
- [ ] 同名カード存在時に409エラー + 🔵 RES_002コードが返る
- [ ] 201 Createdステータスが返る

**テスト要件**: 必須/全フィールド作成、同名カード409エラー、energyCost/stabilityValue範囲外バリデーション、存在しないevolutionFromIdで400エラーを確認

---

### Day 16（8時間）: カード更新API・削除API実装

#### ☑ TASK-0019: 🔵 カード更新API実装（PUT /api/cards/:id）
- **推定工数**: 4時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-012, WRREQ-013, WRREQ-017
- **依存タスク**: TASK-0018

**実装詳細**:
1. PUT /api/cards/:id エンドポイント実装（部分更新対応）
2. 🔵 CardController.update実装（CardService使用）
3. 🔵 重複チェックはCardService内で実施
4. 🔵 エラー時にRES_001/RES_002コード返却

**完了条件**:
- [ ] PUT /api/cards/:id が動作する
- [ ] 🔵 CardService.updateCardを使用する
- [ ] 部分更新（一部フィールドのみ）が動作する
- [ ] 全フィールド更新が動作する
- [ ] 存在しないIDで404エラー + 🔵 RES_001コードが返る
- [ ] 同名カードに変更時に409エラー + 🔵 RES_002コードが返る

**テスト要件**: 1フィールド/複数/全フィールド部分更新、存在しないIDで404、同名変更時409、バリデーションエラーを確認

---

#### ☑ TASK-0020: 依存関係チェック機能実装
- **推定工数**: 2時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-019
- **依存タスク**: TASK-0013

**実装詳細**:
1. `src/utils/dependencyCheck.ts`作成
   - checkCardDependencies関数実装
   - 進化元、初期デッキ、報酬カード、アンロック可能コンテンツの依存関係をチェック

2. 依存関係レスポンス型定義

**完了条件**:
- [ ] checkCardDependencies関数が動作する
- [ ] 依存関係を検出できる
- [ ] 依存関係がない場合、空配列を返す

**テスト要件**: 進化元/初期デッキ/複数依存関係の検出、依存なし時の空配列を確認

---

#### ☑ TASK-0021: 🔵 カード削除API実装（DELETE /api/cards/:id）
- **推定工数**: 2時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-017, WRREQ-019
- **依存タスク**: TASK-0020

**実装詳細**:
1. DELETE /api/cards/:id エンドポイント実装
2. 🔵 CardController.delete実装（CardService + checkCardDependencies使用）
3. 🔵 依存関係エラー時にRES_003コード返却

**完了条件**:
- [ ] DELETE /api/cards/:id が動作する
- [ ] 🔵 CardServiceを使用する
- [ ] 依存関係がない場合、削除成功（204）
- [ ] 依存関係がある場合、409エラー + 🔵 RES_003コードが返る
- [ ] エラーレスポンスに依存関係詳細が含まれる
- [ ] ソフトデリート（deletedAt設定）が動作する

**テスト要件**: 依存なしカード削除成功、削除後一覧/詳細で非表示、進化元/初期デッキ使用中で409エラーを確認

---

### Day 17（8時間）: 🔵 Customer Repository実装（Prisma + In-Memory）

#### ☑ TASK-0021A: 🔵 Customer Repository実装（Prisma実装）
- **推定工数**: 4時間
- **タスクタイプ**: TDD
- **要件へのリンク**: 設計書 architecture.md（Repository Pattern）
- **依存タスク**: TASK-0015C

**実装詳細**:
1. **Prisma Customer Repository実装**（`src/repositories/prisma/PrismaCustomerRepository.ts`）
   - ICustomerRepositoryインターフェースを実装
   - create/findById/findMany/update/delete/count メソッド実装
   - N:Mリレーション処理（rewardCards）
   - ソフトデリート対応

2. **ICustomerRepositoryインターフェース定義**（`src/repositories/interfaces/ICustomerRepository.ts`）

**完了条件**:
- [ ] 🔵 PrismaCustomerRepositoryが実装される
- [ ] 🔵 ICustomerRepositoryインターフェースを実装している
- [ ] N:Mリレーション（rewardCards）が正しく処理される
- [ ] ソフトデリート対応
- [ ] TypeScriptのコンパイルエラーがない

**テスト要件**: Repositoryメソッドが正しく動作する、N:Mリレーションが正しく処理される

---

#### ☑ TASK-0021B: 🔵 Customer Repository実装（In-Memory実装）
- **推定工数**: 4時間
- **タスクタイプ**: TDD
- **要件へのリンク**: 設計書 architecture.md（Repository Pattern、テスト戦略）
- **依存タスク**: TASK-0021A

**実装詳細**:
1. **In-Memory Customer Repository実装**（`src/repositories/memory/InMemoryCustomerRepository.ts`）
   - ICustomerRepositoryインターフェースを実装
   - メモリ内でデータ保持・操作
   - N:Mリレーション処理をシミュレート
   - clear()メソッド実装

2. **依存性注入コンテナ更新**（`src/di/container.ts`）
   - CustomerRepositoryを追加

**完了条件**:
- [ ] 🔵 InMemoryCustomerRepositoryが実装される
- [ ] 🔵 ICustomerRepositoryインターフェースを実装している
- [ ] N:Mリレーションをメモリ内でシミュレートできる
- [ ] clear()でデータクリアできる
- [ ] 🔵 依存性注入コンテナが更新される

**テスト要件**: ユニットテストでIn-Memory実装が動作する、N:Mリレーションが正しく処理される

---

### Day 18（8時間）: 🔵 CustomerService実装 + 顧客一覧取得API

#### ☑ TASK-0021C: 🔵 CustomerService層実装
- **推定工数**: 4時間
- **タスクタイプ**: TDD
- **要件へのリンク**: 設計書 architecture.md（Service層）
- **依存タスク**: TASK-0021A, TASK-0021B

**実装詳細**:
1. **CustomerService実装**（`src/services/customerService.ts`）
   - コンストラクタでICustomerRepositoryを注入
   - createCustomer/getCustomers/getCustomerById/updateCustomer/deleteCustomer メソッド実装
   - ビジネスロジック（バリデーション、エラーハンドリング）
   - エラーコード定数を使用

**完了条件**:
- [ ] 🔵 CustomerServiceが実装される
- [ ] 🔵 ICustomerRepositoryを注入する
- [ ] ビジネスロジックが実装される
- [ ] エラーコード定数を使用する

**テスト要件**: In-Memory Repositoryを使ったユニットテストが動作する

---

#### ☑ TASK-0022: 🔵 顧客一覧取得API実装（GET /api/customers）
- **推定工数**: 4時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-021, WRREQ-022, WRREQ-025
- **依存タスク**: TASK-0021C

**実装詳細**:
1. **CustomerController実装**（`src/controllers/customerController.ts`）
   - Repository コンテナからCustomerServiceを生成
   - list/getById/create/update/delete メソッド実装

2. **ルート定義**（`src/routes/customers.ts`）
   - GET /api/customers エンドポイント実装

**完了条件**:
- [ ] GET /api/customers が動作する
- [ ] 🔵 Repository コンテナからCustomerServiceを生成する
- [ ] ページネーション・フィルタリングが動作する
- [ ] 削除済み顧客が除外される

**テスト要件**: パラメータなしで全顧客取得、difficulty/searchフィルタリング、ページネーション、削除済み顧客除外を確認

---

### Day 19（8時間）: 顧客詳細取得API・作成API実装

#### ☑ TASK-0023: 🔵 顧客詳細取得API実装（GET /api/customers/:id）
- **推定工数**: 4時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-021, WRREQ-022, WRREQ-023, WRREQ-024, WRREQ-025
- **依存タスク**: TASK-0022

**実装詳細**:
1. GET /api/customers/:id エンドポイント実装
2. 🔵 CustomerController.getById実装（CustomerService使用）
3. 🔵 エラー時にRES_001コード返却

**完了条件**:
- [ ] GET /api/customers/:id が動作する
- [ ] 🔵 CustomerServiceを使用する
- [ ] リレーションデータ（rewardCards）が含まれる
- [ ] 存在しないIDで404エラー + 🔵 RES_001コードが返る

**テスト要件**: 正常UUID詳細取得、不正/存在しないUUIDで400/404エラー、rewardCards配列含有を確認

---

#### ☑ TASK-0024: 🔵 顧客作成API実装（POST /api/customers）
- **推定工数**: 4時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-021, WRREQ-022, WRREQ-023, WRREQ-024, WRREQ-026
- **依存タスク**: TASK-0023

**実装詳細**:
1. POST /api/customers エンドポイント実装
2. 🔵 CustomerController.create実装（CustomerService使用）
3. N:Mリレーション処理（rewardCardIds）
4. 🔵 バリデーションエラー時にVALID_001コード返却

**完了条件**:
- [ ] POST /api/customers が動作する
- [ ] 🔵 CustomerServiceを使用する
- [ ] rewardCardIds指定でN:M関連付けできる
- [ ] バリデーションエラー時に400エラー + 🔵 VALID_001コードが返る
- [ ] 存在しないrewardCardIdで400エラーが返る

**テスト要件**: 必須フィールド作成、rewardCardIds関連付け、difficulty範囲外バリデーション、存在しないIDで400エラー、作成後rewardCards取得を確認

---

### Day 20（8時間）: 顧客更新API・削除API実装

#### ☑ TASK-0025: 🔵 顧客更新API実装（PUT /api/customers/:id）
- **推定工数**: 4時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-021, WRREQ-022, WRREQ-024, WRREQ-026
- **依存タスク**: TASK-0024

**実装詳細**:
1. PUT /api/customers/:id エンドポイント実装
2. 🔵 CustomerController.update実装（CustomerService使用）
3. N:Mリレーション更新処理（rewardCardIds）
4. 🔵 エラー時にRES_001コード返却

**完了条件**:
- [ ] PUT /api/customers/:id が動作する
- [ ] 🔵 CustomerServiceを使用する
- [ ] rewardCardIds更新が動作する
- [ ] 存在しないIDで404エラー + 🔵 RES_001コードが返る

**テスト要件**: 1フィールド更新、rewardCardIds置換/空配列で全削除、存在しないIDで404/400エラーを確認

---

#### ☑ TASK-0026: 🔵 顧客削除API実装（DELETE /api/customers/:id）
- **推定工数**: 4時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-026
- **依存タスク**: TASK-0025

**実装詳細**:
1. DELETE /api/customers/:id エンドポイント実装
2. 🔵 CustomerController.delete実装（CustomerService使用）
3. N:M関連も削除（中間テーブル）

**完了条件**:
- [ ] DELETE /api/customers/:id が動作する
- [ ] 🔵 CustomerServiceを使用する
- [ ] 削除成功時に204ステータスが返る
- [ ] ソフトデリート（deletedAt設定）が動作する

**テスト要件**: 顧客削除成功、削除後一覧/詳細で非表示、N:M関連も削除を確認

---

### Day 21（8時間）: Phase 2統合テスト・ドキュメント整備

#### ☑ TASK-0027: 🔵 Phase 2統合テスト・ドキュメント整備
- **推定工数**: 8時間
- **タスクタイプ**: DIRECT
- **要件へのリンク**: 全API要件、設計書 architecture.md
- **依存タスク**: TASK-0015B〜0026

**実装詳細**:
1. **🔵 Repository Patternテスト実施**
   - In-Memory Repositoryを使ったユニットテストが全て通ることを確認
   - Prisma Repositoryを使った統合テストが全て通ることを確認
   - 環境変数REPOSITORY_TYPEの切り替えが正しく動作することを確認

2. **APIエンドポイント統合テスト実施**（Postman/Thunder Client）
   - カード管理フロー: 一覧→作成→詳細→更新→削除（依存チェック含む）
   - 顧客管理フロー: 一覧→作成（N:M関連）→詳細→更新（関連変更）→削除

3. **データ確認**（Prisma Studio）
   - カード/顧客テーブル、中間テーブル、deletedAtフィールド

4. **🔵 エラーコード確認**
   - 全エラーレスポンスに体系的エラーコードが含まれることを確認
   - VALID_001, RES_001, RES_002, RES_003, DB_003, SYS_001等

5. **API仕様書確認**（`docs/design/resource-management-webapp/api-endpoints.md`）

6. **🔵 README.md更新**（Phase 2完了内容、Repository Pattern説明、APIエンドポイント一覧）

**完了条件**:
- [x] 🔵 In-Memory Repositoryを使ったユニットテストが全て通る
- [x] 🔵 Prisma Repositoryを使った統合テストが全て通る
- [x] 🔵 環境変数REPOSITORY_TYPEの切り替えが動作する
- [x] 全APIエンドポイントが正常に動作する
- [x] テストシナリオが全て通る
- [x] Prisma Studioでデータが正しく保存される
- [x] ソフトデリートが正しく動作する
- [x] N:Mリレーション（rewardCards）が正しく動作する
- [x] 🔵 全エラーレスポンスに体系的エラーコードが含まれる
- [x] README.mdが更新されている（🔵 Repository Pattern説明含む）

---

## Phase 2 完了条件

### 必須条件
- [x] 🔵 Card Repository実装（Prisma + In-Memory）が完了する
- [x] 🔵 Customer Repository実装（Prisma + In-Memory）が完了する
- [x] 🔵 CardService層が実装される
- [x] 🔵 CustomerService層が実装される
- [x] カード管理API（GET一覧・詳細、POST、PUT、DELETE）が動作する
- [x] 顧客管理API（GET一覧・詳細、POST、PUT、DELETE）が動作する
- [x] ページネーション・フィルタリングが動作する
- [x] バリデーションエラーが正しく返る（🔵 VALID_001コード）
- [x] 依存関係チェックが動作する（カード削除時、🔵 RES_003コード）
- [x] N:Mリレーション（顧客報酬カード）が動作する
- [x] ソフトデリートが動作する
- [x] エラーハンドリングが正しく動作する（🔵 体系的エラーコード）

### 品質基準
- [x] 🔵 In-Memory Repositoryを使ったユニットテストが通る
- [x] 全APIエンドポイントのテストが通る
- [x] TypeScriptのコンパイルエラーがない
- [x] ESLint・Prettierでコード整形されている
- [x] API仕様書と実装が一致している

### マイルストーン
- [x] **M2: バックエンドAPI完成** - Phase 2完了時点で達成

---

## 備考

### 🔵 Repository Pattern実装パターン

**依存性注入**:
```typescript
// Controller内でServiceを生成
const repositories = c.get('repositories') as IRepositoryContainer;
const cardService = new CardService(repositories.cardRepository);
```

**テスト時の切り替え**:
```typescript
// ユニットテスト: In-Memory Repository使用
const cardRepository = new InMemoryCardRepository();
const cardService = new CardService(cardRepository);

// 統合テスト: Prisma Repository使用
const cardRepository = new PrismaCardRepository();
const cardService = new CardService(cardRepository);
```

### N:Mリレーション処理パターン
- **作成時**: `rewardCards: { connect: rewardCardIds.map(id => ({ id })) }`
- **更新時**: `rewardCards: { set: rewardCardIds.map(id => ({ id })) }`

### 依存関係チェックパターン
`checkCardDependencies(cardId)`で依存関係を確認し、存在する場合は409エラー + 🔵 RES_003コードを返す

---

## 変更履歴

| 日付 | バージョン | 変更内容 |
|------|----------|---------|
| 2025-11-09 | 1.0 | 初版作成。12タスク、64時間 |
| 2025-11-10 | 2.0 | 🔵 Repository Pattern対応。Card/Customer Repository実装（Prisma + In-Memory）、Service層追加、体系的エラーコード対応。16タスク、80時間、10日間 |
