/**
 * カード詳細ページ（プレースホルダー）
 * TASK-0028: React Router設定
 */
import { useParams } from 'react-router-dom';

const CardDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">カード詳細</h1>
      <p className="text-gray-600">
        カードID: {id}（実装予定: Phase 3-B）
      </p>
    </div>
  );
};

export default CardDetailPage;
