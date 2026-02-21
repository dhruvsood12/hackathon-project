import { User, Trip, RideRequest } from './types';

// In-memory storage
let users: User[] = [];
let trips: Trip[] = [];
let rideRequests: RideRequest[] = [];

// User helpers
export function getUserById(id: string): User | undefined {
  return users.find(u => u.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  return users.find(u => u.email === email);
}

export function createUser(user: User): User {
  users.push(user);
  return user;
}

export function updateUser(id: string, updates: Partial<User>): User | null {
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return null;
  
  users[index] = { ...users[index], ...updates };
  return users[index];
}

export function getAllUsers(): User[] {
  return users;
}

// Trip helpers
export function getTripById(id: string): Trip | undefined {
  return trips.find(t => t.id === id);
}

export function getAllTrips(): Trip[] {
  return trips;
}

export function createTrip(trip: Trip): Trip {
  trips.push(trip);
  return trip;
}

export function updateTrip(id: string, updates: Partial<Trip>): Trip | null {
  const index = trips.findIndex(t => t.id === id);
  if (index === -1) return null;
  
  trips[index] = { ...trips[index], ...updates };
  return trips[index];
}

export function getTripsByDriverId(driverId: string): Trip[] {
  return trips.filter(t => t.driverId === driverId);
}

// RideRequest helpers
export function getRideRequestById(id: string): RideRequest | undefined {
  return rideRequests.find(r => r.id === id);
}

export function createRideRequest(request: RideRequest): RideRequest {
  rideRequests.push(request);
  return request;
}

export function updateRideRequest(id: string, updates: Partial<RideRequest>): RideRequest | null {
  const index = rideRequests.findIndex(r => r.id === id);
  if (index === -1) return null;
  
  rideRequests[index] = { ...rideRequests[index], ...updates };
  return rideRequests[index];
}

export function getRideRequestsByTripId(tripId: string): RideRequest[] {
  return rideRequests.filter(r => r.tripId === tripId);
}

export function getRideRequestsByRiderId(riderId: string): RideRequest[] {
  return rideRequests.filter(r => r.riderId === riderId);
}

// Seed function
export function seedData(): { tripsCount: number } {
  // Clear existing data
  users = [];
  trips = [];
  rideRequests = [];

  // Create demo users
  const user1: User = {
    id: 'user-1',
    name: 'Alice Johnson',
    email: 'alice@ucsd.edu',
    year: 'Senior',
    major: 'Computer Science',
    interests: ['Hiking', 'Music', 'Travel'],
    ratingAvg: 4.8
  };

  const user2: User = {
    id: 'user-2',
    name: 'Bob Smith',
    email: 'bob@ucsd.edu',
    year: 'Junior',
    major: 'Engineering',
    interests: ['Sports', 'Gaming'],
    ratingAvg: 4.5
  };

  const user3: User = {
    id: 'user-3',
    name: 'Carol Williams',
    email: 'carol@ucsd.edu',
    year: 'Graduate',
    major: 'Data Science',
    interests: ['Reading', 'Yoga'],
    ratingAvg: 4.9
  };

  users.push(user1, user2, user3);

  // Create demo trips
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  const dayAfter = new Date(now);
  dayAfter.setDate(dayAfter.getDate() + 2);
  dayAfter.setHours(14, 30, 0, 0);

  const trip1: Trip = {
    id: 'trip-1',
    driverId: 'user-1',
    toLocation: 'Los Angeles',
    fromLocation: 'UCSD',
    departureTime: tomorrow.toISOString(),
    seatsTotal: 4,
    seatsAvailable: 3,
    compRate: 15.50,
    notes: 'Comfortable car, AC available',
    createdAt: now.toISOString()
  };

  const trip2: Trip = {
    id: 'trip-2',
    driverId: 'user-2',
    toLocation: 'San Francisco',
    fromLocation: 'UCSD',
    departureTime: dayAfter.toISOString(),
    seatsTotal: 3,
    seatsAvailable: 2,
    compRate: 25.00,
    notes: 'Electric vehicle, eco-friendly',
    createdAt: now.toISOString()
  };

  trips.push(trip1, trip2);

  return { tripsCount: trips.length };
}

