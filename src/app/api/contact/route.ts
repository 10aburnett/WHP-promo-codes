import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for contact submissions
const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

// Validation schema for bulk delete
const bulkDeleteSchema = z.object({
  ids: z.array(z.string()).min(1, "At least one ID is required"),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    // Build where clause based on status filter
    const whereClause = status && status !== 'all' 
      ? { status: status.toUpperCase() as 'UNREAD' | 'READ' | 'REPLIED' }
      : {};
    
    const submissions = await prisma.contactSubmission.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(submissions);
  } catch (error: any) {
    console.error('Error fetching contact submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact submissions' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log('Contact form submission received');
    
    // Parse request body
    const data = await request.json();
    console.log('Received data:', JSON.stringify(data, null, 2));
    
    // Validate the data
    const validationResult = contactSchema.safeParse(data);
    if (!validationResult.success) {
      console.error('Validation failed:', validationResult.error.format());
      return NextResponse.json({
        error: "Invalid contact data",
        details: validationResult.error.format(),
      }, { status: 400 });
    }
    
    const { name, email, subject, message } = validationResult.data;
    
    // Save to database
    const submission = await prisma.contactSubmission.create({
      data: {
        name,
        email,
        subject,
        message,
        status: 'UNREAD'
      }
    });
    
    console.log('Contact submission saved:', submission.id);
    
    return NextResponse.json({
      success: true,
      message: "Contact form submitted successfully",
      id: submission.id
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Error processing contact submission:', error);
    return NextResponse.json({
      error: "Failed to submit contact form",
      details: error.message
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const data = await request.json();
    
    // Validate the data
    const validationResult = bulkDeleteSchema.safeParse(data);
    if (!validationResult.success) {
      return NextResponse.json({
        error: "Invalid delete data",
        details: validationResult.error.format(),
      }, { status: 400 });
    }
    
    const { ids } = validationResult.data;
    
    // Delete multiple submissions
    const result = await prisma.contactSubmission.deleteMany({
      where: {
        id: {
          in: ids
        }
      }
    });
    
    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${result.count} submissions`,
      deletedCount: result.count
    });
    
  } catch (error: any) {
    console.error('Error bulk deleting contact submissions:', error);
    return NextResponse.json(
      { error: 'Failed to delete contact submissions' },
      { status: 500 }
    );
  }
} 