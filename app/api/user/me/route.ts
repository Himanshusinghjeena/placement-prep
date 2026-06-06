import { auth, currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({}, { status: 401 })

  // Pehle dhundho
  let user = await db.user.findUnique({
    where: { clerkId: userId }
  })

  // Nahi mila toh banao
  if (!user) {
    const clerkUser = await currentUser()
    user = await db.user.create({
      data: {
        clerkId: userId,
        email: clerkUser?.emailAddresses[0].emailAddress || '',
        name: `${clerkUser?.firstName || ''} ${clerkUser?.lastName || ''}`.trim(),
      }
    })
  }

  return NextResponse.json(user)
}