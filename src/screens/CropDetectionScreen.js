import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function CropDetectionScreen() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [detectionResult, setDetectionResult] = useState(null);

  // Demo crop identification results
  const cropIdentificationDatabase = {
    'wheat': {
      name: 'Wheat',
      emoji: '🌾',
      confidence: 92,
      description: 'Winter cereal grain crop',
      characteristics: [
        'Long narrow leaves',
        'Golden brown when mature',
        'Grain heads at top',
        'Height: 60-120 cm'
      ],
      growthStage: 'Mature/Ready for harvest',
      healthStatus: 'Healthy',
      recommendations: [
        'Harvest when moisture content is 12-14%',
        'Check for pest damage before harvesting',
        'Store in dry, well-ventilated area'
      ]
    },
    'rice': {
      name: 'Rice',
      emoji: '🌾',
      confidence: 89,
      description: 'Staple cereal grain crop',
      characteristics: [
        'Broad green leaves',
        'Growing in water',
        'Panicle grain heads',
        'Height: 80-150 cm'
      ],
      growthStage: 'Flowering stage',
      healthStatus: 'Good',
      recommendations: [
        'Maintain 2-3 cm water level',
        'Apply phosphorus fertilizer',
        'Monitor for blast disease'
      ]
    },
    'maize': {
      name: 'Maize/Corn',
      emoji: '🌽',
      confidence: 95,
      description: 'Large grain cereal crop',
      characteristics: [
        'Tall with large leaves',
        'Yellow kernels in rows',
        'Silk tassels at top',
        'Height: 150-300 cm'
      ],
      growthStage: 'Grain filling stage',
      healthStatus: 'Excellent',
      recommendations: [
        'Continue regular watering',
        'Apply nitrogen fertilizer',
        'Protect from birds and pests'
      ]
    }
  };

  const pickImage = async (source) => {
    try {
      let result;
      
      if (source === 'camera') {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          Alert.alert('Permission needed', 'Camera permission is required to take photos');
          return;
        }
        
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
      } else {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          Alert.alert('Permission needed', 'Gallery permission is required to select photos');
          return;
        }
        
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        setDetectionResult(null);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const analyzeCrop = async () => {
    if (!selectedImage) {
      Alert.alert('No Image', 'Please select an image first');
      return;
    }

    setAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const crops = Object.keys(cropIdentificationDatabase);
      const randomCrop = crops[Math.floor(Math.random() * crops.length)];
      const result = cropIdentificationDatabase[randomCrop];
      
      setDetectionResult(result);
      setAnalyzing(false);
    }, 3000);
  };

  const showImageOptions = () => {
    Alert.alert(
      'Select Image Source',
      'Choose how you want to add an image',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: '📷 Camera', onPress: () => pickImage('camera') },
        { text: '🖼️ Gallery', onPress: () => pickImage('gallery') },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      <View style={styles.header}>
        <Text style={styles.title}>📷 Crop Detection</Text>
        <Text style={styles.subtitle}>AI-powered crop identification</Text>
      </View>

      <View style={styles.imageSection}>
        <TouchableOpacity style={styles.imagePickerButton} onPress={showImageOptions}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderIcon}>📸</Text>
              <Text style={styles.imagePlaceholderText}>Tap to add crop image</Text>
            </View>
          )}
        </TouchableOpacity>

        {selectedImage && (
          <TouchableOpacity 
            style={styles.analyzeButton} 
            onPress={analyzeCrop}
            disabled={analyzing}
          >
            {analyzing ? (
              <View style={styles.analyzingContainer}>
                <ActivityIndicator color="white" size="small" />
                <Text style={styles.analyzeButtonText}>  Analyzing...</Text>
              </View>
            ) : (
              <Text style={styles.analyzeButtonText}>🔍 Analyze Crop</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      {detectionResult && (
        <View style={styles.resultContainer}>
          <View style={styles.resultHeader}>
            <Text style={styles.resultEmoji}>{detectionResult.emoji}</Text>
            <View style={styles.resultInfo}>
              <Text style={styles.resultName}>{detectionResult.name}</Text>
              <Text style={styles.resultConfidence}>
                Confidence: {detectionResult.confidence}%
              </Text>
            </View>
          </View>

          <Text style={styles.resultDescription}>{detectionResult.description}</Text>

          <View style={styles.resultSection}>
            <Text style={styles.resultSectionTitle}>🔍 Identified Characteristics:</Text>
            {detectionResult.characteristics.map((char, index) => (
              <Text key={index} style={styles.resultItem}>• {char}</Text>
            ))}
          </View>

          <View style={styles.resultSection}>
            <Text style={styles.resultSectionTitle}>📈 Growth Stage:</Text>
            <Text style={styles.resultItem}>{detectionResult.growthStage}</Text>
          </View>

          <View style={styles.resultSection}>
            <Text style={styles.resultSectionTitle}>🌱 Health Status:</Text>
            <Text style={[
              styles.resultItem,
              detectionResult.healthStatus === 'Excellent' && styles.healthExcellent,
              detectionResult.healthStatus === 'Good' && styles.healthGood,
              detectionResult.healthStatus === 'Healthy' && styles.healthHealthy,
            ]}>
              {detectionResult.healthStatus}
            </Text>
          </View>

          <View style={styles.resultSection}>
            <Text style={styles.resultSectionTitle}>💡 Recommendations:</Text>
            {detectionResult.recommendations.map((rec, index) => (
              <Text key={index} style={styles.resultItem}>• {rec}</Text>
            ))}
          </View>
        </View>
      )}

      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>📝 How to use:</Text>
        <Text style={styles.instructionItem}>1. Take a clear photo of your crop</Text>
        <Text style={styles.instructionItem}>2. Ensure good lighting conditions</Text>
        <Text style={styles.instructionItem}>3. Focus on the main plant features</Text>
        <Text style={styles.instructionItem}>4. Tap "Analyze Crop" for AI identification</Text>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#FF9800',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  imageSection: {
    padding: 20,
    alignItems: 'center',
  },
  imagePickerButton: {
    width: '100%',
    aspectRatio: 4/3,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3,
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  imagePlaceholderIcon: {
    fontSize: 50,
    marginBottom: 10,
  },
  imagePlaceholderText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  analyzeButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
    elevation: 3,
  },
  analyzeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  analyzingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultContainer: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    elevation: 3,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  resultEmoji: {
    fontSize: 40,
    marginRight: 15,
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  resultConfidence: {
    fontSize: 16,
    color: '#666',
    marginTop: 2,
  },
  resultDescription: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  resultSection: {
    marginBottom: 15,
  },
  resultSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  resultItem: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 4,
  },
  healthExcellent: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  healthGood: {
    color: '#8BC34A',
    fontWeight: 'bold',
  },
  healthHealthy: {
    color: '#66BB6A',
    fontWeight: 'bold',
  },
  instructionsContainer: {
    backgroundColor: '#E3F2FD',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 10,
  },
  instructionItem: {
    fontSize: 14,
    color: '#1976D2',
    marginBottom: 5,
  },
});
