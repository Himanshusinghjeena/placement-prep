import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { quizId, score, totalQ } = await req.json()

  const user = await db.user.findUnique({ where: { clerkId: userId } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  await db.quizAttempt.create({
    data: { userId: user.id, quizId, score, totalQ }
  })

  return NextResponse.json({ success: true })
}