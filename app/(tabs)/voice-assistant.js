import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';

export default function VoiceAssistantScreen() {
  const { user } = useAuth();
  const [isListening, setIsListening] = useState(false);
  const [conversation, setConversation] = useState([]);

  // Demo conversation data
  const demoConversation = [
    {
      type: 'user',
      text: 'What should I plant this season?',
      time: '2 mins ago'
    },
    {
      type: 'assistant',
      text: 'Based on your location in Punjab and current weather conditions, I recommend planting wheat this Rabi season. The soil moisture and temperature are perfect for wheat cultivation.',
      time: '2 mins ago'
    },
    {
      type: 'user',
      text: 'How much water does wheat need?',
      time: '1 min ago'
    },
    {
      type: 'assistant',
      text: 'Wheat typically requires 400-500mm of water during its growing season. With current weather patterns, you should irrigate every 15-20 days. I can remind you when it\'s time for the next watering.',
      time: '1 min ago'
    }
  ];

  useEffect(() => {
    // Load demo conversation
    setConversation(demoConversation);
  }, []);

  const startListening = () => {
    setIsListening(true);
    
    // Simulate voice recognition
    setTimeout(() => {
      setIsListening(false);
      Alert.alert(
        "Voice Feature Coming Soon! 🎤",
        "Voice assistance will be available in the next update. For now, you can:\n\n• Ask about crop recommendations\n• Get weather updates\n• Learn about pest management\n• Check market prices",
        [{ text: "Got it!" }]
      );
    }, 2000);
  };

  const quickCommands = [
    {
      icon: '🌾',
      title: 'Crop Advice',
      command: 'What crops should I plant?',
      color: '#4CAF50'
    },
    {
      icon: '🌤️',
      title: 'Weather',
      command: 'How\'s the weather today?',
      color: '#2196F3'
    },
    {
      icon: '💰',
      title: 'Market Prices',
      command: 'What are today\'s crop prices?',
      color: '#FF9800'
    },
    {
      icon: '🐛',
      title: 'Pest Control',
      command: 'Help with pest problems',
      color: '#F44336'
    }
  ];

  return (
    <View style={styles.container}>
      
      {/* Header */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <Text style={styles.title}>🎤 Voice Assistant</Text>
        <Text style={styles.subtitle}>Your Smart Farming Helper</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Voice Button */}
        <View style={styles.voiceSection}>
          <TouchableOpacity
            style={[
              styles.voiceButton,
              isListening && styles.voiceButtonListening
            ]}
            onPress={startListening}
            disabled={isListening}
          >
            <LinearGradient
              colors={isListening ? ['#FF6B6B', '#FF8E53'] : ['#4CAF50', '#45a049']}
              style={styles.voiceButtonGradient}
            >
              {isListening ? (
                <View style={styles.listeningContainer}>
                  <ActivityIndicator color="white" size="large" />
                  <Text style={styles.listeningText}>Listening...</Text>
                </View>
              ) : (
                <>
                  <Text style={styles.voiceIcon}>🎤</Text>
                  <Text style={styles.voiceButtonText}>Tap to Speak</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
          
          <Text style={styles.voiceHint}>
            "Hey Kissan, what should I plant this season?"
          </Text>
        </View>

        {/* Quick Commands */}
        <View style={styles.quickCommandsSection}>
          <Text style={styles.sectionTitle}>⚡ Quick Commands</Text>
          
          <View style={styles.commandsGrid}>
            {quickCommands.map((command, index) => (
              <TouchableOpacity
                key={index}
                style={styles.commandCard}
                onPress={() => {
                  Alert.alert(
                    "Voice Command",
                    `You can say: "${command.command}"`,
                    [{ text: "Try it!" }]
                  );
                }}
              >
                <View style={[styles.commandIcon, { backgroundColor: command.color + '20' }]}>
                  <Text style={styles.commandEmoji}>{command.icon}</Text>
                </View>
                <Text style={styles.commandTitle}>{command.title}</Text>
                <Text style={styles.commandText}>"{command.command}"</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Conversation History */}
        <View style={styles.conversationSection}>
          <Text style={styles.sectionTitle}>💬 Recent Conversations</Text>
          
          {conversation.map((message, index) => (
            <View
              key={index}
              style={[
                styles.messageContainer,
                message.type === 'user' ? styles.userMessage : styles.assistantMessage
              ]}
            >
              <View style={styles.messageHeader}>
                <Text style={styles.messageType}>
                  {message.type === 'user' ? '👤 You' : '🤖 Assistant'}
                </Text>
                <Text style={styles.messageTime}>{message.time}</Text>
              </View>
              <Text style={styles.messageText}>{message.text}</Text>
            </View>
          ))}
        </View>

        {/* Voice Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>🌟 Voice Features</Text>
          
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🗣️</Text>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Multi-Language Support</Text>
                <Text style={styles.featureText}>Hindi, English, Punjabi, and more</Text>
              </View>
            </View>
            
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🧠</Text>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Smart Recommendations</Text>
                <Text style={styles.featureText}>Personalized farming advice</Text>
              </View>
            </View>
            
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>📱</Text>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Hands-Free Operation</Text>
                <Text style={styles.featureText}>Use while working in fields</Text>
              </View>
            </View>
            
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🔔</Text>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Voice Reminders</Text>
                <Text style={styles.featureText}>Irrigation, fertilizer, harvest alerts</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Coming Soon */}
        <View style={styles.comingSoonSection}>
          <Text style={styles.comingSoonTitle}>🚀 Coming Soon</Text>
          <Text style={styles.comingSoonText}>
            • Real-time voice recognition{'\n'}
            • Offline voice commands{'\n'}
            • Voice-to-text farming notes{'\n'}
            • Integration with all app features{'\n'}
            • Custom voice shortcuts
          </Text>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 25,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  content: {
    flex: 1,
  },
  voiceSection: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  voiceButton: {
    width: 150,
    height: 150,
    borderRadius: 75,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  voiceButtonListening: {
    transform: [{ scale: 1.1 }],
  },
  voiceButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceIcon: {
    fontSize: 50,
    marginBottom: 5,
  },
  voiceButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listeningContainer: {
    alignItems: 'center',
  },
  listeningText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  voiceHint: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
  quickCommandsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 15,
  },
  commandsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  commandCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 3,
  },
  commandIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  commandEmoji: {
    fontSize: 24,
  },
  commandTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  commandText: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  conversationSection: {
    padding: 20,
  },
  messageContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
  },
  userMessage: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  assistantMessage: {
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  messageType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
  },
  messageText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  featuresSection: {
    padding: 20,
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 15,
    elevation: 3,
  },
  featuresList: {
    gap: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 15,
    width: 35,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  featureText: {
    fontSize: 13,
    color: '#666',
  },
  comingSoonSection: {
    backgroundColor: '#E3F2FD',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  comingSoonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 12,
  },
  comingSoonText: {
    fontSize: 14,
    color: '#1976D2',
    lineHeight: 22,
  },
});
