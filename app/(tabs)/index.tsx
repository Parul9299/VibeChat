import React, { useState, useRef, useLayoutEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  StatusBar,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useChat } from '../context/ChatContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  Search,
  MoreVertical,
  Paperclip,
  Mic,
  Send,
  Phone,
  Video,
  MessageCircle,
  Bell,
  ChevronLeft,
  ChevronRight,
  Download,
  CheckCheck,
  X,
  Check
} from 'lucide-react-native';

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  type: 'individual' | 'group';
  timestamp: number;
  handle?: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'them';
  time: string;
  status: 'read' | 'sent' | 'unread';
  imageUrl?: string;
}

interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  about: string;
  isAdmin: boolean;
}

type RootStackParamList = {
  Settings: undefined;
  Profile: undefined;
  Login: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const API_BASE_URL = 'http://localhost:3000/api';

const getGroupMembers = (chatId: string): GroupMember[] => {
  // Mock data based on chatId
  switch (chatId) {
    case '4':
      return [
        { id: 'm1', name: 'Neha Khanna', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=60', about: 'Project lead', isAdmin: true },
        { id: 'm2', name: 'Sumit Kumar', avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&auto=format&fit=crop&q=60', about: 'Developer', isAdmin: false },
        { id: 'm3', name: '+91 98765 43321', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=60', about: 'Designer', isAdmin: false },
      ];
    case '6':
      return [
        { id: 'm4', name: 'Kunal Desai', avatar: 'https://images.unsplash.com/photo-1578445714074-946b536079aa?w=150&auto=format&fit=crop&q=60', about: 'Team lead', isAdmin: true },
        { id: 'm5', name: 'Raman Kumar', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=60', about: 'Engineer', isAdmin: false },
        { id: 'm6', name: 'David Kim', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=60', about: 'Artist', isAdmin: false },
      ];
    case '7':
      return [
        { id: 'm7', name: 'Krishna Thakur', avatar: 'https://images.unsplash.com/photo-1578445714074-946b536079aa?w=150&auto=format&fit=crop&q=60', about: 'Manager', isAdmin: true },
        { id: 'm8', name: 'Lisa Anderson', avatar: 'https://images.unsplash.com/photo-1578445714074-946b536079aa?w=150&auto=format&fit=crop&q=60', about: 'Traveler', isAdmin: false },
        { id: 'm9', name: 'Mike Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=60', about: 'Tech enthusiast', isAdmin: false },
      ];
    default:
      return [];
  }
};

const getGroupCreator = (chatId: string) => {
  // Mock creator data
  switch (chatId) {
    case '4':
      return { name: 'Neha Khanna', createdAt: 'October 10, 2025, 2:30 PM', isMe: true };
    case '6':
      return { name: 'Kunal Desai', createdAt: 'October 11, 2025, 3:45 PM', isMe: false };
    case '7':
      return { name: 'Krishna Thakur', createdAt: 'October 9, 2025, 10:15 AM', isMe: false };
    default:
      return { name: 'Unknown', createdAt: 'Unknown', isMe: false };
  }
};

const getContactBackground = (chatName: string) => {
  // Mock background image based on contact name
  switch (chatName.toLowerCase()) {
    case 'olivia':
      return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&fit=crop';
    default:
      return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&fit=crop';
  }
};

const themeColor = '#FFDA7C';

export default function TabOneScreen() {
  const router = useRouter();
  const navigation = useNavigation<NavigationProp>();
  const { state, dispatch } = useChat();
  const { width, height } = useWindowDimensions();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1300;
  const isDesktop = width >= 1300;

  const [showInfo, setShowInfo] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showHeaderDropdown, setShowHeaderDropdown] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showMediaCarousel, setShowMediaCarousel] = useState(false);
  const [carouselStartIndex, setCarouselStartIndex] = useState(0);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const carouselFlatListRef = useRef<FlatList>(null);

  const handleLogout = async () => {
    try {
      // Step 1: Fetch and clean token (strip quotes + trim)
      let rawToken = await AsyncStorage.getItem('userToken');
      const token = rawToken ? rawToken.replace(/^["']|["']$/g, '').trim() : null; // Removes leading/trailing " or '
      console.log('Raw token from storage:', rawToken);
      console.log('Cleaned token length:', token?.length);
      console.log('Full Auth header value:', `Bearer ${token}`);

      if (!token) {
        console.warn('No valid token found, forcing logout locally.');
        await AsyncStorage.removeItem('userToken');
        router.replace('/login');
        return;
      }

      // Step 2: Call logout API with cleaned token
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Now clean
        },
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Full response data:', data);

      if (!response.ok) {
        console.error('Logout API failed:', data);
      }

      // Step 3: Remove token from AsyncStorage
      await AsyncStorage.removeItem('userToken');

      // Step 4: Navigate to login
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Something went wrong during logout.');
    } finally {
      closeAllDropdowns();
    }
  };

  useLayoutEffect(() => {
    if (state.selectedChatId) {
      (navigation as any).setOptions({
        tabBarStyle: { display: 'none' },
      });
    } else {
      (navigation as any).setOptions({
        tabBarStyle: { display: 'flex' },
      });
    }
  }, [state.selectedChatId, navigation]);

  const selectedChat = state.chats.find(chat => chat.id === state.selectedChatId);
  const selectedMessages = useMemo(() => state.messagesByChat[state.selectedChatId || ''] || [], [state.messagesByChat, state.selectedChatId]);

  const filteredChats = useMemo(() =>
    state.chats
      .filter(chat => chat.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => b.timestamp - a.timestamp),
    [state.chats, searchQuery]
  );

  const mediaImages = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&fit=crop',
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b5?w=400&fit=crop',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&fit=crop',
    'https://images.unsplash.com/photo-1534088561358-1890a1c9d1f3?w=400&fit=crop',
    'https://images.unsplash.com/photo-1517457373958-b7bdd4587206?w=400&fit=crop',
    'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&fit=crop',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&fit=crop',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&fit=crop',
    'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&fit=crop'
  ];

  const headerDropdownItems = [
    { label: 'Settings' },
    { label: 'Profile' },
    { label: 'Logout' }
  ];

  const closeAllDropdowns = () => {
    setShowDropdown(false);
    setShowHeaderDropdown(false);
  };

  const toggleHeaderDropdown = () => {
    setShowHeaderDropdown(!showHeaderDropdown);
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    setShowHeaderDropdown(false);
  };

  const toggleInfoPane = () => {
    setShowInfo(!showInfo);
    closeAllDropdowns();
  };

  const sendMessage = () => {
    if (!state.selectedChatId || newMessage.trim() === '') return;
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const prefix = selectedChat?.type === 'group' ? '~You: ' : '';
    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'me',
      time: currentTime,
      status: 'sent'
    };
    dispatch({ type: 'ADD_MESSAGE', payload: { chatId: state.selectedChatId, message } });
    dispatch({ type: 'UPDATE_CHAT', payload: { id: state.selectedChatId, updates: { lastMessage: prefix + newMessage, time: currentTime, unread: 0, timestamp: Date.now() } } });
    setNewMessage('');
    closeAllDropdowns();
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const handleOutsideClick = () => {
    closeAllDropdowns();
  };

  const openImageModal = (avatarUrl: string) => {
    setSelectedAvatar(avatarUrl);
    setShowImageModal(true);
    closeAllDropdowns();
  };

  const openMediaCarousel = (startIndex: number) => {
    setCarouselStartIndex(startIndex);
    setCurrentCarouselIndex(startIndex);
    setShowMediaCarousel(true);
    closeAllDropdowns();
  };

  const scrollToCarouselIndex = (targetIndex: number) => {
    const offset = targetIndex * width;
    carouselFlatListRef.current?.scrollToOffset({ offset, animated: true });
    setCurrentCarouselIndex(targetIndex);
  };

  const renderMediaThumbnail = ({ item, index }: { item: number; index: number }) => {
    if (index < 6) {
      return (
        <TouchableOpacity onPress={() => openMediaCarousel(index)}>
          <Image source={{ uri: mediaImages[index] }} style={styles.mediaThumbnail} />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity style={styles.seeMoreContainer} onPress={() => openMediaCarousel(10)}>
          <ChevronRight size={20} color="#526F8A" />
          <Text style={styles.seeMoreText}>See more</Text>
        </TouchableOpacity>
      );
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.sender === 'me';
    const bubbleStyle = [
      styles.messageBubble,
      {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      isMe
        ? {
          backgroundColor: '#182231ff',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20
        }
        : {
          backgroundColor: '#17243aff',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20
        }
    ];
    return (
      <View style={[
        styles.messageContainer,
        { justifyContent: isMe ? 'flex-end' : 'flex-start' }
      ]}>
        <View style={bubbleStyle}>
          {item.imageUrl ? (
            <>
              <Image source={{ uri: item.imageUrl }} style={styles.messageImage} />
              <View style={styles.messageFooter}>
                <Text style={isMe ? styles.timeWhite : styles.time}>{item.time}</Text>
                {isMe && (
                  <View style={{ marginLeft: 4 }}>
                    {item.status === 'read' ? <CheckCheck size={14} color="#FFFFFF" /> : <Check size={14} color="#FFFFFF" />}
                  </View>
                )}
              </View>
            </>
          ) : (
            <>
              <Text style={isMe ? styles.messageTextWhite : styles.messageText}>{item.text}</Text>
              <View style={styles.messageFooter}>
                <Text style={isMe ? styles.timeWhite : styles.time}>{item.time}</Text>
                {isMe && (
                  <View style={{ marginLeft: 4 }}>
                    {item.status === 'read' ? <CheckCheck size={14} color="#FFFFFF" /> : <Check size={14} color="#FFFFFF" />}
                  </View>
                )}
              </View>
            </>
          )}
        </View>
      </View>
    );
  };

  const renderChatItem = ({ item }: { item: Chat }) => {
    const isSelected = state.selectedChatId === item.id;
    return (
      <TouchableOpacity
        style={[
          styles.chatCard,
          {
            backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.05)' : '#051834',
            borderColor: isSelected ? 'transparent' : 'transparent',
            borderBottomColor: isSelected ? 'transparent' : 'rgba(255, 255, 255, 0.1)',
          }
        ]}
        onPress={() => {
          dispatch({ type: 'UPDATE_CHAT', payload: { id: item.id, updates: { unread: 0 } } });
          dispatch({ type: 'SET_SELECTED_CHAT', payload: item.id });
          closeAllDropdowns();
          if (isDesktop) setShowInfo(false);
        }}
      >
        <TouchableOpacity onPress={() => openImageModal(item.avatar)}>
          <Image source={{ uri: item.avatar }} style={styles.avatarSmall} />
        </TouchableOpacity>
        <View style={styles.chatInfo}>
          <Text style={[
            styles.chatName,
            { color: isSelected ? themeColor : '#FFFFFF' }
          ]} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
          <Text style={[
            styles.chatHandle,
            item.unread > 0 ? { fontWeight: 'bold', color: '#FFFFFF' } : {}
          ]} numberOfLines={1} ellipsizeMode="tail">{item.handle || item.lastMessage}</Text>
        </View>
        <View style={styles.chatMeta}>
          <Text style={styles.chatTime}>{item.time}</Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread > 99 ? '99+' : item.unread}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeaderDropdown = (isMobileLayout: boolean) => {
    const dropdownStyle = isMobileLayout
      ? [styles.headerDropdownMobile, { top: Platform.OS === 'ios' ? 120 : 100 }]
      : styles.headerDropdownDesktop;
    return (
      <View style={dropdownStyle}>
        <FlatList
          data={headerDropdownItems}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={async () => {
                closeAllDropdowns();
                if (item.label === 'Settings') {
                  router.push('/settings');
                } else if (item.label === 'Profile') {
                  router.push('/profile');
                } else if (item.label === 'Logout') {
                  await handleLogout();
                }
              }}
            >
              <Text style={styles.dropdownItemText}>{item.label}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.label}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  };

  const WelcomeScreen = () => (
    <ScrollView contentContainerStyle={styles.welcomeContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.welcomeIcon}>
        <MessageCircle size={200} color='#FFDF8C' />
      </View>
      <Text style={styles.welcomeTitle}>Download VibeChat for Windows</Text>
      <Text style={styles.welcomeSubtitle}>Make calls, share your screen and get a faster experience when you download the app.</Text>
      <TouchableOpacity style={[styles.downloadBtn, { backgroundColor: '#CA973E' }]} onPress={closeAllDropdowns}>
        <Download size={20} color="white" style={{ marginRight: 8 }} />
        <Text style={styles.downloadBtnText}>Download</Text>
      </TouchableOpacity>
      <Text style={styles.welcomeNote}>Your personal messages are end-to-end encrypted</Text>
    </ScrollView>
  );

  const dropdownItems = [
    { label: 'Select messages', icon: 'check-square' },
    { label: 'Mute notifications', icon: 'bell-off' },
    { label: 'Disappearing messages', icon: 'clock' },
    { label: 'Clear chat', icon: 'trash-2' },
    { label: 'Report', icon: 'alert-triangle' },
    { label: 'Block', icon: 'block' },
    { label: 'Delete chat', icon: 'x' }
  ];

  const fullImageStyle = {
    width: width * 0.9,
    height: height * 0.7,
    resizeMode: 'contain' as const,
  };

  const renderGroupMember = ({ item }: { item: GroupMember }) => (
    <View style={styles.groupMemberItem}>
      <TouchableOpacity onPress={() => openImageModal(item.avatar)}>
        <Image source={{ uri: item.avatar }} style={styles.groupMemberAvatar} />
      </TouchableOpacity>
      <View style={styles.groupMemberInfo}>
        <View style={styles.groupMemberHeader}>
          <Text style={styles.groupMemberName}>{item.name}</Text>
          {item.isAdmin && <Text style={styles.adminText}>admin</Text>}
        </View>
        <Text style={styles.groupMemberAbout}>{item.about}</Text>
      </View>
      {!item.isAdmin && (
        <TouchableOpacity
          style={styles.removeMemberBtn}
          onPress={() => {
            Alert.alert(
              'Remove Member',
              `Remove ${item.name} from the group?`,
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Remove',
                  style: 'destructive',
                  onPress: () => {
                    // Mock removal logic - in real app, dispatch action to update group members
                    Alert.alert('Member Removed', `${item.name} has been removed from the group.`);
                  },
                },
              ]
            );
          }}
        >
          <Text style={styles.removeMemberText}>Remove</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderInfoContent = () => {
    if (!selectedChat) return null;
    const isGroup = selectedChat.type === 'group';
    const infoTitle = isGroup ? 'Group info' : 'Contact info';
    const groupMembers = isGroup ? getGroupMembers(selectedChat.id) : [];
    const creator = isGroup ? getGroupCreator(selectedChat.id) : null;
    const memberCount = groupMembers.length;
    const contactBg = !isGroup ? getContactBackground(selectedChat.name) : null;

    const content = (
      <ScrollView style={styles.infoContent} contentContainerStyle={{ paddingBottom: 20 }}>
        <TouchableOpacity onPress={() => openImageModal(selectedChat.avatar)}>
          <Image source={{ uri: selectedChat.avatar }} style={styles.largeAvatar} />
        </TouchableOpacity>
        <Text style={styles.infoName}>{selectedChat.name}</Text>

        {isGroup ? (
          <>
            {/* Members count */}
            <View style={styles.infoSection}>
              <Text style={styles.infoAbout}>{memberCount} members</Text>
            </View>

            {/* Creator */}
            {creator && (
              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Created by</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={styles.infoAbout}>{`Group created by ${creator.isMe ? 'you' : creator.name}`}</Text>
                  <Text style={styles.infoAbout}>{creator.createdAt}</Text>
                </View>
              </View>
            )}

            {/* Media Section */}
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Media, links, and docs</Text>
              <FlatList
                data={Array.from({ length: 7 }, (_, index) => index)}
                renderItem={renderMediaThumbnail}
                keyExtractor={(item) => item.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
              />
            </View>

            {/* Group Members */}
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Group members</Text>
              <FlatList
                data={groupMembers}
                renderItem={renderGroupMember}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
              />
            </View>

            {/* Actions */}
            <View style={styles.infoSection}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => {
                  Alert.alert(
                    'Exit Group',
                    `Leave ${selectedChat.name}? You won't receive updates after leaving.`,
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Exit',
                        style: 'destructive',
                        onPress: () => {
                          dispatch({ type: 'REMOVE_CHAT', payload: selectedChat.id });
                          dispatch({ type: 'SET_SELECTED_CHAT', payload: null });
                        },
                      },
                    ]
                  );
                }}
              >
                <Text style={styles.actionBtnText}>Exit Group</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={closeAllDropdowns}>
                <Text style={styles.actionBtnText}>Report Group</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            {/* About Section for Individual */}
            <View style={styles.contactInfoSection}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.infoAbout}>Loves coffee ☕</Text>
              <TouchableOpacity style={styles.editBtn}>
                <Text style={styles.editBtnText}>Edit</Text>
              </TouchableOpacity>
            </View>

            {/* Media Section */}
            <View style={styles.contactInfoSection}>
              <Text style={styles.sectionTitle}>Media, links, and docs</Text>
              <FlatList
                data={Array.from({ length: 7 }, (_, index) => index)}
                renderItem={renderMediaThumbnail}
                keyExtractor={(item) => item.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
              />
            </View>

            {/* Actions for Individual */}
            <View style={styles.contactInfoSection}>
              <TouchableOpacity style={styles.actionBtn} onPress={closeAllDropdowns}>
                <Text style={styles.actionBtnText}>Block {selectedChat?.name}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={closeAllDropdowns}>
                <Text style={styles.actionBtnText}>Report {selectedChat?.name}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    );

    if (!isGroup && contactBg) {
      return (
        <ImageBackground
          source={{ uri: contactBg }}
          style={styles.infoContent}
          imageStyle={{ opacity: 0.3 }}
          resizeMode="cover"
        >
          {content}
        </ImageBackground>
      );
    }

    return content;
  };

  const chatBackgroundUrl = 'https://wallpapercave.com/wp/wp10254485.jpg';

  // Mobile layout
  if (isMobile) {
    if (!state.selectedChatId) {
      // Full screen chat list
      return (
        <View style={styles.flex1}>
          <TouchableWithoutFeedback onPress={handleOutsideClick}>
            <View style={{ flex: 1 }}>
              <View style={[styles.chatsHeader, { paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0 }]}>
                <View style={styles.logoContainer}>
                  <View style={styles.vibeLogo}>
                    <Text style={styles.logoHeart}>♥</Text>
                    <Text style={styles.logoText}>VibeChat</Text>
                  </View>
                  <TouchableOpacity onPress={toggleHeaderDropdown}><MoreVertical size={24} color={themeColor} /></TouchableOpacity>
                </View>
                <View style={styles.searchContainer}>
                  <Search size={20} color="#526F8A" />
                  <TextInput
                    placeholder="Search or start new chat"
                    style={styles.searchInput}
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                  />
                </View>
              </View>
              <FlatList
                data={filteredChats}
                renderItem={renderChatItem}
                keyExtractor={item => item.id}
                style={styles.chatsList}
                contentContainerStyle={{ paddingBottom: 20, paddingTop: 8 }}
              />
            </View>
          </TouchableWithoutFeedback>
          {showHeaderDropdown && renderHeaderDropdown(true)}
          {/* Modals */}
          <Modal visible={showImageModal} transparent animationType="fade" onRequestClose={() => setShowImageModal(false)}>
            <View style={styles.modalOverlay}>
              <TouchableOpacity style={styles.modalClose} onPress={() => setShowImageModal(false)}>
                <X size={32} color="white" />
              </TouchableOpacity>
              <Image source={{ uri: selectedAvatar }} style={fullImageStyle} />
            </View>
          </Modal>
          <Modal visible={showMediaCarousel} transparent={true} animationType="slide" onRequestClose={() => setShowMediaCarousel(false)}>
            <View style={styles.carouselModalOverlay}>
              <View style={styles.carouselHeader}>
                <View style={styles.carouselHeaderLeft}>
                  <Image source={{ uri: selectedChat?.avatar || '' }} style={styles.avatar} />
                  <Text style={styles.carouselHeaderName}>{selectedChat?.name || 'Media'}</Text>
                </View>
                <TouchableOpacity style={styles.iconBtn} onPress={() => setShowMediaCarousel(false)}>
                  <X size={24} color="white" />
                </TouchableOpacity>
              </View>
              <FlatList
                ref={carouselFlatListRef}
                style={[styles.flex1, { paddingBottom: 80 }]}
                data={mediaImages}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                initialScrollIndex={carouselStartIndex}
                getItemLayout={(data, index) => ({ length: width, offset: width * index, index })}
                onMomentumScrollEnd={(event) => {
                  const index = Math.round(event.nativeEvent.contentOffset.x / width);
                  setCurrentCarouselIndex(index);
                }}
                renderItem={({ item, index }) => (
                  <View style={[{ width, height: height - 140, justifyContent: 'center', alignItems: 'center' }]}>
                    <Image source={{ uri: item }} style={styles.carouselImage} />
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
              <TouchableOpacity
                style={[styles.carouselNavBtn, styles.prevBtn]}
                onPress={() => {
                  if (currentCarouselIndex > 0) {
                    scrollToCarouselIndex(currentCarouselIndex - 1);
                  }
                }}
              >
                <ChevronLeft size={30} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.carouselNavBtn, styles.nextBtn]}
                onPress={() => {
                  if (currentCarouselIndex < mediaImages.length - 1) {
                    scrollToCarouselIndex(currentCarouselIndex + 1);
                  }
                }}
              >
                <ChevronRight size={30} color="white" />
              </TouchableOpacity>
              <View style={styles.carouselFooter}>
                <FlatList
                  data={mediaImages}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      onPress={() => scrollToCarouselIndex(index)}
                      style={[
                        styles.previewThumb,
                        { opacity: index === currentCarouselIndex ? 1 : 0.5 }
                      ]}
                    >
                      <Image source={{ uri: item }} style={styles.previewImage} />
                    </TouchableOpacity>
                  )}
                  keyExtractor={(_, i) => i.toString()}
                />
              </View>
            </View>
          </Modal>
        </View>
      );
    }

    // Mobile chat view
    return (
      <KeyboardAvoidingView style={styles.flex1} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={closeAllDropdowns}>
          <View style={{ flex: 1 }}>
            <View style={[styles.header, {
              backgroundColor: '#051834',
              paddingTop: Platform.OS === 'web' ? 20 : (Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0)
            }]}>
              {/* Back button for mobile */}
              <TouchableOpacity style={styles.iconBtn} onPress={() => dispatch({ type: 'SET_SELECTED_CHAT', payload: null })}>
                <ChevronLeft size={24} color="#FFFFFF" />
              </TouchableOpacity>
              {/* Info toggle */}
              <TouchableOpacity style={styles.headerLeft} onPress={toggleInfoPane}>
                <Image source={{ uri: selectedChat?.avatar }} style={styles.avatar} />
                <View style={styles.headerInfo}>
                  <Text style={styles.headerName} numberOfLines={1} ellipsizeMode="tail">{selectedChat?.name}</Text>
                  {selectedChat?.type === 'group' ? (
                    <Text style={styles.headerStatus} numberOfLines={1} ellipsizeMode="tail">
                      {getGroupMembers(selectedChat.id).map(m => m.name).join(', ')}
                    </Text>
                  ) : (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={styles.onlineDot} />
                      <Text style={styles.headerStatus}>Online</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
              <View style={styles.headerActions}>
                {showMediaCarousel ? (
                  <TouchableOpacity style={styles.iconBtn} onPress={() => setShowMediaCarousel(false)}>
                    <X size={24} color="white" />
                  </TouchableOpacity>
                ) : (
                  <>
                    <TouchableOpacity style={styles.iconBtn} onPress={closeAllDropdowns}><Phone size={24} color="#FFFFFF" /></TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn} onPress={closeAllDropdowns}><Video size={24} color="#FFFFFF" /></TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn} onPress={toggleDropdown}>
                      <MoreVertical size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>

            {showDropdown && (
              <View style={styles.dropdownMenu}>
                <FlatList
                  data={dropdownItems}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.dropdownItem} onPress={() => {
                      console.log(item.label);
                      closeAllDropdowns();
                    }}>
                      <Text style={styles.dropdownItemText}>{item.label}</Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item.label}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            )}

            <ImageBackground
              source={{ uri: chatBackgroundUrl }}
              style={styles.messagesBg}
              imageStyle={styles.messagesImage}
              resizeMode="cover"
            >
              <FlatList
                ref={flatListRef}
                data={selectedMessages}
                renderItem={renderMessage}
                keyExtractor={item => item.id}
                style={styles.messagesList}
                contentContainerStyle={styles.messagesContainer}
                showsVerticalScrollIndicator={false}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
              />
            </ImageBackground>

            <View style={styles.inputContainer}>
              <TouchableOpacity style={styles.iconBtn} onPress={closeAllDropdowns}><Paperclip size={24} color="#FFFFFF" /></TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder="Type a message"
                placeholderTextColor="#526F8A"
                value={newMessage}
                onChangeText={setNewMessage}
                multiline
              />
              <TouchableOpacity style={styles.iconBtn} onPress={sendMessage}>
                {newMessage.trim() === '' ? <Mic size={24} color={themeColor} /> : <Send size={24} color={themeColor} />}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
        {/* Image Overlay Modal */}
        <Modal
          visible={showImageModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowImageModal(false)}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowImageModal(false)}>
              <X size={32} color="white" />
            </TouchableOpacity>
            <Image source={{ uri: selectedAvatar }} style={fullImageStyle} />
          </View>
        </Modal>
        {/* Info Overlay Modal for mobile */}
        <Modal
          visible={showInfo}
          transparent={false}
          animationType="slide"
          onRequestClose={() => setShowInfo(false)}
        >
          <View style={styles.infoModalOverlay}>
            <View style={styles.infoHeader}>
              <Text style={styles.infoTitle}>
                {selectedChat?.type === 'group' ? 'Group info' : 'Contact info'}
              </Text>
              <TouchableOpacity onPress={() => setShowInfo(false)}>
                <X size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            {renderInfoContent()}
          </View>
        </Modal>
        {/* Media Carousel Modal */}
        <Modal
          visible={showMediaCarousel}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowMediaCarousel(false)}
        >
          <View style={styles.carouselModalOverlay}>
            <View style={styles.carouselHeader}>
              <View style={styles.carouselHeaderLeft}>
                <Image source={{ uri: selectedChat?.avatar || '' }} style={styles.avatar} />
                <Text style={styles.carouselHeaderName}>{selectedChat?.name || 'Media'}</Text>
              </View>
              <TouchableOpacity style={styles.iconBtn} onPress={() => setShowMediaCarousel(false)}>
                <X size={24} color="white" />
              </TouchableOpacity>
            </View>
            <FlatList
              ref={carouselFlatListRef}
              style={[styles.flex1, { paddingBottom: 80 }]}
              data={mediaImages}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              initialScrollIndex={carouselStartIndex}
              getItemLayout={(data, index) => ({ length: width, offset: width * index, index })}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(event.nativeEvent.contentOffset.x / width);
                setCurrentCarouselIndex(index);
              }}
              renderItem={({ item, index }) => (
                <View style={[{ width, height: height - 140, justifyContent: 'center', alignItems: 'center' }]}>
                  <Image source={{ uri: item }} style={styles.carouselImage} />
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
            <TouchableOpacity
              style={[styles.carouselNavBtn, styles.prevBtn]}
              onPress={() => {
                if (currentCarouselIndex > 0) {
                  scrollToCarouselIndex(currentCarouselIndex - 1);
                }
              }}
            >
              <ChevronLeft size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.carouselNavBtn, styles.nextBtn]}
              onPress={() => {
                if (currentCarouselIndex < mediaImages.length - 1) {
                  scrollToCarouselIndex(currentCarouselIndex + 1);
                }
              }}
            >
              <ChevronRight size={30} color="white" />
            </TouchableOpacity>
            <View style={styles.carouselFooter}>
              <FlatList
                data={mediaImages}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    onPress={() => scrollToCarouselIndex(index)}
                    style={[
                      styles.previewThumb,
                      { opacity: index === currentCarouselIndex ? 1 : 0.5 }
                    ]}
                  >
                    <Image source={{ uri: item }} style={styles.previewImage} />
                  </TouchableOpacity>
                )}
                keyExtractor={(_, i) => i.toString()}
              />
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    );
  }

  // Tablet/Desktop layout
  return (
    <View style={styles.container}>
      {/* Left Pane */}
      <View style={[styles.leftPane, { width: isDesktop ? 360 : 300 }]}>
        <TouchableWithoutFeedback onPress={handleOutsideClick}>
          <View style={{ flex: 1 }}>
            <View style={styles.chatsHeader}>
              <View style={styles.logoContainer}>
                <View style={styles.vibeLogo}>
                  <Text style={styles.logoHeart}>♥</Text>
                  <Text style={styles.logoText}>VibeChat</Text>
                </View>
                <TouchableOpacity onPress={toggleHeaderDropdown}><MoreVertical size={24} color={themeColor} /></TouchableOpacity>
              </View>
              <View style={styles.searchContainer}>
                <Search size={20} color="#385B90" />
                <TextInput placeholder="Search or start new chat" style={styles.searchInput} value={searchQuery} onChangeText={setSearchQuery} />
              </View>
            </View>
            <FlatList
              data={filteredChats}
              renderItem={renderChatItem}
              keyExtractor={item => item.id}
              style={styles.chatsList}
              contentContainerStyle={{ paddingBottom: 20, paddingTop: 8 }}
            />
          </View>
        </TouchableWithoutFeedback>
        {showHeaderDropdown && renderHeaderDropdown(false)}
      </View>

      {/* Right Pane */}
      <View style={[
        styles.rightPaneBase,
        !state.selectedChatId && styles.rightPaneCentered,
        showInfo && !isDesktop && { borderRightWidth: 1, borderRightColor: '#081730' }
      ]}>
        {state.selectedChatId ? (
          <TouchableWithoutFeedback onPress={closeAllDropdowns}>
            <KeyboardAvoidingView style={styles.flex1} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <View style={[styles.header, { backgroundColor: '#031229', borderBottomColor: '#081730', }]}>
                <TouchableOpacity style={styles.headerLeft} onPress={toggleInfoPane}>
                  <Image source={{ uri: selectedChat?.avatar }} style={styles.avatar} />
                  <View style={styles.headerInfo}>
                    <Text style={styles.headerName} numberOfLines={1} ellipsizeMode="tail">{selectedChat?.name}</Text>
                    {selectedChat?.type === 'group' ? (
                      <Text style={styles.headerStatus} numberOfLines={1} ellipsizeMode="tail">
                        {getGroupMembers(selectedChat.id).map(m => m.name).join(', ')}
                      </Text>
                    ) : (
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {/* <View style={styles.onlineDot} />
                        <Text style={styles.headerStatus}>Online</Text> */}
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
                <View style={styles.headerActions}>
                  {showMediaCarousel ? (
                    <TouchableOpacity style={styles.iconBtn} onPress={() => setShowMediaCarousel(false)}>
                      <X size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                  ) : (
                    <>
                      <TouchableOpacity style={styles.iconBtn} onPress={closeAllDropdowns}><Phone size={24} color="#FFFFFF" /></TouchableOpacity>
                      <TouchableOpacity style={styles.iconBtn} onPress={closeAllDropdowns}><Video size={24} color="#FFFFFF" /></TouchableOpacity>
                      <TouchableOpacity style={styles.iconBtn} onPress={toggleDropdown}>
                        <MoreVertical size={24} color="#FFFFFF" />
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>

              {showDropdown && (
                <View style={styles.dropdownMenu}>
                  <FlatList
                    data={dropdownItems}
                    renderItem={({ item }) => (
                      <TouchableOpacity style={styles.dropdownItem} onPress={() => {
                        console.log(item.label);
                        closeAllDropdowns();
                      }}>
                        <Text style={styles.dropdownItemText}>{item.label}</Text>
                      </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.label}
                    showsVerticalScrollIndicator={false}
                  />
                </View>
              )}

              <ImageBackground
                source={{ uri: chatBackgroundUrl }}
                style={styles.messagesBg}
                imageStyle={styles.messagesImage}
                resizeMode="cover"
              >
                <FlatList
                  ref={flatListRef}
                  data={selectedMessages}
                  renderItem={renderMessage}
                  keyExtractor={item => item.id}
                  style={styles.messagesList}
                  contentContainerStyle={[styles.messagesContainer, styles.flexGrow]}
                  showsVerticalScrollIndicator={false}
                  onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                />
              </ImageBackground>

              <View style={styles.inputContainer}>
                <TouchableOpacity style={styles.iconBtn} onPress={closeAllDropdowns}><Paperclip size={24} color="#FFFFFF" /></TouchableOpacity>
                <TextInput
                  style={styles.input}
                  placeholder="Type a message"
                  placeholderTextColor="#526F8A"
                  value={newMessage}
                  onChangeText={setNewMessage}
                  multiline
                />
                <TouchableOpacity style={styles.iconBtn} onPress={sendMessage}>
                  {newMessage.trim() === '' ? <Mic size={24} color={themeColor} /> : <Send size={24} color={themeColor} />}
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        ) : (
          <TouchableWithoutFeedback onPress={closeAllDropdowns}>
            <View style={{ flex: 1, position: 'relative', width: '100%' }}>
              <WelcomeScreen />
              <View style={styles.footer}>
                <Text style={styles.footerText}>Activate Windows</Text>
                <Text style={styles.footerSubtext}>Go to Settings to activate Windows.</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>

      {/* Side Info Pane for Desktop */}
      {isDesktop && showInfo && state.selectedChatId && (
        <View style={styles.infoPane}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoTitle}>
              {selectedChat?.type === 'group' ? 'Group info' : 'Contact info'}
            </Text>
            <TouchableOpacity onPress={() => { setShowInfo(false); closeAllDropdowns(); }}>
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          {renderInfoContent()}
        </View>
      )}

      {/* Overlay Info for Tablet */}
      {isTablet && showInfo && state.selectedChatId && (
        <View style={styles.infoOverlay}>
          <TouchableWithoutFeedback onPress={() => setShowInfo(false)}>
            <View style={styles.infoPaneOverlay}>
              <View style={styles.infoHeader}>
                <Text style={styles.infoTitle}>
                  {selectedChat?.type === 'group' ? 'Group info' : 'Contact info'}
                </Text>
                <TouchableOpacity onPress={() => setShowInfo(false)}>
                  <X size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              {renderInfoContent()}
            </View>
          </TouchableWithoutFeedback>
        </View>
      )}

      {/* Image Overlay Modal */}
      <Modal
        visible={showImageModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowImageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalClose} onPress={() => setShowImageModal(false)}>
            <X size={32} color="white" />
          </TouchableOpacity>
          <Image source={{ uri: selectedAvatar }} style={fullImageStyle} />
        </View>
      </Modal>
      {/* Media Carousel Modal */}
      <Modal
        visible={showMediaCarousel}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMediaCarousel(false)}
      >
        <View style={styles.carouselModalOverlay}>
          <View style={styles.carouselHeader}>
            <View style={styles.carouselHeaderLeft}>
              <Image source={{ uri: selectedChat?.avatar || '' }} style={styles.avatar} />
              <Text style={styles.carouselHeaderName}>{selectedChat?.name || 'Media'}</Text>
            </View>
            <TouchableOpacity style={styles.iconBtn} onPress={() => setShowMediaCarousel(false)}>
              <X size={24} color="white" />
            </TouchableOpacity>
          </View>
          <FlatList
            ref={carouselFlatListRef}
            style={[styles.flex1, { paddingBottom: 80 }]}
            data={mediaImages}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={carouselStartIndex}
            getItemLayout={(data, index) => ({ length: width, offset: width * index, index })}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / width);
              setCurrentCarouselIndex(index);
            }}
            renderItem={({ item, index }) => (
              <View style={[{ width, height: height - 140, justifyContent: 'center', alignItems: 'center' }]}>
                <Image source={{ uri: item }} style={styles.carouselImage} />
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          <TouchableOpacity
            style={[styles.carouselNavBtn, styles.prevBtn]}
            onPress={() => {
              if (currentCarouselIndex > 0) {
                scrollToCarouselIndex(currentCarouselIndex - 1);
              }
            }}
          >
            <ChevronLeft size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.carouselNavBtn, styles.nextBtn]}
            onPress={() => {
              if (currentCarouselIndex < mediaImages.length - 1) {
                scrollToCarouselIndex(currentCarouselIndex + 1);
              }
            }}
          >
            <ChevronRight size={30} color="white" />
          </TouchableOpacity>
          <View style={styles.carouselFooter}>
            <FlatList
              data={mediaImages}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => scrollToCarouselIndex(index)}
                  style={[
                    styles.previewThumb,
                    { opacity: index === currentCarouselIndex ? 1 : 0.5 }
                  ]}
                >
                  <Image source={{ uri: item }} style={styles.previewImage} />
                </TouchableOpacity>
              )}
              keyExtractor={(_, i) => i.toString()}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  flexGrow: { flexGrow: 1 },
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#0B141A',
  },
  leftPane: {
    borderRightWidth: 1,
    borderRightColor: '#081730',
    backgroundColor: '#051834',
  },
  rightPaneBase: {
    flex: 1,
    backgroundColor: '#031229',
  },
  rightPaneCentered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoPane: {
    width: 500,
    borderLeftWidth: 1,
    borderLeftColor: '#081730',
    backgroundColor: '#051834',
    flexDirection: 'column',
  },
  infoOverlay: {
    position: 'absolute',
    top: 0,
    left: 300,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    backgroundColor: '#051834',
  },
  infoPaneOverlay: {
    flex: 1,
  },
  infoModalOverlay: {
    flex: 1,
    backgroundColor: '#051834',
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#031229',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  infoContent: {
    flex: 1,
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    backgroundColor: '#020E20',
    borderBottomColor: '#051834',
  },
  vibeLogo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoHeart: {
    fontSize: 44,
    color: themeColor,
    marginRight: 4,
  },
  logoText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: themeColor,
  },
  chatsHeader: { backgroundColor: '#020E20' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#051834',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    margin: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchInput: {
    marginLeft: 8,
    flex: 1,
    color: '#385B90',
    fontSize: 14,
  },
  chatsList: { flex: 1, backgroundColor: '#020E20' },
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  avatarSmall: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12
  },
  chatInfo: { flex: 1, marginRight: 12 },
  chatName: { fontWeight: 'bold', fontSize: 16, marginBottom: 2 },
  chatHandle: { color: '#526F8A', fontSize: 14 },
  chatMeta: { alignItems: 'flex-end', minWidth: 60, flexDirection: 'column' },
  chatTime: { color: '#526F8A', fontSize: 12, marginBottom: 4 },
  unreadBadge: {
    backgroundColor: '#4f7bc7ff',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 5,
    borderBottomColor: '#4f7bc7ff',
    paddingBottom: 8,
    paddingTop: 7,
    paddingHorizontal: 16,
  },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    padding: 4,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 12,
  },
  headerName: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 18 },
  headerStatus: { color: '#526F8A', fontSize: 14, marginTop: 2 },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00FF00',
    marginRight: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  iconBtn: {
    marginLeft: 8,
    padding: 4
  },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  largeAvatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginTop: 24,
    marginBottom: 16,
    alignSelf: 'center'
  },
  messagesList: {
    flex: 1,
    width: '100%',
  },
  messagesBg: {
    flex: 1,
  },
  messagesImage: {
    opacity: 0.07,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingHorizontal: 16,
    width: '100%',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 10,
    marginBottom: 4,
  },
  messageText: { color: '#FFFFFF', fontSize: 15 },
  messageTextWhite: { color: 'white', fontSize: 15 },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4
  },
  time: { color: '#526F8A', fontSize: 12 },
  timeWhite: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
  messagesContainer: {
    paddingHorizontal: 0,
    paddingVertical: 8,
    flexGrow: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#031229',
    backgroundColor: '#051834',
  },
  input: {
    flex: 1,
    backgroundColor: '#051834',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
    color: '#FFFFFF',
    fontSize: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  welcomeContainer: {
    flexGrow: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#0B141A',
  },
  welcomeIcon: {
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#526F8A',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 32,
  },
  downloadBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  welcomeNote: {
    fontSize: 12,
    color: '#526F8A',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 12,
    alignItems: 'center',
    display: 'none',
  },
  footerText: {
    fontSize: 12,
    color: '#667781',
    fontWeight: 'bold',
  },
  footerSubtext: {
    fontSize: 11,
    color: '#919EAB',
  },
  infoName: {
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 18,
    color: '#FFFFFF',
  },
  infoSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#031229',
  },
  contactInfoSection: {
    backgroundColor: 'rgba(3, 18, 41, 0.8)',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  editBtn: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  editBtnText: {
    fontSize: 12,
    color: themeColor,
  },
  mediaThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  seeMoreContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#031229',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  seeMoreText: {
    fontSize: 12,
    color: '#526F8A',
    marginTop: 2,
  },
  actionBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#031229',
  },
  actionBtnText: {
    fontSize: 14,
    color: themeColor,
  },
  infoAbout: {
    color: '#526F8A',
    textAlign: 'left',
    lineHeight: 20,
    marginBottom: 8
  },
  groupMemberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#031229',
  },
  groupMemberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  groupMemberInfo: {
    flex: 1,
  },
  groupMemberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  groupMemberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  adminText: {
    fontSize: 12,
    color: themeColor,
    marginLeft: 4,
    backgroundColor: 'rgba(255, 218, 124, 0.1)',
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  groupMemberAbout: {
    fontSize: 14,
    color: '#526F8A',
  },
  removeMemberBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#FF6B6B',
    borderRadius: 4,
  },
  removeMemberText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 60,
    right: 16,
    width: 200,
    backgroundColor: '#031229',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
    maxHeight: 300,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerDropdownMobile: {
    position: 'absolute',
    right: 16,
    width: 200,
    backgroundColor: '#031229',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
    maxHeight: 300,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerDropdownDesktop: {
    position: 'absolute',
    top: 60,
    right: 16,
    width: 200,
    backgroundColor: '#031229',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
    maxHeight: 300,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#081730',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalClose: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1001,
  },
  carouselModalOverlay: {
    flex: 1,
    backgroundColor: 'black',
  },
  carouselHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    height: 60,
  },
  carouselHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  carouselHeaderName: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 12,
  },
  carouselImage: {
    flex: 1,
    width: '100%',
    resizeMode: 'contain' as const,
  },
  carouselNavBtn: {
    position: 'absolute',
    top: '50%',
    zIndex: 2,
    padding: 10,
  },
  prevBtn: {
    left: 20,
    transform: [{ translateY: -15 }],
  },
  nextBtn: {
    right: 20,
    transform: [{ translateY: -15 }],
  },
  carouselFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  previewThumb: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
});