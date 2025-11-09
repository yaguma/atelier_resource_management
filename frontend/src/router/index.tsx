import { createBrowserRouter } from 'react-router-dom';
import CardCreatePage from '../pages/CardCreatePage';
import CardDetailPage from '../pages/CardDetailPage';
import CardEditPage from '../pages/CardEditPage';
import CardListPage from '../pages/CardListPage';
import HomePage from '../pages/HomePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/cards',
    element: <CardListPage />,
  },
  {
    path: '/cards/new',
    element: <CardCreatePage />,
  },
  {
    path: '/cards/:id',
    element: <CardDetailPage />,
  },
  {
    path: '/cards/:id/edit',
    element: <CardEditPage />,
  },
]);
