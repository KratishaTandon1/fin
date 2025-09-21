// src/screens/WeatherScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import axios from "axios";

const WeatherScreen = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentCity, setCurrentCity] = useState("Delhi");

  // Get your free API key from: https://openweathermap.org/api
  const API_KEY = "YOUR_API_KEY_HERE"; // Replace with your actual API key
  const cities = ["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata"];

  useEffect(() => {
    fetchWeatherData();
  }, [currentCity]);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);

      // Fetch current weather
      const currentWeatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${currentCity}&appid=${API_KEY}&units=metric`
      );

      // Fetch 5-day forecast
      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${currentCity}&appid=${API_KEY}&units=metric`
      );

      setWeather(currentWeatherResponse.data);
      setForecast(forecastResponse.data.list.slice(0, 8)); // Next 24 hours (8 x 3-hour intervals)
    } catch (error) {
      console.error("Weather API Error:", error);
      Alert.alert(
        "Weather Service Error",
        "Unable to fetch weather data. Please check your internet connection."
      );
      // Load mock data as fallback
      loadMockWeatherData();
    } finally {
      setLoading(false);
    }
  };

  const loadMockWeatherData = () => {
    // Mock weather data for demonstration
    const mockWeather = {
      name: currentCity,
      main: {
        temp: 28,
        feels_like: 32,
        humidity: 65,
        pressure: 1013,
      },
      weather: [
        {
          main: "Clear",
          description: "clear sky",
          icon: "01d",
        },
      ],
      wind: {
        speed: 3.5,
      },
      visibility: 10000,
    };

    const mockForecast = [
      {
        dt: Date.now() + 3600000,
        main: { temp: 29 },
        weather: [{ main: "Clear", icon: "01d" }],
      },
      {
        dt: Date.now() + 7200000,
        main: { temp: 31 },
        weather: [{ main: "Clouds", icon: "02d" }],
      },
      {
        dt: Date.now() + 10800000,
        main: { temp: 30 },
        weather: [{ main: "Clouds", icon: "03d" }],
      },
      {
        dt: Date.now() + 14400000,
        main: { temp: 28 },
        weather: [{ main: "Rain", icon: "10d" }],
      },
    ];

    setWeather(mockWeather);
    setForecast(mockForecast);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchWeatherData().finally(() => setRefreshing(false));
  }, []);

  const getWeatherIcon = (iconCode, size = 50) => {
    const weatherEmojis = {
      "01d": "☀️",
      "01n": "🌙",
      "02d": "⛅",
      "02n": "☁️",
      "03d": "☁️",
      "03n": "☁️",
      "04d": "☁️",
      "04n": "☁️",
      "09d": "🌧️",
      "09n": "🌧️",
      "10d": "🌦️",
      "10n": "🌧️",
      "11d": "⛈️",
      "11n": "⛈️",
      "13d": "❄️",
      "13n": "❄️",
      "50d": "🌫️",
      "50n": "🌫️",
    };

    return weatherEmojis[iconCode] || "🌤️";
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: true,
    });
  };

  const getFarmingAdvice = (weatherMain, temp) => {
    const advice = {
      Clear:
        temp > 30
          ? "Good weather for harvesting. Ensure adequate irrigation."
          : "Perfect weather for outdoor farming activities.",
      Clouds:
        "Ideal conditions for transplanting. Reduced sun stress on plants.",
      Rain: "Avoid pesticide application. Good time for natural irrigation.",
      Thunderstorm: "Secure loose farming equipment. Avoid field work.",
      Snow: "Protect sensitive crops. Check greenhouse heating systems.",
      Mist: "Watch for fungal diseases. Ensure good air circulation.",
    };

    return advice[weatherMain] || "Monitor crop conditions regularly.";
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading Weather Data...</Text>
      </View>
    );
  }

  if (!weather) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Unable to load weather data</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchWeatherData}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>🌤️ Weather Update</Text>
        <Text style={styles.subtitle}>Real-time Agricultural Weather</Text>
      </View>

      {/* City Selector */}
      <View style={styles.citySelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {cities.map((city) => (
            <TouchableOpacity
              key={city}
              style={[
                styles.cityButton,
                currentCity === city && styles.activeCityButton,
              ]}
              onPress={() => setCurrentCity(city)}
            >
              <Text
                style={[
                  styles.cityButtonText,
                  currentCity === city && styles.activeCityButtonText,
                ]}
              >
                {city}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Current Weather */}
      <View style={styles.currentWeatherCard}>
        <View style={styles.currentWeatherHeader}>
          <Text style={styles.cityName}>{weather.name}</Text>
          <Text style={styles.weatherIcon}>
            {getWeatherIcon(weather.weather[0].icon)}
          </Text>
        </View>

        <Text style={styles.temperature}>
          {Math.round(weather.main.temp)}°C
        </Text>
        <Text style={styles.condition}>{weather.weather[0].description}</Text>
        <Text style={styles.feelsLike}>
          Feels like {Math.round(weather.main.feels_like)}°C
        </Text>

        <View style={styles.weatherDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>💧 Humidity</Text>
            <Text style={styles.detailValue}>{weather.main.humidity}%</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>💨 Wind</Text>
            <Text style={styles.detailValue}>{weather.wind.speed} m/s</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>🔽 Pressure</Text>
            <Text style={styles.detailValue}>{weather.main.pressure} hPa</Text>
          </View>
        </View>
      </View>

      {/* Farming Advice */}
      <View style={styles.adviceCard}>
        <Text style={styles.adviceTitle}>🌾 Farming Advice</Text>
        <Text style={styles.adviceText}>
          {getFarmingAdvice(weather.weather[0].main, weather.main.temp)}
        </Text>
      </View>

      {/* Hourly Forecast */}
      <View style={styles.forecastCard}>
        <Text style={styles.forecastTitle}>24-Hour Forecast</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {forecast.map((item, index) => (
            <View key={index} style={styles.forecastItem}>
              <Text style={styles.forecastTime}>{formatTime(item.dt)}</Text>
              <Text style={styles.forecastIcon}>
                {getWeatherIcon(item.weather[0].icon)}
              </Text>
              <Text style={styles.forecastTemp}>
                {Math.round(item.main.temp)}°
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
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
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e8f5e8",
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryText: {
    color: "white",
    fontSize: 16,
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
  citySelector: {
    padding: 15,
  },
  cityButton: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    elevation: 2,
  },
  activeCityButton: {
    backgroundColor: "#4CAF50",
  },
  cityButtonText: {
    fontSize: 14,
    color: "#666",
  },
  activeCityButtonText: {
    color: "white",
    fontWeight: "bold",
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
    marginBottom: 10,
  },
  cityName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
    marginRight: 10,
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
    justifyContent: "space-around",
    width: "100%",
  },
  detailItem: {
    alignItems: "center",
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
    fontSize: 16,
    fontWeight: "bold",
    color: "#856404",
    marginBottom: 8,
  },
  adviceText: {
    fontSize: 14,
    color: "#856404",
    lineHeight: 20,
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
    marginRight: 20,
    paddingVertical: 10,
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
    fontSize: 14,
    fontWeight: "bold",
    color: "#4CAF50",
  },
});

export default WeatherScreen;
