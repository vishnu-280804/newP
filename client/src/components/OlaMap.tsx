import React, { useEffect, useRef, useState } from 'react';
import { isMapsConfigured, MAPS_CONFIG, isGoogleMapsConfigured, getGoogleMapsApiKey } from '../config/maps';
import FallbackMap from './FallbackMap';

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

interface OlaMapProps {
  userLocation: Location;
  laborers: Laborer[];
  onLaborerSelect?: (laborer: Laborer) => void;
  height?: string;
}

declare global {
  interface Window {
    OlaMaps: any;
    google: any;
  }
}

// Ola Maps Web SDK interface
interface OlaMapsConfig {
  apiKey: string;
  mode?: string;
  threedTileset?: string;
}

interface OlaMapsInitConfig {
  style: string;
  container: string;
  center: [number, number];
  zoom: number;
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

// Default location (India center)
const DEFAULT_LOCATION: Location = {
  latitude: 20.5937,
  longitude: 78.9629
};

const OlaMap: React.FC<OlaMapProps> = ({ 
  userLocation, 
  laborers, 
  onLaborerSelect,
  height = "400px" 
}) => {
  // Validate user location
  const validUserLocation = isValidLocation(userLocation) ? userLocation : DEFAULT_LOCATION;
  
  // If no API key is configured, use fallback map
  if (!isMapsConfigured()) {
    return (
      <FallbackMap
        userLocation={validUserLocation}
        laborers={laborers}
        onLaborerSelect={onLaborerSelect}
        height={height}
      />
    );
  }

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationWarning, setLocationWarning] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    // Show warning if using default location
    if (!isValidLocation(userLocation)) {
      setLocationWarning('Using default location. Please update your location for accurate results.');
    }

    // Try to load Ola Maps first, then fallback to Google Maps
    loadOlaMapsWithFallback();

