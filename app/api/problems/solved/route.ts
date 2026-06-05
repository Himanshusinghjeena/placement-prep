import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json([])
  }

  const user = await db.user.findUnique({
    where: { clerkId: userId }
  })

  if (!user) return NextResponse.json([])

  const solved = await db.userProblem.findMany({
    where: {
      userId: user.id,
      solved: true
    }
  })

  return NextResponse.json(solved)
}