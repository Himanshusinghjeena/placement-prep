import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const modules = [
  {
    href: '/problems',
    label: 'DSA Problems',
    desc: 'Practice coding problems',
    icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
    color: 'blue',
  },
  {
    href: '/companies',
    label: 'Companies',
    desc: 'Upcoming placement drives',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    color: 'violet',
  },
  {
    href: '/mock-interview',
    label: 'Mock Interview',
    desc: 'AI-powered mock interviews',
    icon: 'M15 10l4.553-2.069A1 1 0 0121 8.82V15.18a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
    color: 'emerald',
  },
  {
    href: '/quiz',
    label: 'Aptitude Quiz',
    desc: 'Practice aptitude tests',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    color: 'amber',
  },
  {
    href: '/leaderboard',
    label: 'Leaderboard',
    desc: 'See your college ranking',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    color: 'yellow',
  },
  {
    href: '/study',
    label: 'Study Materials',
    desc: 'OS, DBMS, CN concepts',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    color: 'cyan',
  },
]

const colorMap: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  blue:    { bg: 'bg-blue-500/10',    text: 'text-blue-400',    border: 'border-blue-500/20',    glow: 'group-hover:shadow-blue-500/10' },
  violet:  { bg: 'bg-violet-500/10',  text: 'text-violet-400',  border: 'border-violet-500/20',  glow: 'group-hover:shadow-violet-500/10' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', glow: 'group-hover:shadow-emerald-500/10' },
  amber:   { bg: 'bg-amber-500/10',   text: 'text-amber-400',   border: 'border-amber-500/20',   glow: 'group-hover:shadow-amber-500/10' },
  yellow:  { bg: 'bg-yellow-500/10',  text: 'text-yellow-400',  border: 'border-yellow-500/20',  glow: 'group-hover:shadow-yellow-500/10' },
  cyan:    { bg: 'bg-cyan-500/10',    text: 'text-cyan-400',    border: 'border-cyan-500/20',    glow: 'group-hover:shadow-cyan-500/10' },
}

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/')

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: {
      _count: { select: { solvedProblems: true, quizAttempts: true, companyInterests: true } },
      quizAttempts: { select: { score: true } },
    }
  })

  if (!user) redirect('/')

  const totalPoints = (user._count.solvedProblems * 10) +
    (user.quizAttempts.reduce((sum: number, a: any) => sum + a.score, 0) * 5)

  const stats = [
    { label: 'Problems Solved', value: user._count.solvedProblems, color: 'text-emerald-400', suffix: '' },
    { label: 'Quizzes Taken',   value: user._count.quizAttempts,   color: 'text-blue-400',    suffix: '' },
    { label: 'Drives Registered', value: user._count.companyInterests, color: 'text-violet-400', suffix: '' },
    { label: 'Total Points',    value: totalPoints,                 color: 'text-amber-400',   suffix: 'pts' },
  ]

  return (
    <div className="min-h-screen bg-[#080b11] text-white p-6 md:p-8">

      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Welcome back, <span className="text-blue-400">{user.name?.split(' ')[0] || 'Student'}</span> 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1.5">
          {user.college || 'Set your college in profile'} · {user.branch || 'Set your branch'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bg-gray-900/50 border border-gray-800/80 rounded-2xl p-4 md:p-5">
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">{s.label}</p>
            <p className={`${s.color} font-bold text-2xl md:text-3xl mt-2 tabular-nums`}>
              {s.value}{s.suffix && <span className="text-sm font-medium ml-1">{s.suffix}</span>}
            </p>
          </div>
        ))}
      </div>

      {/* Modules */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-200">Modules</h2>
        <span className="text-gray-600 text-xs">{modules.length} available</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {modules.map(({ href, label, desc, icon, color }) => {
          const c = colorMap[color]
          return (
            <Link key={href} href={href}>
              <div className={`
                group relative bg-gray-900/50 border border-gray-800/80 rounded-2xl p-5
                hover:border-gray-700 hover:bg-gray-900/80 
                transition-all duration-200 cursor-pointer
                hover:shadow-lg ${c.glow}
              `}>
                <div className={`w-10 h-10 rounded-xl ${c.bg} ${c.border} border flex items-center justify-center mb-4`}>
                  <svg className={`w-5 h-5 ${c.text}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                  </svg>
                </div>
                <h3 className="font-semibold text-white text-sm mb-1">{label}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
                <svg
                  className="absolute bottom-5 right-5 w-4 h-4 text-gray-700 group-hover:text-gray-500 transition-colors"
                  fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
