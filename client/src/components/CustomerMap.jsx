import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const DEFAULT_LOCATION = { lat: 20.5937, lng: 78.9629 }; // Center of India

export default function CustomerMap() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let didCancel = false;
    let timeoutId;

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLocation(DEFAULT_LOCATION);
      setLoading(false);
      return;
    }

    // Manual timeout in case geolocation hangs
    timeoutId = setTimeout(() => {
      if (!didCancel) {
        setError('Location request timed out. Showing default location.');
        setLocation(DEFAULT_LOCATION);
        setLoading(false);
      }
    }, 15000);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (!didCancel) {
          clearTimeout(timeoutId);
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setLoading(false);
        }
      },
      (err) => {
        if (!didCancel) {
          clearTimeout(timeoutId);
          let msg = 'Could not get your location. Showing default.';
          if (err.code === 1) msg = 'Location permission denied. Showing default.';
          if (err.code === 2) msg = 'Location unavailable. Showing default.';
          if (err.code === 3) msg = 'Location request timed out. Showing default.';
          setError(msg);
          setLocation(DEFAULT_LOCATION);
          setLoading(false);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );

    return () => {
      didCancel = true;
      clearTimeout(timeoutId);
    };
  }, []);

  if (loading) return <div>Loading map...<br />Please allow location access for best results.</div>;

  return (
    <MapContainer center={location} zoom={15} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <Marker position={location}>
        <Popup>
          {error ? error : 'You are here!'}
        </Popup>
      </Marker>
    </MapContainer>
  );
} 