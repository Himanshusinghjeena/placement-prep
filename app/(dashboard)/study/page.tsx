'use client'

import { useState, useEffect } from 'react'

const subjects = [
  { key: 'OS', label: 'Operating System', icon: '🖥️' },
  { key: 'DBMS', label: 'Database Management', icon: '🗄️' },
  { key: 'CN', label: 'Computer Networks', icon: '🌐' },
]

export default function StudyPage() {
  const [activeTab, setActiveTab] = useState('OS')
  const [materials, setMaterials] = useState<any[]>([])
  const [openTopic, setOpenTopic] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setOpenTopic(null)
    
    fetch(`/api/study?subject=${activeTab}`)
      .then(async (res) => {
        // 1. Check if the response status is 2xx
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        
        // 2. Read the text first to prevent empty-body JSON errors
        const text = await res.text()
        return text ? JSON.parse(text) : []
      })
      .then(data => {
        setMaterials(data)
        setLoading(false)
      })
      .catch(error => {
        console.error("Failed to fetch materials:", error)
        setMaterials([]) // Set an empty array as a fallback
        setLoading(false)
      })
  }, [activeTab])

  const formatContent = (content: string) => {
    return content
      .split('\n')
      .map((line, i) => {
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={i} className="font-semibold text-white mt-3 mb-1">{line.replace(/\*\*/g, '')}</p>
        }
        if (line.startsWith('- ')) {
          return <li key={i} className="text-gray-300 ml-4 list-disc">{line.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '$1')}</li>
        }
        if (line.startsWith('```')) {
          return null
        }
        if (line.trim() === '') return <br key={i} />
        return <p key={i} className="text-gray-300 text-sm leading-relaxed">{line.replace(/\*\*(.*?)\*\*/g, '$1')}</p>
      })
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Study Materials 📚</h1>
        <p className="text-gray-400 mt-1">Core subjects for SDE interviews</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-gray-800 pb-0">
        {subjects.map(subject => (
          <button
            key={subject.key}
            onClick={() => setActiveTab(subject.key)}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === subject.key
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <span>{subject.icon}</span>
            <span>{subject.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading...</div>
      ) : (
        <div className="max-w-3xl">
          <p className="text-gray-500 text-sm mb-4">{materials.length} topics</p>
          <div className="flex flex-col gap-3">
            {materials.map((material, index) => (
              <div
                key={material.id}
                className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
              >
                {/* Accordion Header */}
                <button
                  onClick={() => setOpenTopic(openTopic === material.id ? null : material.id)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-blue-500 font-bold text-sm w-6">{index + 1}</span>
                    <span className="font-medium text-white">{material.topic}</span>
                  </div>
                  <span className={`text-gray-400 transition-transform ${openTopic === material.id ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>

                {/* Accordion Content */}
                {openTopic === material.id && (
                  <div className="px-5 pb-5 border-t border-gray-800 pt-4">
                    <div className="space-y-1">
                      {formatContent(material.content)}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}