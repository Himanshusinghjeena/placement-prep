import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { sendNewDriveEmail } from '@/lib/email'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = await db.user.findUnique({ where: { clerkId: userId } })
  if (!admin || admin.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const company = await db.company.create({ data: body })

  // Group auto-create karo
  const group = await db.group.create({
    data: {
      companyId: company.id,
      name: `${company.name} — Placement Drive`,
    }
  })

  // Admin ko group mein add karo
  await db.groupMember.create({
    data: { groupId: group.id, userId: admin.id }
  })

  // Saare students fetch karo
  const students = await db.user.findMany({
    where: { role: 'student' },
    select: { id: true, email: true }
  })

  // Notifications save karo
  if (students.length > 0) {
    await db.notification.createMany({
      data: students.map((student: { id: string; email: string | null }) => ({
        userId: student.id,
        title: '🏢 New Placement Drive!',
        message: `${company.name} is hiring! CTC: ₹${company.ctc} LPA.`,
        type: 'info',
        link: `/companies/${company.id}`,
      }))
    })

    // Email bhejo
    const emails: string[] = students
      .map((s: { id: string; email: string | null }) => s.email)
      .filter((email: string | null): email is string => Boolean(email))
    await sendNewDriveEmail(emails, {
      id: company.id,
      name: company.name,
      ctc: company.ctc,
      date: company.date,
      type: company.type,
    })
  }

  return NextResponse.json(company)
}