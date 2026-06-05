import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { problemId } = await req.json()

  const user = await db.user.findUnique({
    where: { clerkId: userId }
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const existing = await db.userProblem.findUnique({
    where: {
      userId_problemId: {
        userId: user.id,
        problemId
      }
    }
  })

  if (existing) {
    // Toggle - agar already solved hai toh unsolved karo
    await db.userProblem.update({
      where: {
        userId_problemId: {
          userId: user.id,
          problemId
        }
      },
      data: { solved: !existing.solved }
    })
  } else {
    // Naya record banao
    await db.userProblem.create({
      data: {
        userId: user.id,
        problemId,
        solved: true
      }
    })
  }

  return NextResponse.json({ success: true })
}