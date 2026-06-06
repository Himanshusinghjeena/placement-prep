'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'


export default function CompaniesPage() {
  const [companies, setCompanies] = useState([])
  const [filter, setFilter] = useState('All')
  const [interests, setInterests] = useState<string[]>([])
  const [loading, setLoading] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/companies')
      .then(res => res.json())
      .then(data => setCompanies(data))

    fetch('/api/companies/interest')
      .then(res => res.json())
      .then(data => setInterests(data))
  }, [])

  const handleInterest = async (companyId: string) => {
    setLoading(companyId)
    const res = await fetch('/api/companies/interest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companyId })
    })
    const data = await res.json()
    if (data.registered) {
      setInterests(prev => [...prev, companyId])
    } else {
      setInterests(prev => prev.filter(id => id !== companyId))
    }
    setLoading(null)
  }

  const filtered = companies.filter((c: any) =>
    filter === 'All' || c.type === filter
  )

  return (
    <div className="min-h-screen bg-black text-white p-8">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Placement Drives</h1>
        <p className="text-gray-400 mt-1">Upcoming companies visiting your campus</p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        {['All', 'Product', 'Service', 'Startup'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-gray-900 border border-gray-700 text-gray-400 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <p className="text-gray-500 col-span-3 text-center py-20">No drives posted yet</p>
        ) : (
          filtered.map((company: any) => {
            const isRegistered = interests.includes(company.id)
            const isLoading = loading === company.id

            return (
              <Link href={`/companies/${company.id}`}>
              <div key={company.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-blue-500 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-900 flex items-center justify-center font-bold text-blue-400">
                    {company.name[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{company.name}</h3>
                    <p className="text-gray-400 text-xs">{company.type}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap mb-4">
                  <span className="px-2 py-1 bg-green-900 text-green-400 text-xs rounded">₹{company.ctc} LPA</span>
                  <span className="px-2 py-1 bg-yellow-900 text-yellow-400 text-xs rounded">{company.date}</span>
                  <span className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded">CGPA {company.minCgpa}+</span>
                </div>
                <button
                  onClick={() => handleInterest(company.id)}
                  disabled={isLoading}
                  className={`w-full py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                    isRegistered
                      ? 'bg-green-900 border border-green-600 text-green-400 hover:bg-red-900 hover:border-red-600 hover:text-red-400'
                      : 'border border-gray-700 text-gray-400 hover:bg-blue-600 hover:text-white hover:border-blue-600'
                  }`}
                >
                  {isLoading ? 'Loading...' : isRegistered ? '✓ Registered' : 'Register Interest'}
                </button>
              </div>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}