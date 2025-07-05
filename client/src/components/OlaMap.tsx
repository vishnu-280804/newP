import React, { useEffect, useRef, useState } from 'react';
import { isMapsConfigured } from '../config/maps';
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

const OlaMap: React.FC<OlaMapProps> = ({ 
  userLocation, 
  laborers, 
  onLaborerSelect,
  height = "400px" 
}) => {
  // If no API key is configured, use fallback map
  if (!isMapsConfigured()) {
    return (
      <FallbackMap
        userLocation={userLocation}
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

  useEffect(() => {
    // Load Google Maps as fallback since Ola Maps SDK might not be available
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initializeGoogleMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google && window.google.maps) {
          initializeGoogleMap();
        } else {
          setError('Failed to load Google Maps SDK');
          setLoading(false);
        }
      };
      script.onerror = () => {
        setError('Failed to load Google Maps SDK');
        setLoading(false);
      };
      document.head.appendChild(script);
    };

    const initializeGoogleMap = () => {
      if (!mapRef.current || !window.google) return;

      try {
        // Initialize the map
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: userLocation.latitude, lng: userLocation.longitude },
          zoom: 13,
          mapTypeId: window.google.maps.MapTypeId.ROADMAP,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ]
        });

        mapInstanceRef.current = map;

        // Add user location marker
        const userMarker = new window.google.maps.Marker({
          position: { lat: userLocation.latitude, lng: userLocation.longitude },
          map: map,
          title: 'Your Location',
          icon: {
            url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyQzIgMTcuNTIgNi40OCAyMiAxMiAyMkMxNy41MiAyMiAyMiAxNy41MiAyMiAxMkMyMiA2LjQ4IDE3LjUyIDIgMTIgMloiIGZpbGw9IiMyNTYzRjYiLz4KPHBhdGggZD0iTTEyIDZDNi40OCA2IDIgMTAuNDggMiAxNkMyIDIxLjUyIDYuNDggMjYgMTIgMjZDMjEuNTIgMjYgMjYgMjEuNTIgMjYgMTZDMjYgMTAuNDggMjEuNTIgNiAxMiA2WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTEyIDEwQzE0LjIwOTEgMTAgMTYgMTEuNzkwOSAxNiAxNEMxNiAxNi4yMDkxIDE0LjIwOTEgMTggMTIgMThDOS43OTA5IDE4IDggMTYuMjA5MSA4IDE0QzggMTEuNzkwOSA5Ljc5MDkgMTAgMTIgMTBaIiBmaWxsPSIjMjU2M0Y2Ii8+Cjwvc3ZnPgo=',
            scaledSize: new window.google.maps.Size(24, 24),
            anchor: new window.google.maps.Point(12, 12)
          }
        });

        // Add info window for user location
        const userInfoWindow = new window.google.maps.InfoWindow({
          content: '<div style="padding: 8px;"><strong>Your Location</strong></div>'
        });

        userMarker.addListener('click', () => {
          userInfoWindow.open(map, userMarker);
        });

        // Add markers for laborers
        laborers.forEach((laborer) => {
          const marker = new window.google.maps.Marker({
            position: { lat: laborer.location.latitude, lng: laborer.location.longitude },
            map: map,
            title: laborer.name,
            icon: {
              url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyQzIgMTcuNTIgNi40OCAyMiAxMiAyMkMxNy41MiAyMiAyMiAxNy41MiAyMiAxMkMyMiA2LjQ4IDE3LjUyIDIgMTIgMloiIGZpbGw9IiNGRjY4MjAiLz4KPHBhdGggZD0iTTEyIDZDNi40OCA2IDIgMTAuNDggMiAxNkMyIDIxLjUyIDYuNDggMjYgMTIgMjZDMjEuNTIgMjYgMjYgMjEuNTIgMjYgMTZDMjYgMTAuNDggMjEuNTIgNiAxMiA2WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTEyIDEwQzE0LjIwOTEgMTAgMTYgMTEuNzkwOSAxNiAxNEMxNiAxNi4yMDkxIDE0LjIwOTEgMTggMTIgMThDOS43OTA5IDE4IDggMTYuMjA5MSA4IDE0QzggMTEuNzkwOSA5Ljc5MDkgMTAgMTIgMTBaIiBmaWxsPSIjRkY2ODIwIi8+Cjwvc3ZnPgo=',
              scaledSize: new window.google.maps.Size(24, 24),
              anchor: new window.google.maps.Point(12, 12)
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

          const infoWindow = new window.google.maps.InfoWindow({
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
        });

        // Add global function for button clicks in info windows
        (window as any).selectLaborer = (laborerId: string) => {
          const laborer = laborers.find(l => l.id === laborerId);
          if (laborer && onLaborerSelect) {
            onLaborerSelect(laborer);
          }
        };

        setMapLoaded(true);
        setLoading(false);
      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Failed to initialize map');
        setLoading(false);
      }
    };

    loadGoogleMaps();

    return () => {
      // Cleanup
      if (mapInstanceRef.current) {
        // Clean up map instance if needed
      }
    };
  }, [userLocation, laborers, onLaborerSelect]);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p className="font-medium">Map Error</p>
        <p className="text-sm">{error}</p>
        <p className="text-sm mt-2">
          Using fallback map instead. The map will show your location and nearby laborers.
        </p>
        <FallbackMap
          userLocation={userLocation}
          laborers={laborers}
          onLaborerSelect={onLaborerSelect}
          height={height}
        />
      </div>
    );
  }

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        style={{ height, width: '100%' }}
        className="rounded-lg border border-gray-200"
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OlaMap; 