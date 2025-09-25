import * as Location from 'expo-location';
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const scrollViewRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [scrollPosition, setScrollPosition] = useState(0);
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);

  // 🔑 REPLACE WITH YOUR ACTUAL API KEY
  // WEATHER_API_KEY: 'b7c72500a099878618197a2256f5dd2a',
  // WEATHER_API_KEY: 'b7c7250099878618197a2256f5dd2a0a',
  const WEATHER_API_KEY = "b7c72500a099878618197a2256f5dd2a"; // Put your real API key here

  // Convert weather icon to emoji
  const getWeatherEmoji = (iconCode) => {
    const weatherEmojis = {
      "01d": "☀️", "01n": "🌙", // clear sky
      "02d": "⛅", "02n": "☁️", // few clouds  
      "03d": "☁️", "03n": "☁️", // scattered clouds
      "04d": "☁️", "04n": "☁️", // broken clouds
      "09d": "🌧️", "09n": "🌧️", // shower rain
      "10d": "🌦️", "10n": "🌧️", // rain
      "11d": "⛈️", "11n": "⛈️", // thunderstorm
      "13d": "❄️", "13n": "❄️", // snow
      "50d": "🌫️", "50n": "🌫️"  // mist
    };
    return weatherEmojis[iconCode] || "🌤️";
  };

  // Fetch REAL current weather data
  const fetchCurrentWeather = async (latitude, longitude) => {
    try {
      console.log('🌡️ Fetching REAL current weather...');
      
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`;
      
      const response = await fetch(weatherUrl);
      
      if (!response.ok) {
        throw new Error(`Weather API failed: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ REAL weather received:', data);
      
      // Extract REAL weather data - NO HARDCODING
      const realWeather = {
        temperature: Math.round(data.main.temp), // REAL temperature
        condition: data.weather[0].main, // REAL condition
        description: data.weather[0].description,
        humidity: data.main.humidity, // REAL humidity
        rainfall: data.rain ? data.rain["1h"] || 0 : 0, // REAL rainfall
        location: data.name, // REAL city name
        emoji: getWeatherEmoji(data.weather[0].icon), // REAL weather emoji
        windSpeed: data.wind.speed,
        pressure: data.main.pressure,
        feelsLike: Math.round(data.main.feels_like),
        visibility: data.visibility ? (data.visibility / 1000).toFixed(1) : null
      };
      
      console.log('🌤️ Setting REAL weather data:', realWeather);
      setWeatherData(realWeather);
      
    } catch (error) {
      console.error('❌ Weather fetch failed:', error);
      // If API fails, show error message
      setWeatherData({
        temperature: "N/A",
        condition: "API Error",
        description: "Failed to fetch weather",
        humidity: "N/A",
        rainfall: 0,
        location: "Weather Unavailable",
        emoji: "⚠️"
      });
    }
  };

  // Get current location and fetch REAL weather
  const getCurrentLocationWeather = async () => {
    try {
      setWeatherLoading(true);
      console.log('📍 Getting current location...');

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('❌ Location permission denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 15000,
      });

      const { latitude, longitude } = location.coords;
      console.log(`📍 Location: ${latitude}, ${longitude}`);
      setCurrentLocation({ latitude, longitude });

      // Fetch REAL weather data
      await fetchCurrentWeather(latitude, longitude);

    } catch (error) {
      console.error('📍 Location error:', error);
      setWeatherData({
        temperature: "N/A",
        condition: "Location Error", 
        description: "Unable to get location",
        humidity: "N/A",
        rainfall: 0,
        location: "Location Required",
        emoji: "📍"
      });
    } finally {
      setWeatherLoading(false);
    }
  };

  // Update time every minute for dynamic greeting
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Get REAL weather on mount
  useEffect(() => {
    getCurrentLocationWeather();
  }, []);

  // Auto-scroll effect for schemes ticker
  useEffect(() => {
    const totalSchemes = governmentSchemes.length;
    const cardWidth = 290;
    const maxScroll = (totalSchemes - 1) * cardWidth;
    
    const autoScroll = setInterval(() => {
      if (scrollViewRef.current) {
        setScrollPosition(prev => {
          const nextPosition = prev + cardWidth;
          if (nextPosition >= maxScroll) {
            scrollViewRef.current.scrollTo({ x: 0, animated: true });
            return 0;
          } else {
            scrollViewRef.current.scrollTo({ x: nextPosition, animated: true });
            return nextPosition;
          }
        });
      }
    }, 4000);

    return () => clearInterval(autoScroll);
  }, []);

  // Dynamic greeting function with Namaste
  const getTimeBasedGreeting = () => {
    const currentHour = currentTime.getHours();
    
    if (currentHour >= 5 && currentHour < 12) {
      return {
        greeting: "Namaste! Good Morning",
        emoji: "🌅",
        subtext: "शुभ प्रभात! Start your farming day fresh!",
        bgColor: "#4CAF50"
      };
    } else if (currentHour >= 12 && currentHour < 17) {
      return {
        greeting: "Namaste! Good Afternoon", 
        emoji: "☀️",
        subtext: "शुभ दोपहर! Hope your crops are thriving!",
        bgColor: "#FF9800"
      };
    } else if (currentHour >= 17 && currentHour < 21) {
      return {
        greeting: "Namaste! Good Evening",
        emoji: "🌇", 
        subtext: "शुभ संध्या! Time to review today's farm work!",
        bgColor: "#9C27B0"
      };
    } else {
      return {
        greeting: "Namaste! Good Night",
        emoji: "🌙",
        subtext: "शुभ रात्रि! Rest well, tomorrow brings new growth!",
        bgColor: "#3F51B5"
      };
    }
  };

  const currentGreeting = getTimeBasedGreeting();

  // Enhanced Government schemes data
  const governmentSchemes = [
    {
      id: 1,
      name: "PM-KISAN Samman Nidhi",
      benefit: "₹6,000 Annual Support",
      shortDesc: "Direct benefit transfer to farmer families",
      emoji: "💰",
      color: "#4CAF50",
      urgency: "HIGH",
      deadline: "31 Mar 2025"
    },
    {
      id: 2,
      name: "Pradhan Mantri Fasal Bima Yojana",
      benefit: "90% Premium Subsidy",
      shortDesc: "Crop insurance against natural calamities",
      emoji: "🛡️",
      color: "#2196F3",
      urgency: "MEDIUM",
      deadline: "31 Dec 2024"
    },
    {
      id: 3,
      name: "Kisan Credit Card (KCC)",
      benefit: "Credit at 7% Interest",
      shortDesc: "Easy agricultural credit facility",
      emoji: "💳",
      color: "#FF9800",
      urgency: "HIGH",
      deadline: "Ongoing"
    },
    {
      id: 4,
      name: "PM Kisan Mandhan Yojana",
      benefit: "₹3,000 Monthly Pension",
      shortDesc: "Retirement security for farmers",
      emoji: "👴",
      color: "#9C27B0",
      urgency: "MEDIUM",
      deadline: "Ongoing"
    },
    {
      id: 5,
      name: "Soil Health Card Scheme",
      benefit: "Free Soil Testing",
      shortDesc: "Improve soil productivity with testing",
      emoji: "🌱",
      color: "#795548",
      urgency: "LOW",
      deadline: "Ongoing"
    },
    {
      id: 6,
      name: "PM-KUSUM Solar Scheme",
      benefit: "90% Solar Subsidy",
      shortDesc: "Solar energy for sustainable farming",
      emoji: "☀️",
      color: "#FFC107",
      urgency: "HIGH",
      deadline: "15 Feb 2025"
    }
  ];

  const quickStats = [
    { label: "Active Crops", value: "12", icon: "🌾", color: "#4CAF50" },
    { label: "Soil Health", value: "Good", icon: "🌱", color: "#FF9800" },
    { label: "Market Price", value: "₹2,450", icon: "💰", color: "#2196F3" },
    { label: "Schemes Applied", value: "3", icon: "🏛️", color: "#9C27B0" },
  ];

  // Function to navigate to specific scheme
  const navigateToScheme = (schemeId) => {
    console.log('🎯 Navigating to scheme ID:', schemeId);
    router.push({
      pathname: "/(tabs)/government-schemes",
      params: { selectedScheme: schemeId.toString() }
    });
  };

  const getUrgencyColor = (urgency) => {
    switch(urgency) {
      case 'HIGH': return '#F44336';
      case 'MEDIUM': return '#FF9800';
      case 'LOW': return '#4CAF50';
      default: return '#666';
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Enhanced Header Section */}
      <View style={[styles.headerBackground, { backgroundColor: currentGreeting.bgColor }]}>
        <View style={styles.headerOverlay}>
          {/* Refresh weather button */}
          <TouchableOpacity 
            style={styles.locationButton}
            onPress={getCurrentLocationWeather}
          >
            <Text style={styles.locationButtonText}>
              {weatherLoading ? "🔄" : "📍"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.greetingEmoji}>{currentGreeting.emoji}</Text>
          <Text style={styles.greeting}>{currentGreeting.greeting}!</Text>
          <Text style={styles.userName}>👨‍🌾 Demo User</Text>
          <Text style={styles.greetingSubtext}>{currentGreeting.subtext}</Text>
          <Text style={styles.dateText}>
            {currentTime.toLocaleDateString('en-IN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
        </View>
      </View>

      {/* REAL WEATHER WIDGET - NO HARDCODED DATA */}
      <View style={styles.weatherCard}>
        <View style={styles.weatherHeader}>
          <Text style={styles.weatherIcon}>🌤️</Text>
          <Text style={styles.weatherTitle}>
            {weatherLoading ? "Getting real weather..." : "Current Weather"}
          </Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/weather")}>
            <Text style={styles.viewMore}>View Details →</Text>
          </TouchableOpacity>
        </View>
        
        {weatherLoading ? (
          <View style={styles.weatherLoadingContainer}>
            <ActivityIndicator color="#4CAF50" size="small" />
            <Text style={styles.weatherLoadingText}>Fetching current weather...</Text>
          </View>
        ) : (
          <View style={styles.weatherContent}>
            {/* Left - REAL Temperature from API */}
            <View style={styles.weatherLeft}>
              <Text style={styles.weatherEmoji}>{weatherData?.emoji}</Text>
              <View style={styles.tempContainer}>
                <Text style={styles.temperature}>{weatherData?.temperature}°C</Text>
                <Text style={styles.condition}>{weatherData?.condition}</Text>
              </View>
            </View>
            
            {/* Right - REAL Stats from API */}
            <View style={styles.weatherRight}>
              <View style={styles.weatherStatRow}>
                <Text style={styles.statIcon}>💧</Text>
                <View style={styles.statInfo}>
                  <Text style={styles.statValue}>{weatherData?.humidity}%</Text>
                  <Text style={styles.statLabel}>Humidity</Text>
                </View>
              </View>
              
              <View style={styles.weatherStatRow}>
                <Text style={styles.statIcon}>🌧️</Text>
                <View style={styles.statInfo}>
                  <Text style={styles.statValue}>{weatherData?.rainfall}mm</Text>
                  <Text style={styles.statLabel}>Rainfall</Text>
                </View>
              </View>
            </View>
            
            {/* Location - REAL CITY NAME from API */}
            <View style={styles.locationInline}>
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={styles.locationText}>{weatherData?.location}</Text>
            </View>
          </View>
        )}
      </View>

      {/* ALL THE REST STAYS THE SAME - Government Schemes Ticker */}
      <View style={styles.schemesTickerContainer}>
        <View style={styles.schemesTickerHeader}>
          <View style={styles.tickerHeaderLeft}>
            <Text style={styles.schemesTickerTitle}>🏛️ सरकारी योजनाएं</Text>
            <Text style={styles.schemesTickerSubtitle}>Government Schemes</Text>
          </View>
          <TouchableOpacity 
            onPress={() => router.push("/(tabs)/government-schemes")}
            style={styles.viewAllButton}
          >
            <Text style={styles.viewAllText}>View All →</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.breakingNewsBar}>
          <View style={styles.breakingLabel}>
            <Text style={styles.breakingText}>🔴 LIVE</Text>
          </View>
          <View style={styles.breakingContent}>
            <Text style={styles.breakingContentText}>
              Click any scheme for details
            </Text>
          </View>
        </View>
        
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.schemesTickerContent}
          style={styles.schemesTickerWrapper}
          pagingEnabled={false}
          scrollEventThrottle={16}
        >
          {governmentSchemes.map((scheme, index) => (
            <TouchableOpacity
              key={scheme.id}
              style={[
                styles.schemeTickerCard,
                { borderLeftColor: scheme.color }
              ]}
              onPress={() => {
                console.log('🚀 Clicked:', scheme.name, 'ID:', scheme.id);
                navigateToScheme(scheme.id);
              }}
              activeOpacity={0.8}
            >
              <View style={[styles.urgencyBadge, { backgroundColor: getUrgencyColor(scheme.urgency) }]}>
                <Text style={styles.urgencyText}>{scheme.urgency}</Text>
              </View>

              <View style={styles.schemeTickerEmoji}>
                <Text style={styles.schemeTickerEmojiText}>{scheme.emoji}</Text>
              </View>
              
              <View style={styles.schemeTickerInfo}>
                <Text style={styles.schemeTickerName} numberOfLines={2}>
                  {scheme.name}
                </Text>
                <Text style={styles.schemeTickerBenefit}>
                  {scheme.benefit}
                </Text>
                <Text style={styles.schemeTickerDesc} numberOfLines={1}>
                  {scheme.shortDesc}
                </Text>
                <View style={styles.deadlineContainer}>
                  <Text style={styles.deadlineLabel}>⏰ Deadline: </Text>
                  <Text style={[styles.deadlineText, { 
                    color: scheme.deadline.includes('2024') || scheme.deadline.includes('Feb') ? '#F44336' : '#4CAF50' 
                  }]}>
                    {scheme.deadline}
                  </Text>
                </View>
              </View>

              <View style={styles.schemeTickerArrow}>
                <Text style={styles.arrowText}>→</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <View style={styles.indicatorContainer}>
          {governmentSchemes.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                { 
                  backgroundColor: Math.floor(scrollPosition / 290) === index ? '#4CAF50' : '#E0E0E0'
                }
              ]}
            />
          ))}
        </View>
      </View>

      {/* Quick Stats Grid - STAYS THE SAME */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>📊 Quick Overview</Text>
        <View style={styles.statsGrid}>
          {quickStats.map((stat, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.statCard,
                { borderLeftColor: stat.color }
              ]}
              onPress={() => {
                if (stat.label === "Schemes Applied") {
                  router.push("/(tabs)/government-schemes");
                }
              }}
            >
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quick Actions - STAYS THE SAME */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>🚀 Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: "#E8F5E8" }]}
            onPress={() => router.push("/(tabs)/crop-advisory")}
          >
            <Text style={styles.actionIcon}>📋</Text>
            <Text style={styles.actionTitle}>Crop Advisory</Text>
            <Text style={styles.actionSubtitle}>Expert farming advice</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: "#E3F2FD" }]}
            onPress={() => router.push("/(tabs)/market")}
          >
            <Text style={styles.actionIcon}>💰</Text>
            <Text style={styles.actionTitle}>Market Prices</Text>
            <Text style={styles.actionSubtitle}>Current crop rates</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: "#FFF3E0" }]}
            onPress={() => router.push("/(tabs)/pest")}
          >
            <Text style={styles.actionIcon}>🐛</Text>
            <Text style={styles.actionTitle}>Pest Detection</Text>
            <Text style={styles.actionSubtitle}>AI-powered analysis</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: "#F3E5F5" }]}
            onPress={() => router.push("/(tabs)/government-schemes")}
          >
            <Text style={styles.actionIcon}>🏛️</Text>
            <Text style={styles.actionTitle}>Govt Schemes</Text>
            <Text style={styles.actionSubtitle}>Financial benefits</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Farming Tips Card - STAYS THE SAME */}
      <View style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>💡 Tip of the Day</Text>
        <Text style={styles.tipsContent}>
          "Water your plants early morning or late evening to reduce water loss
          through evaporation and ensure better absorption."
        </Text>
        <Text style={styles.tipsAuthor}>- Agricultural Expert</Text>
      </View>

      {/* Bottom Spacing */}
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

