import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { getCurrentUser } from '../../../lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get('city');
    const category = searchParams.get('category');
    const query = searchParams.get('q');

    const where: any = {};

    if (city && city !== 'All') {
      where.city = { equals: city, mode: 'insensitive' };
    }

    if (category && category !== 'All') {
      where.category = { equals: category, mode: 'insensitive' };
    }

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { venue: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ];
    }

    const events = await prisma.event.findMany({
      where,
      include: {
        ticketTiers: {
          orderBy: { price: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, count: events.length, data: events });
  } catch (error: any) {
    console.error('Fetch events error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch events.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to create an event.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      title,
      category,
      date,
      time,
      venue,
      city,
      state,
      image,
      description,
      capacity,
      ticketTiers,
    } = body;

    if (!title || !date || !time || !venue || !city) {
      return NextResponse.json(
        { error: 'Event title, date, time, venue, and city are required.' },
        { status: 400 }
      );
    }

    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;

    const event = await prisma.event.create({
      data: {
        title,
        slug,
        organizerName: user.organizationName || user.name,
        organizerVerified: true,
        category: category || 'Social & Wedding',
        date,
        time,
        venue,
        city,
        state: state || 'Nigeria',
        image: image || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
        description: description || '',
        capacity: Number(capacity) || 500,
        startingPrice: ticketTiers?.[0]?.price ? Number(ticketTiers[0].price) : 0,
        userId: user.id,
        ticketTiers: {
          create: (ticketTiers || []).map((t: any) => ({
            name: t.name,
            price: Number(t.price) || 0,
            description: t.description || '',
            remaining: Number(t.capacity || 100),
            capacity: Number(t.capacity || 100),
          })),
        },
      },
      include: {
        ticketTiers: true,
      },
    });

    return NextResponse.json({ success: true, data: event }, { status: 201 });
  } catch (error: any) {
    console.error('Create event error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create event.' },
      { status: 500 }
    );
  }
}
