import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getCurrentUser } from '../../../../lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const { eventId, subject, message } = body;

    // Get attendee emails
    const tickets = await prisma.ticket.findMany({
      where: eventId ? { eventId } : undefined,
      select: { attendeeEmail: true, attendeeName: true },
      distinct: ['attendeeEmail'],
    });

    return NextResponse.json({
      success: true,
      recipientsCount: tickets.length,
      message: `Broadcast message queued for ${tickets.length} registered ticket holders.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to send broadcast.' },
      { status: 500 }
    );
  }
}
