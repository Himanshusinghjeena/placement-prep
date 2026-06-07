import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import Pusher from 'pusher'

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
})

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const messages = await db.groupMessage.findMany({
    where: { groupId: id },
    include: {
      user: { select: { name: true, role: true, clerkId: true } }
    },
    orderBy: { createdAt: 'asc' },
    take: 50
  })

  return NextResponse.json(messages)
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { message } = await req.json()

  const user = await db.user.findUnique({ where: { clerkId: userId } })
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const newMessage = await db.groupMessage.create({
    data: { groupId: id, userId: user.id, message },
    include: {
      user: { select: { name: true, role: true, clerkId: true } }
    }
  })

  // Pusher se real-time broadcast karo
  await pusher.trigger(`group-${id}`, 'new-message', newMessage)

  return NextResponse.json(newMessage)
}