import { db } from '@/lib/db'
import StudentStatusTable from './StudentStatusTable'
export default async function AdminStudentsPage() {
  const students = await db.user.findMany({
    where: { role: 'student' },
    include: {
      _count: {
        select: {
          solvedProblems: true,
          quizAttempts: true,
        }
      },
      companyInterests: {
        include: { company: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  const companies = await db.company.findMany({
    orderBy: { name: 'asc' }
  })

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Students</h1>
        <p className="text-gray-400 mt-1">{students.length} registered students</p>
      </div>
      <StudentStatusTable students={students} companies={companies} />
    </div>
  )
}