import { useRouter } from "expo-router";
import React, { useState } from "react";
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
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function SideDrawer({ visible, onClose }) {
  const router = useRouter();
  const [slideAnim] = useState(new Animated.Value(-width));

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const menuItems = [
    {
      id: 'profit-calculator',
      title: 'Profit Calculator',
      icon: '💰',
      description: 'Calculate crop profitability',
      route: '/profit-calculator',
      color: '#4CAF50'
    },
    {
      id: 'crop-advisory',
      title: 'Crop Advisory',
      icon: '📋',
      description: 'Expert farming advice',
      route: '/(tabs)/crop-advisory',
      color: '#2196F3'
    },
    {
      id: 'pest-detection',
      title: 'Pest Detection',
      icon: '🐛',
      description: 'AI-powered pest identification',
      route: '/(tabs)/pest',
      color: '#FF9800'
    },
    {
      id: 'crop-selection',
      title: 'Crop Selection',
      icon: '🌾',
      description: 'Choose best crops for your region',
      route: '/(tabs)/crop-selection',
      color: '#8BC34A'
    },
    {
      id: 'community',
      title: 'Community Forum',
      icon: '👥',
      description: 'Connect with other farmers',
      route: '/(tabs)/community',
      color: '#9C27B0'
    },
    {
      id: 'analytics',
      title: 'Analytics & Reports',
      icon: '📊',
      description: 'View farming insights',
      route: '/analytics',
      color: '#00BCD4'
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: '⚙️',
      description: 'App preferences & configuration',
      route: '/settings',
      color: '#607D8B'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: '🔔',
      description: 'Manage your notifications',
      route: '/notifications',
      color: '#FF5722'
    },
    {
      id: 'learning',
      title: 'Learning Resources',
      icon: '📚',
      description: 'Educational content & tutorials',
      route: '/learning',
      color: '#795548'
    },
    {
      id: 'profile',
      title: 'Profile & Account',
      icon: '👤',
      description: 'Manage your profile',
      route: '/profile',
      color: '#3F51B5'
    },
    {
      id: 'support',
      title: 'Contact Support',
      icon: '📞',
      description: 'Get help & assistance',
      route: '/support',
      color: '#E91E63'
    },
    {
      id: 'about',
      title: 'About KisaanSetu',
      icon: 'ℹ️',
      description: 'App information & credits',
      route: '/about',
      color: '#009688'
    }
  ];

  const handleMenuItemPress = (item) => {
    onClose();
    
    // Handle special cases
    if (item.id === 'support') {
      Alert.alert(
        "📞 Contact Support",
        "Choose your preferred contact method:",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "📞 Call Support", 
            onPress: () => Alert.alert("Calling Support", "📞 1800-180-1551 (Kisan Call Center)")
          },
          { 
            text: "✉️ Email Support", 
            onPress: () => Alert.alert("Email Support", "📧 support@kisaansetu.com")
          },
          { 
            text: "🌐 Visit Website", 
            onPress: () => Alert.alert("Website", "🌐 www.kisaansetu.com")
          }
        ]
      );
      return;
    }

    if (item.id === 'about') {
      Alert.alert(
        "🌾 KisaanSetu",
        "Your Smart Farming Companion\n\n" +
        "Version 1.0.0\n" +
        "Developed for farmers by farmers\n\n" +
        "Features:\n" +
        "• Crop Advisory & Selection\n" +
        "• Weather Updates\n" +
        "• Government Schemes\n" +
        "• Market Prices\n" +
        "• Pest Detection\n" +
        "• Community Forum\n" +
        "• Profit Calculator\n\n" +
        "© 2025 KisaanSetu\n" +
        "Made with ❤️ for Indian Farmers",
        [{ text: "OK" }]
      );
      return;
    }

    // For features not yet implemented
    if (['analytics', 'settings', 'notifications', 'learning', 'profile'].includes(item.id)) {
      Alert.alert(
        "🚧 Coming Soon!",
        `${item.title} feature is under development and will be available in the next update.\n\nStay tuned for more exciting features!`,
        [{ text: "OK" }]
      );
      return;
    }

    // Navigate to route
    try {
      router.push(item.route);
    } catch (error) {
      console.log('Navigation error:', error);
      Alert.alert(
        "Navigation Error",
        `Unable to navigate to ${item.title}. This feature may not be available yet.`,
        [{ text: "OK" }]
      );
    }
  };

  const MenuItem = ({ item }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => handleMenuItemPress(item)}
      activeOpacity={0.7}
    >
      <View style={[styles.menuIcon, { backgroundColor: `${item.color}20` }]}>
        <Text style={styles.menuIconText}>{item.icon}</Text>
      </View>
      <View style={styles.menuTextContainer}>
        <Text style={styles.menuTitle}>{item.title}</Text>
        <Text style={styles.menuDescription}>{item.description}</Text>
      </View>
      <View style={styles.menuArrow}>
        <Text style={[styles.arrowText, { color: item.color }]}>→</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Background overlay */}
        <TouchableOpacity 
          style={styles.backgroundOverlay} 
          onPress={onClose}
          activeOpacity={1}
        />
        
        {/* Menu content */}
        <Animated.View 
          style={[
            styles.menuContainer,
            { transform: [{ translateX: slideAnim }] }
          ]}
        >
          {/* Header */}
          <View style={styles.menuHeader}>
            <View style={styles.headerContent}>
              <View style={styles.logoContainer}>
                <Text style={styles.logoEmoji}>🌾</Text>
              </View>
              <View style={styles.headerText}>
                <Text style={styles.appTitle}>KisaanSetu</Text>
                <Text style={styles.appSubtitle}>Smart Farming Solutions</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Menu Items */}
          <ScrollView 
            style={styles.menuContent}
            showsVerticalScrollIndicator={false}
          >
            {menuItems.map((item, index) => (
              <MenuItem key={item.id} item={item} />
            ))}
            
            {/* Footer */}
            <View style={styles.menuFooter}>
              <Text style={styles.footerText}>Made with ❤️ for Indian Farmers</Text>
              <Text style={styles.versionText}>Version 1.0.0 • KisaanSetu</Text>
            </View>
          </ScrollView>
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
  backgroundOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menuContainer: {
    width: width * 0.85,
    height: height,
    backgroundColor: 'white',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#4CAF50',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  logoEmoji: {
    fontSize: 25,
  },
  headerText: {
    flex: 1,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  appSubtitle: {
    fontSize: 14,
    color: '#c8e6c9',
    marginTop: 2,
  },
  closeButton: {
    width: 35,
    height: 35,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuContent: {
    flex: 1,
    paddingTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuIcon: {
    width: 45,
    height: 45,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuIconText: {
    fontSize: 20,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  menuDescription: {
    fontSize: 13,
    color: '#666',
  },
  menuArrow: {
    marginLeft: 10,
  },
  arrowText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuFooter: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  versionText: {
    fontSize: 12,
    color: '#999',
  },
});
