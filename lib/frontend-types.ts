// Frontend types mirroring backend types
export interface User {
  id: string;
  name: string;
  email: string;
  year?: string;
  major?: string;
  interests: string[];
  ratingAvg?: number;
}

export interface Trip {
  id: string;
  driverId: string;
  toLocation: string;
  fromLocation: string;
  departureTime: string; // ISO string
  seatsTotal: number;
  seatsAvailable: number;
  compRate: number;
  notes?: string;
  createdAt: string; // ISO string
}

export interface RideRequest {
  id: string;
  tripId: string;
  riderId: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string; // ISO string
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface LoginResponse {
  user: User;
}

export interface UserResponse {
  user: User;
}

export interface TripsResponse {
  trips: Trip[];
}

export interface TripResponse {
  trip: Trip;
}

export interface RideRequestResponse {
  request: RideRequest;
}

export interface AcceptRequestResponse {
  request: RideRequest;
  trip: Trip;
}

export interface SeedResponse {
  ok: boolean;
  tripsCount: number;
}

