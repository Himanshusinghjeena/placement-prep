'use client'

import { useState, useEffect, useRef } from 'react'

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/notifications')
      .then(res => res.json())
      .then(data => setNotifications(data))
  }, [])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAllRead = async () => {
    await fetch('/api/notifications', { method: 'PATCH' })
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const typeColors: Record<string, string> = {
    success: 'border-l-green-500',
    warning: 'border-l-yellow-500',
    info: 'border-l-blue-500',
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => { setOpen(!open); if (!open && unreadCount > 0) markAllRead() }}
        className="relative w-9 h-9 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-80 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <h3 className="font-semibold text-white text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-blue-400 text-xs hover:text-blue-300">
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">No notifications yet</p>
            ) : (
              notifications.map(notif => (
                <a
                  key={notif.id}
                  href={notif.link || '#'}
                  className={`block px-4 py-3 border-b border-gray-800 border-l-2 hover:bg-gray-800 transition-colors ${
                    typeColors[notif.type] || 'border-l-blue-500'
                  } ${!notif.read ? 'bg-gray-800/50' : ''}`}
                >
                  <p className="text-white text-sm font-medium">{notif.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{notif.message}</p>
                  <p className="text-gray-600 text-xs mt-1">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </p>
                </a>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}