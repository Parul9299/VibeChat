import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
  useWindowDimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { ChevronLeft, Palette, Moon, Bell, Lock, User, Shield, LogOut, Info, ChevronRight } from 'lucide-react-native';

interface Item {
  title: string;
  icon: React.ReactNode;
  action: () => void;
  value?: boolean;
  subtitle?: string;
  chevron?: boolean;
}

interface Section {
  title: string;
  icon: React.ReactNode;
  items: Item[];
}

export default function SettingsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1300;
  const isDesktop = width >= 1300;

  // Theme settings
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [systemTheme, setSystemTheme] = useState<boolean>(true);
  
  // Notification settings
  const [messageNotifications, setMessageNotifications] = useState<boolean>(true);
  const [callNotifications, setCallNotifications] = useState<boolean>(true);
  const [groupNotifications, setGroupNotifications] = useState<boolean>(true);
  const [notificationSound, setNotificationSound] = useState<boolean>(true);
  
  // Privacy settings
  const [lastSeen, setLastSeen] = useState<boolean>(true);
  const [profilePhoto, setProfilePhoto] = useState<boolean>(true);
  const [readReceipts, setReadReceipts] = useState<boolean>(true);
  const [blockUnknown, setBlockUnknown] = useState<boolean>(false);
  
  // Account settings
  const [twoFactor, setTwoFactor] = useState<boolean>(false);

  const [selectedSection, setSelectedSection] = useState(0);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) setSystemTheme(false);
  };

  const toggleSystemTheme = () => {
    setSystemTheme(!systemTheme);
    if (systemTheme) setDarkMode(false);
  };

  const settingsSections: Section[] = [
    {
      title: "Theme",
      icon: <Palette size={20} color="#FFDA7C" />,
      items: [
        {
          title: "Dark Mode",
          icon: <Moon size={18} color="#FFDA7C" />,
          action: () => toggleDarkMode(),
          value: darkMode,
        },
        {
          title: "Use System Theme",
          icon: <Palette size={18} color="#FFDA7C" />,
          action: () => toggleSystemTheme(),
          value: systemTheme,
        }
      ]
    },
    {
      title: "Notifications",
      icon: <Bell size={20} color="#FFDA7C" />,
      items: [
        {
          title: "Message Notifications",
          icon: <Bell size={18} color="#FFDA7C" />,
          action: () => setMessageNotifications(!messageNotifications),
          value: messageNotifications,
        },
        {
          title: "Call Notifications",
          icon: <Bell size={18} color="#FFDA7C" />,
          action: () => setCallNotifications(!callNotifications),
          value: callNotifications,
        },
        {
          title: "Group Notifications",
          icon: <Bell size={18} color="#FFDA7C" />,
          action: () => setGroupNotifications(!groupNotifications),
          value: groupNotifications,
        },
        {
          title: "Notification Sound",
          icon: <Bell size={18} color="#FFDA7C" />,
          action: () => setNotificationSound(!notificationSound),
          value: notificationSound,
        }
      ]
    },
    {
      title: "Privacy",
      icon: <Lock size={20} color="#FFDA7C" />,
      items: [
        {
          title: "Last Seen",
          icon: <User size={18} color="#FFDA7C" />,
          action: () => setLastSeen(!lastSeen),
          value: lastSeen,
        },
        {
          title: "Profile Photo",
          icon: <User size={18} color="#FFDA7C" />,
          action: () => setProfilePhoto(!profilePhoto),
          value: profilePhoto,
        },
        {
          title: "Read Receipts",
          icon: <User size={18} color="#FFDA7C" />,
          action: () => setReadReceipts(!readReceipts),
          value: readReceipts,
        },
        {
          title: "Block Unknown Numbers",
          icon: <User size={18} color="#FFDA7C" />,
          action: () => setBlockUnknown(!blockUnknown),
          value: blockUnknown,
        }
      ]
    },
    {
      title: "Account",
      icon: <User size={20} color="#FFDA7C" />,
      items: [
        {
          title: "Two-Factor Authentication",
          icon: <Shield size={18} color="#FFDA7C" />,
          action: () => setTwoFactor(!twoFactor),
          value: twoFactor,
        },
        {
          title: "Log Out",
          icon: <LogOut size={18} color="#FFDA7C" />,
          action: () => console.log('Log out pressed'),
          chevron: true,
        }
      ]
    },
    {
      title: "About",
      icon: <Info size={20} color="#FFDA7C" />,
      items: [
        {
          title: "App Version",
          subtitle: "1.0.0",
          icon: <Info size={18} color="#FFDA7C" />,
          action: () => console.log('App version pressed'),
          chevron: true,
        },
        {
          title: "Terms & Conditions",
          icon: <Info size={18} color="#FFDA7C" />,
          action: () => console.log('Terms pressed'),
          chevron: true,
        },
        {
          title: "Privacy Policy",
          icon: <Info size={18} color="#FFDA7C" />,
          action: () => console.log('Privacy policy pressed'),
          chevron: true,
        }
      ]
    }
  ];

  const renderItem = (item: Item, index: number) => (
    <TouchableOpacity
      key={index}
      style={styles.item}
      onPress={item.action}
      activeOpacity={0.7}
    >
      <View style={styles.itemLeft}>
        <View style={styles.itemIcon}>
          {item.icon}
        </View>
        <View>
          <Text style={styles.itemTitle}>{item.title}</Text>
          {item.subtitle && <Text style={styles.itemSubtitle}>{item.subtitle}</Text>}
        </View>
      </View>
      {item.value !== undefined ? (
        <Switch
          value={item.value}
          onValueChange={item.action}
          trackColor={{ false: "#526F8A", true: "#FFDA7C" }}
          thumbColor={item.value ? "#FFFFFF" : "#051834"}
        />
      ) : item.chevron ? (
        <ChevronRight size={20} color="#526F8A" />
      ) : null}
    </TouchableOpacity>
  );

  const renderSectionItem = (section: Section, index: number) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.sectionItem,
        selectedSection === index && styles.selectedSectionItem
      ]}
      onPress={() => setSelectedSection(index)}
      activeOpacity={0.7}
    >
      <View style={styles.sectionItemLeft}>
        <View style={styles.sectionItemIcon}>
          {section.icon}
        </View>
        <Text style={[
          styles.sectionItemTitle,
          selectedSection === index && styles.selectedSectionItemTitle
        ]}>{section.title}</Text>
      </View>
    </TouchableOpacity>
  );

  if (isMobile) {
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ChevronLeft size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Settings</Text>
          </View>
        </View>

        {/* Settings Content */}
        <ScrollView style={styles.scrollView}>
          {settingsSections.map((section: Section, sectionIndex: number) => (
            <View key={sectionIndex} style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIcon}>
                  {section.icon}
                </View>
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>
              
              <View style={styles.sectionItems}>
                {section.items.map((item: Item, itemIndex: number) => renderItem(item, itemIndex))}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  // Tablet/Desktop layout
  return (
    <View style={styles.desktopContainer}>
      {/* Left Pane - Sections Menu */}
      <View style={[
        styles.leftPane,
        { width: isDesktop ? 300 : 250 }
      ]}>
        <ScrollView style={styles.leftScrollView}>
          {settingsSections.map((section, index) => renderSectionItem(section, index))}
        </ScrollView>
      </View>

      {/* Right Pane - Content */}
      <View style={styles.rightPane}>
        {/* Header with fixed Settings title */}
        <View style={styles.rightHeader}>
          <View style={styles.rightHeaderContent}>
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ChevronLeft size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.rightHeaderTitle}>Settings</Text>
          </View>
        </View>

        {/* Content Area */}
        <ScrollView style={styles.rightContent}>
          <View style={styles.rightSectionItems}>
            {settingsSections[selectedSection].items.map((item, index) => renderItem(item, index))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const themeColor = '#FFDA7C';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B141A',
  },
  desktopContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#0B141A',
  },
  leftPane: {
    borderRightWidth: 1,
    borderRightColor: '#081730',
    backgroundColor: '#051834',
  },
  leftScrollView: {
    flex: 1,
  },
  sectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#031229',
  },
  selectedSectionItem: {
    backgroundColor: 'rgba(255, 218, 124, 0.1)',
  },
  sectionItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionItemIcon: {
    marginRight: 12,
  },
  sectionItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  selectedSectionItemTitle: {
    color: themeColor,
  },
  rightPane: {
    flex: 1,
    backgroundColor: '#031229',
  },
  rightHeader: {
    backgroundColor: '#051834',
    paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#081730',
  },
  rightHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 16,
  },
  rightContent: {
    flex: 1,
  },
  rightSectionItems: {
    backgroundColor: '#051834',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  header: {
    backgroundColor: '#051834',
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 8,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 16,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#051834',
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#031229',
  },
  sectionIcon: {
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  sectionItems: {
    backgroundColor: '#051834',
    borderRadius: 12,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#031229',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    marginRight: 16,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#526F8A',
  },
});