'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { seedData } from '@/lib/api';
import { useSession } from '@/lib/session';
import Toast from '@/components/Toast';

export default function Home() {
  const router = useRouter();
  const [isSeeding, setIsSeeding] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const { session, isLoaded } = useSession();

  const handleSeed = async () => {
    setIsSeeding(true);
    const { data, error } = await seedData();

    if (error || !data) {
      setToast({ message: error || 'Failed to seed data', type: 'error' });
    } else {
      setToast({ message: `Seeded ${data.tripsCount} trips successfully!`, type: 'success' });
    }
    setIsSeeding(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-2xl w-full text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">DRIVE UCSD</h1>
        <p className="text-xl text-gray-600 mb-8">
          Connect with fellow UCSD students for rides
        </p>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Demo Tips</h2>
          <ol className="text-left space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="font-bold mr-2">1.</span>
              <span>Click "Seed Demo Data" to populate the database with sample trips</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">2.</span>
              <span>Click "Login" and use a @ucsd.edu email to authenticate</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">3.</span>
              <span>Browse available trips and request rides</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">4.</span>
              <span>As a driver, check "Requests" to accept or decline ride requests</span>
            </li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleSeed}
            disabled={isSeeding}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSeeding ? 'Seeding...' : 'Seed Demo Data'}
          </button>

          {isLoaded && session ? (
            <Link
              href="/trips"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-center"
            >
              Go to Trips
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-center"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

