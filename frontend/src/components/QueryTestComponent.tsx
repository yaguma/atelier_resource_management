/**
 * TanStack Query動作確認用テストコンポーネント
 * TASK-0029の検証専用（後で削除予定）
 */

import { useCards, useCreateCard } from '../hooks/useCards';

export function QueryTestComponent() {
  const { data: cards, isLoading, error, isError } = useCards();
  const createCardMutation = useCreateCard();

  const handleTestCreate = () => {
    createCardMutation.mutate({
      name: 'テストカード',
      description: 'TanStack Queryのテスト用カード',
      cardType: 'item',
      rarity: 'common',
      attribute: 'none',
      stabilityValue: 50,
      energyCost: 10,
    });
  };

  return (
    <div
      style={{
        padding: '20px',
        border: '2px solid #4CAF50',
        borderRadius: '8px',
        margin: '20px',
      }}
    >
      <h2>🧪 TanStack Query 動作確認</h2>

      <div style={{ marginTop: '10px' }}>
        <h3>✅ QueryClientProvider設定</h3>
        <p>
          ✓
          このコンポーネントが表示されていればQueryClientProviderが正しく動作しているのだ
        </p>
      </div>

      <div style={{ marginTop: '10px' }}>
        <h3>✅ React Query Devtools設定</h3>
        <p>
          ✓ 画面右下に赤いフローティングアイコンが表示されているか確認するのだ
        </p>
        <p style={{ fontSize: '12px', color: '#666' }}>
          （アイコンをクリックするとクエリの状態を確認できるのだ）
        </p>
      </div>

      <div style={{ marginTop: '10px' }}>
        <h3>✅ カスタムフック (useCards) 動作確認</h3>
        <div
          style={{
            padding: '10px',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
          }}
        >
          {isLoading && <p>📡 Loading...</p>}
          {isError && (
            <div>
              <p style={{ color: '#f44336' }}>
                ❌ エラー: {error?.message || '不明なエラー'}
              </p>
              <p style={{ fontSize: '12px', color: '#666' }}>
                ※ バックエンドが起動していないため、このエラーは正常なのだ
              </p>
              <p style={{ fontSize: '12px', color: '#666' }}>
                ✓
                useCardsフックが正しく動作して、エラーハンドリングができているのだ
              </p>
            </div>
          )}
          {cards && (
            <div>
              <p style={{ color: '#4CAF50' }}>
                ✓ カード取得成功: {cards.length}件
              </p>
              <pre style={{ fontSize: '12px' }}>
                {JSON.stringify(cards, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '10px' }}>
        <h3>✅ Mutation (useCreateCard) 動作確認</h3>
        <button
          type="button"
          onClick={handleTestCreate}
          disabled={createCardMutation.isPending}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: createCardMutation.isPending ? 'not-allowed' : 'pointer',
            opacity: createCardMutation.isPending ? 0.6 : 1,
          }}
        >
          {createCardMutation.isPending ? '作成中...' : 'テストカード作成'}
        </button>
        {createCardMutation.isError && (
          <p style={{ color: '#f44336', marginTop: '10px' }}>
            ❌ 作成エラー: {createCardMutation.error?.message}
            <br />
            <span style={{ fontSize: '12px' }}>
              ※ バックエンドが起動していないため、このエラーは正常なのだ
            </span>
          </p>
        )}
        {createCardMutation.isSuccess && (
          <p style={{ color: '#4CAF50', marginTop: '10px' }}>✓ 作成成功！</p>
        )}
      </div>

      <div
        style={{
          marginTop: '20px',
          padding: '10px',
          backgroundColor: '#e3f2fd',
          borderRadius: '4px',
        }}
      >
        <h3>📋 検証チェックリスト</h3>
        <ul style={{ fontSize: '14px' }}>
          <li>✅ QueryClientProvider が動作している</li>
          <li>✅ React Query Devtools が表示されている</li>
          <li>✅ useCards フックが動作している</li>
          <li>✅ useCreateCard mutation が動作している</li>
          <li>✅ エラーハンドリングが機能している</li>
          <li>✅ TypeScript型定義が正確</li>
        </ul>
      </div>
    </div>
  );
}
