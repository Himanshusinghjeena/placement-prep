'use client'

import { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/toast'
import { ProblemsSkeleton } from '@/components/ui/skeleton'

const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard']

const diffStyle: Record<string, string> = {
  Easy:   'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Medium: 'bg-amber-500/10   text-amber-400   border-amber-500/20',
  Hard:   'bg-red-500/10     text-red-400     border-red-500/20',
}

export default function ProblemsPage() {
  const toast = useToast()
  const [problems, setProblems]       = useState<any[]>([])
  const [solved, setSolved]           = useState<string[]>([])
  const [filter, setFilter]           = useState('All')
  const [search, setSearch]           = useState('')
  const [pageLoading, setPageLoading] = useState(true)
  const [toggling, setToggling]       = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/problems').then(r => r.json()),
      fetch('/api/problems/solved').then(r => r.json()),
    ]).then(([problems, solvedData]) => {
      setProblems(problems)
      setSolved(solvedData.map((p: any) => p.problemId))
      setPageLoading(false)
    }).catch(() => {
      toast('Failed to load problems', 'error')
      setPageLoading(false)
    })
  }, [])

  const toggleSolved = async (problemId: string, title: string) => {
    const wasSolved = solved.includes(problemId)
    // Optimistic update
    setSolved(prev => wasSolved ? prev.filter(id => id !== problemId) : [...prev, problemId])
    setToggling(problemId)
    try {
      await fetch('/api/problems/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemId }),
      })
      toast(wasSolved ? `Unmarked: ${title}` : `Solved: ${title} 🎉`, wasSolved ? 'info' : 'success')
    } catch {
      // Revert on error
      setSolved(prev => wasSolved ? [...prev, problemId] : prev.filter(id => id !== problemId))
      toast('Failed to update. Try again.', 'error')
    } finally {
      setToggling(null)
    }
  }

  if (pageLoading) return <ProblemsSkeleton />

  const filtered = problems.filter((p: any) => {
    const matchDiff   = filter === 'All' || p.difficulty === filter
    const matchSearch = !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.companies?.some((c: string) => c.toLowerCase().includes(search.toLowerCase()))
    return matchDiff && matchSearch
  })

  const solvedCount = solved.length

  return (
    <div className="min-h-screen bg-[#080b11] text-white p-6 md:p-8">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">DSA Problems</h1>
        <div className="flex items-center gap-3 mt-2">
          <p className="text-gray-500 text-sm">{solvedCount} / {problems.length} solved</p>
          {/* Progress bar */}
          <div className="flex-1 max-w-xs h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: problems.length ? `${(solvedCount / problems.length) * 100}%` : '0%' }}
            />
          </div>
          <span className="text-gray-600 text-xs">
            {problems.length ? Math.round((solvedCount / problems.length) * 100) : 0}%
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search problems or company…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-gray-900/70 border border-gray-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 w-64 transition-all"
          />
        </div>
        {DIFFICULTIES.map(d => (
          <button
            key={d}
            onClick={() => setFilter(d)}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 border ${
              filter === d
                ? 'bg-blue-600/20 text-blue-400 border-blue-500/30'
                : 'bg-gray-900/60 border-gray-800 text-gray-400 hover:text-gray-200 hover:border-gray-700'
            }`}
          >
            {d}
          </button>
        ))}
        {(search || filter !== 'All') && (
          <button
            onClick={() => { setSearch(''); setFilter('All') }}
            className="px-3 py-2.5 rounded-xl text-xs text-gray-500 hover:text-gray-300 transition-colors border border-transparent hover:border-gray-800"
          >
            Clear
          </button>
        )}
      </div>

      <p className="text-gray-600 text-xs mb-4">{filtered.length} problems</p>

      {/* Table */}
      <div className="bg-gray-900/40 border border-gray-800/80 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px]">
            <thead>
              <tr className="border-b border-gray-800/80">
                <th className="text-left text-gray-600 text-[11px] font-semibold uppercase tracking-wider p-4 w-12">Done</th>
                <th className="text-left text-gray-600 text-[11px] font-semibold uppercase tracking-wider p-4 w-10">#</th>
                <th className="text-left text-gray-600 text-[11px] font-semibold uppercase tracking-wider p-4">Title</th>
                <th className="text-left text-gray-600 text-[11px] font-semibold uppercase tracking-wider p-4">Difficulty</th>
                <th className="text-left text-gray-600 text-[11px] font-semibold uppercase tracking-wider p-4">Companies</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-gray-600 text-sm py-16">
                    No problems found
                  </td>
                </tr>
              ) : (
                filtered.map((problem: any, index: number) => {
                  const isSolved  = solved.includes(problem.id)
                  const isToggling = toggling === problem.id

                  return (
                    <tr
                      key={problem.id}
                      className={`border-b border-gray-800/50 transition-colors ${isSolved ? 'bg-emerald-950/10' : 'hover:bg-gray-800/30'}`}
                    >
                      <td className="p-4">
                        <button
                          onClick={() => toggleSolved(problem.id, problem.title)}
                          disabled={isToggling}
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                            isSolved
                              ? 'bg-emerald-500 border-emerald-500 shadow-sm shadow-emerald-500/30'
                              : 'border-gray-700 hover:border-emerald-500/60'
                          } disabled:opacity-50`}
                        >
                          {isToggling
                            ? <svg className="w-2.5 h-2.5 animate-spin text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                            : isSolved && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                          }
                        </button>
                      </td>
                      <td className="p-4 text-gray-600 text-xs tabular-nums">{index + 1}</td>
                      <td className="p-4">
                        <a
                          href={problem.leetcodeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-sm font-medium transition-colors hover:text-blue-400 ${isSolved ? 'text-gray-500 line-through decoration-gray-600' : 'text-gray-200'}`}
                        >
                          {problem.title}
                        </a>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${diffStyle[problem.difficulty] || ''}`}>
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1 flex-wrap">
                          {problem.companies?.slice(0, 3).map((c: string, idx: number) => (
                            <span key={`${problem.id}-${idx}`} className="px-2 py-0.5 bg-gray-800/80 text-gray-400 text-[10px] rounded-lg border border-gray-700/60 cursor-pointer hover:text-gray-200 hover:border-gray-600 transition-colors">
                              {c}
                            </span>
                          ))}
                          {problem.companies?.length > 3 && (
                            <span className="text-gray-600 text-[10px] py-0.5">+{problem.companies.length - 3}</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
