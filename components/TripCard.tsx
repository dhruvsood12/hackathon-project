'use client';

import { Trip, User } from '@/lib/frontend-types';
import { useState } from 'react';
import RequestForm from './RequestForm';

interface TripCardProps {
  trip: Trip;
  driver?: User;
  currentUserId: string;
  onRequestSuccess?: () => void;
}

export default function TripCard({
  trip,
  driver,
  currentUserId,
  onRequestSuccess,
}: TripCardProps) {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const isDriver = trip.driverId === currentUserId;
  const canRequest = !isDriver && trip.seatsAvailable > 0;

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {trip.fromLocation} → {trip.toLocation}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Driver: {driver?.name || 'Unknown'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary-600">
              ${trip.compRate.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">per person</p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium">Departure:</span>
            <span className="ml-2">{formatDate(trip.departureTime)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium">Seats:</span>
            <span className="ml-2">
              {trip.seatsAvailable} / {trip.seatsTotal} available
            </span>
          </div>
          {trip.notes && (
            <div className="text-sm text-gray-600 mt-2">
              <span className="font-medium">Notes:</span>
              <span className="ml-2">{trip.notes}</span>
            </div>
          )}
        </div>

        {isDriver && (
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">This is your trip</p>
          </div>
        )}

        {canRequest && (
          <button
            onClick={() => setShowRequestForm(true)}
            className="mt-4 w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors font-medium"
          >
            Request Ride
          </button>
        )}

        {!canRequest && !isDriver && (
          <div className="mt-4 p-3 bg-gray-100 rounded-md">
            <p className="text-sm text-gray-600">
              {trip.seatsAvailable === 0 ? 'No seats available' : 'Cannot request'}
            </p>
          </div>
        )}
      </div>

      {showRequestForm && (
        <RequestForm
          trip={trip}
          onClose={() => setShowRequestForm(false)}
          onSuccess={() => {
            setShowRequestForm(false);
            onRequestSuccess?.();
          }}
        />
      )}
    </>
  );
}

