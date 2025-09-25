import { Redirect, Tabs, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../src/contexts/AuthContext";

// SIMPLE Hamburger Menu Component - THIS WILL WORK!
function HamburgerMenu() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <>
      {/* Hamburger Button */}
      <TouchableOpacity 
        style={{
          position: 'absolute',
          top: 45,
          right: 20,
          zIndex: 1000,
          backgroundColor: 'rgba(76, 175, 80, 0.9)',
          padding: 12,
          borderRadius: 25,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
        }}
        onPress={() => setMenuVisible(true)}
      >
        <Text style={{ color: 'white', fontSize: 18 }}>☰</Text>
      </TouchableOpacity>

      {/* Simple Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'flex-end',
        }}>
          <View style={{
            backgroundColor: 'white',
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            padding: 20,
            maxHeight: '85%',
          }}>
            
            {/* Header */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
              paddingBottom: 15,
              borderBottomWidth: 1,
              borderBottomColor: '#E0E0E0',
            }}>
              <View>
                <Text style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: '#2E7D32',
                }}>
                  🌾 Navigation Menu
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: '#666',
                  marginTop: 2,
                }}>
                  Welcome, {user?.name?.split(' ')[0] || 'Farmer'}!
                </Text>
              </View>
              <TouchableOpacity 
                onPress={() => setMenuVisible(false)}
                style={{
                  backgroundColor: '#F5F5F5',
                  padding: 8,
                  borderRadius: 20,
                }}
              >
                <Text style={{ fontSize: 18, color: '#666' }}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* SIMPLE MENU ITEMS - SHOULD DEFINITELY WORK */}
            <ScrollView showsVerticalScrollIndicator={false}>
              
              {/* MAIN NAVIGATION */}
              <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#4CAF50',
                marginBottom: 15,
                marginTop: 10,
              }}>
                📱 Main Navigation
              </Text>

              {/* Dashboard */}
              <TouchableOpacity 
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 15,
                  backgroundColor: '#f8f9fa',
                  marginBottom: 10,
                  borderRadius: 12,
                  borderLeftWidth: 4,
                  borderLeftColor: '#4CAF50',
                }}
                onPress={() => {
                  setMenuVisible(false);
                  router.push('/(tabs)/');
                }}
              >
                <Text style={{ fontSize: 20, marginRight: 15 }}>🏠</Text>
                <View>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>Dashboard</Text>
                  <Text style={{ fontSize: 12, color: '#666' }}>Home & overview</Text>
                </View>
              </TouchableOpacity>

              {/* Crop Selection */}
              <TouchableOpacity 
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 15,
                  backgroundColor: '#f8f9fa',
                  marginBottom: 10,
                  borderRadius: 12,
                  borderLeftWidth: 4,
                  borderLeftColor: '#4CAF50',
                }}
                onPress={() => {
                  setMenuVisible(false);
                  router.push('/(tabs)/crop-selection');
                }}
              >
                <Text style={{ fontSize: 20, marginRight: 15 }}>🌾</Text>
                <View>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>Crop Selection</Text>
                  <Text style={{ fontSize: 12, color: '#666' }}>Choose your crops</Text>
                </View>
              </TouchableOpacity>

              {/* Crop Detection */}
              <TouchableOpacity 
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 15,
                  backgroundColor: '#f8f9fa',
                  marginBottom: 10,
                  borderRadius: 12,
                  borderLeftWidth: 4,
                  borderLeftColor: '#4CAF50',
                }}
                onPress={() => {
                  setMenuVisible(false);
                  router.push('/(tabs)/crop-detection');
                }}
              >
                <Text style={{ fontSize: 20, marginRight: 15 }}>📷</Text>
                <View>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>Crop Detection</Text>
                  <Text style={{ fontSize: 12, color: '#666' }}>AI-powered identification</Text>
                </View>
              </TouchableOpacity>

              {/* Pest Detection */}
              <TouchableOpacity 
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 15,
                  backgroundColor: '#f8f9fa',
                  marginBottom: 10,
                  borderRadius: 12,
                  borderLeftWidth: 4,
                  borderLeftColor: '#4CAF50',
                }}
                onPress={() => {
                  setMenuVisible(false);
                  router.push('/(tabs)/pest');
                }}
              >
                <Text style={{ fontSize: 20, marginRight: 15 }}>🐛</Text>
                <View>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>Pest Detection</Text>
                  <Text style={{ fontSize: 12, color: '#666' }}>Identify & manage pests</Text>
                </View>
              </TouchableOpacity>

              {/* Weather */}
              <TouchableOpacity 
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 15,
                  backgroundColor: '#f8f9fa',
                  marginBottom: 10,
                  borderRadius: 12,
                  borderLeftWidth: 4,
                  borderLeftColor: '#4CAF50',
                }}
                onPress={() => {
                  setMenuVisible(false);
                  router.push('/(tabs)/weather');
                }}
              >
                <Text style={{ fontSize: 20, marginRight: 15 }}>🌤️</Text>
                <View>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>Weather Forecast</Text>
                  <Text style={{ fontSize: 12, color: '#666' }}>Current & upcoming weather</Text>
                </View>
              </TouchableOpacity>

              {/* Market */}
              <TouchableOpacity 
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 15,
                  backgroundColor: '#f8f9fa',
                  marginBottom: 10,
                  borderRadius: 12,
                  borderLeftWidth: 4,
                  borderLeftColor: '#4CAF50',
                }}
                onPress={() => {
                  setMenuVisible(false);
                  router.push('/(tabs)/market');
                }}
              >
                <Text style={{ fontSize: 20, marginRight: 15 }}>💰</Text>
                <View>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>Market Prices</Text>
                  <Text style={{ fontSize: 12, color: '#666' }}>Current crop rates</Text>
                </View>
              </TouchableOpacity>

              {/* Community */}
              <TouchableOpacity 
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 15,
                  backgroundColor: '#f8f9fa',
                  marginBottom: 10,
                  borderRadius: 12,
                  borderLeftWidth: 4,
                  borderLeftColor: '#4CAF50',
                }}
                onPress={() => {
                  setMenuVisible(false);
                  router.push('/(tabs)/community');
                }}
              >
                <Text style={{ fontSize: 20, marginRight: 15 }}>🤝</Text>
                <View>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>Community</Text>
                  <Text style={{ fontSize: 12, color: '#666' }}>Connect with farmers</Text>
                </View>
              </TouchableOpacity>

              {/* Crop Advisory */}
              <TouchableOpacity 
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 15,
                  backgroundColor: '#f8f9fa',
                  marginBottom: 10,
                  borderRadius: 12,
                  borderLeftWidth: 4,
                  borderLeftColor: '#4CAF50',
                }}
                onPress={() => {
                  setMenuVisible(false);
                  router.push('/(tabs)/crop-advisory');
                }}
              >
                <Text style={{ fontSize: 20, marginRight: 15 }}>📋</Text>
                <View>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>Crop Advisory</Text>
                  <Text style={{ fontSize: 12, color: '#666' }}>Expert farming advice</Text>
                </View>
              </TouchableOpacity>

              
              {/* Voice Assistant */}
              <TouchableOpacity 
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 15,
                  backgroundColor: '#f8f9fa',
                  marginBottom: 20,
                  borderRadius: 12,
                  borderLeftWidth: 4,
                  borderLeftColor: '#4CAF50',
                }}
                onPress={() => {
                  setMenuVisible(false);
                  router.push('/(tabs)/voice-assistant');
                }}
              >
                <Text style={{ fontSize: 20, marginRight: 15 }}>🎤</Text>
                <View>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>Voice Assistant</Text>
                  <Text style={{ fontSize: 12, color: '#666' }}>Voice-powered help</Text>
                </View>
              </TouchableOpacity>
              {/* Government Schemes - ADD THIS AFTER Voice Assistant */}
