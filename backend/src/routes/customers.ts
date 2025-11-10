import { Hono } from 'hono';
import { CustomerController } from '../controllers/customerController';

/**
 * 🔵 Customer Routes
 * 顧客管理に関するすべてのエンドポイント
 */
const customersRouter = new Hono();

// GET /api/customers - 顧客一覧取得
customersRouter.get('/', CustomerController.list);

// GET /api/customers/:id - 顧客詳細取得
customersRouter.get('/:id', CustomerController.getById);

// POST /api/customers - 顧客作成
customersRouter.post('/', CustomerController.create);

// PUT /api/customers/:id - 顧客更新
customersRouter.put('/:id', CustomerController.update);

// DELETE /api/customers/:id - 顧客削除
customersRouter.delete('/:id', CustomerController.delete);

export default customersRouter;
