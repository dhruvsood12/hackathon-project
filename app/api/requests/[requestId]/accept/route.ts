import { NextRequest, NextResponse } from 'next/server';
import { getRideRequestById, updateRideRequest, getTripById, updateTrip, getUserById } from '@/lib/store';

export async function POST(
  request: NextRequest,
  { params }: { params: { requestId: string } }
) {
  try {
    const { requestId } = params;
    const body = await request.json();
    const { driverId } = body;

    if (!driverId || typeof driverId !== 'string') {
      return NextResponse.json(
        { error: 'driverId is required and must be a string' },
        { status: 400 }
      );
    }

    // Get ride request
    const rideRequest = getRideRequestById(requestId);
    if (!rideRequest) {
      return NextResponse.json(
        { error: 'Ride request not found' },
        { status: 404 }
      );
    }

    // Get trip
    const trip = getTripById(rideRequest.tripId);
    if (!trip) {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      );
    }

    // Verify driver owns the trip
    if (trip.driverId !== driverId) {
      return NextResponse.json(
        { error: 'Only the trip driver can accept requests' },
        { status: 403 }
      );
    }

    // Check if request is already processed
    if (rideRequest.status !== 'pending') {
      return NextResponse.json(
        { error: `Request is already ${rideRequest.status}` },
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

    // Update request status
    const updatedRequest = updateRideRequest(requestId, { status: 'accepted' });
    if (!updatedRequest) {
      return NextResponse.json(
        { error: 'Failed to update request' },
        { status: 500 }
      );
    }

    // Decrement available seats (never below 0)
    const newSeatsAvailable = Math.max(0, trip.seatsAvailable - 1);
    const updatedTrip = updateTrip(rideRequest.tripId, { seatsAvailable: newSeatsAvailable });
    if (!updatedTrip) {
      return NextResponse.json(
        { error: 'Failed to update trip' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { request: updatedRequest, trip: updatedTrip },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

