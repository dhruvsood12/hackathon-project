export function isValidUCSDEmail(email: string): boolean {
  return email.endsWith('@ucsd.edu');
}

export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required and must be a string' };
  }
  if (!isValidUCSDEmail(email)) {
    return { valid: false, error: 'Email must end with @ucsd.edu' };
  }
  return { valid: true };
}

export function validateName(name: string): { valid: boolean; error?: string } {
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return { valid: false, error: 'Name is required and must be a non-empty string' };
  }
  return { valid: true };
}

export function validateTripData(data: any): { valid: boolean; error?: string } {
  if (!data.driverId || typeof data.driverId !== 'string') {
    return { valid: false, error: 'driverId is required and must be a string' };
  }
  if (!data.toLocation || typeof data.toLocation !== 'string') {
    return { valid: false, error: 'toLocation is required and must be a string' };
  }
  if (!data.departureTime || typeof data.departureTime !== 'string') {
    return { valid: false, error: 'departureTime is required and must be a string (ISO format)' };
  }
  if (typeof data.seatsTotal !== 'number' || data.seatsTotal < 1) {
    return { valid: false, error: 'seatsTotal is required and must be a positive number' };
  }
  if (typeof data.compRate !== 'number' || data.compRate < 0) {
    return { valid: false, error: 'compRate is required and must be a non-negative number' };
  }
  
  // Validate ISO date
  const date = new Date(data.departureTime);
  if (isNaN(date.getTime())) {
    return { valid: false, error: 'departureTime must be a valid ISO date string' };
  }

  return { valid: true };
}

export function validateRideRequest(data: any): { valid: boolean; error?: string } {
  if (!data.riderId || typeof data.riderId !== 'string') {
    return { valid: false, error: 'riderId is required and must be a string' };
  }
  return { valid: true };
}

