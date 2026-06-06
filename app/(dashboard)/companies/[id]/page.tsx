import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { notFound } from 'next/navigation'
import CompanyActions from '../[id]/CompanyActions'

export default async function CompanyDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { userId } = await auth()

  const company = await db.company.findUnique({
    where: { id },
    include: {
      interests: {
        include: { user: true }
      }
    }
  })

  if (!company) notFound()

  // Current user ka interest
  let userInterest = null
  if (userId) {
    const user = await db.user.findUnique({ where: { clerkId: userId } })
    if (user) {
      userInterest = await db.companyInterest.findUnique({
        where: { userId_companyId: { userId: user.id, companyId: id } }
      })
    }
  }

  const totalRegistered = company.interests.length

  const roundColors: Record<string, string> = {
    'Aptitude': 'bg-blue-900 text-blue-400 border-blue-700',
    'Coding': 'bg-purple-900 text-purple-400 border-purple-700',
    'Technical': 'bg-green-900 text-green-400 border-green-700',
    'HR': 'bg-yellow-900 text-yellow-400 border-yellow-700',
    'GD': 'bg-orange-900 text-orange-400 border-orange-700',
  }

  const statusMap: Record<string, { label: string, color: string }> = {
    'registered': { label: 'Registered', color: 'text-blue-400' },
    'round1': { label: 'Round 1 Cleared', color: 'text-green-400' },
    'round2': { label: 'Round 2 Cleared', color: 'text-green-400' },
    'round3': { label: 'Round 3 Cleared', color: 'text-green-400' },
    'selected': { label: '🎉 Selected!', color: 'text-yellow-400' },
    'rejected': { label: 'Not Selected', color: 'text-red-400' },
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-blue-900 flex items-center justify-center text-2xl font-bold text-blue-400">
              {company.name[0]}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{company.name}</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-gray-400 text-sm">{company.type}</span>
                {company.location && <span className="text-gray-500 text-sm">📍 {company.location}</span>}
                {company.website && (
                  <a href={company.website} target="_blank" className="text-blue-400 text-sm hover:underline">
                    🌐 Website
                  </a>
                )}
              </div>
            </div>
          </div>
          <CompanyActions
            companyId={company.id}
            userInterest={userInterest}
          />
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-green-400">₹{company.ctc} LPA</p>
            <p className="text-gray-400 text-xs mt-1">CTC Package</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-blue-400">{company.minCgpa}+</p>
            <p className="text-gray-400 text-xs mt-1">Min CGPA</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-purple-400">{company.rounds.length}</p>
            <p className="text-gray-400 text-xs mt-1">Total Rounds</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-yellow-400">{totalRegistered}</p>
            <p className="text-gray-400 text-xs mt-1">Students Registered</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 flex flex-col gap-6">

            {/* About */}
            {company.description && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h2 className="font-bold text-lg mb-3">About {company.name}</h2>
                <p className="text-gray-400 text-sm leading-relaxed">{company.description}</p>
              </div>
            )}

            {/* Placement Process */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="font-bold text-lg mb-4">Placement Process</h2>
              <div className="flex flex-col gap-3">
                {company.rounds.map((round: string, index: number) => {
                  const isCurrentRound = userInterest && userInterest.currentRound === index
                  const isCleared = userInterest && userInterest.currentRound > index
                  const isRejected = userInterest?.status === 'rejected'

                  return (
                    <div
                      key={round}
                      className={`flex items-center gap-4 p-4 rounded-xl border ${
                        isCurrentRound
                          ? 'border-blue-500 bg-blue-900/20'
                          : isCleared
                          ? 'border-green-800 bg-green-900/10'
                          : 'border-gray-800'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                        isCleared
                          ? 'bg-green-600 text-white'
                          : isCurrentRound
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-400'
                      }`}>
                        {isCleared ? '✓' : index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-white">Round {index + 1}: {round}</p>
                        <p className="text-gray-400 text-xs mt-0.5">
                          {isCleared ? 'Cleared ✅' : isCurrentRound ? 'Current Round 🔄' : 'Upcoming'}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-xs border ${roundColors[round] || 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                        {round}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Eligible Branches */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="font-bold text-lg mb-4">Eligible Branches</h2>
              <div className="flex gap-2 flex-wrap">
                {company.branches.map((branch: string) => (
                  <span key={branch} className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300">
                    {branch}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Right Sidebar */}
          <div className="flex flex-col gap-4">

            {/* Your Status */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h3 className="font-bold mb-4">Your Status</h3>
              {userInterest ? (
                <div>
                  <div className={`text-lg font-bold mb-3 ${statusMap[userInterest.status]?.color || 'text-white'}`}>
                    {statusMap[userInterest.status]?.label || 'Registered'}
                  </div>
                  {userInterest.status !== 'selected' && userInterest.status !== 'rejected' && (
                    <div>
                      <p className="text-gray-400 text-xs mb-2">Current Round:</p>
                      <p className="text-white font-medium">
                        {company.rounds[userInterest.currentRound] || 'Completed'}
                      </p>
                      {company.rounds[userInterest.currentRound + 1] && (
                        <div className="mt-3">
                          <p className="text-gray-400 text-xs mb-1">Next Round:</p>
                          <p className="text-blue-400 font-medium">
                            {company.rounds[userInterest.currentRound + 1]}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  <p className="text-gray-500 text-xs mt-4">
                    Registered on {new Date(userInterest.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">Not registered yet</p>
              )}
            </div>

            {/* Drive Details */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h3 className="font-bold mb-4">Drive Details</h3>
              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-gray-400 text-xs">Drive Date</p>
                  <p className="text-white text-sm font-medium mt-0.5">{company.date}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Company Type</p>
                  <p className="text-white text-sm font-medium mt-0.5">{company.type}</p>
                </div>
                {company.employees && (
                  <div>
                    <p className="text-gray-400 text-xs">Employees</p>
                    <p className="text-white text-sm font-medium mt-0.5">{company.employees}</p>
                  </div>
                )}
              </div>
            </div>

            {/* DSA Problems */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h3 className="font-bold mb-3">Practice for {company.name}</h3>
              <a
                href={`/problems?company=${company.name}`}
                className="block w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-lg text-sm font-medium transition-colors"
              >
                View {company.name} Problems →
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}