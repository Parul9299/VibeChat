import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
} from 'react-native';
import { ChevronRight, Moon, Bell, Lock, User, Palette, Shield, LogOut, Info } from 'lucide-react-native';

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
      icon: <Palette size={20} color="#8B5CF6" />,
      items: [
        {
          title: "Dark Mode",
          icon: <Moon size={18} color="#8B5CF6" />,
          action: () => toggleDarkMode(),
          value: darkMode,
        },
        {
          title: "Use System Theme",
          icon: <Palette size={18} color="#8B5CF6" />,
          action: () => toggleSystemTheme(),
          value: systemTheme,
        }
      ]
    },
    {
      title: "Notifications",
      icon: <Bell size={20} color="#8B5CF6" />,
      items: [
        {
          title: "Message Notifications",
          icon: <Bell size={18} color="#8B5CF6" />,
          action: () => setMessageNotifications(!messageNotifications),
          value: messageNotifications,
        },
        {
          title: "Call Notifications",
          icon: <Bell size={18} color="#8B5CF6" />,
          action: () => setCallNotifications(!callNotifications),
          value: callNotifications,
        },
        {
          title: "Group Notifications",
          icon: <Bell size={18} color="#8B5CF6" />,
          action: () => setGroupNotifications(!groupNotifications),
          value: groupNotifications,
        },
        {
          title: "Notification Sound",
          icon: <Bell size={18} color="#8B5CF6" />,
          action: () => setNotificationSound(!notificationSound),
          value: notificationSound,
        }
      ]
    },
    {
      title: "Privacy",
      icon: <Lock size={20} color="#8B5CF6" />,
      items: [
        {
          title: "Last Seen",
          icon: <User size={18} color="#8B5CF6" />,
          action: () => setLastSeen(!lastSeen),
          value: lastSeen,
        },
        {
          title: "Profile Photo",
          icon: <User size={18} color="#8B5CF6" />,
          action: () => setProfilePhoto(!profilePhoto),
          value: profilePhoto,
        },
        {
          title: "Read Receipts",
          icon: <User size={18} color="#8B5CF6" />,
          action: () => setReadReceipts(!readReceipts),
          value: readReceipts,
        },
        {
          title: "Block Unknown Numbers",
          icon: <User size={18} color="#8B5CF6" />,
          action: () => setBlockUnknown(!blockUnknown),
          value: blockUnknown,
        }
      ]
    },
    {
      title: "Account",
      icon: <User size={20} color="#8B5CF6" />,
      items: [
        {
          title: "Two-Factor Authentication",
          icon: <Shield size={18} color="#8B5CF6" />,
          action: () => setTwoFactor(!twoFactor),
          value: twoFactor,
        },
        {
          title: "Log Out",
          icon: <LogOut size={18} color="#8B5CF6" />,
          action: () => console.log('Log out pressed'),
          chevron: true,
        }
      ]
    },
    {
      title: "About",
      icon: <Info size={20} color="#8B5CF6" />,
      items: [
        {
          title: "App Version",
          subtitle: "1.0.0",
          icon: <Info size={18} color="#8B5CF6" />,
          action: () => console.log('App version pressed'),
          chevron: true,
        },
        {
          title: "Terms & Conditions",
          icon: <Info size={18} color="#8B5CF6" />,
          action: () => console.log('Terms pressed'),
          chevron: true,
        },
        {
          title: "Privacy Policy",
          icon: <Info size={18} color="#8B5CF6" />,
          action: () => console.log('Privacy policy pressed'),
          chevron: true,
        }
      ]
    }
  ];

  const renderItem = (item: Item, index: number, sectionIndex: number) => (
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
          trackColor={{ false: "#E0E0E0", true: "#8B5CF6" }}
          thumbColor={item.value ? "#FFFFFF" : "#F0F0F0"}
        />
      ) : item.chevron ? (
        <ChevronRight size={20} color="#667781" />
      ) : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
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
              {section.items.map((item: Item, itemIndex: number) => renderItem(item, itemIndex, sectionIndex))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const themeColor = '#8B5CF6';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  header: {
    backgroundColor: themeColor,
    paddingTop: 44,
    paddingBottom: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  sectionIcon: {
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111B21',
  },
  sectionItems: {
    backgroundColor: 'white',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
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
    color: '#111B21',
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#667781',
  },
});