    return () => {
      // Cleanup
      if (mapInstanceRef.current) {
        // Clean up map instance if needed
      }
    };
  }, [validUserLocation, laborers, onLaborerSelect]);

  const loadOlaMapsWithFallback = async () => {
    try {
      // First try Ola Maps
      await loadOlaMaps();
    } catch (olaError) {
      console.log('Ola Maps failed, trying Google Maps fallback...');
      try {
        // Fallback to Google Maps
        await loadGoogleMaps();
      } catch (googleError) {
        console.log('Google Maps also failed, using custom fallback');
        setUsingFallback(true);
        setLoading(false);
      }
    }
  };

  const loadOlaMaps = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if OlaMaps is already loaded
      if (window.OlaMaps && window.OlaMaps.OlaMaps) {
        initializeOlaMap();
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = MAPS_CONFIG.SDK_URL;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        // Wait a bit for the SDK to fully initialize
        setTimeout(() => {
          if (window.OlaMaps && window.OlaMaps.OlaMaps) {
            initializeOlaMap();
            resolve();
          } else {
            reject(new Error('Ola Maps SDK not available'));
          }
        }, 100);
      };
      script.onerror = () => {
        reject(new Error('Failed to load Ola Maps SDK'));
      };
      document.head.appendChild(script);
    });
  };

  const loadGoogleMaps = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        initializeGoogleMap();
        resolve();
        return;
      }

      const script = document.createElement('script');
      const apiKey = getGoogleMapsApiKey();
      const apiKeyParam = apiKey && apiKey !== 'YOUR_GOOGLE_MAPS_API_KEY' ? `?key=${apiKey}` : '';
      script.src = `https://maps.googleapis.com/maps/api/js${apiKeyParam}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google && window.google.maps) {
          initializeGoogleMap();
          resolve();
        } else {
          reject(new Error('Google Maps SDK not available'));
        }
      };
      script.onerror = () => {
        reject(new Error('Failed to load Google Maps SDK'));
      };
      document.head.appendChild(script);
    });
  };

  const initializeOlaMap = () => {
    if (!mapRef.current) {
      console.error('Map container ref missing');
      setError('Map container missing');
      setLoading(false);
      return;
    }
    if (!window.OlaMaps || !window.OlaMaps.OlaMaps) {
      console.error('Ola Maps SDK not loaded. Make sure the script is included in index.html as per https://cloud.olakrutrim.com/console/maps?section=map-docs');
      setError('Ola Maps SDK not loaded. Please check your internet connection and ensure the SDK script is present in index.html.');
      setLoading(false);
      return;
    }
    try {
      console.log('Initializing Ola Map with location:', validUserLocation);
      const olaMaps = new window.OlaMaps.OlaMaps({
        apiKey: MAPS_CONFIG.API_KEY,
      });
      const map = olaMaps.init({
        style: "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
        container: 'ola-map-container',
        center: [validUserLocation.longitude, validUserLocation.latitude],
        zoom: MAPS_CONFIG.DEFAULT_ZOOM,
      });
      mapInstanceRef.current = map;
      addMapMarkers(map, 'ola');
      setMapLoaded(true);
      setLoading(false);
    } catch (err: any) {
      console.error('Error initializing Ola Map:', err);
      setError('Failed to initialize Ola Map: ' + (err?.message || err));
      setLoading(false);
    }
  };

  const initializeGoogleMap = () => {
    if (!mapRef.current || !window.google) return;

    try {
      console.log('Initializing Google Map with location:', validUserLocation);
      
      // Initialize the Google Map
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: validUserLocation.latitude, lng: validUserLocation.longitude },
        zoom: MAPS_CONFIG.DEFAULT_ZOOM,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      });

      mapInstanceRef.current = map;
      addMapMarkers(map, 'google');
      setMapLoaded(true);
      setLoading(false);
    } catch (err) {
      console.error('Error initializing Google Map:', err);
      throw new Error('Failed to initialize Google Map');
    }
  };

  const addMapMarkers = (map: any, mapType: 'ola' | 'google') => {
    if (mapType === 'ola') {
      // For Ola Maps, we'll use a simpler approach since the SDK might have different APIs
      console.log('Adding markers for Ola Maps...');
      
      // Add user location marker (simplified for Ola Maps)
      const userMarkerElement = document.createElement('div');
      userMarkerElement.className = 'ola-user-marker';
      userMarkerElement.innerHTML = `
        <div style="
          width: 24px; 
          height: 24px; 
          background: #2563eb; 
          border: 2px solid white; 
          border-radius: 50%; 
          position: absolute; 
          transform: translate(-50%, -50%);
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        " title="Your Location"></div>
      `;
      
      // Add laborers markers
      laborers.forEach((laborer) => {
        if (isValidLocation(laborer.location)) {
          const laborerMarkerElement = document.createElement('div');
          laborerMarkerElement.className = 'ola-laborer-marker';
          laborerMarkerElement.innerHTML = `
            <div style="
              width: 24px; 
              height: 24px; 
              background: #ff6820; 
              border: 2px solid white; 
              border-radius: 50%; 
              position: absolute; 
              transform: translate(-50%, -50%);
              cursor: pointer;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            " title="${laborer.name}"></div>
          `;
          
          // Add click listener
          laborerMarkerElement.addEventListener('click', () => {
            if (onLaborerSelect) {
              onLaborerSelect(laborer);
            }
          });
        }
      });
      
      return;
    }
    
    // Google Maps implementation (unchanged)
    const MapsAPI = window.google.maps;
    
    // Add user location marker
    const userMarker = new MapsAPI.Marker({
      position: { lat: validUserLocation.latitude, lng: validUserLocation.longitude },
      map: map,
      title: 'Your Location',
      icon: {
        url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyQzIgMTcuNTIgNi40OCAyMiAxMiAyMkMxNy41MiAyMiAyMiAxNy41MiAyMiAxMkMyMiA2LjQ4IDE3LjUyIDIgMTIgMloiIGZpbGw9IiMyNTYzRjYiLz4KPHBhdGggZD0iTTEyIDZDNi40OCA2IDIgMTAuNDggMiAxNkMyIDIxLjUyIDYuNDggMjYgMTIgMjZDMjEuNTIgMjYgMjYgMjEuNTIgMjYgMTZDMjYgMTAuNDggMjEuNTIgNiAxMiA2WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTEyIDEwQzE0LjIwOTEgMTAgMTYgMTEuNzkwOSAxNiAxNEMxNiAxNi4yMDkxIDE0LjIwOTEgMTggMTIgMThDOS43OTA5IDE4IDggMTYuMjA5MSA4IDE0QzggMTEuNzkwOSA5Ljc5MDkgMTAgMTIgMTBaIiBmaWxsPSIjMjU2M0Y2Ii8+Cjwvc3ZnPgo=',
        scaledSize: new MapsAPI.Size(24, 24),
        anchor: new MapsAPI.Point(12, 12)
      }
    });

    // Add info window for user location
    const userInfoWindow = new MapsAPI.InfoWindow({
      content: `
        <div style="padding: 8px;">
          <strong>Your Location</strong><br/>
          <small>Lat: ${validUserLocation.latitude.toFixed(6)}<br/>
          Lng: ${validUserLocation.longitude.toFixed(6)}</small>
        </div>
      `
    });

    userMarker.addListener('click', () => {
      userInfoWindow.open(map, userMarker);
    });

    // Add markers for laborers
    laborers.forEach((laborer) => {
      if (isValidLocation(laborer.location)) {
        const marker = new MapsAPI.Marker({
          position: { lat: laborer.location.latitude, lng: laborer.location.longitude },
          map: map,
          title: laborer.name,
          icon: {
            url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyQzIgMTcuNTIgNi40OCAyMiAxMiAyMkMxNy41MiAyMiAyMiAxNy41MiAyMiAxMkMyMiA2LjQ4IDE3LjUyIDIgMTIgMloiIGZpbGw9IiNGRjY4MjAiLz4KPHBhdGggZD0iTTEyIDZDNi40OCA2IDIgMTAuNDggMiAxNkMyIDIxLjUyIDYuNDggMjYgMTIgMjZDMjEuNTIgMjYgMjYgMjEuNTIgMjYgMTZDMjYgMTAuNDggMjEuNTIgNiAxMiA2WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTEyIDEwQzE0LjIwOTEgMTAgMTYgMTEuNzkwOSAxNiAxNEMxNiAxNi4yMDkxIDE0LjIwOTEgMTggMTIgMThDOS43OTA5IDE4IDggMTYuMjA5MSA4IDE0QzggMTEuNzkwOSA5Ljc5MDkgMTAgMTIgMTBaIiBmaWxsPSIjRkY2ODIwIi8+Cjwvc3ZnPgo=',
            scaledSize: new MapsAPI.Size(24, 24),
            anchor: new MapsAPI.Point(12, 12)
          }
        });

        // Create info window content
        const infoContent = `
          <div style="padding: 12px; max-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #1f2937;">${laborer.name}</h3>
            <p style="margin: 0 0 4px 0; font-size: 14px; color: #6b7280;">
              <strong>Skills:</strong> ${laborer.skills.join(', ')}
            </p>
            <p style="margin: 0 0 4px 0; font-size: 14px; color: #6b7280;">
              <strong>Rate:</strong> ₹${laborer.hourlyRate}/hour
            </p>
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">
              <strong>Rating:</strong> ⭐ ${laborer.rating.toFixed(1)} (${laborer.distance.toFixed(1)}km)
            </p>
            <button 
              onclick="window.selectLaborer('${laborer.id}')"
              style="
                background: #2563eb; 
                color: white; 
                border: none; 
                padding: 6px 12px; 
                border-radius: 4px; 
                cursor: pointer;
                font-size: 12px;
              "
            >
              Send Request
            </button>
          </div>
        `;

        const infoWindow = new MapsAPI.InfoWindow({
          content: infoContent
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        // Add click listener for laborer selection
        if (onLaborerSelect) {
          marker.addListener('click', () => {
            onLaborerSelect(laborer);
          });
        }
      }
    });

    // Add global function for button clicks in info windows
    (window as any).selectLaborer = (laborerId: string) => {
      const laborer = laborers.find(l => l.id === laborerId);
      if (laborer && onLaborerSelect) {
        onLaborerSelect(laborer);
      }
    };
  };

  if (usingFallback) {
    return (
      <FallbackMap
        userLocation={validUserLocation}
        laborers={laborers}
        onLaborerSelect={onLaborerSelect}
        height={height}
      />
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p className="font-medium">Map Error</p>
        <p className="text-sm">{error}</p>
        <p className="text-sm mt-2">
          Using fallback map instead. The map will show your location and nearby laborers.
        </p>
        <FallbackMap
          userLocation={validUserLocation}
          laborers={laborers}
          onLaborerSelect={onLaborerSelect}
          height={height}
        />
      </div>
    );
  }

  return (
    <div className="relative">
      {locationWarning && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-2 rounded mb-2 text-sm">
          ⚠️ {locationWarning}
        </div>
      )}
      <div 
        ref={mapRef} 
        id="ola-map-container"
        style={{ height, width: '100%' }}
        className="rounded-lg border border-gray-200"
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading Map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OlaMap; 