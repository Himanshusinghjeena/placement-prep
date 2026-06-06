import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = await db.user.findUnique({ where: { clerkId: userId } })
  if (!admin || admin.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const material = await db.studyMaterial.create({ data: body })
  return NextResponse.json(material)
}