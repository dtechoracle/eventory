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
        { businessName: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ];
    }

    const vendors = await prisma.vendor.findMany({
      where,
      include: {
        packages: true,
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
      orderBy: { rating: 'desc' },
    });

    return NextResponse.json({ success: true, count: vendors.length, data: vendors });
  } catch (error: any) {
    console.error('Fetch vendors error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch vendors.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Check if quote request or vendor registration
    if (body.type === 'quote_request') {
      const {
        vendorId,
        eventTitle,
        organizerName,
        organizerPhone,
        organizerEmail,
        date,
        guestCount,
        notes,
      } = body;

      if (!organizerName || !organizerEmail || !date) {
        return NextResponse.json(
          { error: 'Name, email, and event date are required.' },
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
          notes: notes || '',
          receivedTime: 'Just now',
          status: 'pending',
        },
      });

      return NextResponse.json(
        { success: true, message: 'Quotation request submitted to vendor.', data: enquiry },
        { status: 201 }
      );
    }

    // Vendor registration
    const user = await getCurrentUser();
    const {
      businessName,
      category,
      city,
      locationAddress,
      description,
      priceFrom,
      cacNumber,
    } = body;

    if (!businessName || !category || !city) {
      return NextResponse.json(
        { error: 'Business name, category, and city are required.' },
        { status: 400 }
      );
    }

    const vendor = await prisma.vendor.create({
      data: {
        userId: user?.id || null,
        businessName,
        category,
        city,
        locationAddress: locationAddress || `${city}, Nigeria`,
        description: description || '',
        priceFrom: Number(priceFrom) || 50000,
        cacNumber: cacNumber || null,
        cacRegistered: !!cacNumber,
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
        portfolio: [],
        servicesIncluded: ['Professional Event Delivery', 'Escrow Milestone Guarantee'],
      },
    });

    return NextResponse.json({ success: true, data: vendor }, { status: 201 });
  } catch (error: any) {
    console.error('Marketplace action error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process request.' },
      { status: 500 }
    );
  }
}
