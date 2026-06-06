'use client'

import { useState, useEffect } from 'react'

const subjects = ['OS', 'DBMS', 'CN']

export default function AdminStudyPage() {
  const [materials, setMaterials] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('OS')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    subject: 'OS',
    topic: '',
    content: '',
    order: 0,
  })

  useEffect(() => {
    fetch(`/api/study?subject=${activeTab}`)
      .then(res => res.json())
      .then(data => setMaterials(data))
  }, [activeTab])

  const handleSubmit = async () => {
    setLoading(true)
    const url = editingId ? `/api/admin/study/${editingId}` : '/api/admin/study'
    const method = editingId ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, subject: activeTab })
    })

    const data = await res.json()

    if (editingId) {
      setMaterials(prev => prev.map(m => m.id === editingId ? data : m))
    } else {
      setMaterials(prev => [...prev, data])
    }

    resetForm()
    setLoading(false)
  }

  const handleEdit = (material: any) => {
    setForm({
      subject: material.subject,
      topic: material.topic,
      content: material.content,
      order: material.order,
    })
    setEditingId(material.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this topic?')) return
    await fetch(`/api/admin/study/${id}`, { method: 'DELETE' })
    setMaterials(prev => prev.filter(m => m.id !== id))
  }

  const resetForm = () => {
    setForm({ subject: activeTab, topic: '', content: '', order: 0 })
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Study Materials</h1>
          <p className="text-gray-400 mt-1">Add and manage study topics</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ subject: activeTab, topic: '', content: '', order: 0 }) }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + Add Topic
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-6">
          <h2 className="font-semibold text-white mb-4">
            {editingId ? 'Edit Topic' : 'New Topic'}
          </h2>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Topic Title</label>
                <input
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
                  placeholder="e.g. What is Deadlock?"
                  value={form.topic}
                  onChange={e => setForm({ ...form, topic: e.target.value })}
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Order (position)</label>
                <input
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
                  type="number"
                  value={form.order}
                  onChange={e => setForm({ ...form, order: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">
                Content
                <span className="text-gray-500 ml-2 text-xs">(Use **bold** for headings, - for bullet points)</span>
              </label>
              <textarea
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500 font-mono text-sm"
                rows={12}
                placeholder={`**Main Heading:**\n- Point 1\n- Point 2\n\n**Another Heading:**\n- Point 3`}
                value={form.content}
                onChange={e => setForm({ ...form, content: e.target.value })}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={loading || !form.topic || !form.content}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
              >
                {loading ? 'Saving...' : editingId ? 'Update Topic' : 'Save Topic'}
              </button>
              <button
                onClick={resetForm}
                className="bg-gray-800 text-gray-400 px-6 py-2 rounded-lg text-sm transition-colors hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subject Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-800">
        {subjects.map(s => (
          <button
            key={s}
            onClick={() => setActiveTab(s)}
            className={`px-6 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === s
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            {s === 'OS' ? '🖥️ Operating System' : s === 'DBMS' ? '🗄️ DBMS' : '🌐 Computer Networks'}
          </button>
        ))}
      </div>

      {/* Materials List */}
      <div className="flex flex-col gap-3">
        {materials.length === 0 ? (
          <p className="text-gray-500 text-center py-12">No topics yet — add one!</p>
        ) : (
          materials.map((material, index) => (
            <div key={material.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <span className="text-blue-500 font-bold text-sm mt-0.5 w-5">{index + 1}</span>
                <div className="flex-1">
                  <p className="font-medium text-white">{material.topic}</p>
                  <p className="text-gray-500 text-xs mt-1 line-clamp-2">{material.content.substring(0, 100)}...</p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => handleEdit(material)}
                  className="px-3 py-1.5 bg-gray-800 text-gray-300 hover:text-white rounded-lg text-xs transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(material.id)}
                  className="px-3 py-1.5 bg-red-900/30 text-red-400 hover:bg-red-900/50 rounded-lg text-xs transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}