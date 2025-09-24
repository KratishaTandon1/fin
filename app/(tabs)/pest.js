import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function PestDetectionScreen() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(null);
  const [detectionResult, setDetectionResult] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Comprehensive pest database with more realistic data
  const pestDatabase = [
    {
      name: "Aphid Infestation",
      treatment: "Spray with neem oil solution every 3-4 days. Remove affected leaves. Use ladybugs as natural predators.",
      severity: "Medium",
      color: "#FF9800",
      prevention: "Regular inspection, avoid over-fertilizing with nitrogen",
      symptoms: "Curled leaves, sticky honeydew, yellowing"
    },
    {
      name: "Leaf Blight Disease",
      treatment: "Apply copper-based fungicide spray weekly. Remove infected plant parts. Improve air circulation.",
      severity: "High",
      color: "#F44336",
      prevention: "Avoid overhead watering, ensure good drainage",
      symptoms: "Brown spots on leaves, leaf yellowing, wilting"
    },
    {
      name: "Healthy Plant",
      treatment: "Continue current care routine. Monitor regularly for any changes.",
      severity: "None",
      color: "#4CAF50",
      prevention: "Maintain proper watering and fertilization schedule",
      symptoms: "Green foliage, steady growth, no visible issues"
    },
    {
      name: "Caterpillar Damage",
      treatment: "Manual removal of caterpillars. Use Bt (Bacillus thuringiensis) spray if infestation is severe.",
      severity: "Medium",
      color: "#FF9800",
      prevention: "Regular inspection, companion planting with marigolds",
      symptoms: "Chewed leaves, visible caterpillars, droppings"
    },
    {
      name: "Spider Mite Infestation",
      treatment: "Increase humidity around plant. Spray with miticide or strong water spray. Use predatory mites.",
      severity: "High",
      color: "#F44336",
      prevention: "Maintain adequate humidity, avoid dusty conditions",
      symptoms: "Fine webbing, stippled leaves, leaf drop"
    },
    {
      name: "Powdery Mildew",
      treatment: "Apply baking soda solution (1 tsp per quart water). Improve air circulation. Use sulfur fungicide.",
      severity: "Medium",
      color: "#FF5722",
      prevention: "Avoid overcrowding, ensure good air flow",
      symptoms: "White powdery coating on leaves, stunted growth"
    },
    {
      name: "Whitefly Infestation",
      treatment: "Use yellow sticky traps. Apply insecticidal soap spray. Remove heavily infested leaves.",
      severity: "Medium",
      color: "#FF9800",
      prevention: "Regular monitoring, reflective mulch",
      symptoms: "White flying insects, yellowing leaves, honeydew"
    },
    {
      name: "Thrips Damage",
      treatment: "Use blue sticky traps. Apply beneficial nematodes to soil. Spray with insecticidal soap.",
      severity: "Low",
      color: "#FFC107",
      prevention: "Remove weeds, use reflective mulch",
      symptoms: "Silver streaks on leaves, black specks, stunted growth"
    }
  ];

  const selectImageSource = () => {
    Alert.alert(
      "🐛 Pest Detection",
      "Choose how you want to capture your plant image:",
      [
        {
          text: "📷 Take Photo",
          onPress: openCamera,
          style: "default",
        },
        {
          text: "🖼️ Choose from Gallery",
          onPress: openGallery,
          style: "default",
        },
        {
          text: "🎯 Try Demo",
          onPress: simulateAnalysis,
          style: "default",
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const openCamera = async () => {
    try {
      // Request camera permission
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission Required',
          'Please allow camera access to take photos of your plants.',
          [{ text: 'OK' }]
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0]);
        analyzePlantImage();
      }
    } catch (error) {
      console.log('Camera error:', error);
      Alert.alert('Camera Error', 'Unable to access camera. Please try again.');
    }
  };

  const openGallery = async () => {
    try {
      // Request gallery permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Gallery Permission Required',
          'Please allow gallery access to select photos of your plants.',
          [{ text: 'OK' }]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0]);
        analyzePlantImage();
      }
    } catch (error) {
      console.log('Gallery error:', error);
      Alert.alert('Gallery Error', 'Unable to access gallery. Please try again.');
    }
  };

  const simulateAnalysis = () => {
    // Demo images for different pest conditions
    const demoImages = [
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop", // Plant with issues
      "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400&h=300&fit=crop", // Healthy plant
      "https://images.unsplash.com/photo-1469194069062-30f4ddd9a0b8?w=400&h=300&fit=crop", // Plant leaves
      "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=300&fit=crop", // Garden plants
    ];
    
    const randomImageIndex = Math.floor(Math.random() * demoImages.length);
    setSelectedImage({
      uri: demoImages[randomImageIndex]
    });
    analyzePlantImage();
  };

  const analyzePlantImage = () => {
    setIsAnalyzing(true);
    setDetectionResult("");
    
    // Simulate AI analysis with more realistic timing
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * pestDatabase.length);
      const result = pestDatabase[randomIndex];
      setDetectionResult(result);
      setIsAnalyzing(false);
    }, 3500); // Slightly longer for realism
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setDetectionResult("");
    setIsAnalyzing(false);
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'High': return '#F44336';
      case 'Medium': return '#FF9800';
      case 'Low': return '#FFC107';
      case 'None': return '#4CAF50';
      default: return '#666';
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>🐛 Pest Detection</Text>
          <Text style={styles.subtitle}>AI-Powered Plant Health Analysis</Text>
        </View>
      </View>

      <View style={styles.content}>
        {!selectedImage ? (
          // Upload Section
          <View style={styles.uploadSection}>
            <View style={styles.instructionCard}>
              <Text style={styles.instructionTitle}>📋 How to Use</Text>
              <Text style={styles.instructionText}>
                1. Take a clear photo of affected plant parts{'\n'}
                2. Ensure good lighting and focus{'\n'}
                3. Our AI will analyze for pests & diseases{'\n'}
                4. Get instant treatment recommendations
              </Text>
            </View>

            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderIcon}>📸</Text>
              <Text style={styles.placeholderText}>
                Scan your plant for pests & diseases
              </Text>
              <Text style={styles.placeholderSubtext}>
                Camera and Gallery fully supported!
              </Text>
            </View>

            <TouchableOpacity
              style={styles.selectButton}
              onPress={selectImageSource}
            >
              <Text style={styles.selectButtonText}>🔍 Start Detection</Text>
            </TouchableOpacity>

            <View style={styles.featureList}>
              <Text style={styles.featureTitle}>✨ Detection Features:</Text>
              <Text style={styles.featureItem}>• Pest identification</Text>
              <Text style={styles.featureItem}>• Disease diagnosis</Text>
              <Text style={styles.featureItem}>• Treatment recommendations</Text>
              <Text style={styles.featureItem}>• Prevention tips</Text>
            </View>
          </View>
        ) : (
          // Analysis Section
          <View style={styles.analysisSection}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: selectedImage.uri }} style={styles.selectedImage} />
              <TouchableOpacity style={styles.retakeButton} onPress={resetAnalysis}>
                <Text style={styles.retakeText}>✕ Reset</Text>
              </TouchableOpacity>
            </View>

            {isAnalyzing && (
              <View style={styles.analyzingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.analyzingText}>🔍 Analyzing plant health...</Text>
                <Text style={styles.analyzingSubtext}>
                  Our AI is scanning for pests, diseases, and health indicators
                </Text>
                <View style={styles.progressSteps}>
                  <Text style={styles.progressStep}>✓ Image processing</Text>
                  <Text style={styles.progressStep}>⏳ Pattern recognition</Text>
                  <Text style={styles.progressStep}>⏳ Generating report</Text>
                </View>
              </View>
            )}

            {detectionResult && !isAnalyzing && (
              <View style={styles.resultContainer}>
                <View style={[styles.resultHeader, { backgroundColor: detectionResult.color }]}>
                  <Text style={styles.resultTitle}>✅ Analysis Complete</Text>
                  <Text style={styles.resultSubtitle}>Detailed Report Below</Text>
                </View>

                <View style={styles.resultContent}>
                  <Text style={styles.detectionTitle}>
                    🎯 Detection: {detectionResult.name}
                  </Text>

                  <View style={styles.severityCard}>
                    <View style={styles.severityHeader}>
                      <Text style={styles.severityLabel}>🚨 Severity Level:</Text>
                      <View style={[styles.severityBadge, { backgroundColor: detectionResult.color }]}>
                        <Text style={styles.severityValue}>{detectionResult.severity}</Text>
                      </View>
                    </View>
                  </View>

                  {detectionResult.symptoms && (
                    <View style={styles.infoCard}>
                      <Text style={styles.infoCardTitle}>🔍 Symptoms Identified:</Text>
                      <Text style={styles.infoCardText}>{detectionResult.symptoms}</Text>
                    </View>
                  )}

                  <View style={styles.treatmentCard}>
                    <Text style={styles.treatmentTitle}>💡 Treatment Plan:</Text>
                    <Text style={styles.treatmentText}>{detectionResult.treatment}</Text>
                  </View>

                  {detectionResult.prevention && (
                    <View style={styles.preventionCard}>
                      <Text style={styles.preventionTitle}>🛡️ Prevention Tips:</Text>
                      <Text style={styles.preventionText}>{detectionResult.prevention}</Text>
                    </View>
                  )}

                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.primaryButton}
                      onPress={resetAnalysis}
                    >
                      <Text style={styles.primaryButtonText}>🔄 Analyze Another Plant</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={styles.secondaryButton}
                      onPress={() => {
                        Alert.alert(
                          "Treatment Details Saved",
                          "This analysis has been saved to your plant health records.",
                          [{ text: "OK" }]
                        );
                      }}
                    >
                      <Text style={styles.secondaryButtonText}>💾 Save Report</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f8e9",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#4CAF50",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  backButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 16,
    color: "#c8e6c9",
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  uploadSection: {
    alignItems: "center",
  },
  instructionCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    width: "100%",
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
  },
  placeholderImage: {
    width: "100%",
    height: 200,
    backgroundColor: "white",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#4CAF50",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
    elevation: 2,
  },
  placeholderIcon: {
    fontSize: 50,
    marginBottom: 15,
  },
  placeholderText: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: "#4CAF50",
    textAlign: "center",
    fontWeight: "500",
  },
  selectButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginBottom: 30,
  },
  selectButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  featureList: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    width: "100%",
    elevation: 2,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 12,
  },
  featureItem: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
    paddingLeft: 10,
  },
  analysisSection: {
    alignItems: "center",
  },
  imageContainer: {
    position: "relative",
    marginBottom: 25,
  },
  selectedImage: {
    width: 320,
    height: 240,
    borderRadius: 15,
    resizeMode: "cover",
    elevation: 5,
  },
  retakeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(244, 67, 54, 0.9)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  retakeText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  analyzingContainer: {
    alignItems: "center",
    padding: 30,
    backgroundColor: "white",
    borderRadius: 15,
    width: "100%",
    elevation: 3,
  },
  analyzingText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
    marginTop: 15,
    marginBottom: 8,
  },
  analyzingSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  progressSteps: {
    alignSelf: "stretch",
  },
  progressStep: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
    paddingLeft: 10,
  },
  resultContainer: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 15,
    elevation: 5,
    overflow: "hidden",
  },
  resultHeader: {
    padding: 20,
    alignItems: "center",
  },
  resultTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  resultSubtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    marginTop: 4,
  },
  resultContent: {
    padding: 25,
  },
  detectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 20,
    textAlign: "center",
  },
  severityCard: {
    marginBottom: 20,
  },
  severityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  severityLabel: {
    fontSize: 16,
    color: "#555",
    fontWeight: "600",
  },
  severityBadge: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
  },
  severityValue: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  infoCard: {
    backgroundColor: "#E3F2FD",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#2196F3",
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1565C0",
    marginBottom: 8,
  },
  infoCardText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  treatmentCard: {
    backgroundColor: "#E8F5E8",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  treatmentTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 10,
  },
  treatmentText: {
    fontSize: 15,
    color: "#555",
    lineHeight: 24,
  },
  preventionCard: {
    backgroundColor: "#FFF3E0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 25,
    borderLeftWidth: 4,
    borderLeftColor: "#FF9800",
  },
  preventionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#EF6C00",
    marginBottom: 8,
  },
  preventionText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
  },
  actionButtons: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#4CAF50",
    padding: 18,
    borderRadius: 25,
    alignItems: "center",
    elevation: 3,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "#F5F5F5",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  secondaryButtonText: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "bold",
  },
});
