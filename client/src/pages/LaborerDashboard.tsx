import React, { useState, useEffect } from 'react';
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
  customer: {
    id: string;
    name: string;
    phone: string;
  };
  createdAt: string;
}

const LaborerDashboard: React.FC = () => {
  const { user, updateAvailability } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAvailable, setIsAvailable] = useState(user?.isAvailable ?? true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await api.getRequests();
      setRequests(response.requests);
    } catch (err: any) {
      setError(err.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAvailabilityToggle = async () => {
    try {
      await updateAvailability(!isAvailable);
      setIsAvailable(!isAvailable);
    } catch (err: any) {
      setError(err.message || 'Failed to update availability');
    }
  };

  const handleRequestAction = async (requestId: string, status: 'accepted' | 'declined') => {
    try {
      await api.updateRequestStatus(requestId, status);
      loadRequests(); // Reload requests
    } catch (err: any) {
      setError(err.message || 'Failed to update request');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Requests</h1>
            <p className="text-gray-600 mt-2">
              Manage incoming job requests from customers
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Availability:</span>
            <button
              onClick={handleAvailabilityToggle}
              className={`px-4 py-2 rounded-lg font-medium ${
                isAvailable 
                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                  : 'bg-red-100 text-red-800 hover:bg-red-200'
              }`}
            >
              {isAvailable ? 'Available' : 'Unavailable'}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-blue-600">{requests.length}</div>
          <div className="text-sm text-gray-600">Total Requests</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {requests.filter(r => r.status === 'pending').length}
          </div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-green-600">
            {requests.filter(r => r.status === 'accepted').length}
          </div>
          <div className="text-sm text-gray-600">Accepted</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-blue-600">
            {requests.filter(r => r.status === 'completed').length}
          </div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Job Requests ({requests.length})
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {requests.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <p className="text-gray-500">No requests yet</p>
            </div>
          ) : (
            requests.map((request) => (
              <div key={request.id} className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {request.jobType}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{request.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Customer:</span>
                        <p className="text-gray-600">{request.customer.name}</p>
                        <p className="text-gray-500">{request.customer.phone}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Budget:</span>
                        <p className="text-gray-600">₹{request.budget}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Duration:</span>
                        <p className="text-gray-600">{request.estimatedHours} hours</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Urgency:</span>
                        <p className="text-gray-600 capitalize">{request.urgency}</p>
                      </div>
                    </div>
                    
                    {request.scheduledDate && (
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">Scheduled:</span> {new Date(request.scheduledDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  
                  {request.status === 'pending' && (
                    <div className="ml-4 flex space-x-2">
                      <button
                        onClick={() => handleRequestAction(request.id, 'accepted')}
                        className="btn btn-success"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRequestAction(request.id, 'declined')}
                        className="btn btn-danger"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                  
                  {request.status === 'accepted' && (
                    <div className="ml-4">
                      <button
                        onClick={() => handleRequestAction(request.id, 'completed')}
                        className="btn btn-primary"
                      >
                        Mark Complete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LaborerDashboard; 