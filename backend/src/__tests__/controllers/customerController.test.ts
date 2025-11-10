import { describe, it, expect, beforeEach } from 'vitest';
import { Hono } from 'hono';
import { CustomerController } from '../../controllers/customerController';
import { InMemoryCustomerRepository } from '../../repositories/memory/InMemoryCustomerRepository';
import { IRepositoryContainer } from '../../di/container';
import { RES_001 } from '../../constants/errorCodes';
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
      requiredAttribute: 'fire',
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
    expect(json.data.requiredAttribute).toBe('fire');
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
      requiredAttribute: 'water',
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
 * 🔵 CustomerController.update テスト
 * TASK-0025: 顧客更新API実装（PUT /api/customers/:id）
 */
describe('CustomerController.update', () => {
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

    // 🔵 PUT /api/customers/:id ルートを設定
    app.put('/api/customers/:id', CustomerController.update);

    // 🔵 テスト用の顧客データを作成
    const customer = await customerRepository.create({
      name: 'テスト顧客',
      description: 'テスト用の顧客です',
      customerType: 'regular',
      difficulty: 3,
      requiredAttribute: { type: 'fire' },
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
    // UUIDを生成
    const newCardId1 = uuidv4();
    const newCardId2 = uuidv4();
    const newCardId3 = uuidv4();

    const req = new Request(`http://localhost/api/customers/${testCustomerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rewardCardIds: [newCardId1, newCardId2, newCardId3],
      }),
    });

    const res = await app.fetch(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data.rewardCards).toBeDefined();
    expect(json.data.rewardCards).toHaveLength(3);
    expect(json.data.rewardCards[0].id).toBe(newCardId1);
    expect(json.data.rewardCards[1].id).toBe(newCardId2);
    expect(json.data.rewardCards[2].id).toBe(newCardId3);
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
    // UUIDを生成
    const cardIdA = uuidv4();
    const cardIdB = uuidv4();

    const req = new Request(`http://localhost/api/customers/${testCustomerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: '完全更新顧客',
        description: '全フィールド更新',
        customerType: 'special',
        difficulty: 5,
        requiredAttribute: { type: 'water', level: 3 },
        qualityCondition: 80,
        stabilityCondition: 70,
        rewardFame: 500,
        rewardKnowledge: 300,
        portraitUrl: 'https://example.com/new-portrait.png',
        rewardCardIds: [cardIdA, cardIdB],
      }),
    });

    const res = await app.fetch(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data.name).toBe('完全更新顧客');
    expect(json.data.description).toBe('全フィールド更新');
    expect(json.data.customerType).toBe('special');
    expect(json.data.difficulty).toBe(5);
    expect(json.data.requiredAttribute).toEqual({ type: 'water', level: 3 });
    expect(json.data.qualityCondition).toBe(80);
    expect(json.data.stabilityCondition).toBe(70);
    expect(json.data.rewardFame).toBe(500);
    expect(json.data.rewardKnowledge).toBe(300);
    expect(json.data.portraitUrl).toBe('https://example.com/new-portrait.png');
    expect(json.data.rewardCards).toHaveLength(2);
  });
});
