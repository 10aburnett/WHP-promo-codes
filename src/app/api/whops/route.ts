import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '15');
    const offset = (page - 1) * limit;
    
    console.log('Fetching whops with pagination:', { page, limit, offset });
    
    const whops = await prisma.whop.findMany({
      where: { 
        publishedAt: { not: null }
      },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'asc' },
      include: {
        promoCodes: true
      }
    });
    
    console.log(`Found ${whops.length} published whops`);
    
    // Simple transformation to match frontend expectations
    const transformedWhops = whops.map(whop => ({
      id: whop.id,
      whopName: whop.name || 'Unknown',
      slug: whop.slug,
      logoUrl: whop.logo || '/images/Simplified Logo.png',
      promoText: whop.description || 'N/A',
      promoType: whop.promoCodes?.[0]?.type || 'FREE',
      promoValue: parseFloat(whop.price?.replace(/[^0-9.]/g, '') || '0'),
      promoCode: whop.promoCodes?.[0]?.code || null,
      affiliateLink: whop.affiliateLink,
      isActive: true,
      price: whop.price || 'Free',
      whopId: whop.id,
      promoCodeId: whop.promoCodes?.[0]?.id || null,
      // Additional fields for compatibility
      name: whop.name || 'Unknown',
      description: whop.description || 'No description',
      rating: whop.rating || 0,
      createdAt: whop.createdAt,
      promoCodes: whop.promoCodes || [],
      website: whop.website,
      category: whop.category
    }));
    
    const total = await prisma.whop.count({
      where: { publishedAt: { not: null } }
    });
    
    console.log(`Total published whops: ${total}`);
    
    return NextResponse.json({
      data: transformedWhops,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
    
  } catch (error: any) {
    console.error('Whops API error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error.message
    }, { status: 500 });
  }
}