import express from 'express';

const router = express.Router();

// Mock location data
const mockLocations = [
  { id: 1, name: 'Downtown Community Center', address: '123 Main St, City, State', coordinates: { lat: 40.7128, lng: -74.0060 } },
  { id: 2, name: 'North Side Food Bank', address: '456 North Ave, City, State', coordinates: { lat: 40.7580, lng: -73.9855 } },
  { id: 3, name: 'South Park Relief Station', address: '789 South Blvd, City, State', coordinates: { lat: 40.6892, lng: -74.0445 } },
  { id: 4, name: 'East End Shelter', address: '321 East St, City, State', coordinates: { lat: 40.7282, lng: -73.7949 } },
  { id: 5, name: 'West Side Community Hub', address: '654 West Ave, City, State', coordinates: { lat: 40.7489, lng: -73.9869 } }
];

// Get nearby locations
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    // Mock logic to return locations within radius
    // In a real app, you'd use a geospatial database query
    const nearbyLocations = mockLocations.filter(location => {
      const distance = calculateDistance(
        parseFloat(lat),
        parseFloat(lng),
        location.coordinates.lat,
        location.coordinates.lng
      );
      return distance <= parseFloat(radius);
    });

    res.json({
      locations: nearbyLocations,
      total: nearbyLocations.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all locations
router.get('/', async (req, res) => {
  try {
    res.json({
      locations: mockLocations,
      total: mockLocations.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get location by ID
router.get('/:id', async (req, res) => {
  try {
    const location = mockLocations.find(loc => loc.id === parseInt(req.params.id));
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.json(location);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Utility function to calculate distance between two coordinates
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

export default router;