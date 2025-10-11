import React, { useState, useRef, useLayoutEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  Image, 
  KeyboardAvoidingView, 
  Platform, 
  useWindowDimensions,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
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
  Check,
  LogOut,
  Settings as SettingsIcon,
  User as UserIcon
} from 'lucide-react-native';
import { useChat } from '../context/ChatContext';

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  type: 'individual' | 'group';
  timestamp: number;
}

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'them';
  time: string;
  status: 'read' | 'sent' | 'unread';
}

export default function TabOneScreen() {
  const navigation = useNavigation();
  const router = useRouter();
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
  const [selectedMessages, setSelectedMessages] = useState<Message[]>([]); // Local for rendering
  const [searchQuery, setSearchQuery] = useState('');

  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const carouselFlatListRef = useRef<FlatList>(null);

  const selectedChat = state.chats.find(chat => chat.id === state.selectedChatId);
  const filteredChats = state.chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const currentMessages = state.messagesByChat[state.selectedChatId || ''] || [];

  useLayoutEffect(() => {
    if (state.selectedChatId) {
      navigation.setOptions({
        tabBarStyle: { display: 'none' },
      });
    } else {
      navigation.setOptions({
        tabBarStyle: { display: 'flex' },
      });
    }
  }, [state.selectedChatId, navigation]);

  const themeColor = '#8B5CF6';

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

  const sendMessage = () => {
    if (newMessage.trim() === '' || !state.selectedChatId) return;
    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };
    dispatch({ type: 'ADD_MESSAGE', payload: { chatId: state.selectedChatId, message } });
    dispatch({
      type: 'UPDATE_CHAT',
      payload: {
        id: state.selectedChatId,
        updates: {
          lastMessage: newMessage,
          time: message.time,
          unread: 0,
          timestamp: Date.now(),
        },
      },
    });
    setNewMessage('');
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const handleBack = () => {
    if (state.fromContacts && currentMessages.length === state.initialMessageCount) {
      dispatch({ type: 'REMOVE_CHAT', payload: state.originalContact?.id || '' });
    }
    dispatch({ type: 'SET_FROM_CONTACTS', payload: { fromContacts: false } });
    dispatch({ type: 'SET_SELECTED_CHAT', payload: null });
  };

  const toggleInfoPane = () => {
    setShowInfo(!showInfo);
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleHeaderDropdown = () => {
    setShowHeaderDropdown(!showHeaderDropdown);
  };

  const handleHeaderOptionPress = (option: string) => {
    setShowHeaderDropdown(false);
    switch (option) {
      case 'Settings':
        router.push('/settings');
        break;
      case 'Profile':
        router.push('/profile');
        break;
      case 'Logout':
        console.log('Logout pressed');
        break;
      default:
        break;
    }
  };

  const handleOutsideClick = () => {
    setShowDropdown(false);
    setShowHeaderDropdown(false);
  };

  const openImageModal = (avatarUrl: string) => {
    setSelectedAvatar(avatarUrl);
    setShowImageModal(true);
  };

  const openMediaCarousel = (startIndex: number) => {
    setCarouselStartIndex(startIndex);
    setCurrentCarouselIndex(startIndex);
    setShowMediaCarousel(true);
  };

  const scrollToCarouselIndex = (targetIndex: number) => {
    const offset = targetIndex * width;
    carouselFlatListRef.current?.scrollToOffset({ offset, animated: true });
    setCurrentCarouselIndex(targetIndex);
  };

  const closeMediaCarousel = () => {
    setShowMediaCarousel(false);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.sender === 'me';
    return (
      <View style={[
        styles.messageContainer,
        { justifyContent: isMe ? 'flex-end' : 'flex-start' }
      ]}>
        <View 
          style={[
            styles.messageBubble,
            isMe 
              ? { 
                  backgroundColor: themeColor, 
                  borderTopRightRadius: 4,
                  borderBottomLeftRadius: 20,
                  borderBottomRightRadius: 20
                } 
              : { 
                  backgroundColor: '#F0F2F5', 
                  borderTopLeftRadius: 4,
                  borderBottomLeftRadius: 20,
                  borderBottomRightRadius: 20
                }
          ]}
        >
          <Text style={isMe ? styles.messageTextWhite : styles.messageText}>{item.text}</Text>
          <View style={styles.messageFooter}>
            <Text style={isMe ? styles.timeWhite : styles.time}>{item.time}</Text>
            {isMe && (
              <View style={{ marginLeft: 4 }}>
                {item.status === 'read' ? <CheckCheck size={14} color="#FFFFFF" /> : <Check size={14} color="#FFFFFF" />}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderChatItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity 
      style={[
        styles.chatItem,
        { backgroundColor: state.selectedChatId === item.id ? '#F0F2F5' : 'transparent' }
      ]}
      onPress={() => {
        dispatch({ type: 'UPDATE_CHAT', payload: { id: item.id, updates: { unread: 0 } } });
        dispatch({ type: 'SET_SELECTED_CHAT', payload: item.id });
        if (isDesktop) setShowInfo(false);
      }}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatarSmall} />
      <View style={styles.chatInfo}>
        <Text style={styles.chatName}>{item.name}</Text>
        <Text style={[
          styles.chatLastMsg, 
          item.unread > 0 ? { fontWeight: 'bold', color: '#000' } : {}
        ]} numberOfLines={1}>{item.lastMessage}</Text>
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

  const WelcomeScreen = () => (
    <ScrollView contentContainerStyle={styles.welcomeContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.welcomeIcon}>
        <MessageCircle size={200} color={themeColor} />
      </View>
      <Text style={styles.welcomeTitle}>Download VibeChat for Windows</Text>
      <Text style={styles.welcomeSubtitle}>Make calls, share your screen and get a faster experience when you download the app.</Text>
      <TouchableOpacity style={[styles.downloadBtn, { backgroundColor: themeColor }]} onPress={handleOutsideClick}>
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

  const headerDropdownItems = [
    { label: 'Settings', icon: SettingsIcon },
    { label: 'Profile', icon: UserIcon },
    { label: 'Logout', icon: LogOut }
  ];

  const fullImageStyle = {
    width: width * 0.9,
    height: height * 0.7,
    resizeMode: 'contain' as const,
  };

  const CarouselView = () => (
    <View style={styles.carouselModalOverlay}>
      <View style={[
        styles.carouselHeader, 
        { paddingHorizontal: width > 1300 ? 24 : 16 }
      ]}>
        <View style={styles.carouselHeaderLeft}>
          <Image source={{ uri: selectedChat?.avatar || '' }} style={styles.avatar} />
          <Text style={[
            styles.carouselHeaderName, 
            { fontSize: width > 1300 ? 20 : 18 }
          ]}>{selectedChat?.name || 'Media'}</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn} onPress={closeMediaCarousel}>
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
      <View style={[
        styles.carouselFooter, 
        { padding: width > 1300 ? 12 : 10 }
      ]}>
        <FlatList
          data={mediaImages}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TouchableOpacity 
              onPress={() => scrollToCarouselIndex(index)}
              style={[
                styles.previewThumb,
                { 
                  opacity: index === currentCarouselIndex ? 1 : 0.5,
                  width: width > 1300 ? 70 : 60, 
                  height: width > 1300 ? 70 : 60,
                  marginRight: width > 1300 ? 12 : 10,
                  borderRadius: width > 1300 ? 6 : 5
                }
              ]}
            >
              <Image source={{ uri: item }} style={styles.previewImage} />
            </TouchableOpacity>
          )}
          keyExtractor={(_, i) => i.toString()}
        />
      </View>
    </View>
  );

  // Tablet/Desktop layout
  const ChatView = () => (
    <KeyboardAvoidingView style={styles.flex1} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={handleOutsideClick}>
        <>
          <View style={[styles.header, { 
            backgroundColor: themeColor,
            paddingTop: Platform.OS === 'web' ? 20 : (Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0),
            paddingHorizontal: width > 1300 ? 24 : 16
          }]}>
            {/* Info toggle for tablet/desktop */}
            <TouchableOpacity style={styles.headerLeft} onPress={toggleInfoPane}>
              <Image source={{ uri: selectedChat?.avatar }} style={[
                styles.avatar, 
                { width: width > 1300 ? 48 : 40, height: width > 1300 ? 48 : 40, borderRadius: width > 1300 ? 24 : 20 }
              ]} />
              <View style={styles.headerInfo}>
                <Text style={styles.headerName} numberOfLines={1}>{selectedChat?.name}</Text>
                <Text style={styles.headerStatus}>Online</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.headerActions}>
              {showMediaCarousel ? (
                <TouchableOpacity style={styles.iconBtn} onPress={closeMediaCarousel}>
                  <X size={24} color="white" />
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity style={styles.iconBtn} onPress={handleOutsideClick}><Phone size={24} color="white" /></TouchableOpacity>
                  <TouchableOpacity style={styles.iconBtn} onPress={handleOutsideClick}><Video size={24} color="white" /></TouchableOpacity>
                  <TouchableOpacity style={styles.iconBtn} onPress={toggleDropdown}>
                    <MoreVertical size={24} color="white" />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>

          {showDropdown && (
            <View style={[
              styles.dropdownMenu, 
              { right: width > 1300 ? 24 : 16, width: width > 1300 ? 220 : 200 }
            ]}>
              <FlatList
                data={dropdownItems}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.dropdownItem} onPress={() => {
                    console.log(item.label);
                    setShowDropdown(false);
                  }}>
                    <Text style={styles.dropdownItemText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.label}
                showsVerticalScrollIndicator={false}
                style={{ maxHeight: 300 }}
              />
            </View>
          )}

          <FlatList
            ref={flatListRef}
            data={currentMessages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            style={styles.messagesList}
            contentContainerStyle={styles.messagesContainer}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />

          <View style={[
            styles.inputContainer, 
            { paddingHorizontal: width > 1300 ? 24 : 16 }
          ]}>
            <TouchableOpacity style={styles.iconBtn} onPress={handleOutsideClick}><Paperclip size={24} color="#667781" /></TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Type a message"
              placeholderTextColor="#667781"
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
            />
            <TouchableOpacity style={styles.iconBtn} onPress={sendMessage}>
              {newMessage.trim() === '' ? <Mic size={24} color={themeColor} /> : <Send size={24} color={themeColor} />}
            </TouchableOpacity>
          </View>
        </>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );

  const InfoPane = () => (
    <ScrollView style={styles.infoContent}>
      <Image source={{ uri: selectedChat?.avatar || '' }} style={[
        styles.largeAvatar, 
        { width: width > 1300 ? 120 : 96, height: width > 1300 ? 120 : 96, borderRadius: width > 1300 ? 60 : 48 }
      ]} />
      <Text style={[
        styles.infoName, 
        { fontSize: width > 1300 ? 20 : 18 }
      ]}>{selectedChat?.name}</Text>
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.infoAbout}>Hey there! I am using VibeChat</Text>
      </View>
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Media, links and docs</Text>
        <View style={styles.mediaRow}>
          {mediaImages.slice(0, 5).map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => openMediaCarousel(index)}
              style={{ marginRight: 8 }}
            >
              <Image
                source={{ uri: item }}
                style={[
                  styles.mediaThumbnail,
                  {
                    width: width > 1300 ? 70 : 60,
                    height: width > 1300 ? 70 : 60,
                    borderRadius: width > 1300 ? 10 : 8,
                  },
                ]}
              />
            </TouchableOpacity>
          ))}
          {mediaImages.length > 5 && (
            <TouchableOpacity
              style={[
                styles.seeMoreContainer,
                {
                  width: width > 1300 ? 70 : 60,
                  height: width > 1300 ? 70 : 60,
                  borderRadius: width > 1300 ? 10 : 8,
                },
              ]}
              onPress={() => openMediaCarousel(mediaImages.length - 1)}
            >
              <ChevronRight size={width > 1300 ? 22 : 20} color="#667781" />
              <Text style={styles.seeMoreText}>See more</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <TouchableOpacity style={styles.actionBtn} onPress={() => console.log('View profile')}>
        <Text style={styles.actionBtnText}>View profile</Text>
      </TouchableOpacity>
      <View style={[styles.infoSection, { borderBottomWidth: 0 }]}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => console.log('Encryption')}>
          <Text style={styles.actionBtnText}>Encryption</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const InfoHeader = () => (
    <View style={[
      styles.infoHeader, 
      { padding: width > 1300 ? 20 : 16 }
    ]}>
      <Text style={[
        styles.infoTitle, 
        { fontSize: width > 1300 ? 18 : 16 }
      ]}>Contact info</Text>
      <TouchableOpacity onPress={toggleInfoPane}>
        <X size={width > 1300 ? 26 : 24} color="#111B21" />
      </TouchableOpacity>
    </View>
  );

  // Main content based on mobile or not
  let mainContent;
  if (isMobile) {
    if (!state.selectedChatId) {
      // Full screen chat list for mobile
      mainContent = (
        <View style={styles.flex1}>
          <View style={[styles.chatsHeader, { paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0 }]}>
            <View style={styles.logoContainer}>
              <Text style={[
                styles.logoText, 
                { fontSize: width > 400 ? 20 : 18 }
              ]}>VibeChat</Text>
              <TouchableOpacity onPress={toggleHeaderDropdown}><MoreVertical size={24} color={themeColor} /></TouchableOpacity>
            </View>
            <View style={styles.searchContainer}>
              <Search size={20} color="#667781" />
              <TextInput 
                placeholder="Search or start new chat" 
                style={[
                  styles.searchInput, 
                  { fontSize: width > 400 ? 15 : 14 }
                ]} 
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
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </View>
      );
    } else {
      // Mobile chat view
      mainContent = (
        <KeyboardAvoidingView style={styles.flex1} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <TouchableWithoutFeedback onPress={handleOutsideClick}>
            <>
              <View style={[styles.header, { 
                backgroundColor: themeColor,
                paddingTop: Platform.OS === 'web' ? 20 : (Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0),
                paddingHorizontal: width > 400 ? 20 : 16
              }]}>
                {/* Back button for mobile */}
                <TouchableOpacity style={styles.iconBtn} onPress={handleBack}>
                  <ChevronLeft size={24} color="white" />
                </TouchableOpacity>
                {/* Info toggle */}
                <TouchableOpacity style={styles.headerLeft} onPress={toggleInfoPane}>
                  <Image source={{ uri: selectedChat?.avatar }} style={[
                    styles.avatar, 
                    { width: width > 400 ? 44 : 40, height: width > 400 ? 44 : 40, borderRadius: width > 400 ? 22 : 20 }
                  ]} />
                  <View style={styles.headerInfo}>
                    <Text style={[
                      styles.headerName, 
                      { fontSize: width > 400 ? 19 : 18 }
                    ]} numberOfLines={1}>{selectedChat?.name}</Text>
                    <Text style={styles.headerStatus}>Online</Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.headerActions}>
                  {showMediaCarousel ? (
                    <TouchableOpacity style={styles.iconBtn} onPress={closeMediaCarousel}>
                      <X size={24} color="white" />
                    </TouchableOpacity>
                  ) : (
                    <>
                      <TouchableOpacity style={styles.iconBtn} onPress={handleOutsideClick}><Phone size={24} color="white" /></TouchableOpacity>
                      <TouchableOpacity style={styles.iconBtn} onPress={handleOutsideClick}><Video size={24} color="white" /></TouchableOpacity>
                      <TouchableOpacity style={styles.iconBtn} onPress={toggleDropdown}>
                        <MoreVertical size={24} color="white" />
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>

              {showDropdown && (
                <View style={[
                  styles.dropdownMenu, 
                  { right: width > 400 ? 20 : 16, width: width > 400 ? 210 : 200 }
                ]}>
                  <FlatList
                    data={dropdownItems}
                    renderItem={({ item }) => (
                      <TouchableOpacity style={styles.dropdownItem} onPress={() => {
                        console.log(item.label);
                        setShowDropdown(false);
                      }}>
                        <Text style={[
                          styles.dropdownItemText, 
                          { fontSize: width > 400 ? 15 : 14 }
                        ]}>{item.label}</Text>
                      </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.label}
                    showsVerticalScrollIndicator={false}
                    style={{ maxHeight: 300 }}
                  />
                </View>
              )}

              <FlatList
                ref={flatListRef}
                data={currentMessages}
                renderItem={renderMessage}
                keyExtractor={item => item.id}
                style={styles.messagesList}
                contentContainerStyle={styles.messagesContainer}
                showsVerticalScrollIndicator={false}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
              />

              <View style={[
                styles.inputContainer, 
                { paddingHorizontal: width > 400 ? 20 : 16 }
              ]}>
                <TouchableOpacity style={styles.iconBtn} onPress={handleOutsideClick}><Paperclip size={24} color="#667781" /></TouchableOpacity>
                <TextInput
                  style={[
                    styles.input, 
                    { fontSize: width > 400 ? 16 : 15 }
                  ]}
                  placeholder="Type a message"
                  placeholderTextColor="#667781"
                  value={newMessage}
                  onChangeText={setNewMessage}
                  multiline
                />
                <TouchableOpacity style={styles.iconBtn} onPress={sendMessage}>
                  {newMessage.trim() === '' ? <Mic size={24} color={themeColor} /> : <Send size={24} color={themeColor} />}
                </TouchableOpacity>
              </View>
            </>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      );
    }
  } else {
    // Tablet/Desktop layout
    mainContent = (
      <View style={styles.container}>
        {/* Left Pane - Chats List */}
        <View style={[
          styles.leftPane, 
          { 
            width: isDesktop ? 360 : (isTablet ? Math.min(300, width * 0.3) : 280),
            minWidth: isDesktop ? 360 : (isTablet ? 280 : 250)
          }
        ]}>
          <View style={[styles.chatsHeader, { paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0 }]}>
            <View style={styles.logoContainer}>
              <Text style={[
                styles.logoText, 
                { fontSize: width > 1400 ? 22 : (width > 1000 ? 20 : 18) }
              ]}>VibeChat</Text>
              <TouchableOpacity onPress={toggleHeaderDropdown}><MoreVertical size={24} color={themeColor} /></TouchableOpacity>
            </View>
            <View style={styles.searchContainer}>
              <Search size={20} color="#667781" />
              <TextInput 
                placeholder="Search or start new chat" 
                style={[
                  styles.searchInput, 
                  { fontSize: width > 1000 ? 16 : 14 }
                ]} 
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
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </View>

        {/* Middle/Right Pane - Chat View or Welcome */}
        <View style={[
          styles.rightPaneBase,
          !state.selectedChatId && styles.rightPaneCentered,
          showInfo && !isDesktop && { borderRightWidth: 1, borderRightColor: '#E5E5E5' },
          { flex: 1 }
        ]}>
          {state.selectedChatId ? <ChatView /> : <WelcomeScreen />}
        </View>

        {/* Info Pane for Desktop */}
        {isDesktop && showInfo && (
          <View style={[
            styles.infoPane, 
            { 
              width: Math.min(500, width * 0.25), 
              minWidth: 400 
            }
          ]}>
            <InfoHeader />
            <InfoPane />
          </View>
        )}
      </View>
    );
  }

  return (
    <>
      {mainContent}
      {/* Header Dropdown */}
      {showHeaderDropdown && (
        <View style={[
          styles.dropdownMenu, 
          { 
            top: 80, 
            right: 16,
            width: 200
          }
        ]}>
          <FlatList
            data={headerDropdownItems}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.dropdownItem} 
                onPress={() => handleHeaderOptionPress(item.label)}
              >
                <View style={styles.headerDropdownIcon}>
                  <item.icon size={20} color="#111B21" />
                </View>
                <Text style={styles.dropdownItemText}>{item.label}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.label}
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: 200 }}
          />
        </View>
      )}
      {/* Info Overlay for Tablet */}
      {isTablet && showInfo && (
        <Modal visible={showInfo} transparent={false} animationType="slide" onRequestClose={toggleInfoPane}>
          <View style={styles.infoModalOverlay}>
            <InfoHeader />
            <InfoPane />
          </View>
        </Modal>
      )}

      {/* Info Overlay for Mobile */}
      {isMobile && state.selectedChatId && showInfo && (
        <Modal visible={showInfo} transparent={false} animationType="slide" onRequestClose={toggleInfoPane}>
          <View style={styles.infoModalOverlay}>
            <InfoHeader />
            <InfoPane />
          </View>
        </Modal>
      )}

      {/* Shared Modals */}
      <Modal visible={showImageModal} transparent animationType="fade" onRequestClose={() => setShowImageModal(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalClose} onPress={() => setShowImageModal(false)}>
            <X size={32} color="white" />
          </TouchableOpacity>
          <Image source={{ uri: selectedAvatar }} style={fullImageStyle} />
        </View>
      </Modal>

      <Modal
        visible={showMediaCarousel}
        transparent={true}
        animationType="slide"
        onRequestClose={closeMediaCarousel}
      >
        <CarouselView />
      </Modal>
    </>
  );
}

