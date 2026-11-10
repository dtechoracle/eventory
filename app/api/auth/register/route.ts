import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { hashPassword, createSessionToken, setAuthCookie } from '../../../../lib/auth';
import { UserRole } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, role, phone, organizationName } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Name, email, and password are required.' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    // Hash password & validate role
    const passwordHash = await hashPassword(password);
    const validRole: UserRole =
      role === 'vendor' ? UserRole.vendor : role === 'attendee' ? UserRole.attendee : UserRole.creator;

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        name: name.trim(),
        passwordHash,
        role: validRole,
        phone: phone?.trim() || null,
        organizationName: organizationName?.trim() || `${name.trim()}'s Organization`,
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
      },
    });

    // Create session token & set cookie
    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    await setAuthCookie(token);

    return NextResponse.json(
      {
        success: true,
        user,
        message: 'Account successfully registered.',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to register account.' },
      { status: 500 }
    );
  }
}
