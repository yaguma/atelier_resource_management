import { Hono } from 'hono';
import { CardController } from '../controllers/cardController';

/**
 * 🔵 Card Routes
 * カード管理に関するすべてのエンドポイント
 */
const cardsRouter = new Hono();

// GET /api/cards - カード一覧取得
cardsRouter.get('/', CardController.list);

// GET /api/cards/:id - カード詳細取得
cardsRouter.get('/:id', CardController.getById);

// POST /api/cards - カード作成
cardsRouter.post('/', CardController.create);

// PUT /api/cards/:id - カード更新
cardsRouter.put('/:id', CardController.update);

// DELETE /api/cards/:id - カード削除
cardsRouter.delete('/:id', CardController.delete);

export default cardsRouter;
