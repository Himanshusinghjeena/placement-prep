import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { LeaderboardSkeleton } from '@/components/ui/skeleton'
import { Suspense } from 'react'

async function LeaderboardContent() {
  const { userId } = await auth()

  const users = await db.user.findMany({
    include: {
      _count: { select: { solvedProblems: true, quizAttempts: true } },
      quizAttempts: { select: { score: true } },
    },
    orderBy: { createdAt: 'asc' }
  })

  type U = (typeof users)[number]

  const ranked = users.map((user: U) => {
    const totalQuizScore = user.quizAttempts.reduce((sum: number, a: { score: number }) => sum + a.score, 0)
    const totalPoints    = user._count.solvedProblems * 10 + totalQuizScore * 5
    return {
      id:             user.id,
      clerkId:        user.clerkId,
      name:           user.name || 'Anonymous',
      college:        user.college || 'Unknown',
      branch:         user.branch || '—',
      problemsSolved: user._count.solvedProblems,
      quizzesTaken:   user._count.quizAttempts,
      totalPoints,
    }
  }).sort((a: { totalPoints: number }, b: { totalPoints: number }): number => b.totalPoints - a.totalPoints)

  const podium = ranked.length >= 3 ? [ranked[1], ranked[0], ranked[2]] : []
  const podiumColors = [
    { ring: 'ring-gray-400',   bg: 'bg-gray-400/10',  text: 'text-gray-300',  medal: '🥈', label: '2nd' },
    { ring: 'ring-yellow-400', bg: 'bg-yellow-400/10', text: 'text-yellow-400', medal: '🥇', label: '1st' },
    { ring: 'ring-amber-600',  bg: 'bg-amber-600/10',  text: 'text-amber-500', medal: '🥉', label: '3rd' },
  ]

  return (
    <div className="min-h-screen bg-[#080b11] text-white p-6 md:p-8">

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Leaderboard</h1>
        <p className="text-gray-500 text-sm mt-1.5">{ranked.length} students · ranked by total points</p>
      </div>

      {/* Podium */}
      {podium.length === 3 && (
        <div className="grid grid-cols-3 gap-3 mb-8 max-w-2xl">
          {podium.map((user, i) => {
            const c = podiumColors[i]
            return (
              <div
                key={user.id}
                className={`relative flex flex-col items-center p-4 md:p-5 rounded-2xl bg-gray-900/50 border border-gray-800/80 text-center ${i === 1 ? 'scale-105' : ''}`}
              >
                <span className="text-2xl mb-2">{c.medal}</span>
                <div className={`w-10 h-10 rounded-full ring-2 ${c.ring} bg-gray-800 flex items-center justify-center font-bold text-sm mb-2`}>
                  {user.name[0]}
                </div>
                <p className="font-semibold text-white text-xs truncate w-full">{user.name}</p>
                <p className="text-gray-600 text-[10px] mt-0.5 truncate w-full">{user.branch}</p>
                <p className={`font-bold text-lg mt-2 ${c.text}`}>{user.totalPoints}</p>
                <p className="text-gray-600 text-[10px]">pts</p>
              </div>
            )
          })}
        </div>
      )}

      {/* Table */}
      <div className="bg-gray-900/40 border border-gray-800/80 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px]">
            <thead>
              <tr className="border-b border-gray-800/80">
                {['Rank', 'Student', 'College', 'Problems', 'Quizzes', 'Points'].map(h => (
                  <th key={h} className="text-left text-gray-600 text-[11px] font-semibold uppercase tracking-wider p-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ranked.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-gray-600 text-sm py-16">No students yet</td>
                </tr>
              ) : (
                ranked.map((user: typeof ranked[number], index: number) => {
                  const isMe = user.clerkId === userId
                  const rankColors = ['text-yellow-400', 'text-gray-400', 'text-amber-600']
                  return (
                    <tr
                      key={user.id}
                      className={`border-b border-gray-800/40 transition-colors ${isMe ? 'bg-blue-500/5 border-l-2 border-l-blue-500' : 'hover:bg-gray-800/20'}`}
                    >
                      <td className="p-4">
                        <span className={`font-bold text-sm ${rankColors[index] || 'text-gray-600'}`}>
                          #{index + 1}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-semibold text-xs text-blue-400 shrink-0">
                            {user.name[0]}
                          </div>
                          <div>
                            <p className={`text-sm font-medium ${isMe ? 'text-blue-400' : 'text-white'}`}>
                              {user.name} {isMe && <span className="text-[10px] text-blue-500 ml-1">You</span>}
                            </p>
                            <p className="text-gray-600 text-xs">{user.branch}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-500 text-xs max-w-[160px] truncate">{user.college}</td>
                      <td className="p-4">
                        <span className="text-emerald-400 font-semibold text-sm">{user.problemsSolved}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-blue-400 font-semibold text-sm">{user.quizzesTaken}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-white text-sm">{user.totalPoints}</span>
                        <span className="text-gray-600 text-xs ml-1">pts</span>
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

export default function LeaderboardPage() {
  return (
    <Suspense fallback={<LeaderboardSkeleton />}>
      <LeaderboardContent />
    </Suspense>
  )
}
