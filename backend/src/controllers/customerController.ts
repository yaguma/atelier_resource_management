import { Context } from 'hono';
import { CustomerService } from '../services/customerService';
import { IRepositoryContainer } from '../di/container';
import { isAppError } from '../utils/errors';
import { createCustomerSchema, updateCustomerSchema, listCustomersQuerySchema } from '../schemas/customer';
import { ZodError } from 'zod';

/**
 * 🔵 Customer Controller
 * Repository コンテナからCustomerServiceを生成
 * すべての顧客管理エンドポイントを処理
 */
export class CustomerController {
  /**
   * 🔵 顧客一覧取得
   * GET /api/customers
   */
  static async list(c: Context) {
    // 🔵 Repository コンテナを取得
    const repositories = c.get('repositories') as IRepositoryContainer;

    // 🔵 Service を初期化（Repositoryを注入）
    const customerService = new CustomerService(repositories.customerRepository);

    try {
      // 🔵 Zodバリデーション
      const query = listCustomersQuerySchema.parse({
        page: c.req.query('page'),
        limit: c.req.query('limit'),
        difficulty: c.req.query('difficulty'),
        search: c.req.query('search'),
      });

      const result = await customerService.getCustomers(query.page, query.limit, {
        difficulty: query.difficulty,
        search: query.search,
      });

      return c.json({
        data: result,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return c.json(
          {
            error: {
              code: 'VALID_001',
              message: 'バリデーションエラー',
              details: error.errors,
            },
          },
          400
        );
      }
      if (isAppError(error)) {
        return c.json({ error: { code: error.code, message: error.message } }, 500);
      }
      return c.json({ error: { code: 'SYS_001', message: '内部サーバーエラー' } }, 500);
    }
  }

  /**
   * 🔵 顧客詳細取得
   * GET /api/customers/:id
   */
  static async getById(c: Context) {
    const repositories = c.get('repositories') as IRepositoryContainer;
    const customerService = new CustomerService(repositories.customerRepository);

    try {
      const id = c.req.param('id');
      const customer = await customerService.getCustomerById(id);

      return c.json({
        data: customer,
      });
    } catch (error) {
      if (isAppError(error)) {
        const statusCode = error.code === 'RES_001' ? 404 : 500;
        return c.json({ error: { code: error.code, message: error.message } }, statusCode);
      }
      return c.json({ error: { code: 'SYS_001', message: '内部サーバーエラー' } }, 500);
    }
  }

  /**
   * 🔵 顧客作成
   * POST /api/customers
   */
  static async create(c: Context) {
    const repositories = c.get('repositories') as IRepositoryContainer;
    const customerService = new CustomerService(repositories.customerRepository);

    try {
      const body = await c.req.json();

      // 🔵 Zodバリデーション
      const validatedData = createCustomerSchema.parse(body);

      const customer = await customerService.createCustomer(validatedData);

      return c.json(
        {
          data: customer,
        },
        201
      );
    } catch (error) {
      if (error instanceof ZodError) {
        return c.json(
          {
            error: {
              code: 'VALID_001',
              message: 'バリデーションエラー',
              details: error.errors,
            },
          },
          400
        );
      }
      if (isAppError(error)) {
        const statusCode = error.code === 'VALID_001' ? 400 : 500;
        return c.json({ error: { code: error.code, message: error.message } }, statusCode);
      }
      return c.json({ error: { code: 'SYS_001', message: '内部サーバーエラー' } }, 500);
    }
  }

  /**
   * 🔵 顧客更新
   * PUT /api/customers/:id
   */
  static async update(c: Context) {
    const repositories = c.get('repositories') as IRepositoryContainer;
    const customerService = new CustomerService(repositories.customerRepository);

    try {
      const id = c.req.param('id');
      const body = await c.req.json();

      // 🔵 Zodバリデーション
      const validatedData = updateCustomerSchema.parse(body);

      const customer = await customerService.updateCustomer(id, validatedData);

      return c.json({
        data: customer,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return c.json(
          {
            error: {
              code: 'VALID_001',
              message: 'バリデーションエラー',
              details: error.errors,
            },
          },
          400
        );
      }
      if (isAppError(error)) {
        const statusCode = error.code === 'RES_001' ? 404 : 500;
        return c.json({ error: { code: error.code, message: error.message } }, statusCode);
      }
      return c.json({ error: { code: 'SYS_001', message: '内部サーバーエラー' } }, 500);
    }
  }

  /**
   * 🔵 顧客削除
   * DELETE /api/customers/:id
   */
  static async delete(c: Context) {
    const repositories = c.get('repositories') as IRepositoryContainer;
    const customerService = new CustomerService(repositories.customerRepository);

    try {
      const id = c.req.param('id');
      await customerService.deleteCustomer(id);

      // 204 No Content - ボディは返さない
      return new Response(null, { status: 204 });
    } catch (error) {
      if (isAppError(error)) {
        const statusCode = error.code === 'RES_001' ? 404 : 500;
        return c.json({ error: { code: error.code, message: error.message } }, statusCode);
      }
      return c.json({ error: { code: 'SYS_001', message: '内部サーバーエラー' } }, 500);
    }
  }
}
