import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ticketCode } = body;

    if (!ticketCode || typeof ticketCode !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Ticket reference code is required.' },
        { status: 400 }
      );
    }

    const cleanCode = ticketCode.trim().toUpperCase();

    const ticket = await prisma.ticket.findUnique({
      where: { ticketCode: cleanCode },
      include: {
        event: {
          select: { title: true, date: true, venue: true },
        },
        tier: {
          select: { name: true },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json(
        {
          success: false,
          alreadyCheckedIn: false,
          message: `INVALID TICKET • Reference "${cleanCode}" not found in event registry.`,
        },
        { status: 404 }
      );
    }

    if (ticket.checkedIn) {
      const formattedTime = ticket.checkInTime
        ? new Date(ticket.checkInTime).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'earlier today';

      return NextResponse.json({
        success: false,
        alreadyCheckedIn: true,
        message: `ALREADY SCANNED • ${ticket.attendeeName} was admitted at ${formattedTime}.`,
        guest: {
          name: ticket.attendeeName,
          ticketType: ticket.tier.name,
          tableNumber: ticket.tableNumber || 'General Admission',
          ticketCode: ticket.ticketCode,
          checkInTime: formattedTime,
        },
      });
    }

    // Mark as checked in
    const updated = await prisma.ticket.update({
      where: { id: ticket.id },
      data: {
        checkedIn: true,
        checkInTime: new Date(),
      },
    });

    const checkInTimeStr = new Date(updated.checkInTime!).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return NextResponse.json({
      success: true,
      alreadyCheckedIn: false,
      message: `VALID TICKET • Welcome ${ticket.attendeeName}!`,
      guest: {
        name: ticket.attendeeName,
        ticketType: ticket.tier.name,
        tableNumber: ticket.tableNumber || 'General Admission',
        ticketCode: ticket.ticketCode,
        checkInTime: checkInTimeStr,
      },
    });
  } catch (error: any) {
    console.error('Gate check-in error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to verify ticket.' },
      { status: 500 }
    );
  }
}
