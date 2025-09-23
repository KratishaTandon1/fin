import { useRouter } from 'expo-router';
import React from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const { width, height } = Dimensions.get('window');

export default function SideDrawer({ visible, onClose }) {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const slideAnim = new Animated.Value(visible ? 0 : -width);

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -width,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const menuItems = [
    // MAIN NAVIGATION SCREENS
    {
      icon: '🏠',
      title: 'Dashboard',
      subtitle: 'Home & overview',
      onPress: () => {
        onClose();
        router.push('/(tabs)/');
      }
    },
    {
      icon: '🌾',
      title: 'Crop Selection',
      subtitle: 'Choose your crops',
      onPress: () => {
        onClose();
        router.push('/(tabs)/crop-selection');
      }
    },
    {
      icon: '📷',
      title: 'Crop Detection',
      subtitle: 'AI-powered identification',
      onPress: () => {
        onClose();
        router.push('/(tabs)/crop-detection');
      }
    },
    {
      icon: '🐛',
      title: 'Pest Detection',
      subtitle: 'Identify & manage pests',
      onPress: () => {
        onClose();
        router.push('/(tabs)/pest');
      }
    },
    {
      icon: '🌤️',
      title: 'Weather Forecast',
      subtitle: 'Current & upcoming weather',
      onPress: () => {
        onClose();
        router.push('/(tabs)/weather');
      }
    },
    {
      icon: '💰',
      title: 'Market Prices',
      subtitle: 'Current crop rates',
      onPress: () => {
        onClose();
        router.push('/(tabs)/market');
      }
    },
    {
      icon: '🤝',
      title: 'Community',
      subtitle: 'Connect with farmers',
      onPress: () => {
        onClose();
        router.push('/(tabs)/community');
      }
    },
    {
      icon: '📋',
      title: 'Crop Advisory',
      subtitle: 'Expert farming advice',
      onPress: () => {
        onClose();
        router.push('/(tabs)/crop-advisory');
      }
    },
    {
      icon: '🎤',
      title: 'Voice Assistant',
      subtitle: 'Voice-powered help',
      onPress: () => {
        onClose();
        router.push('/(tabs)/voice-assistant');
      }
    },

    // DIVIDER
    { isDivider: true, title: 'Account & Settings' },

    // SETTINGS & ACCOUNT
    {
      icon: '👤',
      title: 'Profile',
      subtitle: 'Your account details',
      onPress: () => {
        onClose();
        Alert.alert(
          "Your Profile",
          `Name: ${user?.name || 'Guest'}\nEmail: ${user?.email || 'Not provided'}\nLanguage: ${user?.language || 'Hindi'}\nFarm: ${user?.farmInfo?.farmName || 'Not provided'}\nLocation: ${user?.farmInfo?.location || 'Not provided'}`,
        );
      }
    },
    {
      icon: '⚙️',
      title: 'Settings',
      subtitle: 'App preferences',
      onPress: () => {
        onClose();
        Alert.alert(
          "Settings",
          "Choose an option:",
          [
            { text: "🔔 Notifications", onPress: () => Alert.alert("Notifications", "Feature coming soon!") },
            { text: "🌍 Language", onPress: () => Alert.alert("Language", "Feature coming soon!") },
            { text: "🌙 Theme", onPress: () => Alert.alert("Theme", "Feature coming soon!") },
            { text: "Cancel", style: "cancel" }
          ]
        );
      }
    },
    {
      icon: '📊',
      title: 'Farm Analytics',
      subtitle: 'Crop performance data',
      onPress: () => {
        onClose();
        Alert.alert("Analytics", "Detailed farm analytics coming soon!");
      }
    },
    {
      icon: '📞',
      title: 'Support',
      subtitle: 'Get help & contact us',
      onPress: () => {
        onClose();
        Alert.alert(
          "Customer Support",
          "Contact us for help:",
          [
            { text: "📞 Call Support", onPress: () => Alert.alert("Call", "Support: +91-1800-XXX-XXXX") },
            { text: "📧 Email", onPress: () => Alert.alert("Email", "support@kisaansethu.com") },
            { text: "💬 WhatsApp", onPress: () => Alert.alert("WhatsApp", "WhatsApp: +91-9876543210") },
            { text: "Cancel", style: "cancel" }
          ]
        );
      }
    },
    {
      icon: 'ℹ️',
      title: 'About Kisaan Sethu',
      subtitle: 'Version & info',
      onPress: () => {
        onClose();
        Alert.alert(
          "Kisaan Sethu v1.0.0",
          "🌾 Smart Farming Assistant\n\n✅ Weather forecasting\n✅ AI crop detection\n✅ Pest management\n✅ Market prices\n✅ Voice assistance\n✅ Community support\n\nDeveloped for farmers by farmers 💚",
        );
      }
    },

    // DIVIDER
    { isDivider: true, title: 'Account' },

    // LOGOUT - ONLY IN SIDEBAR
    {
      icon: '🚪',
      title: 'Logout',
      subtitle: 'Sign out of your account',
      isLogout: true,
      onPress: () => {
        onClose();
        Alert.alert(
          "Logout",
          "Are you sure you want to logout?",
          [
            { text: "Cancel", style: "cancel" },
            { 
              text: "Logout", 
              style: "destructive",
              onPress: async () => {
                await signOut();
                router.replace("/login");
              }
            }
          ]
        );
      }
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        
        <Animated.View 
          style={[
            styles.drawer, 
            { transform: [{ translateX: slideAnim }] }
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.appName}>🌾 Kisaan Sethu</Text>
            <Text style={styles.userGreeting}>
              Welcome, {user?.name?.split(' ')[0] || 'Farmer'}!
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Menu Items */}
          <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
            {menuItems.map((item, index) => {
              // Render divider
              if (item.isDivider) {
                return (
                  <View key={index} style={styles.dividerSection}>
                    <Text style={styles.dividerTitle}>{item.title}</Text>
                    <View style={styles.dividerLine} />
                  </View>
                );
              }

              // Render menu item
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.menuItem, item.isLogout && styles.logoutItem]}
                  onPress={item.onPress}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuIcon}>
                    <Text style={styles.menuIconText}>{item.icon}</Text>
                  </View>
                  <View style={styles.menuContent}>
                    <Text style={[styles.menuTitle, item.isLogout && styles.logoutTitle]}>
                      {item.title}
                    </Text>
                    <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                  </View>
                  <Text style={styles.arrow}>›</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Made with 💚 for farmers</Text>
            <Text style={styles.versionText}>v1.0.0</Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    width: width * 0.85,
    backgroundColor: 'white',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    paddingTop: 50,
    position: 'relative',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  userGreeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  closeButton: {
    position: 'absolute',
    top: 45,
    right: 15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuContainer: {
    flex: 1,
    paddingTop: 10,
  },
  dividerSection: {
    paddingHorizontal: 20,
    marginVertical: 15,
  },
  dividerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  dividerLine: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  logoutItem: {
    backgroundColor: '#FFEBEE',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuIconText: {
    fontSize: 18,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  logoutTitle: {
    color: '#D32F2F',
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  arrow: {
    fontSize: 18,
    color: '#ccc',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  footerText: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 5,
  },
  versionText: {
    fontSize: 12,
    color: '#999',
  },
});
