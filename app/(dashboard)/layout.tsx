import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import Sidebar from '@/components/Sidebar'
import NotificationBell from '@/components/NotificationBell'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-60">
        <header className="flex justify-end items-center p-4 gap-4 h-16 bg-black border-b border-gray-800 sticky top-0 z-10">
          <NotificationBell />
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="px-4 py-2 text-sm font-medium text-white hover:text-blue-400 transition-colors">
                Sign In
              </button>
            </SignInButton>
          </Show>
          <Show when="signed-out">
            <SignUpButton mode="modal">
              <button className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Sign Up
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}