import React, { useState } from 'react';

interface Location {
  latitude: number;
  longitude: number;
}

interface Laborer {
  id: string;
  name: string;
  skills: string[];
  hourlyRate: number;
  rating: number;
  totalJobs: number;
  location: Location;
  distance: number;
}

interface FallbackMapProps {
  userLocation: Location;
  laborers: Laborer[];
  onLaborerSelect?: (laborer: Laborer) => void;
  height?: string;
}

// Validate location coordinates
const isValidLocation = (location: Location): boolean => {
  return (
    location &&
    typeof location.latitude === 'number' &&
    typeof location.longitude === 'number' &&
    location.latitude >= -90 && location.latitude <= 90 &&
    location.longitude >= -180 && location.longitude <= 180 &&
    !isNaN(location.latitude) && !isNaN(location.longitude)
  );
};

// Calculate distance between two points
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const FallbackMap: React.FC<FallbackMapProps> = ({ 
  userLocation, 
  laborers, 
  onLaborerSelect,
  height = "400px" 
}) => {
  const [selectedLaborer, setSelectedLaborer] = useState<Laborer | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);

  // Validate user location
  const validUserLocation = isValidLocation(userLocation) ? userLocation : {
    latitude: 20.5937,
    longitude: 78.9629
  };

  // Filter laborers with valid locations
  const validLaborers = laborers.filter(laborer => isValidLocation(laborer.location));

  // Calculate relative positions for laborers
  const getLaborerPosition = (laborer: Laborer) => {
    if (!isValidLocation(laborer.location)) return null;

    // Calculate actual distance from user
    const actualDistance = calculateDistance(
      validUserLocation.latitude,
      validUserLocation.longitude,
      laborer.location.latitude,
      laborer.location.longitude
    );

    // Scale distance for display (max 200px from center)
    const displayDistance = Math.min(actualDistance * 20, 200);
    
    // Calculate angle based on actual coordinates
    const deltaLat = laborer.location.latitude - validUserLocation.latitude;
    const deltaLon = laborer.location.longitude - validUserLocation.longitude;
    const angle = Math.atan2(deltaLon, deltaLat) * 180 / Math.PI;

    // Convert to percentage positions
    const x = 50 + (displayDistance * Math.cos(angle * Math.PI / 180)) / 4;
    const y = 50 + (displayDistance * Math.sin(angle * Math.PI / 180)) / 4;

    return { x, y, actualDistance };
  };

  const handleLaborerClick = (laborer: Laborer) => {
    setSelectedLaborer(laborer);
    onLaborerSelect?.(laborer);
  };

  return (
    <div className="relative" style={{ height }}>
      {/* Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border border-gray-200 overflow-hidden">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px'
          }}></div>
        </div>

        {/* Distance Circles */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-40 h-40 border border-blue-200 rounded-full opacity-30"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 border border-blue-300 rounded-full opacity-50"></div>
        </div>
        
        {/* User Location Marker */}
        <div className="absolute transform -translate-x-1/2 -translate-y-1/2" 
             style={{ 
               left: '50%', 
               top: '50%' 
             }}>
          <div className="relative">
            <div className="w-8 h-8 bg-blue-600 rounded-full border-3 border-white shadow-lg flex items-center justify-center animate-pulse">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full text-xs font-medium shadow-sm border">
              You
            </div>
          </div>
        </div>

        {/* Laborer Markers */}
        {validLaborers.map((laborer) => {
          const position = getLaborerPosition(laborer);
          if (!position) return null;

          return (
            <div key={laborer.id}
                 className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform duration-200"
                 style={{ 
                   left: `${position.x}%`, 
                   top: `${position.y}%` 
                 }}
                 onClick={() => handleLaborerClick(laborer)}>
              <div className="relative group">
                <div className="w-6 h-6 bg-orange-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center hover:bg-orange-600 transition-colors">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-xs font-medium shadow-sm border whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {laborer.name} ({position.actualDistance.toFixed(1)}km)
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Map Info Overlay */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-sm border">
        <div className="text-sm font-medium text-gray-900 mb-2">Map Legend</div>
        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-600 rounded-full border border-white"></div>
            <span>Your Location</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-orange-500 rounded-full border border-white"></div>
            <span>Laborers ({validLaborers.length})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border border-blue-200 rounded-full"></div>
            <span>Distance circles</span>
          </div>
        </div>
      </div>

      {/* Location Info */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-sm border">
        <div className="text-sm font-medium text-gray-900 mb-1">Your Location</div>
        <div className="text-xs text-gray-600 space-y-1">
          <div>Lat: {validUserLocation.latitude.toFixed(6)}</div>
          <div>Lng: {validUserLocation.longitude.toFixed(6)}</div>
          {!isValidLocation(userLocation) && (
            <div className="text-orange-600 font-medium">⚠️ Using default location</div>
          )}
        </div>
      </div>

      {/* Instructions */}
      {showInstructions && (
        <div className="absolute top-4 right-4 bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-xs">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="text-sm font-medium text-blue-900 mb-1">Interactive Map</div>
              <div className="text-xs text-blue-700 mb-2">
                Click on laborer markers to view details and send requests. 
                For full map functionality, configure your Ola Maps API key.
              </div>
              <div className="text-xs text-blue-600">
                💡 Hover over markers to see distance information
              </div>
            </div>
            <button 
              onClick={() => setShowInstructions(false)}
              className="text-blue-400 hover:text-blue-600 ml-2"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Selected Laborer Info */}
      {selectedLaborer && (
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-sm border max-w-xs">
          <div className="text-sm font-medium text-gray-900 mb-2">{selectedLaborer.name}</div>
          <div className="text-xs text-gray-600 space-y-1">
            <div><strong>Skills:</strong> {selectedLaborer.skills.join(', ')}</div>
            <div><strong>Rate:</strong> ₹{selectedLaborer.hourlyRate}/hour</div>
            <div><strong>Rating:</strong> ⭐ {selectedLaborer.rating.toFixed(1)} ({selectedLaborer.totalJobs} jobs)</div>
            <div><strong>Distance:</strong> {selectedLaborer.distance.toFixed(1)} km</div>
          </div>
          <button
            onClick={() => onLaborerSelect?.(selectedLaborer)}
            className="mt-2 w-full bg-blue-600 text-white text-xs py-1 px-2 rounded hover:bg-blue-700 transition-colors"
          >
            Send Request
          </button>
        </div>
      )}

      {/* No Laborers Message */}
      {validLaborers.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-gray-500 mb-2">📍</div>
            <div className="text-sm font-medium text-gray-900 mb-1">No Laborers Nearby</div>
            <div className="text-xs text-gray-600">
              No laborers found within your search radius. Try increasing the search area or updating your location.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FallbackMap; 