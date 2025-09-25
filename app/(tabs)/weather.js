// app/(tabs)/weather.js - WITH REAL SPEECH-TO-TEXT
import Voice from '@react-native-voice/voice';
import * as Location from 'expo-location';
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function WeatherScreen() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentCity, setCurrentCity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [voiceResults, setVoiceResults] = useState([]);

  // 🔑 WEATHER API KEY
  const API_KEY = "b7c72500a099878618197a2256f5dd2a";

  // 🏙️ POPULAR CITIES
  const cities = [
    "Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad",
    "Ghaziabad", "Lucknow", "Kanpur", "Agra", "Varanasi", "Allahabad",
    "Jaipur", "Jodhpur", "Udaipur", "Kota",
    "Bhopal", "Indore", "Gwalior",
    "Patna", "Gaya", "Bhagalpur",
    "Ranchi", "Jamshedpur", "Dhanbad",
    "Bhubaneswar", "Cuttack",
    "Chandigarh", "Ludhiana", "Amritsar",
    "Srinagar", "Jammu",
    "Shimla", "Dharamshala",
    "Dehradun", "Haridwar",
    "Gandhinagar", "Surat", "Vadodara",
    "Panaji",
    "Thiruvananthapuram", "Kochi", "Kozhikode",
    "Coimbatore", "Madurai", "Salem",
    "Vijayawada", "Visakhapatnam", "Tirupati",
    "Mysore", "Mangalore", "Hubli",
    "Nashik", "Nagpur", "Aurangabad",
    "Raipur", "Bilaspur",
    "Guwahati", "Silchar",
    "Imphal", "Aizawl", "Shillong", "Kohima", "Itanagar", "Agartala"
  ];

  // ✅ VOICE RECOGNITION SETUP
  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  // ✅ PRIORITY: GET CURRENT LOCATION FIRST
  useEffect(() => {
    console.log('🚀 Weather Screen Loading - Getting Current Location First...');
    getCurrentLocationWeather();
  }, []);

  useEffect(() => {
    if (currentCity && !locationLoading) {
      fetchWeatherData();
    }
  }, [currentCity]);

  // ✅ VOICE RECOGNITION EVENT HANDLERS
  const onSpeechStart = (e) => {
    console.log('🎤 Speech recognition started');
    setIsListening(true);
  };

  const onSpeechRecognized = (e) => {
    console.log('🎤 Speech recognized');
  };

  const onSpeechEnd = (e) => {
    console.log('🎤 Speech recognition ended');
    setIsListening(false);
  };

  const onSpeechError = (e) => {
    console.log('❌ Speech recognition error:', e.error);
    setIsListening(false);
    Alert.alert(
      'आवाज़ पहचान त्रुटि',
      'कृपया फिर से कोशिश करें। माइक्रोफोन की अनुमति दी गई है या नहीं जांचें।',
      [{ text: 'ठीक है' }]
    );
  };

  const onSpeechResults = (e) => {
    console.log('🎤 Speech results:', e.value);
    setVoiceResults(e.value);
    
    if (e.value && e.value.length > 0) {
      const spokenText = e.value[0];
      console.log('🗣️ User spoke:', spokenText);
      
      // Try to find matching city from spoken text
      const matchedCity = findMatchingCity(spokenText);
      
      if (matchedCity) {
        console.log('✅ Matched city:', matchedCity);
        setCurrentCity(matchedCity);
        setSearchQuery(matchedCity);
        setCurrentLocation(null);
        Alert.alert(
          'आवाज़ पहचानी गई!',
          `मौसम दिखा रहे हैं: ${matchedCity}`,
          [{ text: 'ठीक है' }]
        );
      } else {
        Alert.alert(
          'शहर नहीं मिला',
          `आपने कहा: "${spokenText}"\nकृपया स्पष्ट रूप से शहर का नाम बोलें।`,
          [
            { text: 'फिर कोशिश करें', onPress: startVoiceRecognition },
            { text: 'रद्द करें' }
          ]
        );
      }
    }
  };

  const onSpeechPartialResults = (e) => {
    console.log('🎤 Partial results:', e.value);
  };

  // ✅ FIND MATCHING CITY FROM SPEECH
  const findMatchingCity = (spokenText) => {
    const spoken = spokenText.toLowerCase().trim();
    
    // Direct match first
    const directMatch = cities.find(city => 
      city.toLowerCase() === spoken || 
      spoken.includes(city.toLowerCase())
    );
    
    if (directMatch) return directMatch;
    
    // Hindi to English mapping for common cities
    const hindiMapping = {
      'मुंबई': 'Mumbai',
      'दिल्ली': 'Delhi',
      'बैंगलोर': 'Bangalore',
      'चेन्नई': 'Chennai',
      'कोलकाता': 'Kolkata',
      'हैदराबाद': 'Hyderabad',
      'पुणे': 'Pune',
      'अहमदाबाद': 'Ahmedabad',
      'जयपुर': 'Jaipur',
      'लखनऊ': 'Lucknow',
      'कानपुर': 'Kanpur',
      'आगरा': 'Agra',
      'वाराणसी': 'Varanasi',
      'भोपाल': 'Bhopal',
      'इंदौर': 'Indore',
      'पटना': 'Patna',
      'रांची': 'Ranchi',
      'चंडीगढ़': 'Chandigarh',
      'श्रीनगर': 'Srinagar',
      'शिमला': 'Shimla',
      'देहरादून': 'Dehradun',
      'गोवा': 'Panaji',
      'कोच्चि': 'Kochi',
      'कोयंबटूर': 'Coimbatore',
      'मैसूर': 'Mysore',
      'नागपुर': 'Nagpur',
      'गुवाहाटी': 'Guwahati'
    };
    
    // Check Hindi mapping
    for (const [hindi, english] of Object.entries(hindiMapping)) {
      if (spoken.includes(hindi) || spoken.includes(english.toLowerCase())) {
        return english;
      }
    }
    
    // Fuzzy matching for similar sounding names
    const fuzzyMatch = cities.find(city => {
      const cityLower = city.toLowerCase();
      return (
        spoken.includes(cityLower.substring(0, 3)) ||
        cityLower.includes(spoken.substring(0, 3)) ||
        levenshteinDistance(spoken, cityLower) <= 2
      );
    });
    
    return fuzzyMatch || null;
  };

  // ✅ LEVENSHTEIN DISTANCE FOR FUZZY MATCHING
  const levenshteinDistance = (str1, str2) => {
    const matrix = [];
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[str2.length][str1.length];
  };

  // ✅ START VOICE RECOGNITION
  const startVoiceRecognition = async () => {
    try {
      // Request microphone permission for Android
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'माइक्रोफोन की अनुमति',
            message: 'आवाज़ से खोजने के लिए माइक्रोफोन की अनुमति चाहिए',
            buttonNeutral: 'बाद में पूछें',
            buttonNegative: 'रद्द करें',
            buttonPositive: 'ठीक है',
          }
        );
        
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('अनुमति आवश्यक', 'आवाज़ खोज के लिए माइक्रोफोन की अनुमति चाहिए');
          return;
        }
      }

      // Clear previous results
      setVoiceResults([]);
      
      // Start listening
      console.log('🎤 Starting voice recognition...');
      await Voice.start('hi-IN'); // Hindi language support
      
      // Auto-stop after 10 seconds
      setTimeout(async () => {
        if (isListening) {
          await Voice.stop();
        }
      }, 10000);
      
    } catch (error) {
      console.error('❌ Voice recognition start error:', error);
      Alert.alert(
        'आवाज़ त्रुटि',
        'आवाज़ पहचान शुरू नहीं हो सकी। कृपया फिर कोशिश करें।',
        [{ text: 'ठीक है' }]
      );
      setIsListening(false);
    }
  };

  // ✅ STOP VOICE RECOGNITION
  const stopVoiceRecognition = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (error) {
      console.error('❌ Voice stop error:', error);
    }
  };

  // ✅ CURRENT LOCATION DETECTION
  const getCurrentLocationWeather = async () => {
    try {
      setLocationLoading(true);
      setLoading(true);
      console.log('📍 Priority: Getting current location for weather...');

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('❌ Location permission denied - Using fallback city');
        Alert.alert(
          'स्थान की अनुमति चाहिए',
          'अपने क्षेत्र का मौसम देखने के लिए स्थान की अनुमति दें।',
          [
            { text: 'रद्द करें', style: 'cancel', onPress: () => useFallbackCity() },
            { text: 'अनुमति दें', onPress: () => getCurrentLocationWeather() }
          ]
        );
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 15000,
        maximumAge: 60000,
      });

      const { latitude, longitude } = location.coords;
      console.log(`📍 Current Location Found: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
      
      setCurrentLocation({ latitude, longitude });

      const cityName = await getCityNameFromCoords(latitude, longitude);
      if (cityName) {
        console.log(`🏙️ Current City Detected: ${cityName}`);
        setCurrentCity(cityName);
      } else {
        useFallbackCity();
      }

    } catch (error) {
      console.error('📍 Location detection error:', error);
      Alert.alert(
        'स्थान त्रुटि',
        'आपका स्थान प्राप्त नहीं हो सका। डिफ़ॉल्ट शहर का उपयोग कर रहे हैं।',
        [{ text: 'ठीक है', onPress: () => useFallbackCity() }]
      );
    } finally {
      setLocationLoading(false);
    }
  };

  const useFallbackCity = () => {
    console.log('🏙️ Using fallback city: Delhi');
    setCurrentCity("Delhi");
    setCurrentLocation(null);
  };

  const getCityNameFromCoords = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          return data[0].name;
        }
      }
      return null;
    } catch (error) {
      console.error('❌ Reverse geocoding error:', error);
      return null;
    }
  };

  const fetchWeatherData = async () => {
    if (!currentCity) return;
    
    try {
      setLoading(true);
      console.log(`🌤️ Fetching weather for: ${currentCity}`);

      const currentWeatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${currentCity}&appid=${API_KEY}&units=metric`
      );

      if (!currentWeatherResponse.ok) {
        throw new Error(`Weather API error: ${currentWeatherResponse.status}`);
      }

      const currentWeatherData = await currentWeatherResponse.json();

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${currentCity}&appid=${API_KEY}&units=metric`
      );

      if (forecastResponse.ok) {
        const forecastData = await forecastResponse.json();
        setForecast(forecastData.list.slice(0, 8));
      }

      console.log(`✅ Weather data loaded for: ${currentWeatherData.name}`);
      setWeather(currentWeatherData);

    } catch (error) {
      console.error("❌ Weather fetch error:", error);
      Alert.alert(
        "मौसम सेवा त्रुटि",
        `${currentCity} के लिए मौसम डेटा नहीं मिला। Mock डेटा का उपयोग कर रहे हैं।`
      );
      loadMockWeatherData();
    } finally {
      setLoading(false);
    }
  };

  const loadMockWeatherData = () => {
    const mockWeather = {
      name: currentCity || "दिल्ली",
      main: { temp: 28, feels_like: 32, humidity: 65, pressure: 1013 },
      weather: [{ main: "Clear", description: "साफ आसमान", icon: "01d" }],
      wind: { speed: 3.5 },
      visibility: 10000,
    };

    const mockForecast = [
      { dt: Date.now() / 1000 + 3600, main: { temp: 29 }, weather: [{ main: "Clear", icon: "01d" }] },
      { dt: Date.now() / 1000 + 7200, main: { temp: 31 }, weather: [{ main: "Clouds", icon: "02d" }] },
      { dt: Date.now() / 1000 + 10800, main: { temp: 30 }, weather: [{ main: "Clouds", icon: "03d" }] },
      { dt: Date.now() / 1000 + 14400, main: { temp: 28 }, weather: [{ main: "Rain", icon: "10d" }] },
    ];

    setWeather(mockWeather);
    setForecast(mockForecast);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const searchTerm = searchQuery.trim();
      console.log(`🔍 Manual search for: ${searchTerm}`);
      setCurrentCity(searchTerm);
      setCurrentLocation(null);
      setSearchQuery("");
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    if (currentLocation) {
      getCurrentLocationWeather().finally(() => setRefreshing(false));
    } else {
      fetchWeatherData().finally(() => setRefreshing(false));
    }
  }, [currentLocation]);

  const getWeatherIcon = (iconCode) => {
    const weatherEmojis = {
      "01d": "☀️", "01n": "🌙", "02d": "⛅", "02n": "☁️", "03d": "☁️", "03n": "☁️",
      "04d": "☁️", "04n": "☁️", "09d": "🌧️", "09n": "🌧️", "10d": "🌦️", "10n": "🌧️",
      "11d": "⛈️", "11n": "⛈️", "13d": "❄️", "13n": "❄️", "50d": "🌫️", "50n": "🌫️",
    };
    return weatherEmojis[iconCode] || "🌤️";
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString("hi-IN", {
      hour: "numeric", hour12: true,
    });
  };

  const getFarmingAdvice = (weatherMain, temp) => {
    const advice = {
      Clear: temp > 30 
        ? "🌡️ गर्म मौसम - सुबह या शाम को फसलों को पानी दें। कटाई के लिए अच्छा समय।"
        : "☀️ खेती के काम के लिए बेहतरीन मौसम।",
      Clouds: "⛅ रोपाई के लिए आदर्श स्थिति। पौधों पर कम धूप का तनाव।",
      Rain: "🌧️ कीटनाशक का छिड़काव न करें। प्राकृतिक सिंचाई का अच्छा समय।",
      Thunderstorm: "⛈️ कृषि उपकरणों को सुरक्षित करें। खेत का काम न करें।",
      Snow: "❄️ संवेदनशील फसलों की सुरक्षा करें।",
      Mist: "🌫️ फंगल बीमारियों से सावधान रहें।",
    };
    return advice[weatherMain] || "🌾 फसल की स्थिति पर नियमित नज़र रखें।";
  };

  if (locationLoading || (loading && !weather)) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>
          {locationLoading ? '📍 आपका स्थान खोज रहे हैं...' : '🌤️ मौसम डेटा लोड हो रहा है...'}
        </Text>
        <Text style={styles.loadingSubtext}>
          {locationLoading ? 'कृपया प्रतीक्षा करें' : 'थोड़ा इंतज़ार करें'}
        </Text>
      </View>
    );
  }

  if (!weather) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>मौसम डेटा लोड नहीं हो सका</Text>
        <TouchableOpacity style={styles.retryButton} onPress={getCurrentLocationWeather}>
          <Text style={styles.retryText}>फिर से कोशिश करें</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🌤️ मौसम अपडेट</Text>
        <Text style={styles.subtitle}>कृषि मौसम सेवा</Text>
      </View>

      {/* ✅ ENHANCED SEARCH BAR WITH REAL VOICE */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchTitle}>🔍 मौसम खोजें</Text>
        
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="शहर का नाम लिखें या बोलें..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          
          <TouchableOpacity 
            style={styles.searchButton} 
            onPress={handleSearch}
          >
            <Text style={styles.searchIcon}>🔍</Text>
          </TouchableOpacity>
          
          {/* ✅ REAL VOICE BUTTON WITH SPEECH RECOGNITION */}
          <TouchableOpacity 
            style={[styles.voiceButton, isListening && styles.voiceButtonActive]} 
            onPress={isListening ? stopVoiceRecognition : startVoiceRecognition}
          >
            <Text style={styles.voiceIcon}>
              {isListening ? "🔴" : "🎤"}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.locationButton} 
          onPress={getCurrentLocationWeather}
          disabled={locationLoading}
        >
          <Text style={styles.locationIcon}>
            {locationLoading ? "🔄" : "📍"}
          </Text>
          <Text style={styles.locationText}>
            {locationLoading ? "स्थान खोज रहे हैं..." : "मेरा स्थान"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ✅ VOICE LISTENING INDICATOR */}
      {isListening && (
        <View style={styles.voiceIndicator}>
          <Text style={styles.voiceIndicatorText}>🎤 सुन रहा हूं... शहर का नाम बोलें</Text>
          <Text style={styles.voiceIndicatorSubtext}>जैसे: "मुंबई", "दिल्ली", "बैंगलोर"</Text>
        </View>
      )}

      {/* City Selector */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.citySelector}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      >
        {cities.map((city) => (
          <TouchableOpacity
            key={city}
            style={[
              styles.cityButton,
              currentCity === city && styles.activeCityButton,
            ]}
            onPress={() => {
              setCurrentCity(city);
              setCurrentLocation(null);
            }}
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

      {/* Current Weather */}
      <View style={styles.currentWeatherCard}>
        <View style={styles.currentWeatherHeader}>
          <Text style={styles.cityName}>{weather.name}</Text>
          {currentLocation && (
            <View style={styles.currentLocationBadge}>
              <Text style={styles.badgeText}>📍 आपका स्थान</Text>
            </View>
          )}
          <Text style={styles.weatherIcon}>
            {getWeatherIcon(weather.weather[0].icon)}
          </Text>
        </View>
        
        <Text style={styles.temperature}>{Math.round(weather.main.temp)}°C</Text>
        <Text style={styles.condition}>{weather.weather[0].description}</Text>
        <Text style={styles.feelsLike}>महसूस: {Math.round(weather.main.feels_like)}°C</Text>

        <View style={styles.weatherDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>💧 नमी</Text>
            <Text style={styles.detailValue}>{weather.main.humidity}%</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>💨 हवा</Text>
            <Text style={styles.detailValue}>{weather.wind.speed} m/s</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>🔽 दबाव</Text>
            <Text style={styles.detailValue}>{weather.main.pressure} hPa</Text>
          </View>
        </View>
      </View>

      {/* Farming Advice */}
      <View style={styles.adviceCard}>
        <Text style={styles.adviceTitle}>🌾 किसान सलाह</Text>
        <Text style={styles.adviceText}>
          {getFarmingAdvice(weather.weather[0].main, weather.main.temp)}
        </Text>
      </View>

      {/* Hourly Forecast */}
      <View style={styles.forecastCard}>
        <Text style={styles.forecastTitle}>24 घंटे का पूर्वानुमान</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {forecast.map((item, index) => (
            <View key={index} style={styles.forecastItem}>
              <Text style={styles.forecastTime}>{formatTime(item.dt)}</Text>
              <Text style={styles.forecastIcon}>
                {getWeatherIcon(item.weather[0].icon)}
              </Text>
              <Text style={styles.forecastTemp}>{Math.round(item.main.temp)}°</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

// ✅ ENHANCED STYLES
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
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: "#4CAF50",
    fontWeight: "bold",
    textAlign: "center",
  },
  loadingSubtext: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
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
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
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
  searchContainer: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
  },
  searchTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 15,
    textAlign: "center",
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    padding: 10,
    marginLeft: 5,
  },
  searchIcon: {
    fontSize: 20,
  },
  voiceButton: {
    padding: 10,
    marginLeft: 5,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
  },
  voiceButtonActive: {
    backgroundColor: '#F44336',
  },
  voiceIcon: {
    fontSize: 18,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 25,
  },
  locationIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  locationText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  voiceIndicator: {
    backgroundColor: '#F44336',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  voiceIndicatorText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  voiceIndicatorSubtext: {
    color: 'white',
    fontSize: 12,
    opacity: 0.9,
  },
  citySelector: {
    padding: 15,
    maxHeight: 60,
  },
  cityButton: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    elevation: 2,
    minWidth: 80,
    alignItems: 'center',
  },
  activeCityButton: {
    backgroundColor: "#4CAF50",
  },
  cityButtonText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
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
    flexWrap: "wrap",
    justifyContent: "center",
  },
  cityName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
    marginRight: 10,
  },
  currentLocationBadge: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    marginRight: 10,
    marginBottom: 5,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
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
    lineHeight: 22,
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