<TouchableOpacity 
  style={{
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    marginBottom: 10,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  }}
  onPress={() => {
    setMenuVisible(false);
    router.push('/(tabs)/government-schemes');
  }}
>
  <Text style={{ fontSize: 20, marginRight: 15 }}>🏛️</Text>
  <View>
    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>Government Schemes</Text>
    <Text style={{ fontSize: 12, color: '#666' }}>Financial support & benefits</Text>
  </View>
</TouchableOpacity>
<TouchableOpacity 
  style={{
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    marginBottom: 10,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2E7D32',
  }}
  onPress={() => {
    setMenuVisible(false);
    router.push('/profit-calculator');
  }}
>
  <Text style={{ fontSize: 20, marginRight: 15 }}>💰</Text>
  <View>
    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>Profit Calculator</Text>
    <Text style={{ fontSize: 12, color: '#666' }}>Calculate crop profitability</Text>
  </View>
</TouchableOpacity>

              
              {/* SETTINGS SECTION */}
              <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#4CAF50',
                marginBottom: 15,
                marginTop: 10,
              }}>
                ⚙️ Settings & Support
              </Text>

              {/* Profile */}
              <TouchableOpacity 
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 15,
                  backgroundColor: '#f8f9fa',
                  marginBottom: 10,
                  borderRadius: 12,
                  borderLeftWidth: 4,
                  borderLeftColor: '#4CAF50',
                }}
                onPress={() => {
                  setMenuVisible(false);
                  Alert.alert(
                    "Your Profile",
                    `Name: ${user?.name || 'Guest'}\nEmail: ${user?.email || 'Not provided'}\nLanguage: ${user?.language || 'Hindi'}\nFarm: ${user?.farmInfo?.farmName || 'Not provided'}\nLocation: ${user?.farmInfo?.location || 'Not provided'}`,
                    [{ text: "OK" }]
                  );
                }}
              >
                <Text style={{ fontSize: 20, marginRight: 15 }}>👤</Text>
                <View>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>Profile</Text>
                  <Text style={{ fontSize: 12, color: '#666' }}>Your account details</Text>
                </View>
              </TouchableOpacity>

              {/* Settings */}
              <TouchableOpacity 
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 15,
                  backgroundColor: '#f8f9fa',
                  marginBottom: 10,
                  borderRadius: 12,
                  borderLeftWidth: 4,
                  borderLeftColor: '#4CAF50',
                }}
                onPress={() => {
                  setMenuVisible(false);
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
                }}
              >
                <Text style={{ fontSize: 20, marginRight: 15 }}>⚙️</Text>
                <View>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>Settings</Text>
                  <Text style={{ fontSize: 12, color: '#666' }}>App preferences</Text>
                </View>
              </TouchableOpacity>

              {/* Support */}
              <TouchableOpacity 
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 15,
                  backgroundColor: '#f8f9fa',
                  marginBottom: 10,
                  borderRadius: 12,
                  borderLeftWidth: 4,
                  borderLeftColor: '#4CAF50',
                }}
                onPress={() => {
                  setMenuVisible(false);
                  Alert.alert(
                    "Customer Support",
                    "Get help from our team:",
                    [
                      { text: "📞 Call Support", onPress: () => Alert.alert("Call", "Support: +91-1800-XXX-XXXX") },
                      { text: "📧 Email Support", onPress: () => Alert.alert("Email", "support@kisansetu.com") },
                      { text: "💬 WhatsApp", onPress: () => Alert.alert("WhatsApp", "+91-9876543210") },
                      { text: "Cancel", style: "cancel" }
                    ]
                  );
                }}
              >
                <Text style={{ fontSize: 20, marginRight: 15 }}>📞</Text>
                <View>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>Support</Text>
                  <Text style={{ fontSize: 12, color: '#666' }}>Get help & contact</Text>
                </View>
              </TouchableOpacity>

              {/* About */}
              <TouchableOpacity 
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 15,
                  backgroundColor: '#f8f9fa',
                  marginBottom: 20,
                  borderRadius: 12,
                  borderLeftWidth: 4,
                  borderLeftColor: '#4CAF50',
                }}
                onPress={() => {
                  setMenuVisible(false);
                  Alert.alert(
                    "Kissan Setu v1.0.0",
                    "🌾 Smart Farming Assistant\n\n✅ Weather forecasting\n✅ AI crop detection\n✅ Pest management\n✅ Market prices\n✅ Voice assistance\n✅ Community support\n\nDeveloped for farmers by farmers 💚",
                    [{ text: "OK" }]
                  );
                }}
              >
                <Text style={{ fontSize: 20, marginRight: 15 }}>ℹ️</Text>
                <View>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>About Kissan Setu</Text>
                  <Text style={{ fontSize: 12, color: '#666' }}>Version & info</Text>
                </View>
              </TouchableOpacity>

              {/* LOGOUT SECTION */}
              <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#F44336',
                marginBottom: 15,
                marginTop: 10,
              }}>
                🚪 Account
              </Text>

              {/* Logout */}
              <TouchableOpacity 
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 15,
                  backgroundColor: '#FFEBEE',
                  marginBottom: 10,
                  borderRadius: 12,
                  borderLeftWidth: 4,
                  borderLeftColor: '#F44336',
                }}
                onPress={() => {
                  setMenuVisible(false);
                  Alert.alert(
                    "Logout Confirmation",
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
                }}
              >
                <Text style={{ fontSize: 20, marginRight: 15 }}>🚪</Text>
                <View>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#D32F2F' }}>Logout</Text>
                  <Text style={{ fontSize: 12, color: '#666' }}>Sign out of account</Text>
                </View>
              </TouchableOpacity>

            </ScrollView>

            {/* Footer */}
            <View style={{
              marginTop: 15,
              paddingTop: 15,
              borderTopWidth: 1,
              borderTopColor: '#E0E0E0',
              alignItems: 'center',
            }}>
              <Text style={{
                fontSize: 12,
                color: '#4CAF50',
                fontWeight: '600',
              }}>
                Kissan Setu v1.0.0 - Made with 💚 for farmers
              </Text>
            </View>

          </View>
        </View>
      </Modal>
    </>
  );
}

