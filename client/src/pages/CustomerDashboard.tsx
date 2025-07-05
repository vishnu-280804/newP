import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import OlaMap from '../components/OlaMap';
import LocationUpdater from '../components/LocationUpdater';

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

  useEffect(() => {
    loadNearbyLaborers();
  }, []);

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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">Find Nearby Laborers</h1>
        <p className="text-gray-600 mt-2">
          Discover skilled laborers in your area. All laborers are sorted by distance.
        </p>
      </div>

      {/* Location Updater */}
      <LocationUpdater />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Ola Maps Integration */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Map View</h2>
            <p className="text-sm text-gray-600 mt-1">
              View your location and nearby laborers on the map. Click on laborer markers to see details and send requests.
            </p>
          </div>
          <button
            onClick={loadNearbyLaborers}
            className="btn btn-outline"
          >
            Refresh Map
          </button>
        </div>
        <OlaMap
          userLocation={user!.location}
          laborers={laborers}
          onLaborerSelect={handleRequestLaborer}
          height="500px"
        />
      </div>

      {/* Laborers List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Nearby Laborers ({laborers.length})
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {laborers.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <p className="text-gray-500">No laborers found in your area</p>
            </div>
          ) : (
            laborers.map((laborer) => (
              <div key={laborer.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        {laborer.name}
                      </h3>
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm text-gray-600">
                          {laborer.rating.toFixed(1)} ({laborer.totalJobs} jobs)
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Skills:</span> {laborer.skills.join(', ')}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Rate:</span> ₹{laborer.hourlyRate}/hour
                      </p>
                      <p className="text-sm text-blue-600">
                        <span className="font-medium">Distance:</span> {laborer.distance.toFixed(1)} km away
                      </p>
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    <button
                      onClick={() => handleRequestLaborer(laborer)}
                      className="btn btn-primary"
                    >
                      Send Request
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

    try {
      await api.createRequest({
        laborerId: laborer.id,
        ...formData,
        estimatedHours: parseInt(formData.estimatedHours),
        budget: parseFloat(formData.budget),
        location: laborer.location
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Send Request to {laborer.name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Job Type</label>
            <input
              type="text"
              required
              value={formData.jobType}
              onChange={(e) => setFormData(prev => ({ ...prev, jobType: e.target.value }))}
              className="input"
              placeholder="e.g., Plumbing, Electrical"
            />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="input"
              rows={3}
              placeholder="Describe the work needed"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Estimated Hours</label>
              <input
                type="number"
                required
                value={formData.estimatedHours}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedHours: e.target.value }))}
                className="input"
                placeholder="Hours"
              />
            </div>

            <div>
              <label className="label">Budget (₹)</label>
              <input
                type="number"
                required
                value={formData.budget}
                onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                className="input"
                placeholder="Amount"
              />
            </div>
          </div>

          <div>
            <label className="label">Urgency</label>
            <select
              value={formData.urgency}
              onChange={(e) => setFormData(prev => ({ ...prev, urgency: e.target.value as any }))}
              className="input"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="label">Scheduled Date</label>
            <input
              type="date"
              value={formData.scheduledDate}
              onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
              className="input"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex-1"
            >
              {loading ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerDashboard; 