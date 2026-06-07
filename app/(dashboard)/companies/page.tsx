'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useToast } from '@/components/ui/toast'
import { CompaniesSkeleton } from '@/components/ui/skeleton'

const filters = ['All', 'Product', 'Service', 'Startup']

export default function CompaniesPage() {
  const toast = useToast()
  const [companies, setCompanies]   = useState<any[]>([])
  const [interests, setInterests]   = useState<string[]>([])
  const [filter, setFilter]         = useState('All')
  const [pageLoading, setPageLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/companies').then(r => r.json()),
      fetch('/api/companies/interest').then(r => r.json()),
    ]).then(([companies, interests]) => {
      setCompanies(companies)
      setInterests(interests)
      setPageLoading(false)
    }).catch(() => {
      toast('Failed to load companies', 'error')
      setPageLoading(false)
    })
  }, [])

  const handleInterest = async (e: React.MouseEvent, companyId: string, companyName: string) => {
    e.preventDefault()
    e.stopPropagation()
    setActionLoading(companyId)
    try {
      const res = await fetch('/api/companies/interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId }),
      })
      const data = await res.json()
      if (data.registered) {
        setInterests(prev => [...prev, companyId])
        toast(`Registered for ${companyName}!`, 'success')
      } else {
        setInterests(prev => prev.filter(id => id !== companyId))
        toast(`Unregistered from ${companyName}`, 'info')
      }
    } catch {
      toast('Something went wrong. Try again.', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  if (pageLoading) return <CompaniesSkeleton />

  const filtered = filter === 'All' ? companies : companies.filter((c: any) => c.type === filter)

  const typeColors: Record<string, string> = {
    Product: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Service: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Startup: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  }

  return (
    <div className="min-h-screen bg-[#080b11] text-white p-6 md:p-8">

      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Placement Drives</h1>
        <p className="text-gray-500 text-sm mt-1.5">
          {companies.length} companies · {interests.length} registered
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-150 border ${
              filter === f
                ? 'bg-blue-600/20 text-blue-400 border-blue-500/30'
                : 'bg-gray-900/60 border-gray-800 text-gray-400 hover:text-gray-200 hover:border-gray-700'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <p className="text-gray-400 font-medium text-sm">No drives posted yet</p>
          <p className="text-gray-600 text-xs mt-1">Check back soon</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((company: any) => {
            const isRegistered  = interests.includes(company.id)
            const isLoadingThis = actionLoading === company.id

            return (
              <Link key={company.id} href={`/companies/${company.id}`}>
                <div className="group bg-gray-900/50 border border-gray-800/80 rounded-2xl p-5 hover:border-gray-700 hover:bg-gray-900/80 transition-all duration-200 cursor-pointer h-full flex flex-col">

                  {/* Top */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-bold text-blue-400 text-sm shrink-0">
                      {company.name[0]}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-white text-sm truncate">{company.name}</h3>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${typeColors[company.type] || 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                        {company.type}
                      </span>
                    </div>
                  </div>

                  {/* Info badges */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium rounded-lg">
                      ₹{company.ctc} LPA
                    </span>
                    <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-medium rounded-lg">
                      📅 {company.date}
                    </span>
                    <span className="px-2.5 py-1 bg-gray-800 border border-gray-700 text-gray-400 text-[11px] font-medium rounded-lg">
                      CGPA {company.minCgpa}+
                    </span>
                  </div>

                  {/* Branches */}
                  {company.branches?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {company.branches.slice(0, 4).map((b: string) => (
                        <span key={b} className="text-[10px] text-gray-500 bg-gray-800/60 px-1.5 py-0.5 rounded">{b}</span>
                      ))}
                      {company.branches.length > 4 && (
                        <span className="text-[10px] text-gray-600">+{company.branches.length - 4}</span>
                      )}
                    </div>
                  )}

                  {/* CTA */}
                  <button
                    onClick={(e) => handleInterest(e, company.id, company.name)}
                    disabled={isLoadingThis}
                    className={`mt-auto w-full py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 flex items-center justify-center gap-2 border ${
                      isRegistered
                        ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-red-500/10 hover:border-red-500/25 hover:text-red-400'
                        : 'bg-blue-600/10 border-blue-500/25 text-blue-400 hover:bg-blue-600/20'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isLoadingThis ? (
                      <>
                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Processing...
                      </>
                    ) : isRegistered ? (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        Registered · Click to undo
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Register Interest
                      </>
                    )}
                  </button>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
