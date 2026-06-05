import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { college, branch, year, cgpa } = await req.json()

  await db.user.update({
    where: { clerkId: userId },
    data: {
      college,
      branch,
      year: parseInt(year),
      cgpa: parseFloat(cgpa),
    },
  })

  return NextResponse.json({ success: true })
}