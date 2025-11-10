import { describe, it, expect, beforeEach } from 'vitest';
import { Hono } from 'hono';
import { CustomerController } from '../../controllers/customerController';
import { InMemoryCustomerRepository } from '../../repositories/memory/InMemoryCustomerRepository';
import { InMemoryCardRepository } from '../../repositories/memory/InMemoryCardRepository';
import { IRepositoryContainer } from '../../di/container';
import { RES_001, VALID_001 } from '../../constants/errorCodes';
import { CardType, CardRarity } from '../../types/card';
import { v4 as uuidv4 } from 'uuid';

/**
 * 🔵 CustomerController.getById テスト
 * TASK-0023: 顧客詳細取得API実装（GET /api/customers/:id）
 */
describe('CustomerController.getById', () => {
  let app: Hono;
  let customerRepository: InMemoryCustomerRepository;
  let testCustomerId: string;

  beforeEach(async () => {
    // 🔵 テスト用Honoアプリケーションをセットアップ
    app = new Hono();

    // 🔵 In-Memory Repositoryを初期化
    customerRepository = new InMemoryCustomerRepository();

    // 🔵 Repository コンテナをモック
    const repositories: IRepositoryContainer = {
      customerRepository,
      cardRepository: {} as any, // 今回は使用しない
    };

    // 🔵 ミドルウェアでリポジトリコンテナを注入
    app.use('*', async (c, next) => {
      c.set('repositories', repositories);
      await next();
    });

    // 🔵 GET /api/customers/:id ルートを設定
    app.get('/api/customers/:id', CustomerController.getById);

    // 🔵 テスト用の顧客データを作成
    const customer = await customerRepository.create({
      name: 'テスト顧客',
      description: 'テスト用の顧客です',
      customerType: 'regular',
      difficulty: 3,
      requiredAttribute: { fire: 50 },
      qualityCondition: 50,
      stabilityCondition: 30,
      rewardFame: 100,
      rewardKnowledge: 50,
      portraitUrl: 'https://example.com/portrait.png',
      rewardCardIds: ['card-id-1', 'card-id-2'],
    });

    testCustomerId = customer.id;
  });

  it('正常なUUIDで顧客詳細を取得できる', async () => {
    const req = new Request(`http://localhost/api/customers/${testCustomerId}`, {
      method: 'GET',
    });

    const res = await app.fetch(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data).toBeDefined();
    expect(json.data.id).toBe(testCustomerId);
    expect(json.data.name).toBe('テスト顧客');
    expect(json.data.description).toBe('テスト用の顧客です');
    expect(json.data.customerType).toBe('regular');
    expect(json.data.difficulty).toBe(3);
    expect(json.data.requiredAttribute).toEqual({ fire: 50 });
    expect(json.data.qualityCondition).toBe(50);
    expect(json.data.stabilityCondition).toBe(30);
    expect(json.data.rewardFame).toBe(100);
    expect(json.data.rewardKnowledge).toBe(50);
    expect(json.data.portraitUrl).toBe('https://example.com/portrait.png');
  });

  it('rewardCards配列が含まれる', async () => {
    const req = new Request(`http://localhost/api/customers/${testCustomerId}`, {
      method: 'GET',
    });

    const res = await app.fetch(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data.rewardCards).toBeDefined();
    expect(Array.isArray(json.data.rewardCards)).toBe(true);
    expect(json.data.rewardCards).toHaveLength(2);
    expect(json.data.rewardCards[0].id).toBe('card-id-1');
    expect(json.data.rewardCards[1].id).toBe('card-id-2');
  });

  it('存在しないUUIDで404エラーとRES_001コードが返る', async () => {
    const nonExistentId = uuidv4();
    const req = new Request(`http://localhost/api/customers/${nonExistentId}`, {
      method: 'GET',
    });

    const res = await app.fetch(req);
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBeDefined();
    expect(json.error.code).toBe(RES_001);
    expect(json.error.message).toBeDefined();
  });

  it('削除済みの顧客は取得できない（404エラー）', async () => {
    // 🔵 顧客を削除
    await customerRepository.delete(testCustomerId);

    const req = new Request(`http://localhost/api/customers/${testCustomerId}`, {
      method: 'GET',
    });

    const res = await app.fetch(req);
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBeDefined();
    expect(json.error.code).toBe(RES_001);
  });

  it('rewardCardsが空の顧客も正しく取得できる', async () => {
    // 🔵 rewardCardsなしの顧客を作成
    const customer = await customerRepository.create({
      name: 'カードなし顧客',
      description: '報酬カードがない顧客',
      customerType: 'special',
      difficulty: 1,
      requiredAttribute: { water: 30 },
      qualityCondition: 20,
      stabilityCondition: 10,
      rewardFame: 50,
      rewardKnowledge: 25,
      rewardCardIds: [],
    });

    const req = new Request(`http://localhost/api/customers/${customer.id}`, {
      method: 'GET',
    });

    const res = await app.fetch(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data.id).toBe(customer.id);
    expect(json.data.rewardCards).toBeDefined();
    expect(Array.isArray(json.data.rewardCards)).toBe(true);
    expect(json.data.rewardCards).toHaveLength(0);
  });
});

