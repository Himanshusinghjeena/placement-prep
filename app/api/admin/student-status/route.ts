import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = await db.user.findUnique({ where: { clerkId: userId } })
  if (!admin || admin.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { userId: studentId, companyId, status, currentRound } = await req.json()

  await db.companyInterest.update({
    where: {
      userId_companyId: { userId: studentId, companyId }
    },
    data: { status, currentRound }
  })

  // Company name lo
  const company = await db.company.findUnique({ where: { id: companyId } })

  // Status ke hisaab se notification
  const notifMap: Record<string, { title: string, message: string, type: string }> = {
    round1: {
      title: '✅ Round 1 Cleared!',
      message: `Congratulations! You cleared Round 1 at ${company?.name}. Prepare for Round 2.`,
      type: 'success'
    },
    round2: {
      title: '✅ Round 2 Cleared!',
      message: `Great job! You cleared Round 2 at ${company?.name}. Keep going!`,
      type: 'success'
    },
    round3: {
      title: '✅ Round 3 Cleared!',
      message: `Excellent! You cleared Round 3 at ${company?.name}. Final round coming up!`,
      type: 'success'
    },
    selected: {
      title: '🎉 Congratulations! You are Selected!',
      message: `You have been selected at ${company?.name}! Offer letter will be shared soon.`,
      type: 'success'
    },
    rejected: {
      title: '❌ Application Update',
      message: `Your application at ${company?.name} was not selected this time. Keep preparing!`,
      type: 'warning'
    },
  }

  const notif = notifMap[status]
  if (notif) {
    await db.notification.create({
      data: {
        userId: studentId,
        title: notif.title,
        message: notif.message,
        type: notif.type,
        link: `/companies/${companyId}`,
      }
    })
  }

  return NextResponse.json({ success: true })
}