import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Image,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();

  // Sample data for dashboard
  const weatherData = {
    temperature: "28°C",
    condition: "Sunny",
    humidity: "65%",
    rainfall: "2.5mm",
  };

  const quickStats = [
    { label: "Active Crops", value: "12", icon: "🌾", color: "#4CAF50" },
    { label: "Soil Health", value: "Good", icon: "🌱", color: "#FF9800" },
    { label: "Market Price", value: "₹2,450", icon: "💰", color: "#2196F3" },
    { label: "Alerts", value: "3", icon: "⚠️", color: "#F44336" },
  ];

  const farmingTasks = [
    { task: "Water tomato plants", time: "8:00 AM", priority: "high" },
    { task: "Check pest control", time: "10:30 AM", priority: "medium" },
    { task: "Harvest wheat crop", time: "4:00 PM", priority: "high" },
    { task: "Apply fertilizer", time: "6:00 PM", priority: "low" },
  ];

  const recentUpdates = [
    {
      message: "Weather alert: Heavy rain expected tomorrow",
      time: "2 hours ago",
    },
    { message: "Wheat prices increased by 5%", time: "5 hours ago" },
    { message: "New pest control advisory available", time: "1 day ago" },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section with Background */}
      <ImageBackground
        source={{
          uri: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojNENBRjUwO3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM4QkMzNEE7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyYWRpZW50KSIgLz4KPC9zdmc+",
        }}
        style={styles.headerBackground}
        imageStyle={styles.headerImageStyle}
      >
        <View style={styles.headerOverlay}>
          <Text style={styles.greeting}>Good Morning!</Text>
          <Text style={styles.userName}>👨‍🌾 Farmer</Text>
          <Text style={styles.dateText}>
            Today, {new Date().toDateString()}
          </Text>
        </View>
      </ImageBackground>

      {/* Weather Card */}
      <View style={styles.weatherCard}>
        <View style={styles.weatherHeader}>
          <Text style={styles.weatherTitle}>🌤️ Today's Weather</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/weather")}>
            <Text style={styles.viewMore}>View Details →</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.weatherContent}>
          <View style={styles.weatherMain}>
            <Text style={styles.temperature}>{weatherData.temperature}</Text>
            <Text style={styles.condition}>{weatherData.condition}</Text>
          </View>
          <View style={styles.weatherStats}>
            <View style={styles.weatherStat}>
              <Text style={styles.weatherStatLabel}>Humidity</Text>
              <Text style={styles.weatherStatValue}>
                {weatherData.humidity}
              </Text>
            </View>
            <View style={styles.weatherStat}>
              <Text style={styles.weatherStatLabel}>Rainfall</Text>
              <Text style={styles.weatherStatValue}>
                {weatherData.rainfall}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Quick Stats Grid */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>📊 Quick Overview</Text>
        <View style={styles.statsGrid}>
          {quickStats.map((stat, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.statCard, { borderLeftColor: stat.color }]}
            >
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>🚀 Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: "#E8F5E8" }]}
            onPress={() => router.push("/(tabs)/advisory")}
          >
            <Text style={styles.actionIcon}>🌾</Text>
            <Text style={styles.actionTitle}>Crop Advisory</Text>
            <Text style={styles.actionSubtitle}>Get expert advice</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: "#FFF3E0" }]}
            onPress={() => router.push("/(tabs)/market")}
          >
            <Text style={styles.actionIcon}>💰</Text>
            <Text style={styles.actionTitle}>Market Prices</Text>
            <Text style={styles.actionSubtitle}>Current rates</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: "#FFE8E8" }]}
            onPress={() => router.push("/(tabs)/pest")}
          >
            <Text style={styles.actionIcon}>🐛</Text>
            <Text style={styles.actionTitle}>Pest Detection</Text>
            <Text style={styles.actionSubtitle}>AI-powered scan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: "#E3F2FD" }]}
            onPress={() => router.push("/(tabs)/community")}
          >
            <Text style={styles.actionIcon}>🤝</Text>
            <Text style={styles.actionTitle}>Community</Text>
            <Text style={styles.actionSubtitle}>Connect & share</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Today's Tasks */}
      <View style={styles.tasksContainer}>
        <Text style={styles.sectionTitle}>✅ Today's Tasks</Text>
        {farmingTasks.map((task, index) => (
          <View key={index} style={styles.taskCard}>
            <View
              style={[
                styles.taskPriority,
                {
                  backgroundColor:
                    task.priority === "high"
                      ? "#F44336"
                      : task.priority === "medium"
                      ? "#FF9800"
                      : "#4CAF50",
                },
              ]}
            />
            <View style={styles.taskContent}>
              <Text style={styles.taskTitle}>{task.task}</Text>
              <Text style={styles.taskTime}>⏰ {task.time}</Text>
            </View>
            <TouchableOpacity style={styles.taskButton}>
              <Text style={styles.taskButtonText}>✓</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Recent Updates */}
      <View style={styles.updatesContainer}>
        <Text style={styles.sectionTitle}>📢 Recent Updates</Text>
        {recentUpdates.map((update, index) => (
          <View key={index} style={styles.updateCard}>
            <View style={styles.updateIcon}>
              <Text style={styles.updateIconText}>📰</Text>
            </View>
            <View style={styles.updateContent}>
              <Text style={styles.updateMessage}>{update.message}</Text>
              <Text style={styles.updateTime}>{update.time}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Farming Tips Card */}
      <View style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>💡 Tip of the Day</Text>
        <Text style={styles.tipsContent}>
          "Water your plants early morning or late evening to reduce water loss
          through evaporation and ensure better absorption."
        </Text>
        <Text style={styles.tipsAuthor}>- Agricultural Expert</Text>
      </View>

      {/* Bottom Spacing */}
      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fffe",
  },

  // Header Styles
  headerBackground: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  headerImageStyle: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerOverlay: {
    backgroundColor: "rgba(76, 175, 80, 0.8)",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  userName: {
    fontSize: 18,
    color: "#c8e6c9",
    marginBottom: 5,
  },
  dateText: {
    fontSize: 14,
    color: "#c8e6c9",
  },

  // Weather Card
  weatherCard: {
    backgroundColor: "white",
    margin: 20,
    marginTop: -50,
    borderRadius: 20,
    padding: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  weatherHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  weatherTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  viewMore: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "600",
  },
  weatherContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  weatherMain: {
    alignItems: "center",
  },
  temperature: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FF9800",
  },
  condition: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  weatherStats: {
    justifyContent: "space-around",
  },
  weatherStat: {
    alignItems: "center",
  },
  weatherStatLabel: {
    fontSize: 12,
    color: "#666",
  },
  weatherStatValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2196F3",
  },

  // Quick Stats
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    backgroundColor: "white",
    width: (width - 50) / 2,
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 4,
    borderLeftWidth: 5,
    alignItems: "center",
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },

  // Quick Actions
  actionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionCard: {
    width: (width - 50) / 2,
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: "center",
    elevation: 3,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 5,
  },
  actionSubtitle: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },

  // Tasks
  tasksContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  taskCard: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
  },
  taskPriority: {
    width: 4,
    height: "100%",
    borderRadius: 2,
    marginRight: 15,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  taskTime: {
    fontSize: 14,
    color: "#666",
  },
  taskButton: {
    backgroundColor: "#4CAF50",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  taskButtonText: {
    color: "white",
    fontWeight: "bold",
  },

  // Updates
  updatesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  updateCard: {
    backgroundColor: "white",
    flexDirection: "row",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
  },
  updateIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  updateIconText: {
    fontSize: 18,
  },
  updateContent: {
    flex: 1,
  },
  updateMessage: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  updateTime: {
    fontSize: 12,
    color: "#666",
  },

  // Tips Card
  tipsCard: {
    backgroundColor: "#FFF9C4",
    margin: 20,
    padding: 20,
    borderRadius: 15,
    borderLeftWidth: 5,
    borderLeftColor: "#FBC02D",
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F57F17",
    marginBottom: 10,
  },
  tipsContent: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginBottom: 10,
    fontStyle: "italic",
  },
  tipsAuthor: {
    fontSize: 12,
    color: "#666",
    textAlign: "right",
  },
});
