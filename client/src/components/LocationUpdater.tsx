import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

const LocationUpdater: React.FC = () => {
  const { user, updateLocation } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);
  const [isLocationSupported, setIsLocationSupported] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if geolocation is supported
    setIsLocationSupported('geolocation' in navigator);
  }, []);

  const handleUpdateLocation = async (): Promise<void> => {
    try {
      setUpdating(true);
      setError('');
      setSuccess('');

      // Get current location with high accuracy
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

  const handleManualLocationUpdate = async () => {
    try {
      setUpdating(true);
      setError('');
      setSuccess('');

      // Try to get location with different accuracy settings
      const location = await new Promise<{ latitude: number; longitude: number; accuracy?: number }>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported by this browser'));
          return;
        }

        const options = {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocationAccuracy(position.coords.accuracy);
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy
            });
          },
          (error) => {
            console.error('Geolocation error:', error);
            let errorMessage = 'Unable to retrieve your location';
            
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = 'Location access denied. Please enable location permissions in your browser settings.';
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage = 'Location information unavailable. Please check your GPS or network connection.';
                break;
              case error.TIMEOUT:
                errorMessage = 'Location request timed out. Please try again.';
                break;
            }
            
            reject(new Error(errorMessage));
          },
          options
        );
      });

      // Update location in backend
      await updateLocation(location);
      
      setSuccess(`Location updated successfully! Accuracy: ${location.accuracy ? `${location.accuracy.toFixed(1)}m` : 'Unknown'}`);
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to update location');
    } finally {
      setUpdating(false);
    }
  };

  if (!user) return null;

  const hasValidLocation = user.location?.latitude && user.location?.longitude;

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Current Location</h3>
          <p className="text-sm text-gray-600 mt-1">
            {hasValidLocation ? (
              <>
                Lat: {user.location.latitude.toFixed(6)}, 
                Lng: {user.location.longitude.toFixed(6)}
                {locationAccuracy && (
                  <span className="ml-2 text-blue-600">
                    (Accuracy: {locationAccuracy.toFixed(1)}m)
                  </span>
                )}
              </>
            ) : (
              <span className="text-red-600">Location not set</span>
            )}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleManualLocationUpdate}
            disabled={updating || !isLocationSupported}
            className="btn btn-primary"
            title={!isLocationSupported ? 'Geolocation not supported' : 'Update location with high accuracy'}
          >
            {updating ? 'Updating...' : 'Update Location'}
          </button>
        </div>
      </div>

      {/* Location Status */}
      <div className="mb-3">
        <div className="flex items-center space-x-2 text-sm">
          <span className="font-medium">Location Status:</span>
          {isLocationSupported === false ? (
            <span className="text-red-600">❌ Not supported</span>
          ) : isLocationSupported === true ? (
            <span className="text-green-600">✅ Supported</span>
          ) : (
            <span className="text-gray-500">⏳ Checking...</span>
          )}
        </div>
        
        {hasValidLocation && (
          <div className="mt-2 text-sm text-gray-600">
            <p>✅ Location is set and ready for use</p>
          </div>
        )}
      </div>
      
      {/* Error Messages */}
      {error && (
        <div className="mt-3 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
          <div className="flex items-start">
            <span className="mr-2">⚠️</span>
            <div>
              <p className="font-medium">Location Error</p>
              <p>{error}</p>
              {error.includes('Permission denied') && (
                <p className="mt-1 text-xs">
                  <strong>How to fix:</strong> Go to your browser settings → Privacy & Security → Site Settings → Location → Allow
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Success Messages */}
      {success && (
        <div className="mt-3 bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded text-sm">
          <div className="flex items-start">
            <span className="mr-2">✅</span>
            <div>
              <p className="font-medium">Success</p>
              <p>{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Location Tips */}
      <div className="mt-3 bg-blue-50 border border-blue-200 text-blue-700 px-3 py-2 rounded text-sm">
        <p className="font-medium mb-1">💡 Location Tips:</p>
        <ul className="text-xs space-y-1">
          <li>• Enable GPS on your device for better accuracy</li>
          <li>• Allow location access when prompted by your browser</li>
          <li>• Update your location when you move to a new area</li>
          <li>• Higher accuracy helps find laborers closer to you</li>
        </ul>
      </div>
    </div>
  );
};

export default LocationUpdater; 