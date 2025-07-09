import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

interface LocationDebuggerProps {
  onLocationUpdate?: (location: { latitude: number; longitude: number }) => void;
}

const LocationDebugger: React.FC<LocationDebuggerProps> = ({ onLocationUpdate }) => {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [permission, setPermission] = useState<string>('unknown');
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy?: number;
    timestamp?: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    checkLocationSupport();
    checkPermission();
  }, []);

  const checkLocationSupport = () => {
    const supported = 'geolocation' in navigator;
    setIsSupported(supported);
  };

  const checkPermission = async () => {
    if ('permissions' in navigator) {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        setPermission(result.state);
        
        result.addEventListener('change', () => {
          setPermission(result.state);
        });
      } catch (err) {
        setPermission('unknown');
      }
    } else {
      setPermission('unknown');
    }
  };

  const testLocation = async () => {
    setTesting(true);
    setError(null);
    setCurrentLocation(null);

    try {
      const location = await api.getCurrentLocation();
      setCurrentLocation(location);
      
      if (onLocationUpdate) {
        onLocationUpdate(location);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setTesting(false);
    }
  };

  const getPermissionStatusColor = (status: string) => {
    switch (status) {
      case 'granted': return 'text-green-600';
      case 'denied': return 'text-red-600';
      case 'prompt': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getPermissionStatusIcon = (status: string) => {
    switch (status) {
      case 'granted': return '✅';
      case 'denied': return '❌';
      case 'prompt': return '⚠️';
      default: return '❓';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Location Debugger</h3>
      
      {/* Support Status */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Geolocation Support:</span>
          <span className={`text-sm ${isSupported ? 'text-green-600' : 'text-red-600'}`}>
            {isSupported ? '✅ Supported' : '❌ Not Supported'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Permission Status:</span>
          <span className={`text-sm ${getPermissionStatusColor(permission)}`}>
            {getPermissionStatusIcon(permission)} {permission.charAt(0).toUpperCase() + permission.slice(1)}
          </span>
        </div>

        {/* Current Location */}
        {currentLocation && (
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <div className="text-sm font-medium text-green-900 mb-2">✅ Location Retrieved Successfully</div>
            <div className="text-xs text-green-700 space-y-1">
              <div>Latitude: {currentLocation.latitude.toFixed(6)}</div>
              <div>Longitude: {currentLocation.longitude.toFixed(6)}</div>
              {currentLocation.accuracy && (
                <div>Accuracy: {currentLocation.accuracy.toFixed(1)} meters</div>
              )}
              {currentLocation.timestamp && (
                <div>Time: {new Date(currentLocation.timestamp).toLocaleString()}</div>
              )}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <div className="text-sm font-medium text-red-900 mb-1">❌ Location Error</div>
            <div className="text-xs text-red-700">{error}</div>
          </div>
        )}

        {/* Test Button */}
        <button
          onClick={testLocation}
          disabled={testing || !isSupported}
          className="w-full btn btn-primary"
        >
          {testing ? 'Testing Location...' : 'Test Location'}
        </button>

        {/* Troubleshooting Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded p-3">
          <div className="text-sm font-medium text-blue-900 mb-2">🔧 Troubleshooting Tips</div>
          <div className="text-xs text-blue-700 space-y-1">
            {permission === 'denied' && (
              <div>• <strong>Permission Denied:</strong> Go to browser settings → Privacy → Location → Allow</div>
            )}
            {permission === 'prompt' && (
              <div>• <strong>Permission Prompt:</strong> Allow location access when prompted</div>
            )}
            <div>• <strong>GPS:</strong> Enable GPS on your device for better accuracy</div>
            <div>• <strong>Network:</strong> Ensure you have a stable internet connection</div>
            <div>• <strong>Browser:</strong> Try refreshing the page or using a different browser</div>
          </div>
        </div>

        {/* Browser Info */}
        <div className="bg-gray-50 border border-gray-200 rounded p-3">
          <div className="text-sm font-medium text-gray-900 mb-2">🌐 Browser Information</div>
          <div className="text-xs text-gray-700 space-y-1">
            <div>Browser: {navigator.userAgent.split(' ').pop()?.split('/')[0] || 'Unknown'}</div>
            <div>Platform: {navigator.platform}</div>
            <div>Online: {navigator.onLine ? '✅ Yes' : '❌ No'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationDebugger; 