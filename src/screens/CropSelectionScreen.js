import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function CropSelectionScreen() {
  const router = useRouter();
  const [selectedCrops, setSelectedCrops] = useState([]);
  const maxSelection = 8;

  // Comprehensive crop data with emojis and categories
  const cropData = [
    // Cereals
    {
      id: "wheat",
      name: "Wheat",
      emoji: "🌾",
      category: "Cereals",
      season: "Rabi",
    },
    {
      id: "rice",
      name: "Rice",
      emoji: "🌾",
      category: "Cereals",
      season: "Kharif",
    },
    {
      id: "maize",
      name: "Maize",
      emoji: "🌽",
      category: "Cereals",
      season: "Both",
    },
    {
      id: "barley",
      name: "Barley",
      emoji: "🌾",
      category: "Cereals",
      season: "Rabi",
    },
    {
      id: "oats",
      name: "Oats",
      emoji: "🌾",
      category: "Cereals",
      season: "Rabi",
    },
    {
      id: "millet",
      name: "Millet",
      emoji: "🌾",
      category: "Cereals",
      season: "Kharif",
    },

    // Pulses & Legumes
    {
      id: "bean",
      name: "Bean",
      emoji: "🫘",
      category: "Pulses",
      season: "Both",
    },
    {
      id: "chickpea",
      name: "Chickpea",
      emoji: "🫘",
      category: "Pulses",
      season: "Rabi",
    },
    {
      id: "lentil",
      name: "Lentil",
      emoji: "🫘",
      category: "Pulses",
      season: "Rabi",
    },
    {
      id: "soybean",
      name: "Soybean",
      emoji: "🫘",
      category: "Pulses",
      season: "Kharif",
    },
    { id: "pea", name: "Pea", emoji: "🟢", category: "Pulses", season: "Rabi" },
    {
      id: "black_gram",
      name: "Black Gram",
      emoji: "⚫",
      category: "Pulses",
      season: "Kharif",
    },

    // Vegetables
    {
      id: "tomato",
      name: "Tomato",
      emoji: "🍅",
      category: "Vegetables",
      season: "Both",
    },
    {
      id: "potato",
      name: "Potato",
      emoji: "🥔",
      category: "Vegetables",
      season: "Rabi",
    },
    {
      id: "onion",
      name: "Onion",
      emoji: "🧅",
      category: "Vegetables",
      season: "Both",
    },
    {
      id: "cabbage",
      name: "Cabbage",
      emoji: "🥬",
      category: "Vegetables",
      season: "Rabi",
    },
    {
      id: "carrot",
      name: "Carrot",
      emoji: "🥕",
      category: "Vegetables",
      season: "Rabi",
    },
    {
      id: "cauliflower",
      name: "Cauliflower",
      emoji: "🥦",
      category: "Vegetables",
      season: "Rabi",
    },
    {
      id: "brinjal",
      name: "Brinjal",
      emoji: "🍆",
      category: "Vegetables",
      season: "Both",
    },
    {
      id: "okra",
      name: "Okra",
      emoji: "🫒",
      category: "Vegetables",
      season: "Kharif",
    },
    {
      id: "bitter_gourd",
      name: "Bitter Gourd",
      emoji: "🥒",
      category: "Vegetables",
      season: "Kharif",
    },
    {
      id: "bottle_gourd",
      name: "Bottle Gourd",
      emoji: "🥒",
      category: "Vegetables",
      season: "Kharif",
    },

    // Fruits
    {
      id: "banana",
      name: "Banana",
      emoji: "🍌",
      category: "Fruits",
      season: "Year-round",
    },
    {
      id: "mango",
      name: "Mango",
      emoji: "🥭",
      category: "Fruits",
      season: "Summer",
    },
    {
      id: "apple",
      name: "Apple",
      emoji: "🍎",
      category: "Fruits",
      season: "Winter",
    },
    {
      id: "grapes",
      name: "Grapes",
      emoji: "🍇",
      category: "Fruits",
      season: "Both",
    },
    {
      id: "orange",
      name: "Orange",
      emoji: "🍊",
      category: "Fruits",
      season: "Winter",
    },
    {
      id: "pomegranate",
      name: "Pomegranate",
      emoji: "🍎",
      category: "Fruits",
      season: "Both",
    },

    // Cash Crops
    {
      id: "cotton",
      name: "Cotton",
      emoji: "☁️",
      category: "Cash Crops",
      season: "Kharif",
    },
    {
      id: "sugarcane",
      name: "Sugarcane",
      emoji: "🎋",
      category: "Cash Crops",
      season: "Both",
    },
    {
      id: "jute",
      name: "Jute",
      emoji: "🧶",
      category: "Cash Crops",
      season: "Kharif",
    },
    {
      id: "tobacco",
      name: "Tobacco",
      emoji: "🚬",
      category: "Cash Crops",
      season: "Rabi",
    },

    // Spices & Herbs
    {
      id: "chili",
      name: "Chili",
      emoji: "🌶️",
      category: "Spices",
      season: "Both",
    },
    {
      id: "turmeric",
      name: "Turmeric",
      emoji: "🟡",
      category: "Spices",
      season: "Kharif",
    },
    {
      id: "coriander",
      name: "Coriander",
      emoji: "🌿",
      category: "Spices",
      season: "Rabi",
    },
    {
      id: "cumin",
      name: "Cumin",
      emoji: "🟤",
      category: "Spices",
      season: "Rabi",
    },
    {
      id: "fenugreek",
      name: "Fenugreek",
      emoji: "🌱",
      category: "Spices",
      season: "Rabi",
    },

    // Oil Seeds
    {
      id: "mustard",
      name: "Mustard",
      emoji: "🌻",
      category: "Oil Seeds",
      season: "Rabi",
    },
    {
      id: "sunflower",
      name: "Sunflower",
      emoji: "🌻",
      category: "Oil Seeds",
      season: "Both",
    },
    {
      id: "groundnut",
      name: "Groundnut",
      emoji: "🥜",
      category: "Oil Seeds",
      season: "Kharif",
    },
    {
      id: "sesame",
      name: "Sesame",
      emoji: "🌰",
      category: "Oil Seeds",
      season: "Kharif",
    },
    {
      id: "safflower",
      name: "Safflower",
      emoji: "🌻",
      category: "Oil Seeds",
      season: "Rabi",
    },
  ];

  const toggleCropSelection = (cropId) => {
    if (selectedCrops.includes(cropId)) {
      setSelectedCrops(selectedCrops.filter((id) => id !== cropId));
    } else {
      if (selectedCrops.length < maxSelection) {
        setSelectedCrops([...selectedCrops, cropId]);
      } else {
        Alert.alert(
          "Selection Limit Reached",
          `You can only select up to ${maxSelection} crops.`
        );
      }
    }
  };

  const handleSave = () => {
    if (selectedCrops.length === 0) {
      Alert.alert(
        "No Crops Selected",
        "Please select at least one crop to continue."
      );
      return;
    }

    const selectedCropNames = selectedCrops
      .map((id) => cropData.find((crop) => crop.id === id)?.name)
      .join(", ");

    Alert.alert("Crops Saved!", `Selected crops: ${selectedCropNames}`, [
      {
        text: "OK",
        onPress: () => router.back(),
      },
    ]);
  };

  const groupedCrops = cropData.reduce((groups, crop) => {
    const category = crop.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(crop);
    return groups;
  }, {});

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Crops</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Subtitle */}
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>
            Select up to {maxSelection} crops you are interested in
          </Text>
          <Text style={styles.selectionCounter}>
            {selectedCrops.length}/{maxSelection}
          </Text>
        </View>

        {/* Selected Crops Preview */}
        {selectedCrops.length > 0 && (
          <View style={styles.selectedPreview}>
            <Text style={styles.selectedTitle}>Selected Crops:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.selectedContainer}>
                {selectedCrops.map((cropId) => {
                  const crop = cropData.find((c) => c.id === cropId);
                  return (
                    <View key={cropId} style={styles.selectedItem}>
                      <Text style={styles.selectedEmoji}>{crop.emoji}</Text>
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => toggleCropSelection(cropId)}
                      >
                        <Text style={styles.removeButtonText}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Crop Categories */}
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {Object.entries(groupedCrops).map(([category, crops]) => (
            <View key={category} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>{category}</Text>
              <View style={styles.cropsGrid}>
                {crops.map((crop) => {
                  const isSelected = selectedCrops.includes(crop.id);
                  return (
                    <TouchableOpacity
                      key={crop.id}
                      style={[
                        styles.cropCard,
                        isSelected && styles.cropCardSelected,
                      ]}
                      onPress={() => toggleCropSelection(crop.id)}
                      activeOpacity={0.7}
                    >
                      {isSelected && (
                        <View style={styles.selectedBadge}>
                          <Text style={styles.selectedBadgeText}>✓</Text>
                        </View>
                      )}
                      <Text style={styles.cropEmoji}>{crop.emoji}</Text>
                      <Text style={styles.cropName}>{crop.name}</Text>
                      <Text style={styles.cropSeason}>{crop.season}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Save Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              selectedCrops.length === 0 && styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={selectedCrops.length === 0}
          >
            <Text
              style={[
                styles.saveButtonText,
                selectedCrops.length === 0 && styles.saveButtonTextDisabled,
              ]}
            >
              Save ({selectedCrops.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },

  // Header Styles
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "white",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 20,
    color: "#333",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  placeholder: {
    width: 40,
  },

  // Subtitle Styles
  subtitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    flex: 1,
  },
  selectionCounter: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
  },

  // Selected Preview Styles
  selectedPreview: {
    backgroundColor: "#E8F5E8",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  selectedTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 10,
  },
  selectedContainer: {
    flexDirection: "row",
    gap: 10,
  },
  selectedItem: {
    width: 60,
    height: 60,
    backgroundColor: "white",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#4CAF50",
    position: "relative",
  },
  selectedEmoji: {
    fontSize: 24,
  },
  removeButton: {
    position: "absolute",
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    backgroundColor: "#F44336",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },

  // Scroll Container
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // Category Styles
  categorySection: {
    marginVertical: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 15,
    paddingLeft: 5,
  },
  cropsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  // Crop Card Styles
  cropCard: {
    width: (width - 50) / 3,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: "#e9ecef",
    position: "relative",
  },
  cropCardSelected: {
    borderColor: "#4CAF50",
    backgroundColor: "#f8fff8",
  },
  selectedBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    width: 24,
    height: 24,
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  selectedBadgeText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  cropEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  cropName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 4,
  },
  cropSeason: {
    fontSize: 11,
    color: "#666",
    textAlign: "center",
  },

  // Footer Styles
  footer: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  saveButton: {
    backgroundColor: "#007BFF",
    borderRadius: 25,
    paddingVertical: 18,
    alignItems: "center",
    elevation: 3,
  },
  saveButtonDisabled: {
    backgroundColor: "#cccccc",
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  saveButtonTextDisabled: {
    color: "#999",
  },
});
