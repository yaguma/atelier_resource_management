import { Context } from 'hono';
import { CardService } from '../services/cardService';
import { IRepositoryContainer } from '../di/container';
import { CardType } from '../types/card';
import { VALID_001, RES_001, RES_002, RES_003 } from '../constants/errorCodes';

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
      const page = Number(c.req.query('page')) || 1;
      const limit = Number(c.req.query('limit')) || 20;
      const cardType = c.req.query('cardType') as CardType | undefined;
      const search = c.req.query('search');

      const result = await cardService.getCards(page, limit, { cardType, search });

      return c.json({
        data: result,
      });
    } catch (error: any) {
      return c.json(
        {
          error: {
            code: error.code || 'SYS_001',
            message: error.message,
          },
        },
        500
      );
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
    } catch (error: any) {
      const statusCode = error.code === RES_001 ? 404 : 500;
      return c.json(
        {
          error: {
            code: error.code || 'SYS_001',
            message: error.message,
          },
        },
        statusCode
      );
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

      // バリデーション（簡易版）
      if (!body.name || !body.description || !body.cardType) {
        return c.json(
          {
            error: {
              code: VALID_001,
              message: '必須フィールドが不足しています',
            },
          },
          400
        );
      }

      const card = await cardService.createCard(body);

      return c.json(
        {
          data: card,
        },
        201
      );
    } catch (error: any) {
      const statusCode = error.code === RES_002 ? 409 : error.code === VALID_001 ? 400 : 500;
      return c.json(
        {
          error: {
            code: error.code || 'SYS_001',
            message: error.message,
          },
        },
        statusCode
      );
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

      const card = await cardService.updateCard(id, body);

      return c.json({
        data: card,
      });
    } catch (error: any) {
      const statusCode =
        error.code === RES_001 ? 404 : error.code === RES_002 ? 409 : 500;
      return c.json(
        {
          error: {
            code: error.code || 'SYS_001',
            message: error.message,
          },
        },
        statusCode
      );
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

      return c.json({}, 204);
    } catch (error: any) {
      const statusCode =
        error.code === RES_001 ? 404 : error.code === RES_003 ? 409 : 500;

      // 依存関係エラーの場合は、依存関係情報も含める
      const errorResponse: any = {
        error: {
          code: error.code || 'SYS_001',
          message: error.message,
        },
      };

      if (error.code === RES_003 && error.dependencies) {
        errorResponse.error.dependencies = error.dependencies;
      }

      return c.json(errorResponse, statusCode);
    }
  }
}
