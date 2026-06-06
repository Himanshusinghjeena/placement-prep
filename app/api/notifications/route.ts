import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json([])

  const user = await db.user.findUnique({ where: { clerkId: userId } })
  if (!user) return NextResponse.json([])

  const notifications = await db.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 20
  })

  return NextResponse.json(notifications)
}

export async function PATCH(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await db.user.findUnique({ where: { clerkId: userId } })
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await db.notification.updateMany({
    where: { userId: user.id, read: false },
    data: { read: true }
  })

  return NextResponse.json({ success: true })
}