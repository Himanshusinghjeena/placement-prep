import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { companyId } = await req.json()

    const user = await db.user.findUnique({ where: { clerkId: userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const existing = await db.companyInterest.findUnique({
      where: {
        userId_companyId: {
          userId: user.id,
          companyId
        }
      }
    })

    if (existing) {
      await db.companyInterest.delete({
        where: {
          userId_companyId: {
            userId: user.id,
            companyId
          }
        }
      })
      return NextResponse.json({ registered: false })
    }

    await db.companyInterest.create({
      data: { userId: user.id, companyId }
    })

    return NextResponse.json({ registered: true })
  } catch (error) {
    console.error('Interest error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json([])

    const user = await db.user.findUnique({ where: { clerkId: userId } })
    if (!user) return NextResponse.json([])

    const interests = await db.companyInterest.findMany({
      where: { userId: user.id }
    })

    return NextResponse.json(interests.map(i => i.companyId))
  } catch (error) {
    return NextResponse.json([])
  }
}