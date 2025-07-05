# Ola Maps Integration Setup

This LabourEase application includes Ola Maps integration for displaying user locations and nearby laborers on an interactive map.

## Setup Instructions

### 1. Get Ola Maps API Key

1. Visit [Ola Maps Documentation](https://maps.olakrutrim.com/docs)
2. Sign up for an account on Krutrim Cloud
3. Create credentials and obtain your API key
4. Follow the authentication documentation for setup

### 2. Configure Environment Variables

Create a `.env` file in the `client` directory with:

```env
VITE_OLA_MAPS_API_KEY=your_ola_maps_api_key_here
```

### 3. Features

- **Interactive Map**: Shows user location and nearby laborers
- **Laborer Markers**: Click to view details and send requests
- **Fallback Mode**: Works without API key using a visual representation
- **Real-time Location**: Updates user location automatically

### 4. Map Components

- `OlaMap.tsx`: Main map component with Ola Maps SDK
- `FallbackMap.tsx`: Visual representation when API key is not available
- `maps.ts`: Configuration and API key management

### 5. Usage

The map automatically loads in the Customer Dashboard and displays:
- Blue marker: User's current location
- Orange markers: Available laborers
- Click markers to view laborer details and send requests

### 6. API Key Security

- Never commit your API key to version control
- Use environment variables for configuration
- The fallback map works without an API key for development

## Troubleshooting

- If the map doesn't load, check your API key configuration
- Ensure you have proper CORS settings for your domain
- Check the browser console for any SDK loading errors 