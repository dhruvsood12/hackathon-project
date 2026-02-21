'use client';

import { useEffect, useState } from 'react';
import { getTrips, getUser } from '@/lib/api';
import { useSession } from '@/lib/session';
import { Trip, User } from '@/lib/frontend-types';
import TripCard from '@/components/TripCard';
import ProtectedRoute from '@/components/ProtectedRoute';
import Toast from '@/components/Toast';

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [drivers, setDrivers] = useState<Record<string, User>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const { session, isLoaded } = useSession();

  const loadTrips = async () => {
    setIsLoading(true);
    setError(null);

    const { data, error: apiError } = await getTrips();

    if (apiError || !data) {
      setError(apiError || 'Failed to load trips');
      setIsLoading(false);
      return;
    }

    setTrips(data.trips);

    // Load driver info for each trip
    const driverIds = [...new Set(data.trips.map(t => t.driverId))];
    const driverMap: Record<string, User> = {};

    for (const driverId of driverIds) {
      const { data: userData } = await getUser(driverId);
      if (userData?.user) {
        driverMap[driverId] = userData.user;
      }
    }

    setDrivers(driverMap);
    setIsLoading(false);
  };

  useEffect(() => {
    if (session?.userId) {
      loadTrips();
    }
  }, [session?.userId]);

  const handleRequestSuccess = () => {
    setToast({ message: 'Ride request submitted successfully!', type: 'success' });
    loadTrips(); // Refresh to update seat counts
  };

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Available Trips</h1>
          <button
            onClick={loadTrips}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading trips...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600">{error}</p>
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-600 mb-4">No trips available yet.</p>
            <p className="text-sm text-gray-500">
              Be the first to create a trip!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                driver={drivers[trip.driverId]}
                currentUserId={session?.userId || ''}
                onRequestSuccess={handleRequestSuccess}
              />
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

