import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = await db.user.findUnique({ where: { clerkId: userId } })
  if (!admin || admin.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const company = await db.company.create({ data: body })

  // Saare students ko notification bhejo
  const students = await db.user.findMany({
    where: { role: 'student' }
  })

  if (students.length > 0) {
    await db.notification.createMany({
      data: students.map(student => ({
        userId: student.id,
        title: '🏢 New Placement Drive!',
        message: `${company.name} is hiring! CTC: ₹${company.ctc} LPA. Check eligibility and register now.`,
        type: 'info',
        link: `/companies/${company.id}`,
      }))
    })
  }

  return NextResponse.json(company)
}