import { NextRequest, NextResponse } from 'next/server';
import { getTripById, getRideRequestsByTripId, createRideRequest, getUserById } from '@/lib/store';
import { validateRideRequest } from '@/lib/validate';

// Simple UUID generator for demo
function generateId(): string {
  return `request-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { tripId: string } }
) {
  try {
    const { tripId } = params;
    const body = await request.json();
    const { riderId } = body;

    // Validate request data
    const validation = validateRideRequest(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Verify trip exists
    const trip = getTripById(tripId);
    if (!trip) {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      );
    }

    // Verify rider exists
    const rider = getUserById(riderId);
    if (!rider) {
      return NextResponse.json(
        { error: 'Rider not found' },
        { status: 404 }
      );
    }

    // Check if rider is the driver
    if (trip.driverId === riderId) {
      return NextResponse.json(
        { error: 'Driver cannot request a ride on their own trip' },
        { status: 400 }
      );
    }

    // Check if there are available seats
    if (trip.seatsAvailable <= 0) {
      return NextResponse.json(
        { error: 'No available seats on this trip' },
        { status: 400 }
      );
    }

    // Check if rider already has a pending or accepted request for this trip
    const existingRequests = getRideRequestsByTripId(tripId);
    const existingRequest = existingRequests.find(
      r => r.riderId === riderId && (r.status === 'pending' || r.status === 'accepted')
    );
    if (existingRequest) {
      return NextResponse.json(
        { error: 'You already have a pending or accepted request for this trip' },
        { status: 400 }
      );
    }

    // Create ride request
    const rideRequest = createRideRequest({
      id: generateId(),
      tripId,
      riderId,
      status: 'pending',
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ request: rideRequest }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

