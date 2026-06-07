'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/toast'
import { QuizSkeleton } from '@/components/ui/skeleton'

const categoryIcon: Record<string, string> = {
  Quantitative: '🔢',
  Logical:      '🧠',
  Technical:    '💻',
  Verbal:       '📖',
}

const categoryStyle: Record<string, string> = {
  Quantitative: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Logical:      'bg-violet-500/10 text-violet-400 border-violet-500/20',
  Technical:    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Verbal:       'bg-amber-500/10 text-amber-400 border-amber-500/20',
}

export default function QuizPage() {
  const router = useRouter()
  const toast  = useToast()
  const [quizzes, setQuizzes]           = useState<any[]>([])
  const [pageLoading, setPageLoading]   = useState(true)
  const [startingId, setStartingId]     = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/quiz')
      .then(r => r.json())
      .then(data => {
        setQuizzes(data)
        setPageLoading(false)
      })
      .catch(() => {
        toast('Failed to load quizzes', 'error')
        setPageLoading(false)
      })
  }, [])

  const handleStart = (id: string, title: string) => {
    setStartingId(id)
    toast(`Starting: ${title}`, 'info')
    router.push(`/quiz/${id}`)
  }

  if (pageLoading) return <QuizSkeleton />

  return (
    <div className="min-h-screen bg-[#080b11] text-white p-6 md:p-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Aptitude Quiz</h1>
        <p className="text-gray-500 text-sm mt-1.5">Test your skills and track progress</p>
      </div>

      {quizzes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center mb-4 text-2xl">📝</div>
          <p className="text-gray-400 font-medium text-sm">No quizzes available yet</p>
          <p className="text-gray-600 text-xs mt-1">Check back soon</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((quiz: any) => {
            const isStarting = startingId === quiz.id
            const catStyle   = categoryStyle[quiz.category] || 'bg-gray-800 text-gray-400 border-gray-700'

            return (
              <div
                key={quiz.id}
                className="group bg-gray-900/50 border border-gray-800/80 rounded-2xl p-5 hover:border-gray-700 hover:bg-gray-900/80 transition-all duration-200 flex flex-col"
              >
                {/* Icon */}
                <div className="w-11 h-11 rounded-xl bg-gray-800 flex items-center justify-center text-2xl mb-4 border border-gray-700">
                  {categoryIcon[quiz.category] || '📝'}
                </div>

                <h3 className="font-semibold text-white text-sm mb-3 leading-snug">{quiz.title}</h3>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  <span className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border ${catStyle}`}>
                    {quiz.category}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-gray-800 border border-gray-700 text-gray-400">
                    ⏱ {quiz.duration} min
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-gray-800 border border-gray-700 text-gray-400">
                    {quiz._count?.questions || 5} Qs
                  </span>
                </div>

                <button
                  onClick={() => handleStart(quiz.id, quiz.title)}
                  disabled={isStarting}
                  className="mt-auto w-full py-2.5 bg-blue-600/15 border border-blue-500/25 hover:bg-blue-600/25 text-blue-400 text-xs font-semibold rounded-xl transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isStarting ? (
                    <>
                      <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Loading quiz…
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"/>
                      </svg>
                      Start Quiz
                    </>
                  )}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