/**
 * 🔵 CustomerController.create テスト
 * TASK-0024: 顧客作成API実装（POST /api/customers）
 */
describe('CustomerController.create', () => {
  let app: Hono;
  let customerRepository: InMemoryCustomerRepository;
  let cardRepository: InMemoryCardRepository;
  let testCardId1: string;
  let testCardId2: string;

  beforeEach(async () => {
    // 🔵 テスト用Honoアプリケーションをセットアップ
    app = new Hono();

    // 🔵 In-Memory Repositoryを初期化
    customerRepository = new InMemoryCustomerRepository();
    cardRepository = new InMemoryCardRepository();

    // 🔵 テスト用のカードデータを作成
    const card1 = await cardRepository.create({
      name: 'テストカード1',
      description: 'テスト用カード1',
      cardType: CardType.MATERIAL,
      attribute: { fire: 70 },
      stabilityValue: 50,
      reactionEffect: null,
      energyCost: 10,
      imageUrl: 'https://example.com/card1.png',
      rarity: CardRarity.COMMON,
    });
    testCardId1 = card1.id;

    const card2 = await cardRepository.create({
      name: 'テストカード2',
      description: 'テスト用カード2',
      cardType: CardType.MATERIAL,
      attribute: { water: 50 },
      stabilityValue: 30,
      reactionEffect: null,
      energyCost: 5,
      imageUrl: 'https://example.com/card2.png',
      rarity: CardRarity.UNCOMMON,
    });
    testCardId2 = card2.id;

    // 🔵 Repository コンテナをモック
    const repositories: IRepositoryContainer = {
      customerRepository,
      cardRepository,
    };

    // 🔵 ミドルウェアでリポジトリコンテナを注入
    app.use('*', async (c, next) => {
      c.set('repositories', repositories);
      await next();
    });

    // 🔵 POST /api/customers ルートを設定
    app.post('/api/customers', CustomerController.create);
  });

  it('必須フィールドで顧客を作成できる', async () => {
    const customerData = {
      name: 'テスト顧客',
      description: 'テスト用の顧客です',
      customerType: 'regular',
      difficulty: 3,
      requiredAttribute: { fire: 50 },
      qualityCondition: 50,
      stabilityCondition: 30,
      rewardFame: 100,
      rewardKnowledge: 50,
    };

    const req = new Request('http://localhost/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData),
    });

    const res = await app.fetch(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.data).toBeDefined();
    expect(json.data.id).toBeDefined();
    expect(json.data.name).toBe('テスト顧客');
    expect(json.data.description).toBe('テスト用の顧客です');
    expect(json.data.customerType).toBe('regular');
    expect(json.data.difficulty).toBe(3);
    expect(json.data.qualityCondition).toBe(50);
    expect(json.data.stabilityCondition).toBe(30);
    expect(json.data.rewardFame).toBe(100);
    expect(json.data.rewardKnowledge).toBe(50);
  });

  it('rewardCardIdsでN:M関連付けできる', async () => {
    const customerData = {
      name: 'カード報酬顧客',
      description: 'カード報酬を持つ顧客',
      customerType: 'special',
      difficulty: 4,
      requiredAttribute: { fire: 70 },
      qualityCondition: 80,
      stabilityCondition: 60,
      rewardFame: 200,
      rewardKnowledge: 100,
      rewardCardIds: [testCardId1, testCardId2],
    };

    const req = new Request('http://localhost/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData),
    });

    const res = await app.fetch(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.data).toBeDefined();
    expect(json.data.rewardCards).toBeDefined();
    expect(Array.isArray(json.data.rewardCards)).toBe(true);
    expect(json.data.rewardCards).toHaveLength(2);
    expect(json.data.rewardCards[0].id).toBe(testCardId1);
    expect(json.data.rewardCards[1].id).toBe(testCardId2);
  });

  it('difficulty範囲外でバリデーションエラー（0以下）', async () => {
    const customerData = {
      name: 'テスト顧客',
      description: 'テスト用の顧客です',
      customerType: 'regular',
      difficulty: 0, // 範囲外
      requiredAttribute: { fire: 50 },
      qualityCondition: 50,
      stabilityCondition: 30,
      rewardFame: 100,
      rewardKnowledge: 50,
    };

    const req = new Request('http://localhost/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData),
    });

    const res = await app.fetch(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBeDefined();
    expect(json.error.code).toBe(VALID_001);
  });

  it('difficulty範囲外でバリデーションエラー（6以上）', async () => {
    const customerData = {
      name: 'テスト顧客',
      description: 'テスト用の顧客です',
      customerType: 'regular',
      difficulty: 6, // 範囲外
      requiredAttribute: { fire: 50 },
      qualityCondition: 50,
      stabilityCondition: 30,
      rewardFame: 100,
      rewardKnowledge: 50,
    };

    const req = new Request('http://localhost/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData),
    });

    const res = await app.fetch(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBeDefined();
    expect(json.error.code).toBe(VALID_001);
  });

  it('存在しないrewardCardIdで400エラー（VALID_001）', async () => {
    const nonExistentCardId = uuidv4();
    const customerData = {
      name: 'テスト顧客',
      description: 'テスト用の顧客です',
      customerType: 'regular',
      difficulty: 3,
      requiredAttribute: { fire: 50 },
      qualityCondition: 50,
      stabilityCondition: 30,
      rewardFame: 100,
      rewardKnowledge: 50,
      rewardCardIds: [nonExistentCardId],
    };

    const req = new Request('http://localhost/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData),
    });

    const res = await app.fetch(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBeDefined();
    expect(json.error.code).toBe(VALID_001);
    expect(json.error.message).toContain('報酬カードID');
    expect(json.error.message).toContain('見つかりません');
  });

  it('必須フィールドが欠けている場合にバリデーションエラー', async () => {
    const customerData = {
      name: 'テスト顧客',
      // descriptionが欠けている
      customerType: 'regular',
      difficulty: 3,
      requiredAttribute: { fire: 50 },
      qualityCondition: 50,
      stabilityCondition: 30,
      rewardFame: 100,
      rewardKnowledge: 50,
    };

    const req = new Request('http://localhost/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData),
    });

    const res = await app.fetch(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBeDefined();
    expect(json.error.code).toBe(VALID_001);
  });

  it('作成後にrewardCardsを取得できる', async () => {
    const customerData = {
      name: 'カード報酬顧客',
      description: 'カード報酬を持つ顧客',
      customerType: 'special',
      difficulty: 4,
      requiredAttribute: { fire: 70 },
      qualityCondition: 80,
      stabilityCondition: 60,
      rewardFame: 200,
      rewardKnowledge: 100,
      rewardCardIds: [testCardId1],
    };

    const req = new Request('http://localhost/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData),
    });

    const res = await app.fetch(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.data.rewardCards).toBeDefined();
    expect(json.data.rewardCards).toHaveLength(1);
    expect(json.data.rewardCards[0].id).toBe(testCardId1);
  });

  it('portraitUrlがnullでも正しく作成できる', async () => {
    const customerData = {
      name: 'テスト顧客',
      description: 'テスト用の顧客です',
      customerType: 'regular',
      difficulty: 3,
      requiredAttribute: { fire: 50 },
      qualityCondition: 50,
      stabilityCondition: 30,
      rewardFame: 100,
      rewardKnowledge: 50,
      portraitUrl: null,
    };

    const req = new Request('http://localhost/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData),
    });

    const res = await app.fetch(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.data).toBeDefined();
    expect(json.data.portraitUrl).toBeNull();
  });
});

