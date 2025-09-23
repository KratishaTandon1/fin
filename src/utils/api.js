import axios from 'axios';
import { Alert } from 'react-native';

// API Configuration for OpenWeatherMap
const API_CONFIG = {
  // 👇 Use your teammate's API key
  WEATHER_API_KEY: 'b7c72500a099878618197a2256f5dd2a',
  
  // 👇 OpenWeatherMap Base URL (standard for all OpenWeather API keys)
  WEATHER_BASE_URL: 'https://api.openweathermap.org/data/2.5',
  
  TIMEOUT: 10000,
};

// Create axios instance for OpenWeatherMap API
const weatherClient = axios.create({
  baseURL: API_CONFIG.WEATHER_BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Weather API Service
export const api = {
  // Test the API key
  async checkHealth() {
    try {
      console.log('🧪 Testing OpenWeatherMap API key...');
      
      const response = await weatherClient.get('/weather', {
        params: {
          q: 'London',
          appid: API_CONFIG.WEATHER_API_KEY,
          units: 'metric'
        }
      });
      
      console.log('✅ OpenWeatherMap API key is working!');
      return {
        success: true,
        data: { 
          status: 'openweather_working',
          api_provider: 'OpenWeatherMap',
          test_location: response.data.name
        },
        message: 'OpenWeatherMap API is working'
      };
    } catch (error) {
      console.error('❌ OpenWeatherMap API failed:', error.response?.status);
      
      if (error.response?.status === 401) {
        console.log('🔑 API key is invalid or expired');
      } else if (error.response?.status === 429) {
        console.log('⏰ API rate limit exceeded');
      }
      
      return {
        success: false,
        error: error.message,
        message: 'OpenWeatherMap API issue'
      };
    }
  },

  // Get weather by coordinates using OpenWeatherMap
  async getWeatherByCoordinates(lat, lon) {
    try {
      console.log(`🌤️ Fetching OpenWeatherMap data for: ${lat}, ${lon}`);
      
      // Current weather API call
      const currentWeatherResponse = await weatherClient.get('/weather', {
        params: {
          lat: lat,
          lon: lon,
          appid: API_CONFIG.WEATHER_API_KEY,
          units: 'metric' // Celsius temperature
        }
      });

      // 5-day forecast API call
      const forecastResponse = await weatherClient.get('/forecast', {
        params: {
          lat: lat,
          lon: lon,
          appid: API_CONFIG.WEATHER_API_KEY,
          units: 'metric'
        }
      });

      // Convert to your app's format
      const weatherData = this.convertOpenWeatherToAppFormat(
        currentWeatherResponse.data,
        forecastResponse.data
      );

      return {
        success: true,
        data: weatherData,
        source: 'openweathermap_api'
      };

    } catch (error) {
      console.error('OpenWeatherMap API failed:', error.response?.status, error.message);
      
      if (error.response?.status === 401) {
        Alert.alert(
          'API Key Error 🔑',
          'OpenWeatherMap API key is invalid. Please check the API key.',
          [{ text: 'OK' }]
        );
      } else if (error.response?.status === 429) {
        Alert.alert(
          'Rate Limit Exceeded ⏰',
          'Too many API calls. Using cached data.',
          [{ text: 'OK' }]
        );
      }
      
      return {
        success: false,
        error: error.message,
        data: this.getFallbackWeatherData(lat, lon),
        source: 'fallback'
      };
    }
  },

  // Get weather by city name
  async getWeatherByCity(cityName) {
    try {
      console.log(`🌤️ Fetching OpenWeatherMap data for city: ${cityName}`);
      
      const currentWeatherResponse = await weatherClient.get('/weather', {
        params: {
          q: cityName,
          appid: API_CONFIG.WEATHER_API_KEY,
          units: 'metric'
        }
      });

      const forecastResponse = await weatherClient.get('/forecast', {
        params: {
          q: cityName,
          appid: API_CONFIG.WEATHER_API_KEY,
          units: 'metric'
        }
      });

      const weatherData = this.convertOpenWeatherToAppFormat(
        currentWeatherResponse.data,
        forecastResponse.data
      );

      return {
        success: true,
        data: weatherData,
        source: 'openweathermap_api'
      };

    } catch (error) {
      console.error('City weather API failed:', error.response?.status);
      
      return {
        success: false,
        error: error.message,
        data: this.getFallbackWeatherData(),
        source: 'fallback'
      };
    }
  },

  // Convert OpenWeatherMap response to your app's format
  convertOpenWeatherToAppFormat(currentWeather, forecast) {
    return {
      location: {
        name: currentWeather.name,
        country: currentWeather.sys.country,
        lat: currentWeather.coord.lat,
        lon: currentWeather.coord.lon
      },
      current: {
        temperature: Math.round(currentWeather.main.temp),
        feels_like: Math.round(currentWeather.main.feels_like),
        humidity: currentWeather.main.humidity,
        pressure: currentWeather.main.pressure,
        wind_speed: currentWeather.wind?.speed || 0,
        wind_direction: currentWeather.wind?.deg || 0,
        visibility: (currentWeather.visibility || 10000) / 1000, // Convert to km
        uv_index: 5, // Free plan doesn't include UV index
        description: currentWeather.weather[0].description,
        icon: currentWeather.weather[0].icon
      },
      forecast: forecast.list.slice(0, 8).map(item => ({
        date: new Date(item.dt * 1000),
        temperature: {
          min: Math.round(item.main.temp_min),
          max: Math.round(item.main.temp_max)
        },
        humidity: item.main.humidity,
        wind_speed: item.wind?.speed || 0,
        description: item.weather[0].description,
        icon: item.weather[0].icon
      })),
      farming_advice: this.generateFarmingAdvice(currentWeather),
      source: 'openweathermap_api',
      api_provider: 'OpenWeatherMap',
      timestamp: new Date().toISOString()
    };
  },

  // Generate farming advice based on weather conditions
  generateFarmingAdvice(weatherData) {
    const temp = weatherData.main.temp;
    const humidity = weatherData.main.humidity;
    const condition = weatherData.weather[0].main.toLowerCase();
    const windSpeed = weatherData.wind?.speed || 0;
    
    let cropSuitability = "Good conditions for most crops";
    let irrigationNeeded = false;
    let pestRisk = "Low";
    let harvestRecommendation = "Suitable for field activities";

    // Temperature-based recommendations
    if (temp > 35) {
      cropSuitability = "Very hot - provide shade for sensitive crops";
      irrigationNeeded = true;
      harvestRecommendation = "Avoid midday field work, work early morning/evening";
    } else if (temp > 30) {
      cropSuitability = "Warm weather - good for heat-tolerant crops";
      irrigationNeeded = true;
    } else if (temp < 5) {
      cropSuitability = "Very cold - protect crops from frost damage";
      harvestRecommendation = "Limited outdoor activities recommended";
    } else if (temp < 15) {
      cropSuitability = "Cool weather - good for winter crops";
    }

    // Humidity-based advice
    if (humidity > 85) {
      pestRisk = "High";
      cropSuitability = "High humidity - monitor for fungal diseases";
    } else if (humidity < 30) {
      irrigationNeeded = true;
      cropSuitability = "Low humidity - increase irrigation frequency";
    }

    // Weather condition-based advice
    switch (condition) {
      case 'rain':
      case 'drizzle':
        irrigationNeeded = false;
        harvestRecommendation = "Avoid pesticide application, good for natural irrigation";
        pestRisk = "Medium";
        break;
      case 'thunderstorm':
        harvestRecommendation = "Avoid all field activities, secure equipment";
        pestRisk = "Medium";
        break;
      case 'clear':
        harvestRecommendation = "Excellent weather for harvesting and field work";
        break;
      case 'clouds':
        harvestRecommendation = "Good conditions for transplanting - reduced sun stress";
        break;
      case 'snow':
        cropSuitability = "Protect crops from snow damage";
        harvestRecommendation = "Indoor activities only";
        break;
    }

    // Wind-based advice
    if (windSpeed > 10) {
      harvestRecommendation = "Strong winds - avoid spraying operations";
    }

    return {
      crop_suitability: cropSuitability,
      irrigation_needed: irrigationNeeded,
      pest_risk: pestRisk,
      harvest_recommendation: harvestRecommendation
    };
  },

  // Test API connection
  async testConnection() {
    console.log('🔍 Testing OpenWeatherMap API connection...');
    
    const health = await this.checkHealth();
    
    if (health.success) {
      Alert.alert(
        'OpenWeatherMap Connected! 🌤️',
        `Successfully connected to OpenWeatherMap API!\n\n✅ API Key: Valid\n✅ Test Location: ${health.data.test_location}\n✅ Real weather data available`,
        [{ text: 'Excellent!', style: 'default' }]
      );
    } else {
      Alert.alert(
        'OpenWeatherMap API Issue 🔑',
        'Cannot connect to OpenWeatherMap API.\n\nPossible issues:\n• Invalid API key\n• Rate limit exceeded\n• No internet connection\n\nUsing demo data instead.',
        [{ text: 'OK', style: 'default' }]
      );
    }
    
    return health;
  },

  // Fallback data (same as before)
  getFallbackWeatherData(lat = 12.9716, lon = 77.5946) {
    // Your existing fallback data code...
    return {
      location: {
        name: "Demo Location",
        country: "IN",
        lat: lat,
        lon: lon
      },
      current: {
        temperature: 28,
        feels_like: 32,
        humidity: 65,
        pressure: 1013,
        wind_speed: 3.5,
        wind_direction: 180,
        visibility: 10,
        uv_index: 6,
        description: "Clear sky",
        icon: "01d"
      },
      forecast: [
        {
          date: new Date(Date.now() + 86400000),
          temperature: { min: 24, max: 30 },
          humidity: 60,
          wind_speed: 4.0,
          description: "Partly cloudy",
          icon: "02d"
        }
      ],
      farming_advice: {
        crop_suitability: "Good conditions for most crops",
        irrigation_needed: false,
        pest_risk: "Low",
        harvest_recommendation: "Suitable for farming activities"
      },
      source: 'fallback_demo_data',
      timestamp: new Date().toISOString()
    };
  }
};

export default api;

// Named exports
export const {
  checkHealth,
  getWeatherByCoordinates,
  getWeatherByCity,
  testConnection
} = api;
