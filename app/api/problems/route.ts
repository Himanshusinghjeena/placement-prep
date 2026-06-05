import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const problems = await db.problem.findMany({
    orderBy: { createdAt: 'asc' }
  })
  return NextResponse.json(problems)
}