/**
 * 🔵 CustomerController.update テスト
 * TASK-0025: 顧客更新API実装（PUT /api/customers/:id）
 */
describe('CustomerController.update', () => {
  let app: Hono;
  let customerRepository: InMemoryCustomerRepository;
  let cardRepository: InMemoryCardRepository;
  let testCustomerId: string;

  beforeEach(async () => {
    // 🔵 テスト用Honoアプリケーションをセットアップ
    app = new Hono();

    // 🔵 In-Memory Repositoryを初期化
    customerRepository = new InMemoryCustomerRepository();
    cardRepository = new InMemoryCardRepository();

    // 🔵 Repository コンテナをモック
    const repositories: IRepositoryContainer = {
      customerRepository,
      cardRepository,
    };

    // 🔵 ミドルウェアでリポジトリコンテナを注入
    app.use('*', async (c, next) => {
      c.set('repositories', repositories);
      await next();
    });

    // 🔵 PUT /api/customers/:id ルートを設定
    app.put('/api/customers/:id', CustomerController.update);

    // 🔵 テスト用の顧客データを作成
    const customer = await customerRepository.create({
      name: 'テスト顧客',
      description: 'テスト用の顧客です',
      customerType: 'regular',
      difficulty: 3,
      requiredAttribute: { fire: 50 },
      qualityCondition: 50,
      stabilityCondition: 30,
      rewardFame: 100,
      rewardKnowledge: 50,
      portraitUrl: 'https://example.com/portrait.png',
      rewardCardIds: ['card-id-1', 'card-id-2'],
    });

    testCustomerId = customer.id;
  });

  it('1つのフィールドのみ更新できる', async () => {
    const req = new Request(`http://localhost/api/customers/${testCustomerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: '更新された顧客名',
      }),
    });

    const res = await app.fetch(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data).toBeDefined();
    expect(json.data.id).toBe(testCustomerId);
    expect(json.data.name).toBe('更新された顧客名');
    // 他のフィールドは変更されていない
    expect(json.data.description).toBe('テスト用の顧客です');
    expect(json.data.difficulty).toBe(3);
  });

  it('複数のフィールドを同時に更新できる', async () => {
    const req = new Request(`http://localhost/api/customers/${testCustomerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: '複数更新顧客',
        description: '複数フィールド更新',
        difficulty: 5,
        rewardFame: 500,
      }),
    });

    const res = await app.fetch(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data.name).toBe('複数更新顧客');
    expect(json.data.description).toBe('複数フィールド更新');
    expect(json.data.difficulty).toBe(5);
    expect(json.data.rewardFame).toBe(500);
  });

  it('rewardCardIdsを置き換えできる', async () => {
    // 実際のカードを作成
    const card1 = await cardRepository.create({
      name: '更新用カード1',
      description: '更新テスト用カード1',
      cardType: CardType.MATERIAL,
      attribute: { fire: 60 },
      stabilityValue: 40,
      reactionEffect: null,
      energyCost: 8,
      imageUrl: 'https://example.com/update-card1.png',
      rarity: CardRarity.COMMON,
    });
    const card2 = await cardRepository.create({
      name: '更新用カード2',
      description: '更新テスト用カード2',
      cardType: CardType.MATERIAL,
      attribute: { water: 55 },
      stabilityValue: 35,
      reactionEffect: null,
      energyCost: 7,
      imageUrl: 'https://example.com/update-card2.png',
      rarity: CardRarity.UNCOMMON,
    });
    const card3 = await cardRepository.create({
      name: '更新用カード3',
      description: '更新テスト用カード3',
      cardType: CardType.MATERIAL,
      attribute: { wind: 50 },
      stabilityValue: 30,
      reactionEffect: null,
      energyCost: 6,
      imageUrl: 'https://example.com/update-card3.png',
      rarity: CardRarity.RARE,
    });

    const req = new Request(`http://localhost/api/customers/${testCustomerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rewardCardIds: [card1.id, card2.id, card3.id],
      }),
    });

    const res = await app.fetch(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data.rewardCards).toBeDefined();
    expect(json.data.rewardCards).toHaveLength(3);
    expect(json.data.rewardCards[0].id).toBe(card1.id);
    expect(json.data.rewardCards[1].id).toBe(card2.id);
    expect(json.data.rewardCards[2].id).toBe(card3.id);
  });

  it('rewardCardIdsを空配列にして全削除できる', async () => {
    const req = new Request(`http://localhost/api/customers/${testCustomerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rewardCardIds: [],
      }),
    });

    const res = await app.fetch(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data.rewardCards).toBeDefined();
    expect(json.data.rewardCards).toHaveLength(0);
  });

  it('存在しないIDで404エラーとRES_001コードが返る', async () => {
    const nonExistentId = uuidv4();
    const req = new Request(`http://localhost/api/customers/${nonExistentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: '更新テスト',
      }),
    });

    const res = await app.fetch(req);
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBeDefined();
    expect(json.error.code).toBe(RES_001);
    expect(json.error.message).toBeDefined();
  });

  it('バリデーションエラー時に400エラーとVALID_001コードが返る（difficulty範囲外）', async () => {
    const req = new Request(`http://localhost/api/customers/${testCustomerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        difficulty: 10, // 範囲外: 1-5のみ有効
      }),
    });

    const res = await app.fetch(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBeDefined();
    expect(json.error.code).toBe('VALID_001');
    expect(json.error.message).toBe('バリデーションエラー');
    expect(json.error.details).toBeDefined();
  });

  it('バリデーションエラー時に400エラーとVALID_001コードが返る（不正なUUID形式のrewardCardIds）', async () => {
    const req = new Request(`http://localhost/api/customers/${testCustomerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rewardCardIds: ['invalid-uuid-format'], // 不正なUUID
      }),
    });

    const res = await app.fetch(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBeDefined();
    expect(json.error.code).toBe('VALID_001');
    expect(json.error.message).toBe('バリデーションエラー');
  });

  it('全フィールドを更新できる', async () => {
    // 実際のカードを作成
    const cardA = await cardRepository.create({
      name: '全更新用カードA',
      description: '全更新テスト用カードA',
      cardType: CardType.MATERIAL,
      attribute: { water: 65 },
      stabilityValue: 45,
      reactionEffect: null,
      energyCost: 9,
      imageUrl: 'https://example.com/full-update-cardA.png',
      rarity: CardRarity.RARE,
    });
    const cardB = await cardRepository.create({
      name: '全更新用カードB',
      description: '全更新テスト用カードB',
      cardType: CardType.MATERIAL,
      attribute: { wind: 60 },
      stabilityValue: 40,
      reactionEffect: null,
      energyCost: 8,
      imageUrl: 'https://example.com/full-update-cardB.png',
      rarity: CardRarity.COMMON,
    });

    const req = new Request(`http://localhost/api/customers/${testCustomerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: '完全更新顧客',
        description: '全フィールド更新',
        customerType: 'special',
        difficulty: 5,
        requiredAttribute: { water: 60, level: 3 },
        qualityCondition: 80,
        stabilityCondition: 70,
        rewardFame: 500,
        rewardKnowledge: 300,
        portraitUrl: 'https://example.com/new-portrait.png',
        rewardCardIds: [cardA.id, cardB.id],
      }),
    });

    const res = await app.fetch(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data.name).toBe('完全更新顧客');
    expect(json.data.description).toBe('全フィールド更新');
    expect(json.data.customerType).toBe('special');
    expect(json.data.difficulty).toBe(5);
    expect(json.data.requiredAttribute).toEqual({ water: 60, level: 3 });
    expect(json.data.qualityCondition).toBe(80);
    expect(json.data.stabilityCondition).toBe(70);
    expect(json.data.rewardFame).toBe(500);
    expect(json.data.rewardKnowledge).toBe(300);
    expect(json.data.portraitUrl).toBe('https://example.com/new-portrait.png');
    expect(json.data.rewardCards).toHaveLength(2);
  });
});
