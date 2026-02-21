'use client';

import { useEffect, useState } from 'react';
import { getUser, updateUser } from '@/lib/api';
import { useSession } from '@/lib/session';
import { User } from '@/lib/frontend-types';
import ProtectedRoute from '@/components/ProtectedRoute';
import Toast from '@/components/Toast';

export default function ProfilePage() {
  const { session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState({
    year: '',
    major: '',
    interests: [] as string[],
    interestInput: '',
  });

  useEffect(() => {
    if (session?.userId) {
      loadUser();
    }
  }, [session?.userId]);

  const loadUser = async () => {
    if (!session) return;

    setIsLoading(true);
    const { data, error: apiError } = await getUser(session.userId);

    if (apiError || !data) {
      setError(apiError || 'Failed to load profile');
      setIsLoading(false);
      return;
    }

    setUser(data.user);
    setFormData({
      year: data.user.year || '',
      major: data.user.major || '',
      interests: data.user.interests || [],
      interestInput: '',
    });
    setIsLoading(false);
  };

  const handleAddInterest = () => {
    if (formData.interestInput.trim() && !formData.interests.includes(formData.interestInput.trim())) {
      setFormData({
        ...formData,
        interests: [...formData.interests, formData.interestInput.trim()],
        interestInput: '',
      });
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter(i => i !== interest),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    setIsSaving(true);
    setError(null);

    const { data, error: apiError } = await updateUser(session.userId, {
      year: formData.year || undefined,
      major: formData.major || undefined,
      interests: formData.interests,
    });

    if (apiError || !data) {
      setError(apiError || 'Failed to update profile');
      setIsSaving(false);
      return;
    }

    setUser(data.user);
    setToast({ message: 'Profile updated successfully!', type: 'success' });
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!user) {
    return (
      <ProtectedRoute>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600">{error || 'User not found'}</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

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

        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Profile</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="space-y-2 mb-4">
            <p className="text-lg font-semibold">{user.name}</p>
            <p className="text-gray-600">{user.email}</p>
            {user.ratingAvg && (
              <p className="text-sm text-gray-500">Rating: {user.ratingAvg.toFixed(1)} ⭐</p>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <input
              id="year"
              type="text"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              placeholder="e.g., Freshman, Sophomore, Junior, Senior, Graduate"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="major" className="block text-sm font-medium text-gray-700 mb-1">
              Major
            </label>
            <input
              id="major"
              type="text"
              value={formData.major}
              onChange={(e) => setFormData({ ...formData, major: e.target.value })}
              placeholder="e.g., Computer Science"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Interests
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={formData.interestInput}
                onChange={(e) => setFormData({ ...formData, interestInput: e.target.value })}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddInterest();
                  }
                }}
                placeholder="Add an interest"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleAddInterest}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.interests.map((interest) => (
                <span
                  key={interest}
                  className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                >
                  {interest}
                  <button
                    type="button"
                    onClick={() => handleRemoveInterest(interest)}
                    className="ml-2 text-primary-600 hover:text-primary-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </ProtectedRoute>
  );
}

