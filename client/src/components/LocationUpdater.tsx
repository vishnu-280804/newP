import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

const LocationUpdater: React.FC = () => {
  const { user, updateLocation } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpdateLocation = async () => {
    try {
      setUpdating(true);
      setError('');
      setSuccess('');

      // Get current location
      const currentLocation = await api.getCurrentLocation();
      
      // Update location in backend
      await updateLocation(currentLocation);
      
      setSuccess('Location updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update location');
    } finally {
      setUpdating(false);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Current Location</h3>
          <p className="text-sm text-gray-600 mt-1">
            Lat: {user.location?.latitude?.toFixed(6) || 'Not set'}, 
            Lng: {user.location?.longitude?.toFixed(6) || 'Not set'}
          </p>
        </div>
        
        <button
          onClick={handleUpdateLocation}
          disabled={updating}
          className="btn btn-primary"
        >
          {updating ? 'Updating...' : 'Update Location'}
        </button>
      </div>
      
      {error && (
        <div className="mt-3 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mt-3 bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded text-sm">
          {success}
        </div>
      )}
    </div>
  );
};

export default LocationUpdater; 