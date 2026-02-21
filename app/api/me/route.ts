import { NextRequest, NextResponse } from 'next/server';
import { getUserById, updateUser } from '@/lib/store';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId query parameter is required' },
        { status: 400 }
      );
    }

    const user = getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, year, major, interests } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const updates: any = {};
    if (year !== undefined) {
      if (typeof year !== 'string') {
        return NextResponse.json(
          { error: 'year must be a string' },
          { status: 400 }
        );
      }
      updates.year = year;
    }
    if (major !== undefined) {
      if (typeof major !== 'string') {
        return NextResponse.json(
          { error: 'major must be a string' },
          { status: 400 }
        );
      }
      updates.major = major;
    }
    if (interests !== undefined) {
      if (!Array.isArray(interests) || !interests.every(i => typeof i === 'string')) {
        return NextResponse.json(
          { error: 'interests must be an array of strings' },
          { status: 400 }
        );
      }
      updates.interests = interests;
    }

    const updatedUser = updateUser(userId, updates);
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

