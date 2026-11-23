import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getCurrentUser } from '../../../../lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const vendorId = searchParams.get('vendorId');

    const packages = await prisma.vendorPackage.findMany({
      where: vendorId ? { vendorId } : undefined,
      orderBy: { price: 'asc' },
    });

    return NextResponse.json({ success: true, data: packages });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch packages.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { name, price, description, features, vendorId } = body;

    if (!name || price === undefined) {
      return NextResponse.json(
        { error: 'Name and price are required.' },
        { status: 400 }
      );
    }

    // Find vendor if not provided
    let targetVendorId = vendorId;
    if (!targetVendorId && user) {
      const vendor = await prisma.vendor.findFirst({
        where: { userId: user.id },
      });
      targetVendorId = vendor?.id;
    }

    if (!targetVendorId) {
      const firstVendor = await prisma.vendor.findFirst();
      targetVendorId = firstVendor?.id;
    }

    if (!targetVendorId) {
      return NextResponse.json(
        { error: 'No active vendor found to attach package.' },
        { status: 404 }
      );
    }

    const pkg = await prisma.vendorPackage.create({
      data: {
        vendorId: targetVendorId,
        name: name.trim(),
        price: Number(price),
        description: description?.trim() || null,
        features: Array.isArray(features) ? features : [],
      },
    });

    return NextResponse.json({ success: true, data: pkg }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to create package.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Package ID required.' }, { status: 400 });
    }

    await prisma.vendorPackage.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Package deleted.' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to delete package.' },
      { status: 500 }
    );
  }
}
