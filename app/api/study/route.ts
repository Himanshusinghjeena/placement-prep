import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const subject = searchParams.get('subject') || 'OS'

    console.log(`[API] Attempting to fetch materials for: ${subject}`)

    const materials = await db.studyMaterial.findMany({
      where: { subject },
      orderBy: { order: 'asc' }
    })

    console.log(`[API] Successfully found ${materials.length} records.`)
    return NextResponse.json(materials)

  } catch (error) {
    // 🚨 THIS WILL PRINT THE ACTUAL DATABASE ERROR TO YOUR TERMINAL
    console.error("[API_STUDY_ERROR]:", error)
    
    return NextResponse.json(
      { error: 'Failed to fetch from database' },
      { status: 500 }
    )
  }
}