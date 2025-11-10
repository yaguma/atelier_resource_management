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
