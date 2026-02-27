import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center px-4">

      {/* Logos */}
      <div className="flex gap-10 mb-8">
        <a href="https://vite.dev" target="_blank">
          <img
            src={viteLogo}
            alt="Vite logo"
            className="w-20 hover:scale-110 transition-transform duration-300"
          />
        </a>

        <a href="https://react.dev" target="_blank">
          <img
            src={reactLogo}
            alt="React logo"
            className="w-20 hover:scale-110 transition-transform duration-300"
          />
        </a>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold mb-6 text-center">
        Vite + React
      </h1>

      {/* Card */}
      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl flex flex-col items-center gap-6 w-full max-w-md">

        <button
          onClick={() => setCount((count) => count + 1)}
          className="bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all duration-200 px-6 py-3 rounded-xl font-semibold shadow-lg"
        >
          Count is {count}
        </button>

        <p className="text-slate-400 text-center">
          Edit <code className="bg-slate-700 px-2 py-1 rounded">src/App.tsx</code> and save to test HMR
        </p>
      </div>

      <p className="text-slate-500 mt-8 text-sm text-center">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App