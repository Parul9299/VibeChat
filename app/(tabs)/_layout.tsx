import { Tabs, Slot, useRouter, usePathname } from 'expo-router';
import { MessageCircle, Users, CircleDashed, Settings, PhoneCall } from 'lucide-react-native';
import { Dimensions, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from '@/hooks/use-color-scheme'; // same hook as RootLayout

const { width } = Dimensions.get('window');
const isMobile = width < 768;
const isTablet = width >= 768 && width < 1300;
const isDesktop = width >= 1300;

const tabConfig = [
  { name: 'index', title: 'Home', Icon: MessageCircle },
  { name: 'status', title: 'Status', Icon: CircleDashed },
  { name: 'contacts', title: 'Contacts', Icon: Users },
  { name: 'calls', title: 'Calls', Icon: PhoneCall }
];

const routes = {
  index: '/' as const,
  contacts: '/contacts' as const,
  status: '/status' as const,
  calls: '/calls' as const,
};

export default function TabLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  const activeRoute = pathname === '/' ? 'index' : pathname.split('/')[1];

  return (
    <ThemeProvider value={theme}>
      {isMobile ? (
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: theme.colors.card,
              borderTopColor: 'transparent',
              height: 49,
              paddingBottom: 8,
            },
            tabBarActiveTintColor: theme.colors.primary,
            tabBarInactiveTintColor: theme.colors.text,
          }}
        >
          {tabConfig.map(({ name, title, Icon }) => (
            <Tabs.Screen
              key={name}
              name={name}
              options={{
                title,
                tabBarIcon: ({ color, focused }) => (
                  <Icon
                    size={24}
                    color={color}
                    fill={focused ? color : 'none'}
                  />
                ),
              }}
            />
          ))}
        </Tabs>
      ) : (
        // Tablet & Desktop: same layout for all routes
        <View
          style={[styles.container, { backgroundColor: theme.colors.background }]}
        >
          <View style={[styles.sidebar, { backgroundColor: theme.colors.card }]}>
            {tabConfig.map(({ name, title, Icon }) => (
              <TouchableOpacity
                key={name}
                onPress={() => router.push(routes[name as keyof typeof routes])}
                style={[
                  styles.sidebarItem,
                  activeRoute === name && {
                    backgroundColor:
                      colorScheme === 'dark'
                        ? 'rgba(255,255,255,0.1)'
                        : 'rgba(0,0,0,0.05)',
                  },
                ]}
              >
                <Icon
                  size={24}
                  color={
                    activeRoute === name
                      ? theme.colors.primary
                      : theme.colors.text
                  }
                  fill={
                    activeRoute === name
                      ? theme.colors.primary
                      : 'none'
                  }
                />
              </TouchableOpacity>
            ))}
          </View>
          <View style={[styles.mainContent, { backgroundColor: '#F0F2F5' }]}>
            <Slot />
          </View>
        </View>
      )}
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 70,
    paddingVertical: 20,
    paddingHorizontal: 18,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginVertical: 4,
    borderRadius: 8,
  },
  sidebarText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
});
