import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET() {
  try {
    const [eventsCount, vendorsCount, ticketsCount, bookings] = await Promise.all([
      prisma.event.count(),
      prisma.vendor.count(),
      prisma.ticket.count(),
      prisma.vendorBooking.findMany({ select: { amount: true } }),
    ]);

    const totalBookingValue = bookings.reduce((sum, b) => sum + (b.amount || 0), 0);

    const checkedInCount = await prisma.ticket.count({
      where: { checkedIn: true },
    });

    return NextResponse.json({
      success: true,
      data: {
        totalEvents: eventsCount,
        totalVendors: vendorsCount,
        totalTicketsIssued: ticketsCount,
        checkedInAttendees: checkedInCount,
        totalEscrowBookingValue: totalBookingValue,
        gateAttendanceRate: ticketsCount > 0 ? Math.round((checkedInCount / ticketsCount) * 100) : 0,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch analytics.' },
      { status: 500 }
    );
  }
}
