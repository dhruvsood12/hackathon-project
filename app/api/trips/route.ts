import { NextRequest, NextResponse } from 'next/server';
import { getAllTrips, createTrip, getUserById } from '@/lib/store';
import { validateTripData } from '@/lib/validate';

// Simple UUID generator for demo
function generateId(): string {
  return `trip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export async function GET(request: NextRequest) {
  try {
    const trips = getAllTrips();
    return NextResponse.json({ trips }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { driverId, toLocation, departureTime, seatsTotal, compRate, notes, fromLocation } = body;

    // Validate trip data
    const validation = validateTripData(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Verify driver exists
    const driver = getUserById(driverId);
    if (!driver) {
      return NextResponse.json(
        { error: 'Driver not found' },
        { status: 404 }
      );
    }

    // Create trip
    const trip = createTrip({
      id: generateId(),
      driverId,
      toLocation: toLocation.trim(),
      fromLocation: fromLocation?.trim() || 'UCSD',
      departureTime,
      seatsTotal,
      seatsAvailable: seatsTotal,
      compRate,
      notes: notes?.trim(),
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ trip }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

