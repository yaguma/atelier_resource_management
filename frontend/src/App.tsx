/**
 * App コンポーネント
 * TASK-0028: React Router設定
 */
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './App.css';

function App() {
  return <RouterProvider router={router} />;
}

export default App;
