import { Picker } from "@react-native-picker/picker";
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

export default function Register() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Step 1: Personal Information
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    language: "Hindi",
  });

  // Step 2: Farm Information
  const [farmInfo, setFarmInfo] = useState({
    farmName: "",
    farmSize: "",
    location: "",
    soilType: "",
    farmingExperience: "",
    farmType: "Mixed Farming",
  });

  // Step 3: Crop Preferences
  const [cropPreferences, setCropPreferences] = useState({
    primaryCrops: [],
    farmingSeason: "Both",
    irrigationType: "Rain-fed",
    organicFarming: false,
  });

  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entry animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Progress animation
    Animated.timing(progressAnim, {
      toValue: (currentStep - 1) / 2,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentStep]);

  const validateStep1 = () => {
    const { fullName, email, phone, password, confirmPassword } = personalInfo;

    if (!fullName || !email || !phone || !password || !confirmPassword) {
      Alert.alert("Missing Information", "Please fill all required fields.");
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match.");
      return false;
    }

    if (password.length < 6) {
      Alert.alert(
        "Weak Password",
        "Password must be at least 6 characters long."
      );
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      Alert.alert(
        "Invalid Phone",
        "Please enter a valid 10-digit phone number."
      );
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    const { farmName, farmSize, location, soilType } = farmInfo;

    if (!farmName || !farmSize || !location || !soilType) {
      Alert.alert("Missing Information", "Please fill all farm details.");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleRegister();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRegister = async () => {
    setIsLoading(true);

    // Simulate registration process
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccessModal(true);
    }, 2500);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    Alert.alert(
      "Registration Complete! 🎉",
      "Welcome to Kisaan Sethu family! Please login to continue.",
      [
        {
          text: "Login Now",
          onPress: () => router.replace("/login"),
          style: "default",
        },
      ]
    );
  };

  const updatePersonalInfo = (field, value) => {
    setPersonalInfo((prev) => ({ ...prev, [field]: value }));
  };

  const updateFarmInfo = (field, value) => {
    setFarmInfo((prev) => ({ ...prev, [field]: value }));
  };

  const updateCropPreferences = (field, value) => {
    setCropPreferences((prev) => ({ ...prev, [field]: value }));
  };

  const soilTypes = [
    "Black Soil",
    "Red Soil",
    "Alluvial Soil",
    "Sandy Soil",
    "Clay Soil",
    "Loamy Soil",
    "Saline Soil",
    "Peaty Soil",
  ];

  const farmTypes = [
    "Crop Farming",
    "Livestock Farming",
    "Mixed Farming",
    "Organic Farming",
    "Dairy Farming",
    "Poultry Farming",
  ];

  const irrigationTypes = [
    "Rain-fed",
    "Drip Irrigation",
    "Sprinkler Irrigation",
    "Flood Irrigation",
    "Canal Irrigation",
    "Tube Well",
  ];

  const popularCrops = [
    "🌾 Wheat",
    "🌾 Rice",
    "🌽 Maize",
    "☁️ Cotton",
    "🎋 Sugarcane",
    "🫘 Soybean",
    "🌻 Sunflower",
    "🥔 Potato",
    "🍅 Tomato",
    "🧅 Onion",
    "🌶️ Chili",
    "🟡 Turmeric",
  ];

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      <View style={styles.progressBarContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
      </View>

      <View style={styles.stepsContainer}>
        {[1, 2, 3].map((step) => (
          <View key={step} style={styles.stepItem}>
            <View
              style={[
                styles.stepCircle,
                currentStep >= step && styles.stepCircleActive,
              ]}
            >
              <Text
                style={[
                  styles.stepNumber,
                  currentStep >= step && styles.stepNumberActive,
                ]}
              >
                {step}
              </Text>
            </View>
            <Text
              style={[
                styles.stepLabel,
                currentStep >= step && styles.stepLabelActive,
              ]}
            >
              {step === 1
                ? "Personal"
                : step === 2
                ? "Farm Info"
                : "Preferences"}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>👤 Personal Information</Text>
      <Text style={styles.stepSubtitle}>Tell us about yourself</Text>

      <View style={styles.formGroup}>
        <Text style={styles.inputLabel}>Full Name *</Text>
        <TextInput
          style={[
            styles.input,
            focusedField === "fullName" && styles.inputFocused,
          ]}
          placeholder="Enter your full name"
          placeholderTextColor="#999"
          value={personalInfo.fullName}
          onChangeText={(value) => updatePersonalInfo("fullName", value)}
          onFocus={() => setFocusedField("fullName")}
          onBlur={() => setFocusedField(null)}
          autoCapitalize="words"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.inputLabel}>Email Address *</Text>
        <TextInput
          style={[
            styles.input,
            focusedField === "email" && styles.inputFocused,
          ]}
          placeholder="Enter your email"
          placeholderTextColor="#999"
          value={personalInfo.email}
          onChangeText={(value) => updatePersonalInfo("email", value)}
          onFocus={() => setFocusedField("email")}
          onBlur={() => setFocusedField(null)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.inputLabel}>Phone Number *</Text>
        <TextInput
          style={[
            styles.input,
            focusedField === "phone" && styles.inputFocused,
          ]}
          placeholder="Enter 10-digit phone number"
          placeholderTextColor="#999"
          value={personalInfo.phone}
          onChangeText={(value) => updatePersonalInfo("phone", value)}
          onFocus={() => setFocusedField("phone")}
          onBlur={() => setFocusedField(null)}
          keyboardType="numeric"
          maxLength={10}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.inputLabel}>Password *</Text>
        <View
          style={[
            styles.passwordContainer,
            focusedField === "password" && styles.inputFocused,
          ]}
        >
          <TextInput
            style={styles.passwordInput}
            placeholder="Create password (min 6 characters)"
            placeholderTextColor="#999"
            value={personalInfo.password}
            onChangeText={(value) => updatePersonalInfo("password", value)}
            onFocus={() => setFocusedField("password")}
            onBlur={() => setFocusedField(null)}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={styles.eyeIcon}>{showPassword ? "👁️" : "👁️‍🗨️"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.inputLabel}>Confirm Password *</Text>
        <View
          style={[
            styles.passwordContainer,
            focusedField === "confirmPassword" && styles.inputFocused,
          ]}
        >
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirm your password"
            placeholderTextColor="#999"
            value={personalInfo.confirmPassword}
            onChangeText={(value) =>
              updatePersonalInfo("confirmPassword", value)
            }
            onFocus={() => setFocusedField("confirmPassword")}
            onBlur={() => setFocusedField(null)}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Text style={styles.eyeIcon}>
              {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.inputLabel}>Preferred Language</Text>
        <View
          style={[
            styles.pickerContainer,
            focusedField === "language" && styles.inputFocused,
          ]}
        >
          <Picker
            selectedValue={personalInfo.language}
            style={styles.picker}
            onValueChange={(value) => updatePersonalInfo("language", value)}
            onFocus={() => setFocusedField("language")}
          >
            <Picker.Item label="🇮🇳 हिन्दी (Hindi)" value="Hindi" />
            <Picker.Item label="🇬🇧 English" value="English" />
            <Picker.Item label="🇮🇳 ਪੰਜਾਬੀ (Punjabi)" value="Punjabi" />
            <Picker.Item label="🇮🇳 मराठी (Marathi)" value="Marathi" />
            <Picker.Item label="🇮🇳 ગુજરાતી (Gujarati)" value="Gujarati" />
          </Picker>
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>🚜 Farm Information</Text>
      <Text style={styles.stepSubtitle}>Tell us about your farm</Text>

      <View style={styles.formGroup}>
        <Text style={styles.inputLabel}>Farm Name *</Text>
        <TextInput
          style={[
            styles.input,
            focusedField === "farmName" && styles.inputFocused,
          ]}
          placeholder="Enter your farm name"
          placeholderTextColor="#999"
          value={farmInfo.farmName}
          onChangeText={(value) => updateFarmInfo("farmName", value)}
          onFocus={() => setFocusedField("farmName")}
          onBlur={() => setFocusedField(null)}
          autoCapitalize="words"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.inputLabel}>Farm Size (in acres) *</Text>
        <TextInput
          style={[
            styles.input,
            focusedField === "farmSize" && styles.inputFocused,
          ]}
          placeholder="e.g., 5 acres"
          placeholderTextColor="#999"
          value={farmInfo.farmSize}
          onChangeText={(value) => updateFarmInfo("farmSize", value)}
          onFocus={() => setFocusedField("farmSize")}
          onBlur={() => setFocusedField(null)}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.inputLabel}>Farm Location *</Text>
        <TextInput
          style={[
            styles.input,
            focusedField === "location" && styles.inputFocused,
          ]}
          placeholder="Village, District, State"
          placeholderTextColor="#999"
          value={farmInfo.location}
          onChangeText={(value) => updateFarmInfo("location", value)}
          onFocus={() => setFocusedField("location")}
          onBlur={() => setFocusedField(null)}
          autoCapitalize="words"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.inputLabel}>Soil Type *</Text>
        <View
          style={[
            styles.pickerContainer,
            focusedField === "soilType" && styles.inputFocused,
          ]}
        >
          <Picker
            selectedValue={farmInfo.soilType}
            style={styles.picker}
            onValueChange={(value) => updateFarmInfo("soilType", value)}
            onFocus={() => setFocusedField("soilType")}
          >
            <Picker.Item label="Select soil type" value="" />
            {soilTypes.map((soil, index) => (
              <Picker.Item key={index} label={soil} value={soil} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.inputLabel}>Farming Experience</Text>
        <TextInput
          style={[
            styles.input,
            focusedField === "farmingExperience" && styles.inputFocused,
          ]}
          placeholder="Years of farming experience"
          placeholderTextColor="#999"
          value={farmInfo.farmingExperience}
          onChangeText={(value) => updateFarmInfo("farmingExperience", value)}
          onFocus={() => setFocusedField("farmingExperience")}
          onBlur={() => setFocusedField(null)}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.inputLabel}>Farm Type</Text>
        <View
          style={[
            styles.pickerContainer,
            focusedField === "farmType" && styles.inputFocused,
          ]}
        >
          <Picker
            selectedValue={farmInfo.farmType}
            style={styles.picker}
            onValueChange={(value) => updateFarmInfo("farmType", value)}
            onFocus={() => setFocusedField("farmType")}
          >
            {farmTypes.map((type, index) => (
              <Picker.Item key={index} label={type} value={type} />
            ))}
          </Picker>
        </View>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>🌾 Crop Preferences</Text>
      <Text style={styles.stepSubtitle}>
        Help us personalize your experience
      </Text>

      <View style={styles.formGroup}>
        <Text style={styles.inputLabel}>Primary Crops (Select multiple)</Text>
        <View style={styles.cropsGrid}>
          {popularCrops.map((crop, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.cropChip,
                cropPreferences.primaryCrops.includes(crop) &&
                  styles.cropChipSelected,
              ]}
              onPress={() => {
                const updatedCrops = cropPreferences.primaryCrops.includes(crop)
                  ? cropPreferences.primaryCrops.filter((c) => c !== crop)
                  : [...cropPreferences.primaryCrops, crop];
                updateCropPreferences("primaryCrops", updatedCrops);
              }}
            >
              <Text
                style={[
                  styles.cropChipText,
                  cropPreferences.primaryCrops.includes(crop) &&
                    styles.cropChipTextSelected,
                ]}
              >
                {crop}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.inputLabel}>Farming Season</Text>
        <View style={styles.radioGroup}>
          {["Kharif", "Rabi", "Both"].map((season) => (
            <TouchableOpacity
              key={season}
              style={styles.radioItem}
              onPress={() => updateCropPreferences("farmingSeason", season)}
            >
              <View
                style={[
                  styles.radioCircle,
                  cropPreferences.farmingSeason === season &&
                    styles.radioCircleSelected,
                ]}
              >
                {cropPreferences.farmingSeason === season && (
                  <View style={styles.radioInner} />
                )}
              </View>
              <Text style={styles.radioLabel}>{season}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.inputLabel}>Irrigation Type</Text>
        <View
          style={[
            styles.pickerContainer,
            focusedField === "irrigationType" && styles.inputFocused,
          ]}
        >
          <Picker
            selectedValue={cropPreferences.irrigationType}
            style={styles.picker}
            onValueChange={(value) =>
              updateCropPreferences("irrigationType", value)
            }
            onFocus={() => setFocusedField("irrigationType")}
          >
            {irrigationTypes.map((type, index) => (
              <Picker.Item key={index} label={type} value={type} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.formGroup}>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() =>
            updateCropPreferences(
              "organicFarming",
              !cropPreferences.organicFarming
            )
          }
        >
          <View
            style={[
              styles.checkbox,
              cropPreferences.organicFarming && styles.checkboxSelected,
            ]}
          >
            {cropPreferences.organicFarming && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </View>
          <Text style={styles.checkboxLabel}>
            I'm interested in organic farming practices
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
        {/* Background */}
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
          {/* Header */}
          <Animated.View
            style={[
              styles.headerContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.logoContainer}>
              <Text style={styles.logoIcon}>🌾</Text>
            </View>
            <Text style={styles.appName}>Join Kisaan Sethu</Text>
            <Text style={styles.subtitle}>
              Create your farming companion account
            </Text>
          </Animated.View>

          {/* Step Indicator */}
          <Animated.View
            style={[
              styles.stepIndicatorContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {renderStepIndicator()}
          </Animated.View>

          {/* Form Card */}
          <Animated.View
            style={[
              styles.formCard,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            {/* Navigation Buttons */}
            <View style={styles.navigationContainer}>
              {currentStep > 1 && (
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={handleBack}
                >
                  <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[
                  styles.nextButton,
                  currentStep === 1 && styles.nextButtonFull,
                ]}
                onPress={handleNext}
                disabled={isLoading}
              >
                <Text style={styles.nextButtonText}>
                  {isLoading
                    ? "⏳ Creating..."
                    : currentStep === 3
                    ? "🚀 Create Account"
                    : "Next →"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.replace("/login")}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>

        {/* Success Modal */}
        <Modal
          visible={showSuccessModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowSuccessModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.successModal}>
              <Text style={styles.successIcon}>🎉</Text>
              <Text style={styles.successTitle}>Welcome to Kisaan Sethu!</Text>
              <Text style={styles.successMessage}>
                Your account has been created successfully. You're now part of
                the farming community!
              </Text>
              <TouchableOpacity
                style={styles.successButton}
                onPress={handleSuccessModalClose}
              >
                <Text style={styles.successButtonText}>Continue to Login</Text>
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
    backgroundColor: "rgba(30, 70, 32, 0.8)",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },

  // Header Styles
  headerContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  logoIcon: {
    fontSize: 40,
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#c8e6c9",
    textAlign: "center",
  },

  // Step Indicator Styles
  stepIndicatorContainer: {
    marginBottom: 20,
  },
  stepIndicator: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    padding: 20,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 2,
    marginBottom: 20,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 2,
  },
  stepsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stepItem: {
    alignItems: "center",
    flex: 1,
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  stepCircleActive: {
    backgroundColor: "#4CAF50",
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.7)",
  },
  stepNumberActive: {
    color: "white",
  },
  stepLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
  },
  stepLabelActive: {
    color: "white",
    fontWeight: "bold",
  },

  // Form Card Styles
  formCard: {
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    borderRadius: 25,
    padding: 25,
    elevation: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },

  // Step Container
  stepContainer: {
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
    textAlign: "center",
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 25,
  },

  // Form Group Styles
  formGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E7D32",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f8f9fa",
    borderRadius: 15,
    padding: 18,
    fontSize: 16,
    borderWidth: 2,
    borderColor: "#e9ecef",
    color: "#333",
  },
  inputFocused: {
    borderColor: "#4CAF50",
    backgroundColor: "white",
    elevation: 3,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  // Password Container
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#e9ecef",
    paddingHorizontal: 18,
    paddingVertical: 4,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 14,
  },
  eyeButton: {
    padding: 8,
  },
  eyeIcon: {
    fontSize: 20,
  },

  // Picker Container
  pickerContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#e9ecef",
    overflow: "hidden",
  },
  picker: {
    height: 55,
    color: "#333",
  },

  // Crops Grid
  cropsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  cropChip: {
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  cropChipSelected: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  cropChipText: {
    fontSize: 14,
    color: "#666",
  },
  cropChipTextSelected: {
    color: "white",
    fontWeight: "bold",
  },

  // Radio Group
  radioGroup: {
    flexDirection: "row",
    gap: 20,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#e9ecef",
    justifyContent: "center",
    alignItems: "center",
  },
  radioCircleSelected: {
    borderColor: "#4CAF50",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4CAF50",
  },
  radioLabel: {
    fontSize: 16,
    color: "#333",
  },

  // Checkbox
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#e9ecef",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  checkmark: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },

  // Navigation
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
    marginTop: 20,
  },
  backButton: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  backButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  nextButton: {
    flex: 2,
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: "center",
    elevation: 3,
  },
  nextButtonFull: {
    flex: 1,
  },
  nextButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  // Login Link
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
  },
  loginText: {
    color: "#666",
    fontSize: 16,
  },
  loginLink: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },

  // Success Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  successModal: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    width: "90%",
  },
  successIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
    textAlign: "center",
    marginBottom: 15,
  },
  successMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 25,
  },
  successButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
  },
  successButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
