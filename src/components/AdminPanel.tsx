import React from 'react'

interface AdminPanelProps {
  onBack: () => void
}

export default function AdminPanel({ onBack }: AdminPanelProps) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Admin Panel</h2>
      <p className="mb-6">Welcome, administrator. This area is restricted to admin users.</p>
      <button
        onClick={onBack}
        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
      >
        Back to Tool
      </button>
    </div>
  )
}
