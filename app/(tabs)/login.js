import { useRouter } from "expo-router";
import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  ImageBackground,
  Dimensions,
  StatusBar,
  Animated,
  Platform,
  Alert,
  Modal,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [language, setLanguage] = useState("Hindi");
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const languages = [
    { label: "🇮🇳 हिन्दी (Hindi)", value: "Hindi" },
    { label: "🇬🇧 English", value: "English" },
    { label: "🇮🇳 ਪੰਜਾਬੀ (Punjabi)", value: "Punjabi" },
    { label: "🇮🇳 मराठी (Marathi)", value: "Marathi" },
    { label: "🇮🇳 ગુજરાતી (Gujarati)", value: "Gujarati" },
  ];

  useEffect(() => {
    // Entry animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous pulse animation for logo
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, []);

  const handleLogin = async () => {
    if (!name || !password || !language) {
      Alert.alert(
        "Missing Information ⚠️",
        "Please fill all fields to continue.",
        [{ text: "OK", style: "default" }]
      );
      return;
    }

    setIsLoading(true);

    // Simulate authentication delay
    setTimeout(() => {
      const userExists = name.toLowerCase() === "test" && password === "1234";

      if (userExists) {
        Alert.alert(
          "Welcome! 🎉",
          `Hello ${name}, you have successfully logged in.`,
          [
            {
              text: "Continue",
              onPress: () => router.replace("/(tabs)"),
              style: "default",
            },
          ]
        );
      } else {
        Alert.alert(
          "Account Not Found 🔍",
          "User does not exist. Would you like to create a new account?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Register",
              onPress: () => router.replace("/register"),
              style: "default",
            },
          ]
        );
      }
      setIsLoading(false);
    }, 2000);
  };

  const handleQuickLogin = () => {
    setName("test");
    setPassword("1234");
    Alert.alert("Demo Login", "Test credentials filled for demo purpose!");
  };

  const selectLanguage = (selectedLanguage) => {
    setLanguage(selectedLanguage.value);
    setShowLanguageModal(false);
  };

  const getSelectedLanguageLabel = () => {
    const selected = languages.find((lang) => lang.value === language);
    return selected ? selected.label : languages[0].label;
  };

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Animated Background */}
        <ImageBackground
          source={{
            uri: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjgwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxyYWRpYWxHcmFkaWVudCBpZD0iZ3JhZGllbnQiIGN4PSI1MCUiIGN5PSIwJSIgcj0iMTIwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM2NkJCNkE7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICAgIDxzdG9wIG9mZnNldD0iNTAlIiBzdHlsZT0ic3RvcC1jb2xvcjojNENBRjUwO3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMxQjVFMjA7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICA8L3JhZGlhbEdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyYWRpZW50KSIgLz4KPC9zdmc+",
          }}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.overlay} />
        </ImageBackground>

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Animated Header Section */}
          <Animated.View
            style={[
              styles.headerContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
              },
            ]}
          >
            {/* Logo with Pulse Animation */}
            <Animated.View
              style={[
                styles.logoContainer,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <View style={styles.logoCircle}>
                <Text style={styles.logoIcon}>🌾</Text>
              </View>
            </Animated.View>

            <Text style={styles.appName}>Kisaan Sethu</Text>
            <Text style={styles.slogan}>आपका अपना मार्गदर्शक</Text>

            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome Back!</Text>
              <Text style={styles.subtitleText}>
                Sign in to continue your farming journey
              </Text>
            </View>
          </Animated.View>

          {/* Login Form Card */}
          <Animated.View
            style={[
              styles.formCard,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Demo Login Helper */}
            <TouchableOpacity
              style={styles.demoButton}
              onPress={handleQuickLogin}
            >
              <Text style={styles.demoButtonText}>🚀 Try Demo Login</Text>
            </TouchableOpacity>

            {/* Form Fields */}
            <View style={styles.formContent}>
              {/* Name Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>👤 Full Name</Text>
                <View
                  style={[
                    styles.inputContainer,
                    focusedField === "name" && styles.inputContainerFocused,
                  ]}
                >
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your full name"
                    placeholderTextColor="#999"
                    value={name}
                    onChangeText={setName}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>🔒 Password</Text>
                <View
                  style={[
                    styles.inputContainer,
                    focusedField === "password" && styles.inputContainerFocused,
                  ]}
                >
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Enter your password"
                    placeholderTextColor="#999"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Text style={styles.eyeIcon}>
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Language Selection (Custom Dropdown) */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>🌐 Preferred Language</Text>
                <TouchableOpacity
                  style={[
                    styles.languageSelector,
                    focusedField === "language" && styles.inputContainerFocused,
                  ]}
                  onPress={() => setShowLanguageModal(true)}
                >
                  <Text style={styles.languageSelectorText}>
                    {getSelectedLanguageLabel()}
                  </Text>
                  <Text style={styles.dropdownArrow}>▼</Text>
                </TouchableOpacity>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                style={[
                  styles.loginButton,
                  isLoading && styles.loginButtonLoading,
                ]}
                onPress={handleLogin}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <Text style={styles.loginButtonText}>
                  {isLoading ? "⏳ Signing In..." : "🚀 Sign In"}
                </Text>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Alternative Login Methods */}
              <View style={styles.altLoginContainer}>
                <TouchableOpacity style={styles.altLoginButton}>
                  <Text style={styles.altLoginIcon}>📱</Text>
                  <Text style={styles.altLoginText}>Phone Number</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.altLoginButton}>
                  <Text style={styles.altLoginIcon}>👤</Text>
                  <Text style={styles.altLoginText}>Guest Mode</Text>
                </TouchableOpacity>
              </View>

              {/* Register Link */}
              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>New to Kisaan Sethu? </Text>
                <TouchableOpacity onPress={() => router.replace("/register")}>
                  <Text style={styles.registerLink}>Create Account</Text>
                </TouchableOpacity>
              </View>

              {/* Features Preview */}
              <View style={styles.featuresPreview}>
                <Text style={styles.featuresTitle}>🌟 What You'll Get:</Text>
                <View style={styles.featuresList}>
                  <Text style={styles.featureItem}>
                    • Personalized crop recommendations
                  </Text>
                  <Text style={styles.featureItem}>
                    • Real-time weather updates
                  </Text>
                  <Text style={styles.featureItem}>
                    • Market price insights
                  </Text>
                  <Text style={styles.featureItem}>
                    • Expert farming advice
                  </Text>
                </View>
              </View>

              {/* Footer */}
              <View style={styles.footerContainer}>
                <Text style={styles.footerText}>
                  🔒 Your data is secure and private
                </Text>
                <Text style={styles.versionText}>Kisaan Sethu v1.0.0</Text>
              </View>
            </View>
          </Animated.View>
        </ScrollView>

        {/* Language Selection Modal */}
        <Modal
          visible={showLanguageModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowLanguageModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.languageModal}>
              <Text style={styles.modalTitle}>Select Language</Text>
              {languages.map((lang, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.languageOption,
                    language === lang.value && styles.languageOptionSelected,
                  ]}
                  onPress={() => selectLanguage(lang)}
                >
                  <Text
                    style={[
                      styles.languageOptionText,
                      language === lang.value &&
                        styles.languageOptionTextSelected,
                    ]}
                  >
                    {lang.label}
                  </Text>
                  {language === lang.value && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={() => setShowLanguageModal(false)}
              >
                <Text style={styles.closeModalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: "absolute",
    width: width,
    height: height,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(30, 70, 32, 0.7)",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 40,
  },

  // Header Styles
  headerContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  logoIcon: {
    fontSize: 50,
  },
  appName: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  slogan: {
    fontSize: 18,
    color: "#c8e6c9",
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 25,
  },
  welcomeContainer: {
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitleText: {
    fontSize: 16,
    color: "#c8e6c9",
    textAlign: "center",
    lineHeight: 22,
  },

  // Form Card Styles
  formCard: {
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    borderRadius: 30,
    padding: 25,
    elevation: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },

  // Demo Button
  demoButton: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    alignSelf: "center",
    marginBottom: 20,
    elevation: 3,
  },
  demoButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },

  // Form Content
  formContent: {
    gap: 20,
  },
  inputGroup: {
    marginBottom: 5,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E7D32",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#e9ecef",
    paddingHorizontal: 18,
    paddingVertical: 4,
    minHeight: 55,
  },
  inputContainerFocused: {
    borderColor: "#4CAF50",
    backgroundColor: "white",
    elevation: 3,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  input: {
    fontSize: 16,
    color: "#333",
    paddingVertical: 12,
  },
  eyeButton: {
    padding: 8,
  },
  eyeIcon: {
    fontSize: 20,
  },

  // Custom Language Selector
  languageSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#e9ecef",
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  languageSelectorText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  dropdownArrow: {
    fontSize: 12,
    color: "#666",
  },

  // Login Button
  loginButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 25,
    paddingVertical: 18,
    alignItems: "center",
    elevation: 8,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    marginTop: 10,
  },
  loginButtonLoading: {
    backgroundColor: "#81C784",
  },
  loginButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },

  // Divider
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 25,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e9ecef",
  },
  dividerText: {
    marginHorizontal: 15,
    color: "#666",
    fontSize: 14,
    fontWeight: "600",
  },

  // Alternative Login
  altLoginContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  altLoginButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    paddingVertical: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#e9ecef",
    elevation: 2,
  },
  altLoginIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  altLoginText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#495057",
  },

  // Register Link
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  registerText: {
    color: "#666",
    fontSize: 16,
  },
  registerLink: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },

  // Features Preview
  featuresPreview: {
    backgroundColor: "#E8F5E8",
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 10,
  },
  featuresList: {
    gap: 8,
  },
  featureItem: {
    fontSize: 14,
    color: "#2E7D32",
    lineHeight: 20,
  },

  // Footer
  footerContainer: {
    alignItems: "center",
    paddingTop: 20,
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
    gap: 8,
  },
  footerText: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
  },
  versionText: {
    color: "#999",
    fontSize: 12,
  },

  // Language Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  languageModal: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E7D32",
    textAlign: "center",
    marginBottom: 20,
  },
  languageOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  languageOptionSelected: {
    backgroundColor: "#E8F5E8",
    borderRadius: 10,
  },
  languageOptionText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  languageOptionTextSelected: {
    color: "#2E7D32",
    fontWeight: "bold",
  },
  checkmark: {
    fontSize: 18,
    color: "#4CAF50",
    fontWeight: "bold",
  },
  closeModalButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 20,
  },
  closeModalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
