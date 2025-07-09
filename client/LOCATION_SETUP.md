# Location Setup Guide

This guide will help you set up and troubleshoot location functionality in your laborer finder application.

## 🗺️ Map Configuration

### Option 1: Ola Maps (Primary)
1. Visit [Ola Maps](https://maps.olakrutrim.com/)
2. Sign up for an account
3. Generate an API key
4. Update `src/config/maps.ts`:
   ```typescript
   API_KEY: 'your_ola_maps_api_key_here'
   ```

### Option 2: Google Maps (Fallback)
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select existing one
3. Enable "Maps JavaScript API"
4. Create credentials (API key)
5. Set environment variable in `.env` file:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

## 📍 Location Issues & Solutions

### Common Problems

#### 1. "Location access denied"
**Symptoms:** Browser shows permission denied error
**Solution:**
- Click the lock/info icon in your browser's address bar
- Allow location access
- Or go to browser settings → Privacy & Security → Site Settings → Location → Allow

#### 2. "Location information unavailable"
**Symptoms:** GPS or network issues
**Solutions:**
- Enable GPS on your device
- Check your internet connection
- Try moving to an area with better GPS signal
- Wait a few seconds and try again

#### 3. "Location request timed out"
**Symptoms:** Takes too long to get location
**Solutions:**
- Check your internet connection
- Try refreshing the page
- Move to an area with better GPS signal
- Use a different browser

#### 4. "Using default location"
**Symptoms:** Map shows India center instead of your location
**Solutions:**
- Click "Update Location" button
- Allow location permissions when prompted
- Check if GPS is enabled on your device

### Browser-Specific Instructions

#### Chrome
1. Click the lock icon in address bar
2. Set "Location" to "Allow"
3. Refresh the page

#### Firefox
1. Click the shield icon in address bar
2. Set "Location" to "Allow"
3. Refresh the page

#### Safari
1. Go to Safari → Preferences → Websites → Location
2. Set your site to "Allow"
3. Refresh the page

#### Mobile Browsers
1. Go to device Settings → Privacy → Location Services
2. Enable Location Services
3. Allow location access for your browser
4. Refresh the page

## 🔧 Troubleshooting Tools

### Location Debugger
The app includes a Location Debugger component that shows:
- Geolocation support status
- Permission status
- Current location coordinates
- Accuracy information
- Browser information
- Troubleshooting tips

### Manual Location Update
If automatic location detection fails:
1. Click "Update Location" button
2. Allow location access when prompted
3. Wait for the location to be retrieved
4. Check the accuracy displayed

## 📱 Mobile Optimization

### Android
- Enable "High accuracy" location mode
- Allow location access for your browser
- Ensure GPS is enabled

### iOS
- Enable Location Services
- Allow location access for your browser
- Use Safari for best compatibility

## 🌐 Network Requirements

### Minimum Requirements
- Stable internet connection
- HTTPS connection (required for geolocation)
- Modern browser with geolocation support

### Recommended
- 4G/5G or WiFi connection
- GPS enabled device
- High accuracy location mode

## 🚀 Performance Tips

1. **Update location when needed:** Only update when you move to a new area
2. **Use high accuracy mode:** Better for finding nearby laborers
3. **Check accuracy:** Higher accuracy means better laborer matching
4. **Refresh map:** Use the "Refresh Map" button to reload nearby laborers

## 🔒 Privacy & Security

- Location data is only used to find nearby laborers
- No location data is stored permanently without your consent
- You can revoke location access at any time
- Location data is transmitted securely over HTTPS

## 📞 Support

If you continue to have issues:

1. Check the Location Debugger for specific error messages
2. Try using a different browser
3. Test on a different device
4. Check your internet connection
5. Ensure GPS is enabled on your device

## 🔄 API Key Rotation

For security, regularly rotate your API keys:
1. Generate new API key
2. Update configuration
3. Test functionality
4. Remove old key

---

**Note:** The app will work with the fallback map even without API keys, but for the best experience, configure at least one map service. 