export default function TabLayout() {
  const { user, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#f8fffe' 
      }}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={{ 
          marginTop: 10, 
          fontSize: 16, 
          color: '#4CAF50',
          fontWeight: '600'
        }}>
          Loading your farm dashboard...
        </Text>
      </View>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <>
      {/* Hamburger Menu */}
      <HamburgerMenu />
      
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#4CAF50",
          tabBarInactiveTintColor: "#999",
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "white",
            borderTopWidth: 1,
            borderTopColor: "#E0E0E0",
            height: 70,
            paddingBottom: 12,
            paddingTop: 12,
            elevation: 15,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -5 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            marginTop: 4,
          },
          tabBarIconStyle: {
            marginBottom: 2,
          },
        }}
      >
        {/* 👇 ONLY 4 ESSENTIAL TABS IN FOOTER */}
        
        {/* Home Tab */}
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <Text style={{ 
                fontSize: focused ? 26 : 22,
                opacity: focused ? 1 : 0.7,
              }}>
                🏠
              </Text>
            ),
          }}
        />
        
        {/* Weather Tab */}
        <Tabs.Screen
          name="weather"
          options={{
            title: "Weather",
            tabBarIcon: ({ color, focused }) => (
              <Text style={{ 
                fontSize: focused ? 26 : 22,
                opacity: focused ? 1 : 0.7,
              }}>
                🌤️
              </Text>
            ),
          }}
        />
        
        {/* Voice Assistant Tab */}
        <Tabs.Screen
          name="voice-assistant"
          options={{
            title: "Voice Helper",
            tabBarIcon: ({ color, focused }) => (
              <Text style={{ 
                fontSize: focused ? 26 : 22,
                opacity: focused ? 1 : 0.7,
              }}>
                🎤
              </Text>
            ),
          }}
        />
        
        {/* Market Tab */}
        <Tabs.Screen
          name="market"
          options={{
            title: "Market",
            tabBarIcon: ({ color, focused }) => (
              <Text style={{ 
                fontSize: focused ? 26 : 22,
                opacity: focused ? 1 : 0.7,
              }}>
                💰
              </Text>
            ),
          }}
        />

        {/* 🏛️ GOVERNMENT SCHEMES TAB - ADD THIS */}
      <Tabs.Screen
        name="government-schemes"
        options={{
          title: "Schemes",
          tabBarIcon: ({ focused }) => (
            <Text style={{ 
              fontSize: 20, 
              opacity: focused ? 1 : 0.6 
            }}>
              🏛️
            </Text>
          ),
        }}
      />
        
        {/* 🚫 HIDDEN TABS - Available through Sidebar Only */}
        <Tabs.Screen
          name="crop-selection"
          options={{
            href: null, // Hidden from footer
          }}
        />
        <Tabs.Screen
          name="crop-detection"
          options={{
            href: null, // Hidden from footer
          }}
        />
        <Tabs.Screen
          name="pest"
          options={{
            href: null, // Hidden from footer
          }}
        />
        <Tabs.Screen
          name="community"
          options={{
            href: null, // Hidden from footer
          }}
        />
        <Tabs.Screen
          name="crop-advisory"
          options={{
            href: null, // Hidden from footer
          }}
        />


        <Tabs.Screen
          name="profit-calculator"
          options={{
            href: null, // Hidden from footer
          }}
        />
      </Tabs>
    </>
  );
}
