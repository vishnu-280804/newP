// Utility to clear old localStorage data from in-memory database
export const clearOldData = () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('🧹 Cleared old localStorage data');
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

// Check if we need to clear old data (run this on app startup)
export const checkAndClearOldData = () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      // Try to decode the token to check if it has a numeric userId
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (typeof payload.userId === 'number' || (typeof payload.userId === 'string' && /^\d+$/.test(payload.userId))) {
        console.log('🔄 Detected old token format, clearing localStorage');
        clearOldData();
        return true;
      }
    } catch (error) {
      console.log('🔄 Invalid token format, clearing localStorage');
      clearOldData();
      return true;
    }
  }
  return false;
}; 