import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/')

  let user = await db.user.findUnique({
    where: { clerkId: userId },
    include: {
      _count: {
        select: {
          solvedProblems: true,
          quizAttempts: true,
        }
      },
      quizAttempts: {
        select: { score: true }
      }
    }
  })

  if (!user) redirect('/')

  const totalPoints = (user._count.solvedProblems * 10) + 
    (user.quizAttempts.reduce((sum, a) => sum + a.score, 0) * 5)

  return (
    <div className="min-h-screen bg-black text-white p-8">

      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Welcome back, {user.name || 'Student'} 👋
        </h1>
        <p className="text-gray-400 mt-1">Your placement preparation dashboard</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">College</p>
          <p className="text-white font-semibold mt-1">{user.college || 'Not set'}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Problems Solved</p>
          <p className="text-green-400 font-bold text-2xl mt-1">{user._count.solvedProblems}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Quizzes Taken</p>
          <p className="text-blue-400 font-bold text-2xl mt-1">{user._count.quizAttempts}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Total Points</p>
          <p className="text-yellow-400 font-bold text-2xl mt-1">{totalPoints}</p>
        </div>
      </div>

      {/* Modules */}
      <h2 className="text-xl font-bold mb-4">Modules</h2>
      <div className="grid grid-cols-3 gap-4">
        <Link href="/problems">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 cursor-pointer hover:border-blue-500 transition-colors">
            <div className="text-3xl mb-3">💻</div>
            <h3 className="font-semibold text-white">DSA Problems</h3>
            <p className="text-gray-400 text-sm mt-1">Practice coding problems</p>
          </div>
        </Link>
        <Link href="/companies">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 cursor-pointer hover:border-blue-500 transition-colors">
            <div className="text-3xl mb-3">🏢</div>
            <h3 className="font-semibold text-white">Companies</h3>
            <p className="text-gray-400 text-sm mt-1">Upcoming placement drives</p>
          </div>
        </Link>
        <Link href="/mock-interview">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 cursor-pointer hover:border-blue-500 transition-colors">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-semibold text-white">Mock Interview</h3>
            <p className="text-gray-400 text-sm mt-1">AI powered interviews</p>
          </div>
        </Link>
        <Link href="/quiz">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 cursor-pointer hover:border-blue-500 transition-colors">
            <div className="text-3xl mb-3">📝</div>
            <h3 className="font-semibold text-white">Aptitude Quiz</h3>
            <p className="text-gray-400 text-sm mt-1">Practice aptitude tests</p>
          </div>
        </Link>
        <Link href="/leaderboard">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 cursor-pointer hover:border-blue-500 transition-colors">
            <div className="text-3xl mb-3">🏆</div>
            <h3 className="font-semibold text-white">Leaderboard</h3>
            <p className="text-gray-400 text-sm mt-1">See your college ranking</p>
          </div>
        </Link>
        <Link href="/profile">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 cursor-pointer hover:border-blue-500 transition-colors">
            <div className="text-3xl mb-3">👤</div>
            <h3 className="font-semibold text-white">My Profile</h3>
            <p className="text-gray-400 text-sm mt-1">Update your details</p>
          </div>
        </Link>
      </div>
    </div>
  )
}