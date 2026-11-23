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

    const bookings = await prisma.vendorBooking.findMany({
      where,
      include: {
        vendor: {
          select: { id: true, businessName: true, category: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, count: bookings.length, data: bookings });
  } catch (error: any) {
    console.error('Fetch vendor bookings error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch bookings.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { vendorId, clientName, eventTitle, date, venue, amount, depositStatus } = body;

    if (!clientName || !eventTitle || !date || !amount) {
      return NextResponse.json(
        { error: 'Client name, event title, date, and amount are required.' },
        { status: 400 }
      );
    }

    const booking = await prisma.vendorBooking.create({
      data: {
        vendorId: vendorId || null,
        clientName,
        eventTitle,
        date,
        venue: venue || 'Lagos, Nigeria',
        amount: Number(amount) || 0,
        depositStatus: depositStatus || 'paid',
        bookingStatus: 'confirmed',
      },
    });

    return NextResponse.json({ success: true, data: booking }, { status: 201 });
  } catch (error: any) {
    console.error('Create booking error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create booking.' },
      { status: 500 }
    );
  }
}
