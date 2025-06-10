import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    
    const updatedWhop = await prisma.whop.update({
      where: { id: params.id },
      data: {
        aboutContent: data.aboutContent,
        howToRedeemContent: data.howToRedeemContent,
        promoDetailsContent: data.promoDetailsContent,
        featuresContent: data.featuresContent,
        termsContent: data.termsContent,
        faqContent: data.faqContent,
      }
    });

    return NextResponse.json(updatedWhop);
  } catch (error) {
    console.error("Error updating whop content:", error);
    return NextResponse.json(
      { error: "Failed to update whop content" },
      { status: 500 }
    );
  }
} 