'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function QuizAttemptPage() {
  const { id } = useParams()
  const router = useRouter()

  const [quiz, setQuiz] = useState<any>(null)
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    fetch(`/api/quiz/${id}`)
      .then(res => res.json())
      .then(data => {
        setQuiz(data)
        setTimeLeft(data.duration * 60)
        setSelected(new Array(data.questions.length).fill(-1))
      })
  }, [id])

  // Timer
  useEffect(() => {
    if (!quiz || submitted) return
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [quiz, submitted])

  const handleSubmit = async () => {
    if (submitted) return
    const correct = selected.filter(
      (ans, i) => ans === quiz.questions[i].correctIndex
    ).length
    setScore(correct)
    setSubmitted(true)

    await fetch('/api/quiz/attempt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quizId: id,
        score: correct,
        totalQ: quiz.questions.length,
      }),
    })
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  if (!quiz) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <p className="text-gray-400">Loading quiz...</p>
    </div>
  )

  if (submitted) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-10 text-center max-w-md w-full">
        <div className="text-6xl mb-4">{score === quiz.questions.length ? '🏆' : score >= quiz.questions.length / 2 ? '👍' : '📚'}</div>
        <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>
        <p className="text-gray-400 mb-6">{quiz.title}</p>
        <div className="text-6xl font-bold text-blue-400 mb-2">{score}/{quiz.questions.length}</div>
        <p className="text-gray-400 mb-8">
          {score === quiz.questions.length ? 'Perfect Score!' : score >= quiz.questions.length / 2 ? 'Good Job!' : 'Keep Practicing!'}
        </p>

        {/* Answer Review */}
        <div className="text-left mb-6">
          {quiz.questions.map((q: any, i: number) => (
            <div key={q.id} className="mb-4 p-3 rounded-lg bg-gray-800">
              <p className="text-sm text-gray-300 mb-2">{i + 1}. {q.question}</p>
              <p className={`text-xs ${selected[i] === q.correctIndex ? 'text-green-400' : 'text-red-400'}`}>
                Your answer: {q.options[selected[i]] || 'Not answered'}
              </p>
              {selected[i] !== q.correctIndex && (
                <p className="text-xs text-green-400">Correct: {q.options[q.correctIndex]}</p>
              )}
              {q.explanation && (
                <p className="text-xs text-gray-500 mt-1">💡 {q.explanation}</p>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => router.push('/quiz')}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
        >
          Back to Quizzes
        </button>
      </div>
    </div>
  )

  const question = quiz.questions[current]

  return (
    <div className="min-h-screen bg-black text-white p-8">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold">{quiz.title}</h1>
          <p className="text-gray-400 text-sm">Question {current + 1} of {quiz.questions.length}</p>
        </div>
        <div className={`text-2xl font-bold font-mono ${timeLeft < 60 ? 'text-red-400' : 'text-blue-400'}`}>
          ⏱ {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-800 rounded-full h-1.5 mb-8">
        <div
          className="bg-blue-600 h-1.5 rounded-full transition-all"
          style={{ width: `${((current + 1) / quiz.questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <p className="text-lg font-medium leading-relaxed">{question.question}</p>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3 mb-8">
          {question.options.map((option: string, i: number) => (
            <button
              key={i}
              onClick={() => {
                const newSelected = [...selected]
                newSelected[current] = i
                setSelected(newSelected)
              }}
              className={`text-left px-5 py-4 rounded-xl border transition-all ${
                selected[current] === i
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-gray-900 border-gray-700 text-gray-300 hover:border-blue-500'
              }`}
            >
              <span className="font-medium mr-3">{['A', 'B', 'C', 'D'][i]}.</span>
              {option}
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrent(prev => prev - 1)}
            disabled={current === 0}
            className="px-6 py-2 border border-gray-700 rounded-lg text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
          >
            Previous
          </button>

          {current < quiz.questions.length - 1 ? (
            <button
              onClick={() => setCurrent(prev => prev + 1)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors"
            >
              Submit Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  )
}