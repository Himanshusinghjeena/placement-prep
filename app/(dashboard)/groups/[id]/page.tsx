import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import GroupChat from './GroupChat'

export default async function GroupChatPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const user = await db.user.findUnique({ where: { clerkId: userId } })
  if (!user) redirect('/sign-in')

  const group = await db.group.findUnique({
    where: { id },
    include: {
      company: { select: { name: true, id: true } },
      members: { include: { user: { select: { name: true, role: true } } } },
      _count: { select: { members: true } }
    }
  })

  if (!group) redirect('/groups')

  // Check karo user member hai ya nahi (admin always allowed)
  const isMember = user.role === 'admin' ||
    group.members.some((m: { userId: string }) => m.userId === user.id)

  if (!isMember) redirect('/groups')

  const messages = await db.groupMessage.findMany({
    where: { groupId: id },
    include: {
      user: { select: { name: true, role: true, clerkId: true } }
    },
    orderBy: { createdAt: 'asc' },
    take: 50
  })

  return (
    <GroupChat
      group={group}
      initialMessages={messages}
      currentUser={{ id: user.id, clerkId: userId, name: user.name || 'User', role: user.role || 'student' }}
    />
  )
}