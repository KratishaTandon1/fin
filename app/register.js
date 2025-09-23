import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { useAuth } from "../src/contexts/AuthContext";

function RegisterScreen() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    farmName: "",
    farmSize: "",
    location: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  
  const router = useRouter();
  const { register } = useAuth();
  
  // Input refs
  const refs = {
    name: useRef(null),
    email: useRef(null),
    password: useRef(null),
    farmName: useRef(null),
    farmSize: useRef(null),
    location: useRef(null),
  };

  // Clean animations
  const logoScale = useSharedValue(0.8);
  const cardOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  // Keyboard listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  // Start animations
  useEffect(() => {
    logoScale.value = withSpring(1, { damping: 8 });
    cardOpacity.value = withTiming(1, { duration: 800 });
  }, []);

  // Animated styles
  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    Keyboard.dismiss();
    
    const { name, email, password, farmName, farmSize, location } = formData;
    
    if (!name || !email || !password || !farmName || !farmSize || !location) {
      Alert.alert("Missing Information", "Please fill all required fields");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Password Too Short", "Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    buttonScale.value = withSpring(0.95);
    
    try {
      const userData = {
        ...formData,
        soilType: "Alluvial Soil",
        primaryCrops: ["🌾 Wheat", "🌾 Rice"],
        language: "Hindi"
      };
      
      const result = await register(userData);
      
      if (result.success) {
        buttonScale.value = withSpring(1.05);
        Alert.alert(
          "Account Created! 🎉", 
          `Welcome to Kissan Setu, ${result.user.name}!`,
          [{ text: "Continue to Login", onPress: () => router.replace("/login") }]
        );
      } else {
        Alert.alert("Registration Failed", result.error || "Please try again");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    }
    
    buttonScale.value = withSpring(1);
    setIsLoading(false);
  };

  const handleQuickFill = () => {
    const demoData = {
      name: "Demo Farmer",
      email: "demo@farm.com", 
      password: "123456",
      farmName: "Green Valley Farm",
      farmSize: "5 acres",
      location: "Punjab, India",
    };
    setFormData(demoData);
    Alert.alert("Demo Data Filled! 🚀", "All fields filled with sample data");
  };

  const focusNext = (currentField) => {
    const fields = ['name', 'email', 'password', 'farmName', 'farmSize', 'location'];
    const currentIndex = fields.indexOf(currentField);
    const nextField = fields[currentIndex + 1];
    
    if (nextField && refs[nextField]?.current) {
      refs[nextField].current.focus();
    } else {
      Keyboard.dismiss();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Dark Green Background */}
        <LinearGradient
          colors={['#0F2027', '#203A43', '#2C5364']}
          style={styles.backgroundGradient}
        />

        <ScrollView 
          contentContainerStyle={[
            styles.scrollContainer,
            keyboardVisible && styles.scrollContainerKeyboard
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          
          {/* Header */}
          {!keyboardVisible && (
            <View style={styles.header}>
              {/* Logo */}
              <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
                <View style={styles.logoCircle}>
                  <Text style={styles.logoEmoji}>🌾</Text>
                </View>
              </Animated.View>
              
              {/* App Title */}
              <Text style={styles.appTitle}>Kissan Setu</Text>
              <Text style={styles.slogan}>आपका अपना मार्गदर्शक</Text>
              
              {/* Welcome Text */}
              <View style={styles.welcomeContainer}>
                <Text style={styles.welcomeTitle}>Join Our Family!</Text>
                <Text style={styles.welcomeSubtitle}>
                  Start your smart farming journey today
                </Text>
              </View>
            </View>
          )}

          {/* Register Card */}
          <Animated.View style={[styles.registerCard, cardAnimatedStyle]}>
            
            {/* Demo Button */}
            <TouchableOpacity 
              style={styles.demoButton} 
              onPress={handleQuickFill}
              activeOpacity={0.8}
            >
              <Text style={styles.demoText}>🚀 Fill Demo Data</Text>
            </TouchableOpacity>

            {/* Personal Info Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>👤 Personal Information</Text>
              
              {/* Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name *</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    ref={refs.name}
                    style={styles.input}
                    value={formData.name}
                    onChangeText={(value) => updateField('name', value)}
                    placeholder="Enter your full name"
                    placeholderTextColor="#A0A0A0"
                    autoCapitalize="words"
                    returnKeyType="next"
                    onSubmitEditing={() => focusNext('name')}
                    blurOnSubmit={false}
                  />
                </View>
              </View>

              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address *</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    ref={refs.email}
                    style={styles.input}
                    value={formData.email}
                    onChangeText={(value) => updateField('email', value)}
                    placeholder="Enter your email"
                    placeholderTextColor="#A0A0A0"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    returnKeyType="next"
                    onSubmitEditing={() => focusNext('email')}
                    blurOnSubmit={false}
                  />
                </View>
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password *</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    ref={refs.password}
                    style={styles.passwordInput}
                    value={formData.password}
                    onChangeText={(value) => updateField('password', value)}
                    placeholder="Create password (min 6 chars)"
                    placeholderTextColor="#A0A0A0"
                    secureTextEntry={!showPassword}
                    returnKeyType="next"
                    onSubmitEditing={() => focusNext('password')}
                    blurOnSubmit={false}
                  />
                  <TouchableOpacity 
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.eyeIcon}>
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Farm Info Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🏡 Farm Information</Text>
              
              {/* Farm Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Farm Name *</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    ref={refs.farmName}
                    style={styles.input}
                    value={formData.farmName}
                    onChangeText={(value) => updateField('farmName', value)}
                    placeholder="Enter your farm name"
                    placeholderTextColor="#A0A0A0"
                    autoCapitalize="words"
                    returnKeyType="next"
                    onSubmitEditing={() => focusNext('farmName')}
                    blurOnSubmit={false}
                  />
                </View>
              </View>

              {/* Farm Size */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Farm Size *</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    ref={refs.farmSize}
                    style={styles.input}
                    value={formData.farmSize}
                    onChangeText={(value) => updateField('farmSize', value)}
                    placeholder="e.g., 5 acres, 2 hectares"
                    placeholderTextColor="#A0A0A0"
                    returnKeyType="next"
                    onSubmitEditing={() => focusNext('farmSize')}
                    blurOnSubmit={false}
                  />
                </View>
              </View>

              {/* Location */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Location *</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    ref={refs.location}
                    style={styles.input}
                    value={formData.location}
                    onChangeText={(value) => updateField('location', value)}
                    placeholder="e.g., Punjab, India"
                    placeholderTextColor="#A0A0A0"
                    autoCapitalize="words"
                    returnKeyType="done"
                    onSubmitEditing={handleRegister}
                  />
                </View>
              </View>
            </View>

            {/* Register Button */}
            <Animated.View style={buttonAnimatedStyle}>
              <TouchableOpacity 
                style={[styles.registerButton, isLoading && styles.registerButtonLoading]} 
                onPress={handleRegister}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#4CAF50', '#45a049']}
                  style={styles.buttonGradient}
                >
                  {isLoading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator color="white" size="small" />
                      <Text style={styles.buttonText}>  Creating Account...</Text>
                    </View>
                  ) : (
                    <Text style={styles.buttonText}>🌾 Create Account</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/login")}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>

            {/* Privacy Notice */}
            {!keyboardVisible && (
              <View style={styles.privacyContainer}>
                <Text style={styles.privacyText}>
                  🔒 By creating an account, you agree to our Terms of Service. 
                  Your data is stored securely on your device.
                </Text>
              </View>
            )}

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  scrollContainerKeyboard: {
    paddingTop: 15,
  },

  // Header Styles
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    borderWidth: 3,
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  logoEmoji: {
    fontSize: 45,
  },
  appTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'Roboto',
  },
  slogan: {
    fontSize: 16,
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 25,
    fontWeight: '600',
  },
  welcomeContainer: {
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 6,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },

  // Card Styles
  registerCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 25,
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },

  // Demo Button
  demoButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
  },
  demoText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Section Styles
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#4CAF50',
    paddingBottom: 5,
  },

  // Input Styles
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 6,
  },
  inputContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    paddingHorizontal: 12,
  },
  input: {
    fontSize: 15,
    color: '#333',
    paddingVertical: 12,
  },
  passwordInput: {
    fontSize: 15,
    color: '#333',
    paddingVertical: 12,
    flex: 1,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 4,
  },
  eyeIcon: {
    fontSize: 18,
  },

  // Button Styles
  registerButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 8,
    marginBottom: 15,
  },
  registerButtonLoading: {
    opacity: 0.8,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Login Link
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginText: {
    color: '#666',
    fontSize: 15,
  },
  loginLink: {
    color: '#4CAF50',
    fontSize: 15,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },

  // Privacy
  privacyContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 15,
    borderLeftWidth: 3,
    borderLeftColor: '#FF9800',
  },
  privacyText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
    textAlign: 'center',
  },
});

export default RegisterScreen;
