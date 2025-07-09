import React, { useState, useEffect } from 'react';
import OlaMap from '../components/OlaMap';
import { MAPS_CONFIG } from '../config/maps';

const MapTest: React.FC = () => {
  const [userLocation, setUserLocation] = useState({
    latitude: 17.416192,
    longitude: 78.462976
  });

  const [laborers, setLaborers] = useState([
    {
      id: '1',
      name: 'Rajesh Kumar',
      skills: ['Plumbing', 'Electrical'],
      hourlyRate: 500,
      rating: 4.8,
      totalJobs: 45,
      location: {
        latitude: 17.415000,
        longitude: 78.464000
      },
      distance: 0.2
    },
    {
      id: '2',
      name: 'Amit Singh',
      skills: ['Painting', 'Cleaning'],
      hourlyRate: 400,
      rating: 4.6,
      totalJobs: 32,
      location: {
        latitude: 17.417000,
        longitude: 78.461000
      },
      distance: 0.3
    }
  ]);

  const handleLaborerSelect = (laborer: any) => {
    console.log('Selected laborer:', laborer);
    alert(`Selected: ${laborer.name} - ₹${laborer.hourlyRate}/hour`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Ola Maps Integration Test</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Map Configuration</h2>
                <div className="bg-gray-100 p-3 rounded text-sm">
                  <p><strong>API Key:</strong> {MAPS_CONFIG.API_KEY ? '✅ Configured' : '❌ Not configured'}</p>
                  <p><strong>SDK URL:</strong> {MAPS_CONFIG.SDK_URL}</p>
                  <p><strong>User Location:</strong> {userLocation.latitude.toFixed(6)}, {userLocation.longitude.toFixed(6)}</p>
                  <p><strong>Laborers:</strong> {laborers.length}</p>
                </div>
              </div>
              
              <OlaMap
                userLocation={userLocation}
                laborers={laborers}
                onLaborerSelect={handleLaborerSelect}
                height="500px"
              />
            </div>
            
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Test Controls</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Update User Location
                  </label>
                  <button
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                          (position) => {
                            setUserLocation({
                              latitude: position.coords.latitude,
                              longitude: position.coords.longitude
                            });
                          },
                          (error) => {
                            console.error('Geolocation error:', error);
                            alert('Failed to get location: ' + error.message);
                          }
                        );
                      } else {
                        alert('Geolocation not supported');
                      }
                    }}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Get Current Location
                  </button>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Coordinates
                  </label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setUserLocation({ latitude: 17.416192, longitude: 78.462976 })}
                      className="w-full bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                      Hyderabad
                    </button>
                    <button
                      onClick={() => setUserLocation({ latitude: 12.9716, longitude: 77.5946 })}
                      className="w-full bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                      Bangalore
                    </button>
                    <button
                      onClick={() => setUserLocation({ latitude: 19.0760, longitude: 72.8777 })}
                      className="w-full bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                      Mumbai
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Debug Info
                  </label>
                  <div className="bg-gray-100 p-3 rounded text-xs">
                    <p><strong>Window.OlaMaps:</strong> {window.OlaMaps ? '✅ Available' : '❌ Not available'}</p>
                    <p><strong>Window.Google:</strong> {window.google ? '✅ Available' : '❌ Not available'}</p>
                    <p><strong>User Agent:</strong> {navigator.userAgent.substring(0, 50)}...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapTest; 