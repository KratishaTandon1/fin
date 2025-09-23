import axios from "axios";
import * as Location from 'expo-location'; // 👈 Import location service
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "../../src/contexts/AuthContext";

const WeatherScreen = () => {
  const { user } = useAuth();
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('detecting'); // detecting, found, denied, error

  // OpenWeatherMap API Configuration
  const WEATHER_API_KEY = "b7c72500a099878618197a2256f5dd2a";
  const WEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5";

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (currentLocation) {
      fetchWeatherData();
    }
  }, [currentLocation]);

  // Request location permission and get current location
  const requestLocationPermission = async () => {
    try {
      console.log('📍 Requesting location permission...');
      setLocationStatus('detecting');
      
      // Request permission to access location
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        console.log('❌ Location permission denied');
        setLocationStatus('denied');
        Alert.alert(
          'Location Permission Needed 📍',
          'This app needs location access to show weather for your current location.\n\nWould you like to:\n1. Enable location in settings\n2. Use manual location selection',
          [
            { text: 'Manual Selection', onPress: () => useManualLocation() },
            { text: 'Enable Location', onPress: () => requestLocationPermission() }
          ]
        );
        return;
      }

      console.log('✅ Location permission granted');
      
      // Get current position
      console.log('🌍 Getting current location...');
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 15000, // 15 seconds timeout
      });

      const { latitude, longitude } = location.coords;
      console.log(`📍 Location found: ${latitude}, ${longitude}`);

      // Get location name using reverse geocoding
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      let locationName = 'Current Location';
      if (reverseGeocode && reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        locationName = address.city || address.subregion || address.region || 'Current Location';
      }

      const detectedLocation = {
        name: locationName,
        lat: latitude,
        lon: longitude,
        isAutoDetected: true
      };

      console.log(`✅ Location detected: ${locationName}`);
      setCurrentLocation(detectedLocation);
      setLocationStatus('found');

    } catch (error) {
      console.error('❌ Location detection failed:', error);
      setLocationStatus('error');
      
      Alert.alert(
        'Location Detection Failed 🚨',
        `Unable to detect your location.\n\nError: ${error.message}\n\nWould you like to try manual selection?`,
        [
          { text: 'Retry', onPress: () => requestLocationPermission() },
          { text: 'Manual Selection', onPress: () => useManualLocation() }
        ]
      );
    }
  };

  // Fallback to manual location selection
  const useManualLocation = () => {
    console.log('📍 Using manual location selection');
    const defaultLocation = {
      name: "Delhi", // Default to Delhi if location fails
      lat: 28.6139,
      lon: 77.2090,
      isAutoDetected: false
    };
    setCurrentLocation(defaultLocation);
    setLocationStatus('manual');
  };

  // Fetch weather data using OpenWeatherMap API
  const fetchWeatherData = async () => {
    if (!currentLocation) return;
    
    try {
      setLoading(true);
      console.log(`🌤️ Fetching weather for ${currentLocation.name} (${currentLocation.lat}, ${currentLocation.lon})`);
      
      // Current weather API call
      const currentWeatherResponse = await axios.get(`${WEATHER_BASE_URL}/weather`, {
        params: {
          lat: currentLocation.lat,
          lon: currentLocation.lon,
          appid: WEATHER_API_KEY,
          units: 'metric'
        }
      });

      // 5-day forecast API call
      const forecastResponse = await axios.get(`${WEATHER_BASE_URL}/forecast`, {
        params: {
          lat: currentLocation.lat,
          lon: currentLocation.lon,
          appid: WEATHER_API_KEY,
          units: 'metric'
        }
      });

      // Convert OpenWeatherMap data to your app format
      const weatherData = convertToAppFormat(currentWeatherResponse.data, forecastResponse.data);
      
      setWeather(weatherData);
      setForecast(weatherData.forecast.slice(0, 8));

      console.log('✅ Weather data loaded for:', weatherData.location.name);

    } catch (error) {
      console.error("🚨 OpenWeatherMap API Error:", error.response?.status, error.message);
      
      if (error.response?.status === 401) {
        Alert.alert(
          "API Key Error 🔑",
          "OpenWeatherMap API key is invalid. Using demo data.",
          [{ text: "OK" }]
        );
      } else if (error.response?.status === 429) {
        Alert.alert(
          "Rate Limit Exceeded ⏰",
          "Too many API calls. Using demo data temporarily.",
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "Network Error 📡",
          "Unable to fetch weather data. Using demo data.",
          [{ text: "OK" }]
        );
      }
      
      loadDemoWeatherData();
    } finally {
      setLoading(false);
    }
  };

  // Convert OpenWeatherMap response to app format
  const convertToAppFormat = (currentWeather, forecast) => {
    return {
      location: {
        name: currentWeather.name,
        country: currentWeather.sys.country,
        lat: currentWeather.coord.lat,
        lon: currentWeather.coord.lon,
        isAutoDetected: currentLocation.isAutoDetected
      },
      current: {
        temperature: Math.round(currentWeather.main.temp),
        feels_like: Math.round(currentWeather.main.feels_like),
        humidity: currentWeather.main.humidity,
        pressure: currentWeather.main.pressure,
        wind_speed: currentWeather.wind?.speed || 0,
        wind_direction: currentWeather.wind?.deg || 0,
        visibility: (currentWeather.visibility || 10000) / 1000,
        uv_index: 5,
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
      farming_advice: generateFarmingAdvice(currentWeather),
      source: 'openweathermap_api',
      timestamp: new Date().toISOString()
    };
  };

  // Generate farming advice based on weather conditions
  const generateFarmingAdvice = (weatherData) => {
    const temp = weatherData.main.temp;
    const humidity = weatherData.main.humidity;
    const condition = weatherData.weather[0].main.toLowerCase();
    
    let cropSuitability = "Good conditions for most crops";
    let irrigationNeeded = false;
    let pestRisk = "Low";
    let harvestRecommendation = "Suitable for field activities";

    if (temp > 35) {
      cropSuitability = "Very hot - provide shade for sensitive crops";
      irrigationNeeded = true;
      harvestRecommendation = "Avoid midday field work";
    } else if (temp < 10) {
      cropSuitability = "Cold weather - protect crops from frost";
      harvestRecommendation = "Limited outdoor activities";
    }

    if (humidity > 80) {
      pestRisk = "High";
      cropSuitability = "High humidity - monitor for diseases";
    }

    if (condition === 'rain') {
      irrigationNeeded = false;
      harvestRecommendation = "Good for natural irrigation";
    }

    return {
      crop_suitability: cropSuitability,
      irrigation_needed: irrigationNeeded,
      pest_risk: pestRisk,
      harvest_recommendation: harvestRecommendation
    };
  };

  // Demo data fallback
  const loadDemoWeatherData = () => {
    const demoWeather = {
      location: {
        name: currentLocation?.name || "Demo Location",
        country: "IN",
        lat: currentLocation?.lat || 28.6139,
        lon: currentLocation?.lon || 77.2090,
        isAutoDetected: false
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
      forecast: Array.from({ length: 8 }, (_, i) => ({
        date: new Date(Date.now() + (i + 1) * 3600000 * 3),
        temperature: { min: 24, max: 30 },
        humidity: 60,
        wind_speed: 4.0,
        description: "Partly cloudy",
        icon: "02d"
      })),
      farming_advice: {
        crop_suitability: "Good conditions for most crops",
        irrigation_needed: false,
        pest_risk: "Low",
        harvest_recommendation: "Suitable for farming activities"
      },
      source: 'demo_data',
      timestamp: new Date().toISOString()
    };

    setWeather(demoWeather);
    setForecast(demoWeather.forecast);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    if (currentLocation) {
      fetchWeatherData().finally(() => setRefreshing(false));
    } else {
      requestLocationPermission().finally(() => setRefreshing(false));
    }
  }, [currentLocation]);

  const getWeatherIcon = (iconCode) => {
    const weatherEmojis = {
      "01d": "☀️", "01n": "🌙", "02d": "⛅", "02n": "☁️",
      "03d": "☁️", "03n": "☁️", "04d": "☁️", "04n": "☁️",
      "09d": "🌧️", "09n": "🌧️", "10d": "🌦️", "10n": "🌧️",
      "11d": "⛈️", "11n": "⛈️", "13d": "❄️", "13n": "❄️",
      "50d": "🌫️", "50n": "🌫️"
    };
    return weatherEmojis[iconCode] || "🌤️";
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: true,
    });
  };

  // Show location detection loading
  if (locationStatus === 'detecting' || (loading && !weather)) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>
          {locationStatus === 'detecting' 
            ? 'Detecting Your Location...' 
            : 'Loading Weather Data...'}
        </Text>
        <Text style={styles.loadingSubtext}>
          {locationStatus === 'detecting' 
            ? 'Getting GPS coordinates' 
            : 'Fetching from OpenWeatherMap'}
        </Text>
      </View>
    );
  }

  if (!weather) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>🌐 Weather Service Error</Text>
        <Text style={styles.errorText}>Unable to load weather data</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchWeatherData}>
          <Text style={styles.retryText}>🔄 Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh}
          colors={['#4CAF50']}
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>🌤️ Your Local Weather</Text>
        <Text style={styles.subtitle}>
          {weather.location.isAutoDetected ? 'Auto-Detected Location' : 'Manual Location'}
        </Text>
      </View>

      {/* Location Status Card */}
      <View style={styles.locationCard}>
        <View style={styles.locationHeader}>
          <Text style={styles.locationTitle}>
            📍 {weather.location.isAutoDetected ? 'Current Location' : 'Selected Location'}
          </Text>
          <TouchableOpacity 
            style={styles.refreshLocationButton}
            onPress={requestLocationPermission}
          >
            <Text style={styles.refreshLocationText}>🔄</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.locationName}>{weather.location.name}</Text>
        <Text style={styles.locationCoords}>
          📍 {weather.location.lat.toFixed(4)}, {weather.location.lon.toFixed(4)}
        </Text>
        <Text style={styles.locationStatus}>
          {weather.location.isAutoDetected 
            ? '✅ Automatically detected using GPS' 
            : '📍 Manually selected location'}
        </Text>
      </View>

      {/* Current Weather Card */}
      <View style={styles.currentWeatherCard}>
        <View style={styles.currentWeatherHeader}>
          <View>
            <Text style={styles.cityName}>{weather.location.name}</Text>
            <Text style={styles.dataSource}>
              📡 {weather.source === 'openweathermap_api' ? 'Live OpenWeatherMap' : 'Demo Data'}
            </Text>
          </View>
          <Text style={styles.weatherIcon}>
            {getWeatherIcon(weather.current.icon)}
          </Text>
        </View>

        <Text style={styles.temperature}>
          {Math.round(weather.current.temperature)}°C
        </Text>
        <Text style={styles.condition}>{weather.current.description}</Text>
        <Text style={styles.feelsLike}>
          Feels like {Math.round(weather.current.feels_like)}°C
        </Text>

        <View style={styles.weatherDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>💧 Humidity</Text>
            <Text style={styles.detailValue}>{weather.current.humidity}%</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>💨 Wind</Text>
            <Text style={styles.detailValue}>{weather.current.wind_speed.toFixed(1)} m/s</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>🔽 Pressure</Text>
            <Text style={styles.detailValue}>{weather.current.pressure} hPa</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>👁️ Visibility</Text>
            <Text style={styles.detailValue}>{weather.current.visibility.toFixed(1)} km</Text>
          </View>
        </View>
      </View>

      {/* Smart Farming Advice */}
      {weather.farming_advice && (
        <View style={styles.adviceCard}>
          <Text style={styles.adviceTitle}>🌾 Local Farming Insights</Text>
          
          <View style={styles.adviceItem}>
            <Text style={styles.adviceLabel}>🌱 Crop Conditions:</Text>
            <Text style={styles.adviceValue}>{weather.farming_advice.crop_suitability}</Text>
          </View>
          
          <View style={styles.adviceItem}>
            <Text style={styles.adviceLabel}>💧 Irrigation:</Text>
            <Text style={styles.adviceValue}>
              {weather.farming_advice.irrigation_needed ? "Irrigation recommended" : "No irrigation needed today"}
            </Text>
          </View>
          
          <View style={styles.adviceItem}>
            <Text style={styles.adviceLabel}>🐛 Pest Risk:</Text>
            <Text style={styles.adviceValue}>{weather.farming_advice.pest_risk}</Text>
          </View>
          
          <View style={styles.adviceItem}>
            <Text style={styles.adviceLabel}>🚜 Field Activities:</Text>
            <Text style={styles.adviceValue}>{weather.farming_advice.harvest_recommendation}</Text>
          </View>
        </View>
      )}

      {/* Weather Forecast */}
      {forecast.length > 0 && (
        <View style={styles.forecastCard}>
          <Text style={styles.forecastTitle}>📅 24-Hour Forecast</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {forecast.map((item, index) => (
              <View key={index} style={styles.forecastItem}>
                <Text style={styles.forecastTime}>
                  {formatTime(item.date)}
                </Text>
                <Text style={styles.forecastIcon}>
                  {getWeatherIcon(item.icon)}
                </Text>
                <Text style={styles.forecastTemp}>
                  {Math.round(item.temperature.max)}°
                </Text>
                <Text style={styles.forecastTempMin}>
                  {Math.round(item.temperature.min)}°
                </Text>
                <Text style={styles.forecastHumidity}>
                  💧 {item.humidity}%
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={{ height: 20 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8f5e8",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e8f5e8",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: "#2E7D32",
    fontWeight: "600",
  },
  loadingSubtext: {
    marginTop: 5,
    fontSize: 14,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e8f5e8",
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    color: "#F44336",
    marginBottom: 10,
    fontWeight: "bold",
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 3,
  },
  retryText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  header: {
    backgroundColor: "#4CAF50",
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#c8e6c9",
  },
  locationCard: {
    backgroundColor: "#E8F5E8",
    margin: 15,
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  locationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  refreshLocationButton: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 15,
  },
  refreshLocationText: {
    color: "white",
    fontSize: 16,
  },
  locationName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 5,
  },
  locationCoords: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },
  locationStatus: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "600",
  },
  currentWeatherCard: {
    backgroundColor: "white",
    margin: 15,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    alignItems: "center",
  },
  currentWeatherHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  cityName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  dataSource: {
    fontSize: 10,
    color: "#4CAF50",
    marginTop: 2,
    fontWeight: "600",
  },
  weatherIcon: {
    fontSize: 40,
  },
  temperature: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#4CAF50",
    marginVertical: 10,
  },
  condition: {
    fontSize: 18,
    textTransform: "capitalize",
    color: "#666",
    marginBottom: 5,
  },
  feelsLike: {
    fontSize: 14,
    color: "#999",
    marginBottom: 20,
  },
  weatherDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    width: "100%",
  },
  detailItem: {
    alignItems: "center",
    minWidth: "22%",
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  adviceCard: {
    backgroundColor: "#fff3cd",
    margin: 15,
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#ffc107",
  },
  adviceTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#856404",
    marginBottom: 15,
  },
  adviceItem: {
    marginBottom: 10,
  },
  adviceLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#856404",
  },
  adviceValue: {
    fontSize: 14,
    color: "#856404",
    marginTop: 2,
  },
  forecastCard: {
    backgroundColor: "white",
    margin: 15,
    padding: 15,
    borderRadius: 12,
    elevation: 3,
  },
  forecastTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 15,
  },
  forecastItem: {
    alignItems: "center",
    marginRight: 15,
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    minWidth: 80,
  },
  forecastTime: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  forecastIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  forecastTemp: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  forecastTempMin: {
    fontSize: 12,
    color: "#666",
  },
  forecastHumidity: {
    fontSize: 10,
    color: "#2196F3",
    marginTop: 4,
  },
});

export default WeatherScreen;
