import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const companies = await db.company.findMany({
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(companies)
}