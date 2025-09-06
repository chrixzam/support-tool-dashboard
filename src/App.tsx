import React, { useState } from 'react'
import VectorStoreSupportTool from './components/VectorStoreSupportTool'
import Login from './components/Login'
import AdminPanel from './components/AdminPanel'

interface User {
  username: string
  role: 'user' | 'admin'
}

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [showAdmin, setShowAdmin] = useState(false)

  if (!user) {
    return <Login onLogin={setUser} />
  }

  return (
    <div>
      <div className="flex items-center justify-between bg-gray-100 px-4 py-2 text-sm">
        <span>
          Logged in as {user.username} ({user.role})
        </span>
        <div className="space-x-2">
          {user.role === 'admin' && (
            <button
              onClick={() => setShowAdmin((s) => !s)}
              className="text-blue-600 hover:underline"
            >
              {showAdmin ? 'Close Admin' : 'Admin Panel'}
            </button>
          )}
          <button onClick={() => setUser(null)} className="text-red-600 hover:underline">
            Logout
          </button>
        </div>
      </div>
      {showAdmin && user.role === 'admin' ? (
        <AdminPanel onBack={() => setShowAdmin(false)} />
      ) : (
        <VectorStoreSupportTool />
      )}
    </div>
  )
}

