/**
 * React Router 6 設定
 * TASK-0028: React Router設定
 * TASK-0036: AppLayoutレイアウト統合
 */
import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../components/layouts/AppLayout';
import HomePage from '../pages/HomePage';
import CardListPage from '../pages/cards/CardListPage';
import CardCreatePage from '../pages/cards/CardCreatePage';
import CardEditPage from '../pages/cards/CardEditPage';
import CardDetailPage from '../pages/cards/CardDetailPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'cards',
        element: <CardListPage />,
      },
      {
        path: 'cards/new',
        element: <CardCreatePage />,
      },
      {
        path: 'cards/:id',
        element: <CardDetailPage />,
      },
      {
        path: 'cards/:id/edit',
        element: <CardEditPage />,
      },
    ],
  },
]);
