// Ola Maps Configuration
export const MAPS_CONFIG = {
  // Ola Maps API Key
  API_KEY: 'R4tOvG3GoJxyeEhw3j5kNHv6w2k5bdGRTPTct8Gb',
  SDK_URL: 'https://maps.olakrutrim.com/sdk/web/latest/olamaps.js',
  DEFAULT_ZOOM: 13,
  DEFAULT_CENTER: {
    lat: 20.5937, // Default to India center
    lng: 78.9629
  }
};

// Check if API key is configured
export const isMapsConfigured = () => {
  return !!MAPS_CONFIG.API_KEY;
}; 