'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const { user } = useUser()
  const router = useRouter()

  const [form, setForm] = useState({
    college: '',
    branch: '',
    year: '',
    cgpa: '',
  })

  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    const res = await fetch('/api/user/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2">Complete Your Profile</h1>
        <p className="text-gray-400 text-sm mb-6">Fill your details to get started</p>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">College Name</label>
            <input
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
              placeholder="e.g. IIT Delhi"
              value={form.college}
              onChange={(e) => setForm({ ...form, college: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Branch</label>
            <select
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
              value={form.branch}
              onChange={(e) => setForm({ ...form, branch: e.target.value })}
            >
              <option value="">Select Branch</option>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="ECE">ECE</option>
              <option value="ME">ME</option>
              <option value="CE">CE</option>
              <option value="EE">EE</option>
              <option value="MCA">MCA</option>
              <option value="MBA">MBA</option>
              <option value="MTech">MTech</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Year</label>
            <select
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
            >
              <option value="">Select Year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">CGPA</label>
            <input
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
              placeholder="e.g. 8.5"
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={form.cgpa}
              onChange={(e) => setForm({ ...form, cgpa: e.target.value })}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5 font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  )
}