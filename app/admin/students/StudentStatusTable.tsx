'use client'

import { useState } from 'react'

const statusOptions = [
  { value: 'registered', label: 'Registered' },
  { value: 'round1', label: 'Round 1 Cleared' },
  { value: 'round2', label: 'Round 2 Cleared' },
  { value: 'round3', label: 'Round 3 Cleared' },
  { value: 'selected', label: '🎉 Selected' },
  { value: 'rejected', label: '❌ Rejected' },
]

const statusColors: Record<string, string> = {
  registered: 'text-blue-400',
  round1: 'text-green-400',
  round2: 'text-green-400',
  round3: 'text-green-400',
  selected: 'text-yellow-400',
  rejected: 'text-red-400',
}

export default function StudentStatusTable({ students, companies }: { students: any[], companies: any[] }) {
  const [selectedCompany, setSelectedCompany] = useState('all')
  const [updating, setUpdating] = useState<string | null>(null)
  const [localStudents, setLocalStudents] = useState(students)

  const handleStatusUpdate = async (userId: string, companyId: string, status: string) => {
    setUpdating(`${userId}-${companyId}`)

    const currentRoundMap: Record<string, number> = {
      registered: 0,
      round1: 1,
      round2: 2,
      round3: 3,
      selected: 99,
      rejected: -1,
    }

    await fetch('/api/admin/student-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        companyId,
        status,
        currentRound: currentRoundMap[status] || 0
      })
    })

    // Local state update
    setLocalStudents(prev => prev.map(s => {
      if (s.id === userId) {
        return {
          ...s,
          companyInterests: s.companyInterests.map((ci: any) => {
            if (ci.companyId === companyId) {
              return { ...ci, status, currentRound: currentRoundMap[status] || 0 }
            }
            return ci
          })
        }
      }
      return s
    }))

    setUpdating(null)
  }

  // Filter students by company
  const filteredStudents = selectedCompany === 'all'
    ? localStudents
    : localStudents.filter(s =>
        s.companyInterests.some((ci: any) => ci.companyId === selectedCompany)
      )

  return (
    <div>
      {/* Company Filter */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <span className="text-gray-400 text-sm">Filter by Company:</span>
        <button
          onClick={() => setSelectedCompany('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            selectedCompany === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 border border-gray-700 text-gray-400 hover:text-white'
          }`}
        >
          All Students
        </button>
        {companies.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedCompany(c.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedCompany === c.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 border border-gray-700 text-gray-400 hover:text-white'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Students Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left text-gray-400 text-sm font-medium p-4">Student</th>
              <th className="text-left text-gray-400 text-sm font-medium p-4">Branch</th>
              <th className="text-left text-gray-400 text-sm font-medium p-4">CGPA</th>
              <th className="text-left text-gray-400 text-sm font-medium p-4">Problems</th>
              <th className="text-left text-gray-400 text-sm font-medium p-4">Company Applications</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 py-12">
                  No students found
                </td>
              </tr>
            ) : (
              filteredStudents.map(student => (
                <tr key={student.id} className="border-b border-gray-800">
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
                  <td className="p-4 text-gray-400 text-sm">{student.branch || '-'}</td>
                  <td className="p-4 text-gray-400 text-sm">{student.cgpa || '-'}</td>
                  <td className="p-4 text-green-400 font-medium">{student._count.solvedProblems}</td>
                  <td className="p-4">
                    {student.companyInterests.length === 0 ? (
                      <span className="text-gray-500 text-sm">No applications</span>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {student.companyInterests
                          .filter((ci: any) => selectedCompany === 'all' || ci.companyId === selectedCompany)
                          .map((ci: any) => (
                            <div key={ci.id} className="flex items-center gap-3">
                              <span className="text-gray-300 text-xs font-medium w-20 truncate">
                                {ci.company.name}
                              </span>
                              <span className={`text-xs font-medium w-28 ${statusColors[ci.status] || 'text-gray-400'}`}>
                                {statusOptions.find(s => s.value === ci.status)?.label || ci.status}
                              </span>
                              <select
                                value={ci.status}
                                disabled={updating === `${student.id}-${ci.companyId}`}
                                onChange={e => handleStatusUpdate(student.id, ci.companyId, e.target.value)}
                                className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-white text-xs outline-none focus:border-blue-500 disabled:opacity-50"
                              >
                                {statusOptions.map(opt => (
                                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                              </select>
                            </div>
                          ))}
                      </div>
                    )}
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