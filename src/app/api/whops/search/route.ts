import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { LAUNCH_MODE, LAUNCH_COHORT_SLUGS } from '@/lib/launch-cohort'

// GET /api/whops/search?q=term&limit=20 - Server-side search for whops
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100) // Max 100 results

    if (!query.trim()) {
      return NextResponse.json([])
    }

    // Build where clause with launch cohort gate at DB level
    const whereClause: any = {
      name: {
        contains: query,
        mode: 'insensitive' // Case insensitive search
      }
    };

    // Launch cohort gate: Only search within cohort slugs
    if (LAUNCH_MODE && LAUNCH_COHORT_SLUGS.size > 0) {
      whereClause.slug = { in: Array.from(LAUNCH_COHORT_SLUGS) };
    }

    const whops = await prisma.deal.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        slug: true
      },
      orderBy: { name: 'asc' },
      take: limit
    })

    return NextResponse.json(whops)
  } catch (error) {
    console.error('Error searching whops:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}