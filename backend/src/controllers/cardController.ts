import { Context } from 'hono';
import { CardService } from '../services/cardService';
import { IRepositoryContainer } from '../di/container';
import { CardType } from '../types/card';
import { isAppError, ValidationError } from '../utils/errors';
import { createCardSchema, updateCardSchema, listCardsQuerySchema } from '../schemas/card';
import { ZodError } from 'zod';

/**
 * 🔵 Card Controller
 * Repository コンテナからCardServiceを生成
 * すべてのカード管理エンドポイントを処理
 */
export class CardController {
  /**
   * 🔵 カード一覧取得
   * GET /api/cards
   */
  static async list(c: Context) {
    // 🔵 Repository コンテナを取得
    const repositories = c.get('repositories') as IRepositoryContainer;

    // 🔵 Service を初期化（Repositoryを注入）
    const cardService = new CardService(repositories.cardRepository);

    try {
      // 🔵 Zodバリデーション
      const query = listCardsQuerySchema.parse({
        page: c.req.query('page'),
        limit: c.req.query('limit'),
        cardType: c.req.query('cardType'),
        search: c.req.query('search'),
      });

      const result = await cardService.getCards(query.page, query.limit, {
        cardType: query.cardType,
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
   * 🔵 カード詳細取得
   * GET /api/cards/:id
   */
  static async getById(c: Context) {
    const repositories = c.get('repositories') as IRepositoryContainer;
    const cardService = new CardService(repositories.cardRepository);

    try {
      const id = c.req.param('id');
      const card = await cardService.getCardById(id);

      return c.json({
        data: card,
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
   * 🔵 カード作成
   * POST /api/cards
   */
  static async create(c: Context) {
    const repositories = c.get('repositories') as IRepositoryContainer;
    const cardService = new CardService(repositories.cardRepository);

    try {
      const body = await c.req.json();

      // 🔵 Zodバリデーション
      const validatedData = createCardSchema.parse(body);

      const card = await cardService.createCard(validatedData);

      return c.json(
        {
          data: card,
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
        const statusCode =
          error.code === 'RES_002' ? 409 : error.code === 'VALID_001' ? 400 : 500;
        return c.json({ error: { code: error.code, message: error.message } }, statusCode);
      }
      return c.json({ error: { code: 'SYS_001', message: '内部サーバーエラー' } }, 500);
    }
  }

  /**
   * 🔵 カード更新
   * PUT /api/cards/:id
   */
  static async update(c: Context) {
    const repositories = c.get('repositories') as IRepositoryContainer;
    const cardService = new CardService(repositories.cardRepository);

    try {
      const id = c.req.param('id');
      const body = await c.req.json();

      // 🔵 Zodバリデーション
      const validatedData = updateCardSchema.parse(body);

      const card = await cardService.updateCard(id, validatedData);

      return c.json({
        data: card,
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
        const statusCode =
          error.code === 'RES_001' ? 404 : error.code === 'RES_002' ? 409 : 500;
        return c.json({ error: { code: error.code, message: error.message } }, statusCode);
      }
      return c.json({ error: { code: 'SYS_001', message: '内部サーバーエラー' } }, 500);
    }
  }

  /**
   * 🔵 カード削除
   * DELETE /api/cards/:id
   */
  static async delete(c: Context) {
    const repositories = c.get('repositories') as IRepositoryContainer;
    const cardService = new CardService(repositories.cardRepository);

    try {
      const id = c.req.param('id');
      await cardService.deleteCard(id);

      // 204 No Content - ボディは返さない
      return new Response(null, { status: 204 });
    } catch (error) {
      if (isAppError(error)) {
        const statusCode =
          error.code === 'RES_001' ? 404 : error.code === 'RES_003' ? 409 : 500;

        // 依存関係エラーの場合は、依存関係情報も含める
        const errorResponse: any = {
          error: {
            code: error.code,
            message: error.message,
          },
        };

        if (error.code === 'RES_003' && error.dependencies) {
          errorResponse.error.dependencies = error.dependencies;
        }

        return c.json(errorResponse, statusCode);
      }
      return c.json({ error: { code: 'SYS_001', message: '内部サーバーエラー' } }, 500);
    }
  }
}
