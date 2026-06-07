import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'

export default async function LeaderboardPage() {
  const { userId } = await auth()

  const users = await db.user.findMany({
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
    },
    orderBy: { createdAt: 'asc' }
  })

  type LeaderboardUser = Awaited<ReturnType<typeof db.user.findMany>>[number]

  // Points calculate karo
  const ranked = users.map((user: LeaderboardUser) => {
    const totalQuizScore = user.quizAttempts.reduce((sum: number, a: { score: number }) => sum + a.score, 0)
    const problemPoints = user._count.solvedProblems * 10
    const quizPoints = totalQuizScore * 5
    const totalPoints = problemPoints + quizPoints

    return {
      id: user.id,
      clerkId: user.clerkId,
      name: user.name || 'Anonymous',
      college: user.college || 'Unknown',
      branch: user.branch || '-',
      problemsSolved: user._count.solvedProblems,
      quizzesTaken: user._count.quizAttempts,
      totalPoints,
    }
  }).sort((a: { totalPoints: number }, b: { totalPoints: number }): number => b.totalPoints - a.totalPoints)

  return (
    <div className="min-h-screen bg-black text-white p-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Leaderboard 🏆</h1>
        <p className="text-gray-400 mt-1">Top performers on PlacePrep</p>
      </div>

      {/* Top 3 */}
      {ranked.length >= 3 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[ranked[1], ranked[0], ranked[2]].map((user, i) => {
            const actualRank = i === 0 ? 2 : i === 1 ? 1 : 3
            const colors = ['silver', 'gold', 'bronze'] as const
            const bgMap = { gold: 'bg-yellow-900 border-yellow-600', silver: 'bg-gray-800 border-gray-500', bronze: 'bg-orange-900 border-orange-700' }
            const textMap = { gold: 'text-yellow-400', silver: 'text-gray-300', bronze: 'text-orange-400' }
            const color = colors[i]

            return (
              <div key={user.id} className={`border rounded-xl p-6 text-center ${bgMap[color]} ${i === 1 ? 'scale-105' : ''}`}>
                <div className="text-4xl mb-2">{actualRank === 1 ? '🥇' : actualRank === 2 ? '🥈' : '🥉'}</div>
                <div className={`text-2xl font-bold ${textMap[color]}`}>#{actualRank}</div>
                <div className="w-12 h-12 rounded-full bg-blue-900 flex items-center justify-center font-bold text-lg mx-auto my-3">
                  {user.name[0]}
                </div>
                <p className="font-semibold text-white">{user.name}</p>
                <p className="text-gray-400 text-xs mt-1">{user.college}</p>
                <p className={`text-xl font-bold mt-3 ${textMap[color]}`}>{user.totalPoints} pts</p>
              </div>
            )
          })}
        </div>
      )}

      {/* Full Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
  <div className="overflow-x-auto">
  <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left text-gray-400 text-sm font-medium p-4">Rank</th>
              <th className="text-left text-gray-400 text-sm font-medium p-4">Student</th>
              <th className="text-left text-gray-400 text-sm font-medium p-4">College</th>
              <th className="text-left text-gray-400 text-sm font-medium p-4">Problems</th>
              <th className="text-left text-gray-400 text-sm font-medium p-4">Quizzes</th>
              <th className="text-left text-gray-400 text-sm font-medium p-4">Points</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((user: typeof ranked[number], index: number) => (
              <tr
                key={user.id}
                className={`border-b border-gray-800 transition-colors ${
                  user.clerkId === userId ? 'bg-blue-900/20' : 'hover:bg-gray-800'
                }`}
              >
                <td className="p-4">
                  <span className={`font-bold text-lg ${
                    index === 0 ? 'text-yellow-400' :
                    index === 1 ? 'text-gray-300' :
                    index === 2 ? 'text-orange-400' : 'text-gray-500'
                  }`}>
                    #{index + 1}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center font-bold text-sm">
                      {user.name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-white text-sm">{user.name}</p>
                      <p className="text-gray-500 text-xs">{user.branch}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-gray-400 text-sm">{user.college}</td>
                <td className="p-4">
                  <span className="text-green-400 font-medium">{user.problemsSolved}</span>
                </td>
                <td className="p-4">
                  <span className="text-blue-400 font-medium">{user.quizzesTaken}</span>
                </td>
                <td className="p-4">
                  <span className="font-bold text-white">{user.totalPoints}</span>
                  <span className="text-gray-500 text-xs ml-1">pts</span>
                </td>
              </tr>
            ))}
            {ranked.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 py-12">
                  No students yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )
}