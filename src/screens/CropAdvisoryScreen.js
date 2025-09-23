import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function CropAdvisoryScreen() {
  const { user } = useAuth();
  const [selectedCrop, setSelectedCrop] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Crop database with detailed recommendations
  const cropDatabase = {
    'wheat': {
      name: 'Wheat 🌾',
      season: 'Rabi (Winter)',
      sowingTime: 'November - December',
      harvestTime: 'April - May',
      waterRequirement: 'Medium (400-500mm)',
      soilType: 'Well-drained loamy soil',
      fertilizer: 'NPK 120:60:40 kg/hectare',
      diseases: ['Rust', 'Bunt', 'Smut'],
      tips: [
        'Sow when temperature is 15-20°C',
        'Maintain proper spacing between rows',
        'Apply irrigation at crown root initiation',
        'Harvest when moisture content is 12-14%'
      ]
    },
    'rice': {
      name: 'Rice 🌾',
      season: 'Kharif (Monsoon)',
      sowingTime: 'June - July',
      harvestTime: 'October - November',
      waterRequirement: 'High (1200-1500mm)',
      soilType: 'Clay or clay loam',
      fertilizer: 'NPK 80:40:40 kg/hectare',
      diseases: ['Blast', 'Bacterial Blight', 'Sheath Blight'],
      tips: [
        'Transplant 20-25 day old seedlings',
        'Maintain 2-3 cm water level',
        'Apply nitrogen in 3 splits',
        'Drain field 10 days before harvest'
      ]
    },
    'maize': {
      name: 'Maize 🌽',
      season: 'Kharif & Rabi',
      sowingTime: 'June-July / February-March',
      harvestTime: 'September-October / May-June',
      waterRequirement: 'Medium (600-800mm)',
      soilType: 'Well-drained fertile soil',
      fertilizer: 'NPK 120:60:60 kg/hectare',
      diseases: ['Downy Mildew', 'Rust', 'Borer'],
      tips: [
        'Plant at 60cm x 20cm spacing',
        'Apply mulch to retain moisture',
        'Side dress with nitrogen at knee height',
        'Harvest when kernels reach physiological maturity'
      ]
    },
    'cotton': {
      name: 'Cotton ☁️',
      season: 'Kharif',
      sowingTime: 'April - June',
      harvestTime: 'October - January',
      waterRequirement: 'Medium (700-900mm)',
      soilType: 'Black cotton soil',
      fertilizer: 'NPK 100:50:50 kg/hectare',
      diseases: ['Bollworm', 'Whitefly', 'Jassids'],
      tips: [
        'Maintain plant population 50,000-60,000/hectare',
        'Apply growth regulators at squaring stage',
        'Regular monitoring for pest attacks',
        'Pick cotton in early morning hours'
      ]
    },
    'tomato': {
      name: 'Tomato 🍅',
      season: 'Year-round (protected cultivation)',
      sowingTime: 'July-August / January-February',
      harvestTime: '90-120 days after transplanting',
      waterRequirement: 'Medium (400-600mm)',
      soilType: 'Well-drained sandy loam',
      fertilizer: 'NPK 150:100:100 kg/hectare',
      diseases: ['Early Blight', 'Late Blight', 'Wilt'],
      tips: [
        'Transplant 4-5 week old seedlings',
        'Provide support with stakes or cages',
        'Apply mulch around plants',
        'Harvest when fruits are fully mature but firm'
      ]
    }
  };

  const availableCrops = Object.keys(cropDatabase);

  useEffect(() => {
    if (user?.primaryCrops && user.primaryCrops.length > 0) {
      const userCrop = user.primaryCrops[0].toLowerCase().replace(/[^\w]/g, '');
      if (cropDatabase[userCrop]) {
        setSelectedCrop(userCrop);
        generateRecommendations(userCrop);
      }
    }
  }, [user]);

  const generateRecommendations = (crop) => {
    if (!cropDatabase[crop]) return;
    
    setLoading(true);
    
    setTimeout(() => {
      const cropData = cropDatabase[crop];
      const currentMonth = new Date().getMonth() + 1;
      
      let seasonalAdvice = [];
      
      if (crop === 'wheat' && (currentMonth >= 10 || currentMonth <= 2)) {
        seasonalAdvice.push('🌾 Perfect time for wheat cultivation!');
        seasonalAdvice.push('🌡️ Current weather is ideal for sowing');
      } else if (crop === 'rice' && currentMonth >= 6 && currentMonth <= 8) {
        seasonalAdvice.push('🌾 Monsoon season - ideal for rice cultivation');
        seasonalAdvice.push('🌧️ Make use of monsoon rains');
      }
      
      setRecommendations([
        {
          category: 'Seasonal Advice',
          items: seasonalAdvice.length ? seasonalAdvice : ['Check seasonal calendar for best timing']
        },
        {
          category: 'Cultivation Details',
          items: [
            `🗓️ Sowing Time: ${cropData.sowingTime}`,
            `🗓️ Harvest Time: ${cropData.harvestTime}`,
            `💧 Water Requirement: ${cropData.waterRequirement}`,
            `🌱 Soil Type: ${cropData.soilType}`
          ]
        },
        {
          category: 'Fertilizer Recommendation',
          items: [`💊 ${cropData.fertilizer}`]
        },
        {
          category: 'Disease Management',
          items: cropData.diseases.map(disease => `🦠 Watch for: ${disease}`)
        },
        {
          category: 'Expert Tips',
          items: cropData.tips.map(tip => `💡 ${tip}`)
        }
      ]);
      
      setLoading(false);
    }, 1000);
  };

  const handleCropSelection = (crop) => {
    setSelectedCrop(crop);
    generateRecommendations(crop);
  };

  const filteredCrops = availableCrops.filter(crop =>
    cropDatabase[crop].name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      <View style={styles.header}>
        <Text style={styles.title}>📋 Crop Advisory</Text>
        <Text style={styles.subtitle}>Expert recommendations for your crops</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for crops..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.cropSelectionContainer}>
        <Text style={styles.sectionTitle}>Select Crop:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filteredCrops.map((crop) => (
            <TouchableOpacity
              key={crop}
              style={[
                styles.cropButton,
                selectedCrop === crop && styles.selectedCropButton
              ]}
              onPress={() => handleCropSelection(crop)}
            >
              <Text style={[
                styles.cropButtonText,
                selectedCrop === crop && styles.selectedCropButtonText
              ]}>
                {cropDatabase[crop].name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {user?.primaryCrops && (
        <View style={styles.userCropsContainer}>
          <Text style={styles.userCropsTitle}>👤 Your Registered Crops:</Text>
          <View style={styles.userCropsRow}>
            {user.primaryCrops.slice(0, 3).map((crop, index) => (
              <View key={index} style={styles.userCropTag}>
                <Text style={styles.userCropText}>{crop}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Generating recommendations...</Text>
        </View>
      )}

      {!loading && recommendations.length > 0 && (
        <View style={styles.recommendationsContainer}>
          <Text style={styles.recommendationsTitle}>
            📋 Recommendations for {cropDatabase[selectedCrop]?.name}
          </Text>
          
          {recommendations.map((section, index) => (
            <View key={index} style={styles.recommendationSection}>
              <Text style={styles.recommendationSectionTitle}>
                {section.category}
              </Text>
              {section.items.map((item, itemIndex) => (
                <View key={itemIndex} style={styles.recommendationItem}>
                  <Text style={styles.recommendationText}>{item}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      )}

      <View style={styles.quickActionsContainer}>
        <Text style={styles.quickActionsTitle}>⚡ Quick Actions</Text>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => Alert.alert('Feature Coming Soon', 'Weather-based recommendations will be available soon!')}
        >
          <Text style={styles.actionButtonText}>🌤️ Weather-Based Advice</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => Alert.alert('Feature Coming Soon', 'Market price integration coming soon!')}
        >
          <Text style={styles.actionButtonText}>💰 Market Price Analysis</Text>
        </TouchableOpacity>
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
    backgroundColor: '#4CAF50',
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
    color: '#c8e6c9',
  },
  searchContainer: {
    padding: 15,
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cropSelectionContainer: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
  },
  cropButton: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  selectedCropButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  cropButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  selectedCropButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  userCropsContainer: {
    backgroundColor: '#E8F5E8',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  userCropsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
  },
  userCropsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  userCropTag: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  userCropText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 30,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  recommendationsContainer: {
    margin: 15,
  },
  recommendationsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 15,
  },
  recommendationSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  recommendationSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 5,
  },
  recommendationItem: {
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  quickActionsContainer: {
    margin: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    elevation: 2,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 15,
  },
  actionButton: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '600',
  },
});
