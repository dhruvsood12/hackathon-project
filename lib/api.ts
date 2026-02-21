'use client';

import {
  User,
  Trip,
  RideRequest,
  LoginResponse,
  UserResponse,
  TripsResponse,
  TripResponse,
  RideRequestResponse,
  AcceptRequestResponse,
  SeedResponse,
} from './frontend-types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<{ data?: T; error?: string }> {
  try {
    const url = `${API_BASE}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const json = await response.json();
        errorMessage = json.error || errorMessage;
      } catch {
        // If response isn't JSON, use the status text
      }
      return { error: errorMessage };
    }

    const json = await response.json();
    return { data: json as T };
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      return {
        error: 'Cannot connect to server. Make sure the development server is running on port 3000.',
      };
    }
    return {
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// Auth
export async function demoLogin(
  email: string,
  name: string
): Promise<{ data?: LoginResponse; error?: string }> {
  return fetchApi<LoginResponse>('/api/auth/demo-login', {
    method: 'POST',
    body: JSON.stringify({ email, name }),
  });
}

// User
export async function getUser(
  userId: string
): Promise<{ data?: UserResponse; error?: string }> {
  return fetchApi<UserResponse>(`/api/me?userId=${encodeURIComponent(userId)}`);
}

export async function updateUser(
  userId: string,
  updates: { year?: string; major?: string; interests?: string[] }
): Promise<{ data?: UserResponse; error?: string }> {
  return fetchApi<UserResponse>('/api/me', {
    method: 'PATCH',
    body: JSON.stringify({ userId, ...updates }),
  });
}

// Trips
export async function getTrips(): Promise<{ data?: TripsResponse; error?: string }> {
  return fetchApi<TripsResponse>('/api/trips');
}

export async function createTrip(
  tripData: {
    driverId: string;
    toLocation: string;
    departureTime: string;
    seatsTotal: number;
    compRate: number;
    notes?: string;
    fromLocation?: string;
  }
): Promise<{ data?: TripResponse; error?: string }> {
  return fetchApi<TripResponse>('/api/trips', {
    method: 'POST',
    body: JSON.stringify(tripData),
  });
}

// Requests
export async function requestRide(
  tripId: string,
  riderId: string
): Promise<{ data?: RideRequestResponse; error?: string }> {
  return fetchApi<RideRequestResponse>(`/api/trips/${tripId}/request`, {
    method: 'POST',
    body: JSON.stringify({ riderId }),
  });
}

export async function acceptRequest(
  requestId: string,
  driverId: string
): Promise<{ data?: AcceptRequestResponse; error?: string }> {
  return fetchApi<AcceptRequestResponse>(`/api/requests/${requestId}/accept`, {
    method: 'POST',
    body: JSON.stringify({ driverId }),
  });
}

export async function declineRequest(
  requestId: string,
  driverId: string
): Promise<{ data?: RideRequestResponse; error?: string }> {
  return fetchApi<RideRequestResponse>(`/api/requests/${requestId}/decline`, {
    method: 'POST',
    body: JSON.stringify({ driverId }),
  });
}

// Seed
export async function seedData(): Promise<{ data?: SeedResponse; error?: string }> {
  return fetchApi<SeedResponse>('/api/seed');
}

