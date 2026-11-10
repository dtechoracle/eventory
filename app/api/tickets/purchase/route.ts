import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { generateTicketCode } from '../../../../lib/utils';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventId, tierId, quantity = 1, attendee } = body;

    if (!eventId || !tierId || !attendee?.name || !attendee?.email) {
      return NextResponse.json(
        { error: 'Event, ticket tier, attendee name and email are required.' },
        { status: 400 }
      );
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
    }

    const tier = await prisma.ticketTier.findUnique({
      where: { id: tierId },
    });

    if (!tier) {
      return NextResponse.json({ error: 'Ticket tier not found.' }, { status: 404 });
    }

    const qty = Math.max(1, Number(quantity) || 1);
    if (tier.remaining < qty) {
      return NextResponse.json(
        { error: `Only ${tier.remaining} tickets remaining for ${tier.name}.` },
        { status: 400 }
      );
    }

    const ticketCode = generateTicketCode();
    const totalPaid = tier.price * qty;

    const qrData = JSON.stringify({
      code: ticketCode,
      event: event.title,
      tier: tier.name,
      attendee: attendee.name,
      qty,
      issued: new Date().toISOString(),
      platform: 'Eventory Nexus Nigeria',
    });

    const ticket = await prisma.$transaction(async (tx) => {
      // Create ticket
      const created = await tx.ticket.create({
        data: {
          ticketCode,
          eventId: event.id,
          tierId: tier.id,
          attendeeName: attendee.name,
          attendeeEmail: attendee.email.toLowerCase().trim(),
          attendeePhone: attendee.phone || null,
          quantity: qty,
          totalPaid,
          qrData,
          paymentStatus: 'paid',
        },
      });

      // Decrement tier remaining
      await tx.ticketTier.update({
        where: { id: tier.id },
        data: {
          remaining: { decrement: qty },
        },
      });

      // Increment event ticketsSold
      await tx.event.update({
        where: { id: event.id },
        data: {
          ticketsSold: { increment: qty },
        },
      });

      return created;
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          ticketCode: ticket.ticketCode,
          qrData: ticket.qrData,
          eventTitle: event.title,
          eventDate: event.date,
          eventTime: event.time,
          venue: event.venue,
          city: event.city,
          attendeeName: ticket.attendeeName,
          attendeeEmail: ticket.attendeeEmail,
          attendeePhone: ticket.attendeePhone || '',
          ticketTierName: tier.name,
          quantity: ticket.quantity,
          totalPaid: ticket.totalPaid,
          purchasedAt: ticket.createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Ticket purchase error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to complete ticket order.' },
      { status: 500 }
    );
  }
}
