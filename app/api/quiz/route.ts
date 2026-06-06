import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const quizzes = await db.quiz.findMany({
    include: {
      _count: {
        select: { questions: true }
      }
    },
    orderBy: { createdAt: 'asc' }
  })
  return NextResponse.json(quizzes)
}