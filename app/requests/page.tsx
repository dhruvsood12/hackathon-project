'use client';

import { useEffect, useState } from 'react';
import { getTrips } from '@/lib/api';
import { useSession } from '@/lib/session';
import { Trip, User, RideRequest } from '@/lib/frontend-types';
import RequestCard from '@/components/RequestCard';
import ProtectedRoute from '@/components/ProtectedRoute';
import Toast from '@/components/Toast';

// TODO: Backend doesn't expose a direct endpoint to get requests for a driver
// This is a workaround that would need backend support to work fully
// For now, we'll show a message explaining the limitation

interface RequestWithTrip extends RideRequest {
  trip: Trip;
  rider?: User;
}

export default function RequestsPage() {
  const { session } = useSession();
  const [requests, setRequests] = useState<RequestWithTrip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const loadRequests = async () => {
    if (!session) return;

    setIsLoading(true);
    setError(null);

    // Get all trips
    const { data: tripsData, error: tripsError } = await getTrips();

    if (tripsError || !tripsData) {
      setError(tripsError || 'Failed to load trips');
      setIsLoading(false);
      return;
    }

    // Filter trips where current user is the driver
    const myTrips = tripsData.trips.filter(t => t.driverId === session.userId);

    if (myTrips.length === 0) {
      setRequests([]);
      setIsLoading(false);
      return;
    }

    // TODO: Backend doesn't provide requests in trip response
    // In a real implementation, we'd need:
    // - GET /api/trips/:tripId/requests endpoint, OR
    // - GET /api/requests?driverId=... endpoint, OR
    // - Include requests in GET /api/trips response

    // For now, show a message that requests aren't available via API
    setRequests([]);
    setIsLoading(false);
  };

  useEffect(() => {
    if (session?.userId) {
      loadRequests();
    }
  }, [session?.userId]);

  const handleUpdate = () => {
    setToast({ message: 'Request updated successfully!', type: 'success' });
    loadRequests();
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
          <h1 className="text-3xl font-bold text-gray-900">Ride Requests</h1>
          <button
            onClick={loadRequests}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading requests...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600">{error}</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 mb-4">
              No ride requests found for your trips.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mt-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> The backend API doesn't currently expose a direct endpoint to list ride requests for drivers.
                To fully implement this feature, the backend would need to add either:
              </p>
              <ul className="text-sm text-yellow-800 mt-2 text-left list-disc list-inside">
                <li>GET /api/trips/:tripId/requests - to get requests for a specific trip</li>
                <li>GET /api/requests?driverId=... - to get all requests for a driver's trips</li>
                <li>Include requests array in GET /api/trips response</li>
              </ul>
              <p className="text-sm text-yellow-800 mt-2">
                The accept/decline functionality is ready to use once request IDs are available.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                trip={request.trip}
                rider={request.rider}
                onUpdate={handleUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

