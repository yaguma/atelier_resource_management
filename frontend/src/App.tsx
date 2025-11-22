import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      {/* TailwindCSS動作確認用のテストコンポーネント */}
      <div className="mt-8 p-4 bg-blue-500 text-white rounded-lg">
        <h2 className="text-2xl font-bold mb-2">TailwindCSS動作確認</h2>
        <p className="text-sm">この背景が青色で表示されていれば、TailwindCSSが正しく動作しています。</p>
        <button className="mt-4 px-4 py-2 bg-white text-blue-500 rounded hover:bg-gray-100 transition-colors">
          TailwindCSSテストボタン
        </button>
      </div>
    </>
  )
}

export default App
