'use client';

import { RideRequest, Trip, User } from '@/lib/frontend-types';
import { useState } from 'react';
import { acceptRequest, declineRequest } from '@/lib/api';
import { getSession } from '@/lib/session';

interface RequestCardProps {
  request: RideRequest;
  trip: Trip;
  rider?: User;
  onUpdate: () => void;
}

export default function RequestCard({
  request,
  trip,
  rider,
  onUpdate,
}: RequestCardProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const session = getSession();
  const isDriver = session?.userId === trip.driverId;
  const canProcess = isDriver && request.status === 'pending';

  const handleAccept = async () => {
    if (!session) return;

    setIsProcessing(true);
    setError(null);

    const { error: apiError } = await acceptRequest(request.id, session.userId);

    if (apiError) {
      setError(apiError);
      setIsProcessing(false);
      return;
    }

    onUpdate();
  };

  const handleDecline = async () => {
    if (!session) return;

    setIsProcessing(true);
    setError(null);

    const { error: apiError } = await declineRequest(request.id, session.userId);

    if (apiError) {
      setError(apiError);
      setIsProcessing(false);
      return;
    }

    onUpdate();
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-green-100 text-green-800',
    declined: 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {trip.fromLocation} → {trip.toLocation}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Rider: {rider?.name || 'Unknown'} ({rider?.email || 'N/A'})
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            statusColors[request.status]
          }`}
        >
          {request.status.toUpperCase()}
        </span>
      </div>

      <div className="space-y-2 mb-4 text-sm text-gray-600">
        <p>
          <span className="font-medium">Departure:</span> {formatDate(trip.departureTime)}
        </p>
        <p>
          <span className="font-medium">Rate:</span> ${trip.compRate.toFixed(2)} per person
        </p>
        <p>
          <span className="font-medium">Seats Available:</span> {trip.seatsAvailable} / {trip.seatsTotal}
        </p>
        <p>
          <span className="font-medium">Requested:</span> {formatDate(request.createdAt)}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {canProcess && (
        <div className="flex gap-3">
          <button
            onClick={handleAccept}
            disabled={isProcessing}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : 'Accept'}
          </button>
          <button
            onClick={handleDecline}
            disabled={isProcessing}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : 'Decline'}
          </button>
        </div>
      )}

      {!canProcess && request.status === 'pending' && (
        <p className="text-sm text-gray-500">Waiting for driver response...</p>
      )}
    </div>
  );
}

