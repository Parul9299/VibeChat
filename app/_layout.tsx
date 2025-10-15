import React, { useEffect, useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';
import { ChatProvider } from '@/app/context/ChatContext';
import 'react-native-reanimated';
import { useColorScheme } from '../hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  // ✅ Check if user is logged in
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        setIsLoggedIn(!!token);
      } catch (error) {
        console.error('Error checking login status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  // ✅ Redirect based on login status and current route
  useEffect(() => {
    if (isLoading) return;

    // Allow both signup and login routes as "auth group"
    const inAuthGroup = segments[0] === 'signup' || segments[0] === 'login';

    if (isLoggedIn && inAuthGroup) {
      router.replace('/'); // Go to home if logged in
    } else if (!isLoggedIn && !inAuthGroup) {
      router.replace('/signup'); // Go to signup if not logged in
    }
  }, [isLoading, isLoggedIn, segments]);

  // ✅ Show loader while checking AsyncStorage
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // ✅ App Layout
  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <ChatProvider>
          <SafeAreaView style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: true }}>
              {/* Main Tabs */}
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

              {/* Settings Page */}
              <Stack.Screen
                name="setting"
                options={{
                  presentation: 'containedModal',
                  title: 'Settings',
                  headerShown: false,
                }}
              />

              {/* Auth Screens */}
              <Stack.Screen
                name="signup"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="login"
                options={{
                  headerShown: false,
                }}
              />

              {/* Optional Modal */}
              <Stack.Screen
                name="modal"
                options={{
                  presentation: 'modal',
                  title: 'Modal',
                }}
              />
            </Stack>
          </SafeAreaView>
        </ChatProvider>

        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
