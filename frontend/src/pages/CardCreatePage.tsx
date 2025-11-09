import { Link } from 'react-router-dom';

function CardCreatePage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">カード新規作成</h1>
      <p className="text-gray-600 mb-4">
        カード作成フォームのプレースホルダーです
      </p>
      <Link to="/cards" className="text-blue-600 hover:underline">
        一覧に戻る
      </Link>
    </div>
  );
}

export default CardCreatePage;
