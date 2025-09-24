import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function ProfitCalculatorScreen() {
  const router = useRouter();
  const [seedCost, setSeedCost] = useState("");
  const [fertilizerCost, setFertilizerCost] = useState("");
  const [pesticideCost, setPesticideCost] = useState("");
  const [labourCost, setLabourCost] = useState("");
  const [otherCost, setOtherCost] = useState("");
  const [totalInitialCost, setTotalInitialCost] = useState(null);
  const [sellingPrice, setSellingPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [profit, setProfit] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleCalculateInitialCost = () => {
    const total =
      parseFloat(seedCost || 0) +
      parseFloat(fertilizerCost || 0) +
      parseFloat(pesticideCost || 0) +
      parseFloat(labourCost || 0) +
      parseFloat(otherCost || 0);
    setTotalInitialCost(total);
    setProfit(null);
    setMessage({ text: "Initial cost calculated successfully! ✅", type: "success" });
    
    // Clear message after 3 seconds
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const handleCalculateProfit = () => {
    if (totalInitialCost === null) {
      setMessage({ text: "Please calculate the initial cost first. ⚠️", type: "error" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      return;
    }
    const sellingPriceFloat = parseFloat(sellingPrice || 0);
    const quantityFloat = parseFloat(quantity || 0);

    if (sellingPriceFloat <= 0 || quantityFloat <= 0) {
      setMessage({
        text: "Selling price and quantity must be greater than zero. ❌",
        type: "error",
      });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      return;
    }

    const totalRevenue = sellingPriceFloat * quantityFloat;
    const totalProfit = totalRevenue - totalInitialCost;
    setProfit(totalProfit);
    setMessage({ text: "Profit calculated successfully! 🎉", type: "success" });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const handleReset = () => {
    Alert.alert(
      "Reset All Fields",
      "Are you sure you want to reset all calculations?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            setSeedCost("");
            setFertilizerCost("");
            setPesticideCost("");
            setLabourCost("");
            setOtherCost("");
            setTotalInitialCost(null);
            setSellingPrice("");
            setQuantity("");
            setProfit(null);
            setMessage({ text: "All fields have been reset. 🔄", type: "success" });
            setTimeout(() => setMessage({ text: "", type: "" }), 3000);
          },
        },
      ]
    );
  };

  const InputField = ({ label, value, onChange, placeholder, icon }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{icon} {label}</Text>
      <TextInput
        style={styles.textInput}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#999"
        keyboardType="numeric"
      />
    </View>
  );

  const Message = ({ text, type }) => {
    if (!text) return null;
    const bgColor = type === "success" ? "#E8F5E8" : "#FFEBEE";
    const borderColor = type === "success" ? "#4CAF50" : "#F44336";
    
    return (
      <View style={[styles.messageContainer, { 
        backgroundColor: bgColor, 
        borderLeftColor: borderColor 
      }]}>
        <Text style={styles.messageText}>{text}</Text>
      </View>
    );
  };

  const ProfitResult = ({ initialCost, profitAmount }) => {
    if (initialCost === null && profitAmount === null) return null;
    
    return (
      <View style={styles.resultContainer}>
        <View style={styles.resultHeader}>
          <Text style={styles.resultTitle}>📊 Calculation Results</Text>
        </View>
        
        {initialCost !== null && (
          <View style={styles.resultContent}>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>💰 Total Initial Cost:</Text>
              <Text style={styles.resultValueCost}>₹ {initialCost.toFixed(2)}</Text>
            </View>
            
            {profitAmount !== null && (
              <>
                <View style={styles.divider} />
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>💵 Total Revenue:</Text>
                  <Text style={styles.resultValue}>
                    ₹ {((parseFloat(sellingPrice || 0) * parseFloat(quantity || 0))).toFixed(2)}
                  </Text>
                </View>
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>
                    {profitAmount >= 0 ? "🎉 Your Profit:" : "📉 Your Loss:"}
                  </Text>
                  <Text style={[
                    styles.resultValueProfit,
                    { color: profitAmount >= 0 ? "#4CAF50" : "#F44336" }
                  ]}>
                    ₹ {Math.abs(profitAmount).toFixed(2)}
                  </Text>
                </View>
                
                <View style={[styles.profitInsight, {
                  backgroundColor: profitAmount >= 0 ? "#E8F5E8" : "#FFEBEE"
                }]}>
                  <Text style={[styles.insightText, {
                    color: profitAmount >= 0 ? "#2E7D32" : "#C62828"
                  }]}>
                    {profitAmount >= 0 
                      ? `🎉 Congratulations! You made a profit of ₹${profitAmount.toFixed(2)}. Great farming!`
                      : `⚠️ You have a loss of ₹${Math.abs(profitAmount).toFixed(2)}. Consider reviewing your costs and pricing strategy.`
                    }
                  </Text>
                </View>
              </>
            )}
          </View>
        )}
      </View>
    );
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
          <Text style={styles.headerTitle}>💰 Profit Calculator</Text>
          <Text style={styles.headerSubtitle}>Calculate your crop profitability</Text>
        </View>
      </View>

      {/* App Branding */}
      <View style={styles.brandingContainer}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoEmoji}>🏦</Text>
        </View>
        <Text style={styles.appName}>KisaanSetu</Text>
        <Text style={styles.tagline}>Track expenses • Calculate profits • Grow smarter</Text>
      </View>

      {/* Message Display */}
      <Message text={message.text} type={message.type} />

      {/* Expenses Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🏦 Enter Your Crop Expenses</Text>
          <Text style={styles.sectionSubtitle}>Add all costs related to your farming</Text>
        </View>
        
        <View style={styles.sectionContent}>
          <InputField
            label="Seed Cost"
            value={seedCost}
            onChange={setSeedCost}
            placeholder="Enter seed expenses (₹)"
            icon="🌱"
          />
          <InputField
            label="Fertilizer Cost"
            value={fertilizerCost}
            onChange={setFertilizerCost}
            placeholder="Enter fertilizer expenses (₹)"
            icon="🌿"
          />
          <InputField
            label="Pesticide Cost"
            value={pesticideCost}
            onChange={setPesticideCost}
            placeholder="Enter pesticide expenses (₹)"
            icon="🧪"
          />
          <InputField
            label="Labour Cost"
            value={labourCost}
            onChange={setLabourCost}
            placeholder="Enter labour expenses (₹)"
            icon="👨‍🌾"
          />
          <InputField
            label="Other Expenses"
            value={otherCost}
            onChange={setOtherCost}
            placeholder="Enter other expenses (₹)"
            icon="📋"
          />
          
          <TouchableOpacity
            style={styles.calculateButton}
            onPress={handleCalculateInitialCost}
          >
            <Text style={styles.calculateButtonText}>💰 Calculate Total Cost</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Selling Section - Only show after initial cost is calculated */}
      {totalInitialCost !== null && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>💸 Enter Selling Details</Text>
            <Text style={styles.sectionSubtitle}>Provide your crop selling information</Text>
          </View>
          
          <View style={styles.sectionContent}>
            <InputField
              label="Selling Price per Kg"
              value={sellingPrice}
              onChange={setSellingPrice}
              placeholder="Price per kg (₹)"
              icon="💰"
            />
            <InputField
              label="Quantity Sold (Kg)"
              value={quantity}
              onChange={setQuantity}
              placeholder="Total quantity sold (kg)"
              icon="⚖️"
            />
            
            <TouchableOpacity
              style={styles.profitButton}
              onPress={handleCalculateProfit}
            >
              <Text style={styles.calculateButtonText}>📊 Calculate Profit/Loss</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Results Display */}
      <ProfitResult initialCost={totalInitialCost} profitAmount={profit} />

      {/* Reset Button */}
      {(totalInitialCost !== null || profit !== null) && (
        <View style={styles.resetContainer}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleReset}
          >
            <Text style={styles.resetButtonText}>🔄 Reset All Calculations</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Tips Section */}
      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>💡 Pro Tips for Better Profits</Text>
        <View style={styles.tipItem}>
          <Text style={styles.tipText}>• Track all expenses including small costs</Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipText}>• Compare prices from different buyers</Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipText}>• Consider seasonal price variations</Text>
        </View>
      </View>

      {/* Bottom Spacing */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    elevation: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  backButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#c8e6c9",
    marginTop: 4,
  },
  brandingContainer: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "white",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    elevation: 3,
  },
  logoContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#E8F5E8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  logoEmoji: {
    fontSize: 35,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 5,
  },
  tagline: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  messageContainer: {
    margin: 20,
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    elevation: 2,
    backgroundColor: "white",
  },
  messageText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  section: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    elevation: 4,
    overflow: "hidden",
  },
  sectionHeader: {
    backgroundColor: "#f8f9fa",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  sectionContent: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  calculateButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    elevation: 3,
    marginTop: 10,
  },
  profitButton: {
    backgroundColor: "#FF9800",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    elevation: 3,
    marginTop: 10,
  },
  calculateButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultContainer: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    elevation: 5,
    overflow: "hidden",
  },
  resultHeader: {
    backgroundColor: "#E8F5E8",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E7D32",
    textAlign: "center",
  },
  resultContent: {
    padding: 20,
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  resultLabel: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
    flex: 1,
  },
  resultValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  resultValueCost: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF9800",
  },
  resultValueProfit: {
    fontSize: 20,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#e9ecef",
    marginVertical: 10,
  },
  profitInsight: {
    marginTop: 15,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  insightText: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 20,
  },
  resetContainer: {
    alignItems: "center",
    margin: 20,
  },
  resetButton: {
    backgroundColor: "#dc3545",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 20,
    elevation: 2,
  },
  resetButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  tipsContainer: {
    margin: 20,
    backgroundColor: "#FFF3E0",
    borderRadius: 15,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#FF9800",
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#EF6C00",
    marginBottom: 10,
  },
  tipItem: {
    marginBottom: 5,
  },
  tipText: {
    fontSize: 14,
    color: "#666",
  },
});
