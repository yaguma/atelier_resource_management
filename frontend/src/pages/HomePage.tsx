import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">ホームページ</h1>
      <p className="mb-4">アトリエ資源管理システムへようこそ</p>
      <nav>
        <Link to="/cards" className="text-blue-600 hover:underline">
          カード一覧へ
        </Link>
      </nav>
    </div>
  );
}

export default HomePage;
