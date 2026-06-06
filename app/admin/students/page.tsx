import { db } from '@/lib/db'

export default async function AdminStudentsPage() {
  const students = await db.user.findMany({
    where: { role: 'student' },
    include: {
      _count: {
        select: {
          solvedProblems: true,
          quizAttempts: true,
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Students</h1>
        <p className="text-gray-400 mt-1">{students.length} registered students</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left text-gray-400 text-sm font-medium p-4">Student</th>
              <th className="text-left text-gray-400 text-sm font-medium p-4">College</th>
              <th className="text-left text-gray-400 text-sm font-medium p-4">Branch</th>
              <th className="text-left text-gray-400 text-sm font-medium p-4">Year</th>
              <th className="text-left text-gray-400 text-sm font-medium p-4">CGPA</th>
              <th className="text-left text-gray-400 text-sm font-medium p-4">Problems</th>
              <th className="text-left text-gray-400 text-sm font-medium p-4">Quizzes</th>
              <th className="text-left text-gray-400 text-sm font-medium p-4">Joined</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center text-gray-500 py-12">
                  No students registered yet
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id} className="border-b border-gray-800 hover:bg-gray-800">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-sm font-bold text-blue-400">
                        {student.name?.[0] || student.email[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{student.name || 'No name'}</p>
                        <p className="text-gray-500 text-xs">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-400 text-sm">{student.college || '-'}</td>
                  <td className="p-4 text-gray-400 text-sm">{student.branch || '-'}</td>
                  <td className="p-4 text-gray-400 text-sm">{student.year ? `${student.year} Year` : '-'}</td>
                  <td className="p-4 text-gray-400 text-sm">{student.cgpa || '-'}</td>
                  <td className="p-4">
                    <span className="text-green-400 font-medium">{student._count.solvedProblems}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-blue-400 font-medium">{student._count.quizAttempts}</span>
                  </td>
                  <td className="p-4 text-gray-500 text-xs">
                    {new Date(student.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}