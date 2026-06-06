'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CompanyActions({
  companyId,
  userInterest,
}: {
  companyId: string
  userInterest: any
}) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleInterest = async () => {
    setLoading(true)
    await fetch('/api/companies/interest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companyId })
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <button
      onClick={handleInterest}
      disabled={loading}
      className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-colors disabled:opacity-50 ${
        userInterest
          ? 'bg-green-900 border border-green-600 text-green-400 hover:bg-red-900 hover:border-red-600 hover:text-red-400'
          : 'bg-blue-600 hover:bg-blue-700 text-white'
      }`}
    >
      {loading ? 'Loading...' : userInterest ? '✓ Registered' : 'Register Interest'}
    </button>
  )
}