import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const vendorId = searchParams.get('vendorId');

    const where: any = {};
    if (vendorId) {
      where.vendorId = vendorId;
    }

    const enquiries = await prisma.vendorEnquiry.findMany({
      where,
      include: {
        vendor: {
          select: { id: true, businessName: true, category: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, count: enquiries.length, data: enquiries });
  } catch (error: any) {
    console.error('Fetch vendor enquiries error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch enquiries.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      vendorId,
      eventTitle,
      organizerName,
      organizerPhone,
      organizerEmail,
      date,
      guestCount,
      notes,
      budgetEstimated,
    } = body;

    if (!organizerName || !organizerEmail || !date) {
      return NextResponse.json(
        { error: 'Organizer name, email, and event date are required.' },
        { status: 400 }
      );
    }

    const enquiry = await prisma.vendorEnquiry.create({
      data: {
        vendorId: vendorId || null,
        eventTitle: eventTitle || 'Special Event',
        organizerName,
        organizerPhone: organizerPhone || '',
        organizerEmail: organizerEmail.toLowerCase().trim(),
        date,
        guestCount: Number(guestCount) || 100,
        budgetEstimated: Number(budgetEstimated) || 0,
        notes: notes || '',
        receivedTime: 'Just now',
        status: 'pending',
      },
    });

    return NextResponse.json({ success: true, data: enquiry }, { status: 201 });
  } catch (error: any) {
    console.error('Create enquiry error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to submit enquiry.' },
      { status: 500 }
    );
  }
}
