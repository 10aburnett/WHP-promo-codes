import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const today = new Date();
    
    // Get count of unpublished whops
    const unpublishedCount = await prisma.whop.count({
      where: {
        publishedAt: null
      }
    });

    if (unpublishedCount === 0) {
      return NextResponse.json({ 
        message: 'No more whops to publish',
        published: 0,
        remaining: 0
      });
    }

    // Publish 250 whops (or remaining if less than 250)
    const batchSize = Math.min(250, unpublishedCount);
    
    // Get the oldest 250 unpublished whops (by createdAt)
    const whopsToPublish = await prisma.whop.findMany({
      where: {
        publishedAt: null
      },
      orderBy: {
        createdAt: 'asc' // Oldest first
      },
      take: batchSize,
      select: {
        id: true
      }
    });

    // Update them to be published
    await prisma.whop.updateMany({
      where: {
        id: {
          in: whopsToPublish.map(whop => whop.id)
        }
      },
      data: {
        publishedAt: today
      }
    });

    const remainingCount = unpublishedCount - batchSize;

    console.log(`Published ${batchSize} whops. ${remainingCount} remaining.`);

    return NextResponse.json({
      message: `Successfully published ${batchSize} whops`,
      published: batchSize,
      remaining: remainingCount,
      date: today.toISOString()
    });

  } catch (error) {
    console.error('Error publishing whops:', error);
    return NextResponse.json(
      { error: 'Failed to publish whops' },
      { status: 500 }
    );
  }
}