import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const { user, updateAvailability } = useAuth();
  const [isAvailable, setIsAvailable] = useState(user?.isAvailable ?? true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAvailabilityToggle = async () => {
    try {
      setLoading(true);
      await updateAvailability(!isAvailable);
      setIsAvailable(!isAvailable);
      setSuccess('Availability updated successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to update availability');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="label">Name</label>
            <input
              type="text"
              value={user?.name || ''}
              disabled
              className="input bg-gray-50"
            />
          </div>

          <div>
            <label className="label">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="input bg-gray-50"
            />
          </div>

          <div>
            <label className="label">Phone</label>
            <input
              type="tel"
              value={user?.phone || ''}
              disabled
              className="input bg-gray-50"
            />
          </div>

          <div>
            <label className="label">Address</label>
            <textarea
              value={user?.address || ''}
              disabled
              className="input bg-gray-50"
              rows={3}
            />
          </div>

          <div>
            <label className="label">User Type</label>
            <input
              type="text"
              value={user?.userType === 'customer' ? 'Customer' : 'Laborer'}
              disabled
              className="input bg-gray-50"
            />
          </div>

          {user?.userType === 'laborer' && (
            <>
              <div>
                <label className="label">Skills</label>
                <input
                  type="text"
                  value={user?.skills?.join(', ') || ''}
                  disabled
                  className="input bg-gray-50"
                />
              </div>

              <div>
                <label className="label">Hourly Rate</label>
                <input
                  type="text"
                  value={`₹${user?.hourlyRate || 0}/hour`}
                  disabled
                  className="input bg-gray-50"
                />
              </div>

              <div>
                <label className="label">Experience</label>
                <textarea
                  value={user?.experience || ''}
                  disabled
                  className="input bg-gray-50"
                  rows={3}
                />
              </div>

              <div>
                <label className="label">Rating</label>
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-400 text-xl">★</span>
                  <span className="text-gray-900">{user?.rating?.toFixed(1) || '0.0'}</span>
                  <span className="text-gray-600">({user?.totalJobs || 0} jobs)</span>
                </div>
              </div>

              <div>
                <label className="label">Availability</label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleAvailabilityToggle}
                    disabled={loading}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      isAvailable 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    {loading ? 'Updating...' : (isAvailable ? 'Available' : 'Unavailable')}
                  </button>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="label">Location</label>
            <div className="text-sm text-gray-600">
              Latitude: {user?.location?.latitude?.toFixed(6) || 'N/A'}<br />
              Longitude: {user?.location?.longitude?.toFixed(6) || 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 