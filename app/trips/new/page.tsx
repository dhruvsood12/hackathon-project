'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createTrip } from '@/lib/api';
import { useSession } from '@/lib/session';
import ProtectedRoute from '@/components/ProtectedRoute';
import Toast from '@/components/Toast';

export default function NewTripPage() {
  const router = useRouter();
  const { session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState({
    toLocation: '',
    fromLocation: 'UCSD',
    departureTime: '',
    seatsTotal: 1,
    compRate: 0,
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!session) {
      setError('You must be logged in');
      return;
    }

    if (!formData.toLocation.trim()) {
      setError('Destination is required');
      return;
    }

    if (!formData.departureTime) {
      setError('Departure time is required');
      return;
    }

    if (formData.seatsTotal < 1) {
      setError('Must have at least 1 seat');
      return;
    }

    if (formData.compRate < 0) {
      setError('Rate cannot be negative');
      return;
    }

    setIsSubmitting(true);

    const { data, error: apiError } = await createTrip({
      driverId: session.userId,
      toLocation: formData.toLocation.trim(),
      fromLocation: formData.fromLocation.trim() || 'UCSD',
      departureTime: new Date(formData.departureTime).toISOString(),
      seatsTotal: formData.seatsTotal,
      compRate: formData.compRate,
      notes: formData.notes.trim() || undefined,
    });

    if (apiError || !data) {
      setError(apiError || 'Failed to create trip');
      setIsSubmitting(false);
      return;
    }

    setToast({ message: 'Trip created successfully!', type: 'success' });
    setTimeout(() => {
      router.push('/trips');
    }, 1000);
  };

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Trip</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="fromLocation" className="block text-sm font-medium text-gray-700 mb-1">
              From Location
            </label>
            <input
              id="fromLocation"
              type="text"
              value={formData.fromLocation}
              onChange={(e) => setFormData({ ...formData, fromLocation: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="toLocation" className="block text-sm font-medium text-gray-700 mb-1">
              To Location *
            </label>
            <input
              id="toLocation"
              type="text"
              value={formData.toLocation}
              onChange={(e) => setFormData({ ...formData, toLocation: e.target.value })}
              placeholder="e.g., Los Angeles, San Francisco"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="departureTime" className="block text-sm font-medium text-gray-700 mb-1">
              Departure Time *
            </label>
            <input
              id="departureTime"
              type="datetime-local"
              value={formData.departureTime}
              onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="seatsTotal" className="block text-sm font-medium text-gray-700 mb-1">
                Total Seats *
              </label>
              <input
                id="seatsTotal"
                type="number"
                min="1"
                value={formData.seatsTotal}
                onChange={(e) => setFormData({ ...formData, seatsTotal: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="compRate" className="block text-sm font-medium text-gray-700 mb-1">
                Rate per Person ($) *
              </label>
              <input
                id="compRate"
                type="number"
                min="0"
                step="0.01"
                value={formData.compRate}
                onChange={(e) => setFormData({ ...formData, compRate: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes (optional)
            </label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Any additional information about the trip..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Trip'}
            </button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
}

