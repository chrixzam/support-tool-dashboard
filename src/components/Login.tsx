import React, { useState } from 'react'

interface LoginProps {
  onLogin: (user: { username: string; role: 'user' | 'admin' }) => void
}

const USERS: Record<string, { password: string; role: 'user' | 'admin' }> = {
  test: { password: 'test', role: 'user' },
  admin: { password: 'admin', role: 'admin' }
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    const u = USERS[username as keyof typeof USERS]
    if (!u || u.password !== password) {
      setError('Invalid credentials')
      return
    }
    setError('')
    onLogin({ username, role: u.role })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4 text-center">Support Tool Login</h2>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md text-sm hover:bg-blue-700"
        >
          Log In
        </button>
      </form>
    </div>
  )
}

