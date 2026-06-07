'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { href: '/problems', label: 'DSA Problems', icon: '💻' },
  { href: '/companies', label: 'Companies', icon: '🏢' },
  { href: '/mock-interview', label: 'Mock Interview', icon: '🎯' },
  { href: '/quiz', label: 'Aptitude Quiz', icon: '📝' },
  { href: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
  { href: '/study', label: 'Study Materials', icon: '📚' },
  { href: '/profile', label: 'My Profile', icon: '👤' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed top-4 left-4 z-50 w-9 h-9 bg-gray-900 border border-gray-700 rounded-lg flex items-center justify-center text-white"
      >
        {open ? '✕' : '☰'}
      </button>

      {/* Overlay on mobile */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-30"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-screen w-60 bg-gray-900 border-r border-gray-800 flex flex-col z-40
        transition-transform duration-200
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold text-white">PlacePrep 🚀</h1>
          <p className="text-gray-400 text-xs mt-1">Placement Preparation</p>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm font-medium transition-colors ${
                pathname === item.href
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <span>⚙️</span>
            <span>Admin Panel</span>
          </Link>
        </div>
      </div>
    </>
  )
}