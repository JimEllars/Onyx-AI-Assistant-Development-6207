import supabase from '../lib/supabase';

class GoogleApiHelper {
  constructor() {
    this.apiKey = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      const { data, error } = await supabase
        .from('api_keys_x7k9m2')
        .select('api_key')
        .eq('service', 'google')
        .eq('key_name', 'google_maps')
        .single();

      if (error) throw error;
      
      this.apiKey = data.api_key;
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing Google API:', error);
      throw new Error('Failed to initialize Google API');
    }
  }

  async callGoogleApi(endpoint, params = {}) {
    if (!this.initialized) {
      await this.initialize();
    }

    const url = new URL(`https://maps.googleapis.com/maps/api/${endpoint}`);
    url.searchParams.append('key', this.apiKey);
    
    // Add additional parameters
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    try {
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`Google API error: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error calling Google API:', error);
      throw error;
    }
  }

  // Utility methods for specific API calls
  async geocode(address) {
    return this.callGoogleApi('geocode/json', { address });
  }

  async getPlaceDetails(placeId) {
    return this.callGoogleApi('place/details/json', { place_id: placeId });
  }

  async searchPlaces(query, location) {
    return this.callGoogleApi('place/textsearch/json', {
      query,
      location: location ? `${location.lat},${location.lng}` : undefined
    });
  }
}

// Create a singleton instance
const googleApi = new GoogleApiHelper();
export default googleApi;