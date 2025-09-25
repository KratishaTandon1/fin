// app/(tabs)/profit-calculator.js - EXACT COPY OF YOUR HTML IN REACT NATIVE
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Linking
} from 'react-native';
import { useRouter } from 'expo-router';

export default function ProfitCalculatorScreen() {
  const router = useRouter();
  
  // State for all inputs - SAME AS YOUR HTML
  const [seed, setSeed] = useState('');
  const [fertilizer, setFertilizer] = useState('');
  const [pesticide, setPesticide] = useState('');
  const [labor, setLabor] = useState('');
  const [machinery, setMachinery] = useState('');
  const [other, setOther] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  
  // Results state
  const [totalCost, setTotalCost] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [profitLoss, setProfitLoss] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showGuidance, setShowGuidance] = useState(false);

  // ✅ EXACT SAME LOGIC AS YOUR HTML
  const calculateCost = () => {
    const seedCost = parseFloat(seed) || 0;
    const fertilizerCost = parseFloat(fertilizer) || 0;
    const pesticideCost = parseFloat(pesticide) || 0;
    const laborCost = parseFloat(labor) || 0;
    const machineryCost = parseFloat(machinery) || 0;
    const otherCost = parseFloat(other) || 0;

    const total = seedCost + fertilizerCost + pesticideCost + laborCost + machineryCost + otherCost;
    setTotalCost(total);
    setShowResults(true);
    
    Alert.alert('✅ Cost Calculated', `Total Cost: ₹${total.toFixed(2)}`);
  };

  // ✅ EXACT SAME LOGIC AS YOUR HTML
  const calculateProfit = () => {
    if (totalCost === 0) {
      Alert.alert('⚠️ Error', 'Please calculate total cost first!');
      return;
    }

    const cropQuantity = parseFloat(quantity) || 0;
    const cropPrice = parseFloat(price) || 0;

    const revenue = cropQuantity * cropPrice;
    const profit = revenue - totalCost;

    setTotalRevenue(revenue);
    setProfitLoss(profit);
    setShowGuidance(true);
  };

  // ✅ GUIDANCE LOGIC - SAME AS YOUR HTML
  const getGuidanceContent = () => {
    if (profitLoss > 0) {
      return {
        status: 'Profit Achieved ✅',
        statusColor: '#4CAF50',
        title: 'Guidance (मार्गदर्शन)',
        content: (
          <View>
            <Text style={styles.guidanceText}>Congratulations! You have made a profit.</Text>
            <Text style={styles.guidanceText}>
              <Text style={styles.bold}>English:</Text> Use this profit for better farming next season, save in banks, or invest in small assets like irrigation tools, drip system, cattle farming.
            </Text>
            <Text style={styles.guidanceText}>
              <Text style={styles.bold}>हिन्दी:</Text> बधाई हो! आपको लाभ हुआ है। इस पैसे को अगली खेती के लिए बचाएँ, बैंक में सेविंग करें या सिंचाई उपकरण, पशुपालन आदि में निवेश करें।
            </Text>
          </View>
        )
      };
    } else if (profitLoss < 0) {
      return {
        status: 'Loss Occurred ❌',
        statusColor: '#F44336',
        title: 'Guidance (मार्गदर्शन)',
        content: (
          <View>
            <Text style={styles.guidanceText}>
              <Text style={styles.bold}>English:</Text> You are facing a loss. You can apply for government schemes, subsidies, or agriculture loans.
            </Text>
            <Text style={styles.guidanceText}>
              <Text style={styles.bold}>हिन्दी:</Text> आपको घाटा हुआ है। आप सरकारी योजनाओं, सब्सिडी या कृषि लोन के लिए आवेदन कर सकते हैं।
            </Text>
            
            {/* Clickable Links */}
            <View style={styles.linksContainer}>
              <TouchableOpacity 
                style={styles.linkButton}
                onPress={() => Linking.openURL('https://www.nabard.org')}
              >
                <Text style={styles.linkText}>🏛️ Apply for NABARD Agriculture Loan</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.linkButton}
                onPress={() => Linking.openURL('https://www.myscheme.gov.in/')}
              >
                <Text style={styles.linkText}>🏛️ Check Government Schemes (MyScheme)</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.linkButton}
                onPress={() => Linking.openURL('https://www.pmkisan.gov.in/')}
              >
                <Text style={styles.linkText}>🏛️ PM Kisan Samman Nidhi Yojana</Text>
              </TouchableOpacity>
            </View>
          </View>
        )
      };
    } else {
      return {
        status: 'No Profit, No Loss ⚖',
        statusColor: '#FF9800',
        title: 'Guidance (मार्गदर्शन)',
        content: (
          <View>
            <Text style={styles.guidanceText}>
              <Text style={styles.bold}>English:</Text> You have no profit or loss. Try to reduce costs next season for better results.
            </Text>
            <Text style={styles.guidanceText}>
              <Text style={styles.bold}>हिन्दी:</Text> न लाभ न हानि। अगली बार लागत घटाने की कोशिश करें।
            </Text>
          </View>
        )
      };
    }
  };

  const resetCalculator = () => {
    setSeed('');
    setFertilizer('');
    setPesticide('');
    setLabor('');
    setMachinery('');
    setOther('');
    setQuantity('');
    setPrice('');
    setTotalCost(0);
    setTotalRevenue(0);
    setProfitLoss(0);
    setShowResults(false);
    setShowGuidance(false);
  };

  const guidance = showGuidance ? getGuidanceContent() : null;

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Header - SAME AS YOUR HTML */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Farming Cost & Profit Calculator</Text>
            <Text style={styles.headerSubtitle}>Calculate your farming cost, profit/loss & get guidance</Text>
          </View>
          <TouchableOpacity 
            style={styles.resetButton} 
            onPress={resetCalculator}
          >
            <Text style={styles.resetButtonText}>🔄</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          
          {/* Step 1: Enter Farming Expenses - SAME AS YOUR HTML */}
          <Text style={styles.sectionTitle}>Step 1: Enter Farming Expenses</Text>
          
          <TextInput
            style={styles.input}
            value={seed}
            onChangeText={setSeed}
            placeholder="Seed Cost (₹)"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
          
          <TextInput
            style={styles.input}
            value={fertilizer}
            onChangeText={setFertilizer}
            placeholder="Fertilizer Cost (₹)"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
          
          <TextInput
            style={styles.input}
            value={pesticide}
            onChangeText={setPesticide}
            placeholder="Pesticide Cost (₹)"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
          
          <TextInput
            style={styles.input}
            value={labor}
            onChangeText={setLabor}
            placeholder="Labor Cost (₹)"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
          
          <TextInput
            style={styles.input}
            value={machinery}
            onChangeText={setMachinery}
            placeholder="Machinery Cost (₹)"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
          
          <TextInput
            style={styles.input}
            value={other}
            onChangeText={setOther}
            placeholder="Other Cost (₹)"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
          
          <TouchableOpacity style={styles.button} onPress={calculateCost}>
            <Text style={styles.buttonText}>Calculate Total Cost</Text>
          </TouchableOpacity>

          {/* Results Box 1 - SAME AS YOUR HTML */}
          {showResults && (
            <View style={styles.resultBox}>
              <Text style={styles.resultText}>
                <Text style={styles.bold}>Total Cost:</Text> ₹{totalCost.toFixed(2)}
              </Text>
            </View>
          )}

          {/* Step 2: Enter Crop Selling Details - SAME AS YOUR HTML */}
          <Text style={styles.sectionTitle}>Step 2: Enter Crop Selling Details</Text>
          
          <TextInput
            style={styles.input}
            value={quantity}
            onChangeText={setQuantity}
            placeholder="Quantity of Crop Sold (Quintals)"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
          
          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            placeholder="Price per Quintal (₹)"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
          
          <TouchableOpacity style={styles.button} onPress={calculateProfit}>
            <Text style={styles.buttonText}>Calculate Profit / Loss</Text>
          </TouchableOpacity>

          {/* Results Box 2 - SAME AS YOUR HTML */}
          {showGuidance && (
            <View style={styles.resultBox}>
              <Text style={styles.resultText}>
                <Text style={styles.bold}>Total Revenue:</Text> ₹{totalRevenue.toFixed(2)}
              </Text>
              <Text style={styles.resultText}>
                <Text style={styles.bold}>Profit / Loss:</Text> ₹{profitLoss.toFixed(2)}
              </Text>
              <Text style={[styles.statusText, { color: guidance.statusColor }]}>
                {guidance.status}
              </Text>
            </View>
          )}

          {/* Guidance Box - SAME AS YOUR HTML */}
          {showGuidance && guidance && (
            <View style={styles.guidanceBox}>
              <Text style={styles.guidanceTitle}>{guidance.title}</Text>
              {guidance.content}
            </View>
          )}

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ✅ STYLES - CONVERTED FROM YOUR HTML CSS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Linear gradient background effect
  },
  
  // Header styles - SAME AS YOUR HTML
  header: {
    backgroundColor: '#1d5a11',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  headerSubtitle: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.9,
  },
  resetButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 18,
  },
  
  // Content container
  contentContainer: {
    padding: 20,
    maxWidth: 900,
    alignSelf: 'center',
    width: '100%',
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  
  // Section title - SAME AS YOUR HTML H2
  sectionTitle: {
    color: '#1d5a11',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 15,
  },
  
  // Input styles - SAME AS YOUR HTML INPUT
  input: {
    padding: 12,
    marginVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
    backgroundColor: 'white',
  },
  
  // Button styles - SAME AS YOUR HTML BUTTON
  button: {
    backgroundColor: '#1d5a11',
    padding: 12,
    marginVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Result box - SAME AS YOUR HTML .result-box
  resultBox: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#ecf0f1',
    borderRadius: 10,
  },
  resultText: {
    fontSize: 16,
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  
  // Guidance box - SAME AS YOUR HTML .guidance
  guidanceBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff8dc',
    borderLeftWidth: 5,
    borderLeftColor: '#f39c12',
    borderRadius: 10,
  },
  guidanceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  guidanceText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
    lineHeight: 20,
  },
  
  // Links container
  linksContainer: {
    marginTop: 10,
  },
  linkButton: {
    backgroundColor: '#1d5a11',
    padding: 10,
    borderRadius: 6,
    marginVertical: 4,
  },
  linkText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
});
