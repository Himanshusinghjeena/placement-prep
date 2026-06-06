'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [saved, setSaved] = useState(false)

  const [form, setForm] = useState({
    college: '',
    branch: '',
    year: '',
    cgpa: '',
  })

  // Existing data load karo
  useEffect(() => {
    fetch('/api/user/me')
      .then(res => res.json())
      .then(data => {
        setForm({
          college: data.college || '',
          branch: data.branch || '',
          year: data.year?.toString() || '',
          cgpa: data.cgpa?.toString() || '',
        })
        setFetching(false)
      })
  }, [])

  const handleSubmit = async () => {
    setLoading(true)
    setSaved(false)
    await fetch('/api/user/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (fetching) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-gray-400 mt-1">Update your placement details</p>
        </div>

        {/* Profile Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">

          {/* Avatar */}
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-800">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold">
              {form.college?.[0] || '?'}
            </div>
            <div>
              <p className="font-semibold text-lg">{form.college || 'Your College'}</p>
              <p className="text-gray-400 text-sm">{form.branch || 'Branch'} • {form.year ? `${form.year} Year` : 'Year'}</p>
            </div>
          </div>

          {/* Form */}
          <div className="grid grid-cols-2 gap-6">

            <div className="col-span-2">
              <label className="text-sm text-gray-400 mb-2 block font-medium">College Name</label>
              <input
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
                placeholder="e.g. IET Lucknow"
                value={form.college}
                onChange={e => setForm({ ...form, college: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block font-medium">Branch</label>
              <select
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
                value={form.branch}
                onChange={e => setForm({ ...form, branch: e.target.value })}
              >
                <option value="">Select Branch</option>
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
                <option value="ME">ME</option>
                <option value="CE">CE</option>
                <option value="EE">EE</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block font-medium">Year</label>
              <select
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
                value={form.year}
                onChange={e => setForm({ ...form, year: e.target.value })}
              >
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="text-sm text-gray-400 mb-2 block font-medium">CGPA</label>
              <input
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
                placeholder="e.g. 8.5"
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={form.cgpa}
                onChange={e => setForm({ ...form, cgpa: e.target.value })}
              />
            </div>

          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-800">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">0</p>
              <p className="text-gray-400 text-sm mt-1">Problems Solved</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">0</p>
              <p className="text-gray-400 text-sm mt-1">Quizzes Taken</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">0</p>
              <p className="text-gray-400 text-sm mt-1">Total Points</p>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`mt-8 w-full py-3 rounded-lg font-medium transition-all ${
              saved
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50'
            }`}
          >
            {loading ? 'Saving...' : saved ? '✓ Saved!' : 'Save Profile'}
          </button>

        </div>
      </div>
    </div>
  )
}