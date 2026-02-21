'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { demoLogin } from '@/lib/api';
import { setSession, useSession } from '@/lib/session';
import Toast from '@/components/Toast';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const { session, isLoaded } = useSession();

  useEffect(() => {
    // Redirect if already logged in
    if (isLoaded && session) {
      router.push('/trips');
    }
  }, [router, session, isLoaded]);

  const validateEmail = (email: string): boolean => {
    return email.endsWith('@ucsd.edu');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      setError('Email must end with @ucsd.edu');
      return;
    }

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    setIsSubmitting(true);

    const { data, error: apiError } = await demoLogin(email.trim().toLowerCase(), name.trim());

    if (apiError || !data) {
      setError(apiError || 'Login failed');
      setIsSubmitting(false);
      return;
    }

    setSession(data.user.id, data.user.email);
    setToast({ message: 'Login successful!', type: 'success' });
    
    setTimeout(() => {
      router.push('/trips');
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Login to DRIVE UCSD</h1>
        <p className="text-sm text-gray-600 text-center mb-6">
          Use your @ucsd.edu email to get started
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@ucsd.edu"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

