import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { resumeUrl } = await req.json()

  await db.user.update({
    where: { clerkId: userId },
    data: { resumeUrl }
  })

  return NextResponse.json({ success: true })
}