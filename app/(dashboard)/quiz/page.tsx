'use client'

import { useState, useEffect } from 'react'

export default function QuizPage() {
  const [quizzes, setQuizzes] = useState([])

  useEffect(() => {
    fetch('/api/quiz')
      .then(res => res.json())
      .then(data => setQuizzes(data))
  }, [])

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Aptitude Quiz</h1>
        <p className="text-gray-400 mt-1">Test your skills and track your progress</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {quizzes.map((quiz: any) => (
          <div
            key={quiz.id}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-blue-500 transition-colors cursor-pointer"
            onClick={() => window.location.href = `/quiz/${quiz.id}`}
          >
            <div className="text-3xl mb-3">
              {quiz.category === 'Quantitative' ? '🔢' : quiz.category === 'Logical' ? '🧠' : '💻'}
            </div>
            <h3 className="font-semibold text-white text-lg">{quiz.title}</h3>
            <div className="flex gap-2 mt-3">
              <span className="px-2 py-1 bg-blue-900 text-blue-400 text-xs rounded">{quiz.category}</span>
              <span className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded">⏱ {quiz.duration} min</span>
              <span className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded">{quiz._count?.questions || 5} Questions</span>
            </div>
            <button className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">
              Start Quiz
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}