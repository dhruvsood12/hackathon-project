import { NextResponse } from 'next/server';
import { seedData } from '@/lib/store';

export async function GET() {
  try {
    const { tripsCount } = seedData();
    return NextResponse.json({ ok: true, tripsCount }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to seed data' },
      { status: 500 }
    );
  }
}

