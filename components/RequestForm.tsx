'use client';

import { Trip } from '@/lib/frontend-types';
import { useState } from 'react';
import { requestRide } from '@/lib/api';
import { getSession } from '@/lib/session';

interface RequestFormProps {
  trip: Trip;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RequestForm({ trip, onClose, onSuccess }: RequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const session = getSession();
    if (!session) {
      setError('You must be logged in');
      setIsSubmitting(false);
      return;
    }

    const { data, error: apiError } = await requestRide(trip.id, session.userId);

    if (apiError || !data) {
      setError(apiError || 'Failed to request ride');
      setIsSubmitting(false);
      return;
    }

    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Request Ride</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Route:</span> {trip.fromLocation} → {trip.toLocation}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            <span className="font-medium">Rate:</span> ${trip.compRate.toFixed(2)} per person
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Confirm Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

