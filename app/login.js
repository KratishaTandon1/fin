import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
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
    withTiming
} from 'react-native-reanimated';
import { useAuth } from "../src/contexts/AuthContext";

const { width, height } = Dimensions.get('window');

function LoginScreen() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  
  const router = useRouter();
  const { signIn } = useAuth();
  
  const nameRef = useRef(null);
  const passwordRef = useRef(null);

  // Simple animations
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

  // Start clean animations
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

  const handleLogin = async () => {
    Keyboard.dismiss();
    
    if (!name.trim() || !password.trim()) {
      Alert.alert("Missing Information", "Please enter both name and password");
      return;
    }

    setIsLoading(true);
    buttonScale.value = withSpring(0.95);
    
    try {
      const result = await signIn(name.trim(), password);
      
      if (result.success) {
        buttonScale.value = withSpring(1.05);
        Alert.alert("Welcome Back! 🎉", `Hello ${result.user.name}!`);
        router.replace("/(tabs)");
      } else {
        Alert.alert(
          "Login Failed", 
          "User not found. Would you like to register?",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Register", onPress: () => router.push("/register") }
          ]
        );
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    }
    
    buttonScale.value = withSpring(1);
    setIsLoading(false);
  };

  const handleQuickDemo = () => {
    setName("Demo User");
    setPassword("123456");
    Alert.alert("Demo Ready! 🚀", "Tap login to continue with demo account");
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
          
          {/* Header Section */}
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
                <Text style={styles.welcomeTitle}>Welcome Back!</Text>
                <Text style={styles.welcomeSubtitle}>
                  Continue your smart farming journey
                </Text>
              </View>
            </View>
          )}

          {/* Login Card */}
          <Animated.View style={[styles.loginCard, cardAnimatedStyle]}>
            
            {/* Demo Button */}
            <TouchableOpacity 
              style={styles.demoButton} 
              onPress={handleQuickDemo}
              activeOpacity={0.8}
            >
              <Text style={styles.demoText}>🚀 Try Demo Login</Text>
            </TouchableOpacity>

            {/* Input Section */}
            <View style={styles.inputSection}>
              
              {/* Name Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>👤 Name</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    ref={nameRef}
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your name"
                    placeholderTextColor="#A0A0A0"
                    autoCapitalize="words"
                    returnKeyType="next"
                    onSubmitEditing={() => passwordRef.current?.focus()}
                    blurOnSubmit={false}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>🔒 Password</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    ref={passwordRef}
                    style={styles.passwordInput}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    placeholderTextColor="#A0A0A0"
                    secureTextEntry={!showPassword}
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
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

            {/* Login Button */}
            <Animated.View style={buttonAnimatedStyle}>
              <TouchableOpacity 
                style={[styles.loginButton, isLoading && styles.loginButtonLoading]} 
                onPress={handleLogin}
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
                      <Text style={styles.buttonText}>  Signing In...</Text>
                    </View>
                  ) : (
                    <Text style={styles.buttonText}>🚀 Sign In</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* Register Link */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>New to Kissan Setu? </Text>
              <TouchableOpacity onPress={() => router.push("/register")}>
                <Text style={styles.registerLink}>Create Account</Text>
              </TouchableOpacity>
            </View>

            {/* Features Preview */}
            {!keyboardVisible && (
              <View style={styles.featuresContainer}>
                <Text style={styles.featuresTitle}>🌟 Smart Farming Features</Text>
                <View style={styles.featuresList}>
                  <Text style={styles.featureItem}>🌤️ Real-time weather updates</Text>
                  <Text style={styles.featureItem}>🤖 AI-powered crop detection</Text>
                  <Text style={styles.featureItem}>📈 Market price insights</Text>
                  <Text style={styles.featureItem}>🐛 Pest management guide</Text>
                </View>
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
    paddingVertical: 40,
  },
  scrollContainerKeyboard: {
    paddingTop: 20,
  },

  // Header Styles
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
    fontSize: 50,
  },
  appTitle: {
    fontSize: 48,
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
    fontSize: 18,
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '600',
  },
  welcomeContainer: {
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },

  // Card Styles
  loginCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 30,
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },

  // Demo Button
  demoButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginBottom: 25,
    elevation: 5,
  },
  demoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Input Styles
  inputSection: {
    marginBottom: 25,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    paddingHorizontal: 15,
  },
  input: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 15,
  },
  passwordInput: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 15,
    flex: 1,
  },
  eyeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    padding: 5,
  },
  eyeIcon: {
    fontSize: 20,
  },

  // Button Styles
  loginButton: {
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 8,
    marginBottom: 20,
  },
  loginButtonLoading: {
    opacity: 0.8,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Register Link
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  registerText: {
    color: '#666',
    fontSize: 16,
  },
  registerLink: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },

  // Features
  featuresContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 12,
    textAlign: 'center',
  },
  featuresList: {
    gap: 8,
  },
  featureItem: {
    fontSize: 14,
    color: '#2E7D32',
    lineHeight: 20,
  },
});

export default LoginScreen;