// Styles same as provided in the original index.tsx, with responsive tweaks
const styles = StyleSheet.create({
  flex1: { flex: 1 },
  flexGrow: { flexGrow: 1 },
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#EDEDED',
  },
  leftPane: {
    borderRightWidth: 1,
    borderRightColor: '#E5E5E5',
    backgroundColor: 'white',
  },
  rightPaneBase: { 
    flex: 1, 
    backgroundColor: '#EDEDED',
  },
  rightPaneCentered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoPane: {
    width: 500,
    borderLeftWidth: 1,
    borderLeftColor: '#E5E5E5',
    backgroundColor: 'white',
    flexDirection: 'column',
  },
  infoOverlay: {
    position: 'absolute',
    top: 0,
    left: 300,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    backgroundColor: 'white',
  },
  infoPaneOverlay: {
    flex: 1,
  },
  infoModalOverlay: {
    flex: 1,
    backgroundColor: 'white',
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  infoTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#111B21' 
  },
  infoContent: {
    flex: 1,
  },
  mediaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    overflowX: 'auto',
    marginBottom: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  chatsHeader: { backgroundColor: 'white' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    margin: 16,
  },
  searchInput: { 
    marginLeft: 8, 
    flex: 1, 
    color: '#000',
    fontSize: 14,
  },
  chatsList: { flex: 1, backgroundColor: 'white' },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  avatarSmall: { 
    width: 48, 
    height: 48, 
    borderRadius: 24, 
    marginRight: 12 
  },
  chatInfo: { flex: 1, marginRight: 12 },
  chatName: { fontWeight: 'bold', color: 'black', fontSize: 16 },
  chatLastMsg: { color: '#667781', fontSize: 14, marginTop: 2 },
  chatMeta: { alignItems: 'flex-end', minWidth: 60 },
  chatTime: { color: '#667781', fontSize: 12, marginBottom: 4 },
  unreadBadge: {
    backgroundColor: '#8B5CF6',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  unreadText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
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
  headerName: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  headerStatus: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 2 },
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
  messageText: { color: 'black', fontSize: 15 },
  messageTextWhite: { color: 'white', fontSize: 15 },
  messageFooter: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    alignItems: 'center', 
    marginTop: 4 
  },
  time: { color: '#666', fontSize: 12 },
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
    borderTopColor: '#E5E5E5',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    backgroundColor: '#F0F2F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
    color: 'black',
    fontSize: 15,
  },
  welcomeContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#EDEDED',
  },
  welcomeIcon: {
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111B21',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#667781',
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
    color: '#667781',
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
    fontSize: 18 
  },
  infoSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111B21',
    marginBottom: 8,
  },
  editBtn: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  editBtnText: {
    fontSize: 12,
    color: '#8B5CF6',
  },
  mediaThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  seeMoreContainer: {
    width: 'auto',
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F0F2F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  seeMoreText: {
    fontSize: 12,
    color: '#667781',
    marginTop: 2,
  },
  actionBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  actionBtnText: {
    fontSize: 14,
    color: '#8B5CF6',
  },
  infoAbout: { 
    color: '#667781', 
    textAlign: 'left',
    lineHeight: 20,
    marginBottom: 8 
  },
  dropdownMenu: {
    position: 'absolute',
    top: 80,
    width: 200,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
    maxHeight: 300,
  },
  headerDropdownIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#111B21',
    flex: 1,
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