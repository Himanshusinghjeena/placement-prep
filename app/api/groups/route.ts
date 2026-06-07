import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json([])

  const user = await db.user.findUnique({ where: { clerkId: userId } })
  if (!user) return NextResponse.json([])

  // Admin — saare groups dikhe
  if (user.role === 'admin') {
    const groups = await db.group.findMany({
      include: {
        company: { select: { name: true, id: true, type: true } },
        _count: { select: { members: true, messages: true } }
      }
    })
    return NextResponse.json(groups)
  }

  // Student — sirf joined groups
  const groupMembers = await db.groupMember.findMany({
    where: { userId: user.id },
    include: {
      group: {
        include: {
          company: { select: { name: true, id: true, type: true } },
          _count: { select: { members: true, messages: true } }
        }
      }
    }
  })

  return NextResponse.json(groupMembers.map((gm: typeof groupMembers[number]) => gm.group))
}