import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId');

    const where: any = {};
    if (eventId) {
      where.eventId = eventId;
    }

    const tickets = await prisma.ticket.findMany({
      where,
      include: {
        event: {
          select: { id: true, title: true, date: true, time: true, venue: true, city: true },
        },
        tier: {
          select: { id: true, name: true, price: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, count: tickets.length, data: tickets });
  } catch (error: any) {
    console.error('Fetch tickets error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch tickets.' },
      { status: 500 }
    );
  }
}
