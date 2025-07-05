import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

interface Request {
  id: string;
  jobType: string;
  description: string;
  status: string;
  budget: number;
  estimatedHours: number;
  urgency: string;
  scheduledDate: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  customer: {
    id: string;
    name: string;
    phone: string;
    address: string;
  };
  laborer: {
    id: string;
    name: string;
    phone: string;
    skills: string[];
    hourlyRate: number;
    rating: number;
  };
  createdAt: string;
  updatedAt: string;
}

const RequestDetails: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (requestId) {
      loadRequest();
    }
  }, [requestId]);

  const loadRequest = async () => {
    try {
      setLoading(true);
      const response = await api.getRequest(requestId!);
      setRequest(response.request);
    } catch (err: any) {
      setError(err.message || 'Failed to load request');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status: string) => {
    try {
      setUpdating(true);
      await api.updateRequestStatus(requestId!, status);
      await loadRequest(); // Reload the request
    } catch (err: any) {
      setError(err.message || 'Failed to update request');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Request not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{request.jobType}</h1>
            <p className="text-gray-600 mt-1">Request Details</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(request.status)}`}>
              {request.status}
            </span>
            <button
              onClick={() => navigate('/')}
              className="btn btn-outline"
            >
              Back
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Details */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h2>
          
          <div className="space-y-4">
            <div>
              <label className="label">Job Type</label>
              <p className="text-gray-900">{request.jobType}</p>
            </div>

            <div>
              <label className="label">Description</label>
              <p className="text-gray-900">{request.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Budget</label>
                <p className="text-gray-900">₹{request.budget}</p>
              </div>
              <div>
                <label className="label">Estimated Hours</label>
                <p className="text-gray-900">{request.estimatedHours} hours</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Urgency</label>
                <p className="text-gray-900 capitalize">{request.urgency}</p>
              </div>
              <div>
                <label className="label">Scheduled Date</label>
                <p className="text-gray-900">
                  {request.scheduledDate ? new Date(request.scheduledDate).toLocaleDateString() : 'Not scheduled'}
                </p>
              </div>
            </div>

            <div>
              <label className="label">Location</label>
              <p className="text-gray-900">{request.location.address}</p>
              <p className="text-sm text-gray-600">
                {request.location.latitude.toFixed(6)}, {request.location.longitude.toFixed(6)}
              </p>
            </div>
          </div>
        </div>

        {/* User Details */}
        <div className="space-y-6">
          {/* Customer Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Details</h2>
            
            <div className="space-y-3">
              <div>
                <label className="label">Name</label>
                <p className="text-gray-900">{request.customer.name}</p>
              </div>
              <div>
                <label className="label">Phone</label>
                <p className="text-gray-900">{request.customer.phone}</p>
              </div>
              <div>
                <label className="label">Address</label>
                <p className="text-gray-900">{request.customer.address}</p>
              </div>
            </div>
          </div>

          {/* Laborer Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Laborer Details</h2>
            
            <div className="space-y-3">
              <div>
                <label className="label">Name</label>
                <p className="text-gray-900">{request.laborer.name}</p>
              </div>
              <div>
                <label className="label">Phone</label>
                <p className="text-gray-900">{request.laborer.phone}</p>
              </div>
              <div>
                <label className="label">Skills</label>
                <p className="text-gray-900">{request.laborer.skills.join(', ')}</p>
              </div>
              <div>
                <label className="label">Hourly Rate</label>
                <p className="text-gray-900">₹{request.laborer.hourlyRate}/hour</p>
              </div>
              <div>
                <label className="label">Rating</label>
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-400">★</span>
                  <span className="text-gray-900">{request.laborer.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {user?.userType === 'laborer' && request.status === 'pending' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
          <div className="flex space-x-4">
            <button
              onClick={() => handleStatusUpdate('accepted')}
              disabled={updating}
              className="btn btn-success"
            >
              {updating ? 'Updating...' : 'Accept Request'}
            </button>
            <button
              onClick={() => handleStatusUpdate('declined')}
              disabled={updating}
              className="btn btn-danger"
            >
              {updating ? 'Updating...' : 'Decline Request'}
            </button>
          </div>
        </div>
      )}

      {user?.userType === 'laborer' && request.status === 'accepted' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
          <button
            onClick={() => handleStatusUpdate('completed')}
            disabled={updating}
            className="btn btn-primary"
          >
            {updating ? 'Updating...' : 'Mark as Completed'}
          </button>
        </div>
      )}

      {/* Timestamps */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>Created: {new Date(request.createdAt).toLocaleString()}</p>
          <p>Last Updated: {new Date(request.updatedAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default RequestDetails; 