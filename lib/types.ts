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

