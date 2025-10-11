import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ChatProvider } from '@/app/context/ChatContext';  // Adjust path if context folder is at root; use relative or absolute as per your structure
import 'react-native-reanimated';

import { useColorScheme } from '../hooks/use-color-scheme';  // Adjust path if needed

export const unstable_settings = {
  // The `anchor` property ensures that routing inside the group uses the parent
  // screen as the initial screen when navigating to the group.
  anchor: '(tabs)',
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <ChatProvider>  {/* Moved ChatProvider inside SafeAreaView for better nesting */}
          <SafeAreaView style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: true }}>  {/* Enable header globally, override per screen if needed */}
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />  {/* Hide header for tabs group */}
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
          </SafeAreaView>
        </ChatProvider>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />  {/* Consistent with theme */}
      </ThemeProvider>
    </SafeAreaProvider>
  );
}