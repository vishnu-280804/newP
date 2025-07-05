import React from 'react';

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

const FallbackMap: React.FC<FallbackMapProps> = ({ 
  userLocation, 
  laborers, 
  onLaborerSelect,
  height = "400px" 
}) => {
  return (
    <div className="relative" style={{ height }}>
      {/* Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border border-gray-200">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        
        {/* User Location Marker */}
        <div className="absolute transform -translate-x-1/2 -translate-y-1/2" 
             style={{ 
               left: '50%', 
               top: '50%' 
             }}>
          <div className="relative">
            <div className="w-6 h-6 bg-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-xs font-medium shadow-sm border">
              You
            </div>
          </div>
        </div>

        {/* Laborer Markers */}
        {laborers.map((laborer, index) => {
          // Calculate relative position based on distance
          const angle = (index * 45) % 360; // Distribute markers in a circle
          const distance = Math.min(laborer.distance * 10, 150); // Scale distance for display
          const x = 50 + (distance * Math.cos(angle * Math.PI / 180)) / 3;
          const y = 50 + (distance * Math.sin(angle * Math.PI / 180)) / 3;
          
          return (
            <div key={laborer.id}
                 className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
                 style={{ 
                   left: `${x}%`, 
                   top: `${y}%` 
                 }}
                 onClick={() => onLaborerSelect?.(laborer)}>
              <div className="relative">
                <div className="w-5 h-5 bg-orange-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
                <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-xs font-medium shadow-sm border whitespace-nowrap">
                  {laborer.name}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Map Info Overlay */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm border">
        <div className="text-sm font-medium text-gray-900 mb-1">Map Legend</div>
        <div className="flex items-center space-x-3 text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span>Your Location</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>Laborers ({laborers.length})</span>
          </div>
        </div>
      </div>

      {/* Location Info */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm border">
        <div className="text-sm font-medium text-gray-900 mb-1">Your Location</div>
        <div className="text-xs text-gray-600">
          <div>Lat: {userLocation.latitude.toFixed(6)}</div>
          <div>Lng: {userLocation.longitude.toFixed(6)}</div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute top-4 right-4 bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-xs">
        <div className="text-sm font-medium text-blue-900 mb-1">Interactive Map</div>
        <div className="text-xs text-blue-700">
          Click on laborer markers to view details and send requests. 
          For full map functionality, add your Ola Maps API key.
        </div>
      </div>
    </div>
  );
};

export default FallbackMap; 