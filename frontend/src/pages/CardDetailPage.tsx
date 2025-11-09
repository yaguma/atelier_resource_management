import { Link, useParams } from 'react-router-dom';

function CardDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">カード詳細</h1>
      <p className="text-gray-600 mb-4">カードID: {id}</p>
      <p className="text-gray-600 mb-4">カード詳細のプレースホルダーです</p>
      <div className="flex gap-4">
        <Link to="/cards" className="text-blue-600 hover:underline">
          一覧に戻る
        </Link>
        <Link
          to={`/cards/${id}/edit`}
          className="text-blue-600 hover:underline"
        >
          編集
        </Link>
      </div>
    </div>
  );
}

export default CardDetailPage;
