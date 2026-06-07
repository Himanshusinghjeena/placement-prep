'use client'

import { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/toast'
import { StudySkeleton } from '@/components/ui/skeleton'

const subjects = [
  { key: 'OS',   label: 'Operating System',      icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { key: 'DBMS', label: 'Database Management',   icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4' },
  { key: 'CN',   label: 'Computer Networks',     icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' },
]

function formatContent(content: string) {
  return content.split('\n').map((line, i) => {
    if (line.startsWith('**') && line.endsWith('**')) {
      return <p key={i} className="font-semibold text-white mt-4 mb-1.5 text-sm">{line.replace(/\*\*/g, '')}</p>
    }
    if (line.startsWith('- ')) {
      return (
        <li key={i} className="text-gray-400 ml-4 list-disc text-sm leading-relaxed">
          {line.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '$1')}
        </li>
      )
    }
    if (line.startsWith('```')) return null
    if (line.trim() === '') return <div key={i} className="h-1.5" />
    return <p key={i} className="text-gray-400 text-sm leading-relaxed">{line.replace(/\*\*(.*?)\*\*/g, '$1')}</p>
  })
}

export default function StudyPage() {
  const toast = useToast()
  const [activeTab, setActiveTab]   = useState('OS')
  const [materials, setMaterials]   = useState<any[]>([])
  const [openTopic, setOpenTopic]   = useState<string | null>(null)
  const [tabLoading, setTabLoading] = useState(true)

  useEffect(() => {
    setTabLoading(true)
    setOpenTopic(null)
    fetch(`/api/study?subject=${activeTab}`)
      .then(async res => {
        if (!res.ok) throw new Error()
        const text = await res.text()
        return text ? JSON.parse(text) : []
      })
      .then(data => {
        setMaterials(data)
        setTabLoading(false)
      })
      .catch(() => {
        toast('Failed to load materials', 'error')
        setMaterials([])
        setTabLoading(false)
      })
  }, [activeTab])

  return (
    <div className="min-h-screen bg-[#080b11] text-white p-6 md:p-8">

      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Study Materials</h1>
        <p className="text-gray-500 text-sm mt-1.5">Core subjects for SDE interviews</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-7 bg-gray-900/60 border border-gray-800/80 rounded-2xl p-1 w-fit">
        {subjects.map(s => (
          <button
            key={s.key}
            onClick={() => setActiveTab(s.key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium rounded-xl transition-all duration-150 ${
              activeTab === s.key
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/25 shadow-sm'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
            </svg>
            <span className="hidden sm:inline">{s.label}</span>
            <span className="sm:hidden">{s.key}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {tabLoading ? (
        <div className="max-w-3xl flex flex-col gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-900/50 border border-gray-800/80 rounded-2xl p-5 flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-3 flex-1">
                <div className="h-4 w-5 bg-gray-800 rounded" />
                <div className="h-4 bg-gray-800 rounded w-48" />
              </div>
              <div className="h-4 w-4 bg-gray-800 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-3xl">
          <p className="text-gray-600 text-xs mb-4">{materials.length} topics</p>
          <div className="flex flex-col gap-2">
            {materials.map((material, index) => {
              const isOpen = openTopic === material.id
              return (
                <div
                  key={material.id}
                  className={`bg-gray-900/50 border rounded-2xl overflow-hidden transition-all duration-200 ${
                    isOpen ? 'border-blue-500/25' : 'border-gray-800/80 hover:border-gray-700'
                  }`}
                >
                  <button
                    onClick={() => setOpenTopic(isOpen ? null : material.id)}
                    className="w-full flex items-center justify-between p-5 text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-blue-500/70 font-bold text-xs w-5 tabular-nums">{index + 1}</span>
                      <span className="font-medium text-gray-200 text-sm group-hover:text-white transition-colors">
                        {material.topic}
                      </span>
                    </div>
                    <svg
                      className={`w-4 h-4 text-gray-600 transition-transform duration-200 shrink-0 ml-3 ${isOpen ? 'rotate-180 text-blue-400' : ''}`}
                      fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 border-t border-gray-800/60 pt-4">
                      <div className="space-y-0.5">
                        {formatContent(material.content)}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            {materials.length === 0 && (
              <div className="text-center py-16 text-gray-600 text-sm">
                No materials available for this subject
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
