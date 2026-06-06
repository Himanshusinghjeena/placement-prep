import { db } from '@/lib/db'

export default async function AdminPage() {
  const [totalStudents, totalProblems, totalCompanies, totalQuizAttempts] = await Promise.all([
    db.user.count({ where: { role: 'student' } }),
    db.problem.count(),
    db.company.count(),
    db.quizAttempt.count(),
  ])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">TPO Overview</h1>
        <p className="text-gray-400 mt-1">Platform analytics at a glance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Students', value: totalStudents, color: 'blue' },
          { label: 'DSA Problems', value: totalProblems, color: 'green' },
          { label: 'Companies', value: totalCompanies, color: 'purple' },
          { label: 'Quiz Attempts', value: totalQuizAttempts, color: 'amber' },
        ].map(stat => (
          <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm">{stat.label}</p>
            <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-3 gap-4">
        {[
          { href: '/admin/companies', label: '+ Add Company Drive', desc: 'Post a new placement drive' },
          { href: '/admin/quiz', label: '+ Add Quiz', desc: 'Create new aptitude quiz' },
          { href: '/admin/students', label: 'View Students', desc: 'See all registered students' },
        ].map(action => (
            <a
            key={action.href}
            href={action.href}
            className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-blue-500 transition-colors" >
            <p className="font-semibold text-white">{action.label}</p>
            <p className="text-gray-400 text-sm mt-1">{action.desc}</p>
          </a>
        ))}
      </div>
    </div>
  )
}