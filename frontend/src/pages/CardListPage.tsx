import { Link } from 'react-router-dom';

function CardListPage() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">カード一覧</h1>
        <Link
          to="/cards/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          新規作成
        </Link>
      </div>
      <p className="text-gray-600">カード一覧のプレースホルダーです</p>
    </div>
  );
}

export default CardListPage;
