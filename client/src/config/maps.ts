// Ola Maps Configuration
export const MAPS_CONFIG = {
  // Ola Maps API Key - Replace with your actual API key
  API_KEY: 'R4tOvG3GoJxyeEhw3j5kNHv6w2k5bdGRTPTct8Gb',
  
  // Google Maps API Key - For fallback functionality
  // Get your API key from: https://console.cloud.google.com/apis/credentials
  // Set this in your .env file as REACT_APP_GOOGLE_MAPS_API_KEY=your_key_here
  GOOGLE_MAPS_API_KEY: (import.meta.env?.VITE_GOOGLE_MAPS_API_KEY as string) || 'YOUR_GOOGLE_MAPS_API_KEY',
  
  SDK_URL: 'https://www.unpkg.com/olamaps-web-sdk@latest/dist/olamaps-web-sdk.umd.js',
  DEFAULT_ZOOM: 13,
  DEFAULT_CENTER: {
    lat: 20.5937, // Default to India center
    lng: 78.9629
  },
  
  // Map settings
  MAP_SETTINGS: {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 0,
    defaultRadius: 10, // km
    maxRadius: 50, // km
  }
};

// Check if API key is configured
export const isMapsConfigured = () => {
  return !!MAPS_CONFIG.API_KEY && MAPS_CONFIG.API_KEY !== 'YOUR_API_KEY';
};

// Check if Google Maps API key is configured
export const isGoogleMapsConfigured = () => {
  return !!MAPS_CONFIG.GOOGLE_MAPS_API_KEY && MAPS_CONFIG.GOOGLE_MAPS_API_KEY !== 'YOUR_GOOGLE_MAPS_API_KEY';
};

// Get the appropriate API key for Google Maps
export const getGoogleMapsApiKey = () => {
  return MAPS_CONFIG.GOOGLE_MAPS_API_KEY;
};

// Configuration instructions
export const MAPS_SETUP_INSTRUCTIONS = {
  olaMaps: {
    title: 'Ola Maps Setup',
    steps: [
      '1. Visit https://maps.olakrutrim.com/',
      '2. Sign up for an account',
      '3. Generate an API key',
      '4. Replace the API_KEY value in src/config/maps.ts',
    ]
  },
  googleMaps: {
    title: 'Google Maps Setup (Fallback)',
    steps: [
      '1. Go to https://console.cloud.google.com/apis/credentials',
      '2. Create a new project or select existing one',
      '3. Enable Maps JavaScript API',
      '4. Create credentials (API key)',
      '5. Set environment variable: REACT_APP_GOOGLE_MAPS_API_KEY=your_key_here',
      '6. Or replace GOOGLE_MAPS_API_KEY in src/config/maps.ts',
    ]
  }
}; 