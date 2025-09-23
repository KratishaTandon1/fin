import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [registeredUsers, setRegisteredUsers] = useState([]);

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      // Load current user
      const storedUser = await AsyncStorage.getItem('currentUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      // Load or initialize demo users for testing
      let storedUsers = await AsyncStorage.getItem('registeredUsers');
      if (!storedUsers) {
        // Initialize with demo users for easy testing
        const demoUsers = [
          {
            id: 'demo1',
            name: 'Demo User',
            email: 'demo@test.com',
            password: '123456',
            farmName: 'Green Valley Farm',
            farmSize: '5 acres',
            location: 'Punjab, India',
            soilType: 'Alluvial Soil',
            primaryCrops: ['🌾 Wheat', '🌾 Rice'],
            language: 'Hindi',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'test1',
            name: 'Test User',
            email: 'test@test.com',
            password: '123456',
            farmName: 'Sunrise Farm',
            farmSize: '10 acres',
            location: 'Maharashtra, India',
            soilType: 'Black Soil',
            primaryCrops: ['☁️ Cotton', '🎋 Sugarcane'],
            language: 'English',
            createdAt: new Date().toISOString(),
          }
        ];
        
        setRegisteredUsers(demoUsers);
        await AsyncStorage.setItem('registeredUsers', JSON.stringify(demoUsers));
      } else {
        setRegisteredUsers(JSON.parse(storedUsers));
      }
    } catch (error) {
      console.error('Failed to load stored data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (name, password) => {
    try {
      const foundUser = registeredUsers.find(
        u => u.name.toLowerCase() === name.toLowerCase() && u.password === password
      );

      if (foundUser) {
        setUser(foundUser);
        await AsyncStorage.setItem('currentUser', JSON.stringify(foundUser));
        return { success: true, user: foundUser };
      } else {
        return { success: false, error: 'Invalid credentials or user not found' };
      }
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      await AsyncStorage.removeItem('currentUser');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const register = async (userData) => {
    try {
      const existingUser = registeredUsers.find(
        u => u.name.toLowerCase() === userData.name.toLowerCase() || 
             u.email.toLowerCase() === userData.email.toLowerCase()
      );

      if (existingUser) {
        return { success: false, error: 'User already exists with this name or email' };
      }

      const newUser = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      const updatedUsers = [...registeredUsers, newUser];
      setRegisteredUsers(updatedUsers);
      await AsyncStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));

      return { success: true, user: newUser };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    isLoading,
    signIn,
    signOut,
    register,
    registeredUsers,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
