'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { href: '/problems', label: 'DSA Problems', icon: '💻' },
  { href: '/companies', label: 'Companies', icon: '🏢' },
  { href: '/mock-interview', label: 'Mock Interview', icon: '🎯' },
  { href: '/quiz', label: 'Aptitude Quiz', icon: '📝' },
  { href: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
  { href: '/profile', label: 'My Profile', icon: '👤' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-60 min-h-screen bg-gray-900 border-r border-gray-800 flex flex-col">
      
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white">PlacePrep 🚀</h1>
        <p className="text-gray-400 text-xs mt-1">Placement Preparation</p>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-4">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
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

    </div>
  )
}