// STYLES - SAME AS YOURS + FEW NEW ONES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fffe",
  },
  
  // Header Styles
  headerBackground: {
    height: 260,
    justifyContent: "center",
    alignItems: "center",
  },
  headerOverlay: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  
  // Location Button
  locationButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  locationButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  
  greetingEmoji: {
    fontSize: 50,
    marginBottom: 10,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold", 
    color: "white",
    marginBottom: 8,
    textAlign: "center",
  },
  userName: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 10,
    opacity: 0.9,
  },
  greetingSubtext: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
    fontStyle: "italic",
    opacity: 0.9,
  },
  dateText: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.8,
  },
  
  // Weather Widget
  weatherCard: {
    backgroundColor: "white",
    margin: 20,
    marginTop: 10,
    borderRadius: 15,
    padding: 15,
    paddingBottom: 25, 
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  weatherHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  weatherIcon: {
    fontSize: 20,
  },
  weatherTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
    flex: 1,
    marginLeft: 8,
  },
  viewMore: {
    color: "#4CAF50",
    fontSize: 13,
    fontWeight: "600",
  },
  
  // Loading Container
  weatherLoadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  weatherLoadingText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
  
  weatherContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 80, // ✅ ADDED minimum height
    paddingBottom: 15, // ✅ ADDED bottom padding
  },
  weatherLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  weatherEmoji: {
    fontSize: 32,
    marginRight: 10,
  },
  tempContainer: {
    alignItems: "flex-start",
  },
  temperature: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FF9800",
    lineHeight: 30,
  },
  condition: {
    fontSize: 13,
    color: "#333",
    fontWeight: "500",
  },
  weatherRight: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-around",
    paddingTop: 5,
  },
  weatherStatRow: {
    alignItems: "center",
  },
  statIcon: {
    fontSize: 18,
    marginBottom: 4,
  },
  statInfo: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2196F3",
  },
  statLabel: {
    fontSize: 10,
    color: "#666",
  },
  locationInline: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: -5,
    right: 15,
  },
  locationIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  locationText: {
    fontSize: 11,
    color: "#666",
    fontWeight: "500",
  },

  // ALL OTHER STYLES SAME AS YOURS...
  schemesTickerContainer: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  schemesTickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#E8F5E8",
    borderBottomWidth: 1,
    borderBottomColor: "#c8e6c9",
  },
  tickerHeaderLeft: {
    flex: 1,
  },
  schemesTickerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 2,
  },
  schemesTickerSubtitle: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "600",
  },
  viewAllButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 2,
  },
  viewAllText: {
    color: "white",
    fontSize: 13,
    fontWeight: "bold",
  },
  breakingNewsBar: {
    flexDirection: "row",
    backgroundColor: "#F44336",
    height: 35,
    alignItems: "center",
  },
  breakingLabel: {
    backgroundColor: "#D32F2F",
    paddingHorizontal: 12,
    paddingVertical: 8,
    height: "100%",
    justifyContent: "center",
  },
  breakingText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  breakingContent: {
    flex: 1,
    paddingHorizontal: 15,
    justifyContent: "center",
  },
  breakingContentText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  schemesTickerWrapper: {
    height: 140,
    backgroundColor: "#f8f9fa",
  },
  schemesTickerContent: {
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  schemeTickerCard: {
    width: 280,
    backgroundColor: "white",
    marginHorizontal: 10,
    padding: 15,
    borderRadius: 15,
    borderLeftWidth: 5,
    elevation: 4,
    position: "relative",
  },
  urgencyBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    zIndex: 1,
  },
  urgencyText: {
    color: "white",
    fontSize: 8,
    fontWeight: "bold",
  },
  schemeTickerEmoji: {
    width: 45,
    height: 45,
    backgroundColor: "#f0f0f0",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  schemeTickerEmojiText: {
    fontSize: 22,
  },
  schemeTickerInfo: {
    flex: 1,
  },
  schemeTickerName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
    lineHeight: 18,
  },
  schemeTickerBenefit: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "600",
    marginBottom: 3,
  },
  schemeTickerDesc: {
    fontSize: 10,
    color: "#666",
    marginBottom: 5,
  },
  deadlineContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  deadlineLabel: {
    fontSize: 9,
    color: "#666",
  },
  deadlineText: {
    fontSize: 9,
    fontWeight: "bold",
  },
  schemeTickerArrow: {
    position: "absolute",
    bottom: 10,
    right: 15,
  },
  arrowText: {
    fontSize: 18,
    color: "#4CAF50",
    fontWeight: "bold",
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: "#f8f9fa",
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },

  // Quick Stats
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    backgroundColor: "white",
    width: (width - 50) / 2,
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 4,
    borderLeftWidth: 5,
    alignItems: "center",
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },

  // Quick Actions
  actionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionCard: {
    width: (width - 50) / 2,
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: "center",
    elevation: 3,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 5,
  },
  actionSubtitle: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },

  // Tips Card
  tipsCard: {
    backgroundColor: "#FFF9C4",
    margin: 20,
    padding: 20,
    borderRadius: 15,
    borderLeftWidth: 5,
    borderLeftColor: "#FBC02D",
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F57F17",
    marginBottom: 10,
  },
  tipsContent: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginBottom: 10,
    fontStyle: "italic",
  },
  tipsAuthor: {
    fontSize: 12,
    color: "#666",
    textAlign: "right",
  },
});
