// Main App component for React Native mobile app
// Handles authentication and navigation with shared contracts

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useAuth } from './src/store/useAuthStore-mobile';
import { useCart } from './src/store/useProductStore';
import LoginScreen from './src/screens/LoginScreen';
import ProductListScreen from './src/screens/ProductListScreen';
import CartScreen from './src/screens/CartScreen';
import { COLORS, SPACING, TYPOGRAPHY } from '@pos-mikia/shared';

// Create stack navigator
const Stack = createNativeStackNavigator();

// Create tab navigator
const Tab = createBottomTabNavigator();

// Main POS Screens with Tab Navigation
function POSScreens() {
  const { cartItemsCount } = useCart();
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.text.secondary,
        tabBarStyle: {
          backgroundColor: COLORS.background.primary,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          paddingBottom: SPACING.xs,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: TYPOGRAPHY.fontSize.xs,
          fontWeight: TYPOGRAPHY.fontWeight.medium,
        },
      }}
    >
      <Tab.Screen
        name="Products"
        component={ProductListScreen}
        options={{
          tabBarLabel: 'Products',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>📦</Text>
          ),
          headerStyle: {
            backgroundColor: COLORS.background.primary,
          },
          headerTintColor: COLORS.text.primary,
          title: 'Products',
        }}
      />
      
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({ color, size }) => (
            <View style={{ position: 'relative' }}>
              <Text style={{ color, fontSize: size }}>🛒</Text>
              {cartItemsCount > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    right: -8,
                    top: -4,
                    backgroundColor: COLORS.error,
                    borderRadius: 10,
                    width: 20,
                    height: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 10,
                      fontWeight: 'bold',
                    }}
                  >
                    {cartItemsCount > 99 ? '99+' : cartItemsCount}
                  </Text>
                </View>
              )}
            </View>
          ),
          headerStyle: {
            backgroundColor: COLORS.background.primary,
          },
          headerTintColor: COLORS.text.primary,
          title: 'Shopping Cart',
        }}
      />
    </Tab.Navigator>
  );
}

// Main POS Screen (placeholder for now)
function DashboardScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        Dashboard
      </Text>
      <Text style={{ color: COLORS.text.secondary }}>
        Analytics and reports coming soon!
      </Text>
    </View>
  );
}

// Settings Screen
function SettingsScreen() {
  const { signOut } = useAuth();
  
  const handleSignOut = () => {
    signOut();
  };

  return (
    <View style={{ flex: 1, padding: SPACING.md }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 24 }}>
        Settings
      </Text>
      
      <TouchableOpacity
        style={{
          backgroundColor: COLORS.error,
          padding: SPACING.md,
          borderRadius: 8,
          alignItems: 'center',
        }}
        onPress={handleSignOut}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>
          Sign Out
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// Authenticated App with Tab Navigation
function AuthenticatedApp() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.text.secondary,
        tabBarStyle: {
          backgroundColor: COLORS.background.primary,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          paddingBottom: SPACING.xs,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: TYPOGRAPHY.fontSize.xs,
          fontWeight: TYPOGRAPHY.fontWeight.medium,
        },
        headerStyle: {
          backgroundColor: COLORS.background.primary,
        },
        headerTintColor: COLORS.text.primary,
      }}
    >
      <Tab.Screen
        name="POS"
        component={POSScreens}
        options={{
          tabBarLabel: 'POS',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>💳</Text>
          ),
          headerShown: false,
        }}
      />
      
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>📊</Text>
          ),
        }}
      />
      
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>⚙️</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const { user, isAuthenticated, isLoading, initializeAuth } = useAuth();

  useEffect(() => {
    initializeAuth();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: SPACING.md, color: COLORS.text.secondary }}>
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor={COLORS.primary} />
      
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated && user ? (
          <Stack.Screen name="Main" component={AuthenticatedApp} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
