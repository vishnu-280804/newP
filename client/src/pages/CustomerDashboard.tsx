import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import OlaMap from '../components/OlaMap';
import LocationUpdater from '../components/LocationUpdater';
import LocationDebugger from '../components/LocationDebugger';

interface Laborer {
  id: string;
  name: string;
  skills: string[];
  hourlyRate: number;
  rating: number;
  totalJobs: number;
  distance: number;
  location: {
    latitude: number;
    longitude: number;
  };
}

const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [laborers, setLaborers] = useState<Laborer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedLaborer, setSelectedLaborer] = useState<Laborer | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showLocationDebugger, setShowLocationDebugger] = useState(false);
  const [liveLocation, setLiveLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    loadNearbyLaborers();
    startLiveLocationTracking();
  }, []);

  const startLiveLocationTracking = () => {
    if ('geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setLiveLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.log('Live location tracking error:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  };

  const loadNearbyLaborers = async () => {
    try {
      setLoading(true);
      const response = await api.getNearbyLaborers(
        user!.location.latitude,
        user!.location.longitude,
        10
      );
      setLaborers(response.laborers);
    } catch (err: any) {
      setError(err.message || 'Failed to load nearby laborers');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestLaborer = (laborer: Laborer) => {
    setSelectedLaborer(laborer);
    setShowRequestModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center animate-spin">
              <i className="fas fa-hammer text-white text-2xl"></i>
            </div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <h2 className="mt-6 text-xl font-semibold text-gray-900">Finding Skilled Laborers</h2>
          <p className="mt-2 text-gray-600">Searching for the best workers in your area...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-2xl shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative px-8 py-12 text-white">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <i className="fas fa-map-marker-alt text-2xl"></i>
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Find Skilled Laborers</h1>
                <p className="text-xl text-blue-100">Discover reliable workers in your area</p>
              </div>
            </div>
            
            {/* Live Location Display */}
            {liveLocation && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="font-medium">Live Location Active</span>
                  </div>
                  <div className="text-sm text-blue-100">
                    Lat: {liveLocation.latitude.toFixed(6)}, Lng: {liveLocation.longitude.toFixed(6)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      {/* Location Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LocationUpdater />
        </div>
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => setShowLocationDebugger(!showLocationDebugger)}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <i className="fas fa-bug"></i>
            <span>Debug Location</span>
          </button>
          
          <button
            onClick={loadNearbyLaborers}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <i className="fas fa-sync-alt"></i>
            <span>Refresh Results</span>
          </button>
        </div>
      </div>

      {/* Location Debugger */}
      {showLocationDebugger && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <LocationDebugger 
            onLocationUpdate={(location) => {
              console.log('Location updated via debugger:', location);
            }}
          />
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-lg">
          <div className="flex items-center space-x-3">
            <i className="fas fa-exclamation-triangle text-xl"></i>
            <div>
              <h3 className="font-semibold">Error Loading Laborers</h3>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Map Section */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Interactive Map</h2>
              <p className="text-gray-600">
                View your location and nearby laborers. Click on markers to see details and send requests.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <span className="text-sm font-medium text-blue-700">Your Location</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-2 bg-orange-50 rounded-lg">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm font-medium text-orange-700">Laborers</span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6">
          <OlaMap
            userLocation={user!.location}
            laborers={laborers}
            onLaborerSelect={handleRequestLaborer}
            height="600px"
          />
        </div>
      </div>

      {/* Laborers List */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Nearby Laborers ({laborers.length})
              </h2>
              <p className="text-gray-600 mt-1">All laborers are verified and rated by customers</p>
            </div>
            <div className="flex items-center space-x-2">
              <i className="fas fa-shield-alt text-green-500"></i>
              <span className="text-sm text-green-600 font-medium">Verified Workers</span>
            </div>
          </div>
        </div>
        
        <div className="divide-y divide-gray-100">
          {laborers.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-search text-gray-400 text-xl"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Laborers Found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                No laborers found in your area. Try updating your location or increasing the search radius.
              </p>
            </div>
          ) : (
            laborers.map((laborer) => (
              <div key={laborer.id} className="px-6 py-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {laborer.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {laborer.name}
                          </h3>
                          <div className="flex items-center space-x-1">
                            <span className="text-yellow-400">★</span>
                            <span className="text-sm font-medium text-gray-700">
                              {laborer.rating.toFixed(1)}
                            </span>
                            <span className="text-sm text-gray-500">
                              ({laborer.totalJobs} jobs)
                            </span>
                          </div>
                          <div className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            Verified
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Skills:</span>
                            <p className="text-gray-600">{laborer.skills.join(', ')}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Rate:</span>
                            <p className="text-gray-600">₹{laborer.hourlyRate}/hour</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Distance:</span>
                            <p className="text-blue-600 font-medium">{laborer.distance.toFixed(1)} km away</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-6">
                    <button
                      onClick={() => handleRequestLaborer(laborer)}
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <i className="fas fa-paper-plane"></i>
                      <span>Send Request</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Request Modal */}
      {showRequestModal && selectedLaborer && (
        <RequestModal
          laborer={selectedLaborer}
          onClose={() => setShowRequestModal(false)}
          onSuccess={() => {
            setShowRequestModal(false);
            setSelectedLaborer(null);
          }}
        />
      )}
    </div>
  );
};

// Request Modal Component
interface RequestModalProps {
  laborer: Laborer;
  onClose: () => void;
  onSuccess: () => void;
}

const RequestModal: React.FC<RequestModalProps> = ({ laborer, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    jobType: '',
    description: '',
    estimatedHours: '',
    budget: '',
    urgency: 'medium' as 'low' | 'medium' | 'high',
    scheduledDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Use user.location if available, otherwise use liveLocation
    const location = user?.location || liveLocation;
    if (!location || !location.latitude || !location.longitude) {
      setError('Your location is missing. Please update your location before sending a request.');
      setLoading(false);
      return;
    }

    try {
      await api.createRequest({
        laborerId: laborer.id,
        ...formData,
        location: {
          latitude: location.latitude,
          longitude: location.longitude
        }
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to create request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Send Request to {laborer.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Type
              </label>
              <input
                type="text"
                value={formData.jobType}
                onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="e.g., Plumbing, Electrical, Painting"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Hours
              </label>
              <input
                type="number"
                value={formData.estimatedHours}
                onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="e.g., 4"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget (₹)
              </label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="e.g., 2000"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urgency
              </label>
              <select
                value={formData.urgency}
                onChange={(e) => setFormData({ ...formData, urgency: e.target.value as 'low' | 'medium' | 'high' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Describe the work you need done..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Scheduled Date
            </label>
            <input
              type="datetime-local"
              value={formData.scheduledDate}
              onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i>
                  <span>Send Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerDashboard; 