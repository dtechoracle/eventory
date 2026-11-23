import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const event = await prisma.event.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        ticketTiers: {
          orderBy: { price: 'asc' },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...event,
        organizer: event.organizerName,
      },
    });
  } catch (error: any) {
    console.error('Fetch event detail error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch event.' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updated = await prisma.event.update({
      where: { id },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.venue && { venue: body.venue }),
        ...(body.city && { city: body.city }),
        ...(body.description && { description: body.description }),
        ...(body.image && { image: body.image }),
        ...(body.date && { date: body.date }),
        ...(body.time && { time: body.time }),
        ...(body.capacity && { capacity: Number(body.capacity) }),
      },
      include: { ticketTiers: true },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to update event.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.event.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Event successfully removed.' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to delete event.' },
      { status: 500 }
    );
  }
}
