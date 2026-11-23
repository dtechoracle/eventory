import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getCurrentUser } from '../../../../lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }
    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch user profile.' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone, organizationName, avatar } = body;

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(name && { name: name.trim() }),
        ...(phone !== undefined && { phone: phone?.trim() || null }),
        ...(organizationName !== undefined && { organizationName: organizationName?.trim() || null }),
        ...(avatar !== undefined && { avatar: avatar || null }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        organizationName: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: updated,
      message: 'Profile updated successfully.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to update profile.' },
      { status: 500 }
    );
  }
}
