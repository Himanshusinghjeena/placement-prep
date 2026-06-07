import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function GroupsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const user = await db.user.findUnique({ where: { clerkId: userId } })
  if (!user) redirect('/sign-in')

  // Admin — saare groups dikhe
  // Student — sirf joined groups
  const groupMembers = user.role === 'admin'
    ? await db.group.findMany({
        include: {
          company: { select: { name: true, id: true, type: true } },
          _count: { select: { members: true, messages: true } }
        }
      })
    : (await db.groupMember.findMany({
        where: { userId: user.id },
        include: {
          group: {
            include: {
              company: { select: { name: true, id: true, type: true } },
              _count: { select: { members: true, messages: true } }
            }
          }
        }
      })).map((gm: { group: any }) => gm.group)

  const groups = groupMembers as any[]

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Groups 💬</h1>
        <p className="text-gray-400 mt-1">Company placement drive discussion groups</p>
      </div>

      {groups.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">💬</p>
          <p className="text-gray-400 text-lg">No groups yet</p>
          <p className="text-gray-500 text-sm mt-2">Register for a placement drive to join its group</p>
          <Link href="/companies" className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
            Browse Companies →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group: any) => (
            <Link key={group.id} href={`/groups/${group.id}`}>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-blue-500 transition-colors cursor-pointer">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-900 flex items-center justify-center font-bold text-blue-400 text-lg">
                    {group.company.name[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{group.name}</h3>
                    <p className="text-gray-400 text-xs">{group.company.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-400">👥 {group._count.members} members</span>
                  <span className="text-gray-400">💬 {group._count.messages} messages</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}