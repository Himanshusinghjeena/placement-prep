import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ problemsSolved: 0, quizzesTaken: 0, totalPoints: 0 })

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: {
      _count: {
        select: {
          solvedProblems: true,
          quizAttempts: true,
        }
      },
      quizAttempts: {
        select: { score: true }
      }
    }
  })

  if (!user) return NextResponse.json({ problemsSolved: 0, quizzesTaken: 0, totalPoints: 0 })

  const totalPoints = (user._count.solvedProblems * 10) +
    (user.quizAttempts.reduce((sum: number, a: { score: number }) => sum + a.score, 0) * 5)

  return NextResponse.json({
    problemsSolved: user._count.solvedProblems,
    quizzesTaken: user._count.quizAttempts,
    totalPoints
  })
}