import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Animated,
  StyleSheet,
  Modal,
  ScrollView,
  SectionList,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Search,
  ChevronRight,
  Users,
  UserPlus,
  Check,
  X
} from 'lucide-react-native';
import { useChat } from '../context/ChatContext';

interface Contact {
  id: string;
  name: string;
  avatar: string;
  about: string;
  time: string;
  unread: number;
  online: boolean;
}

interface GroupContact {
  id: string;
  name: string;
  avatar: string;
  selected: boolean;
}

interface ContactSection {
  title: string;
  data: Contact[];
}

export default function ContactsScreen() {
  const router = useRouter();
  const { state, dispatch } = useChat();
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showNewContactModal, setShowNewContactModal] = useState(false);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [showGroupNameModal, setShowGroupNameModal] = useState(false);
  const [selectedGroupContacts, setSelectedGroupContacts] = useState<GroupContact[]>([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [groupNameInput, setGroupNameInput] = useState('');
  const [scaleValue] = useState(new Animated.Value(1));
  const sectionListRef = useRef<SectionList<Contact, ContactSection>>(null);

  useEffect(() => {
    const mockContacts: Contact[] = [
      {
        id: '9',
        name: 'Alex Morgan',
        avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&auto=format&fit=crop&q=60',
        about: 'Loves coding and coffee ☕',
        time: '10:30 AM',
        unread: 0,
        online: true
      },
      {
        id: '10',
        name: 'David Kim',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=60',
        about: 'Designer and artist 🎨',
        time: '9:45 AM',
        unread: 3,
        online: false
      },
      {
        id: '11',
        name: 'Emma Wilson',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=60',
        about: 'Fitness enthusiast 🏃‍♀️',
        time: 'Yesterday',
        unread: 0,
        online: true
      },
      {
        id: '12',
        name: 'James Wilson',
        avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&auto=format&fit=crop&q=60',
        about: 'Music lover 🎵',
        time: 'Yesterday',
        unread: 1,
        online: false
      },
      {
        id: '13',
        name: 'Lisa Anderson',
        avatar: 'https://images.unsplash.com/photo-1578445714074-946b536079aa?w=150&auto=format&fit=crop&q=60',
        about: 'Traveler and photographer 📸',
        time: '2 days ago',
        unread: 0,
        online: false
      },
      {
        id: '14',
        name: 'Mike Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=60',
        about: 'Tech enthusiast 💻',
        time: '2 days ago',
        unread: 5,
        online: true
      },
      {
        id: '15',
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&auto=format&fit=crop&q=60',
        about: 'Bookworm 📚',
        time: '3 days ago',
        unread: 0,
        online: false
      },
      {
        id: '16',
        name: 'Sophia Martinez',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=60',
        about: 'Chef and foodie 🍳',
        time: '3 days ago',
        unread: 0,
        online: true
      }
    ];
    // Sort contacts alphabetically
    const sortedContacts = mockContacts.sort((a, b) => a.name.localeCompare(b.name));
    setContacts(sortedContacts);
  }, []);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group contacts by first letter
  const getSections = (): ContactSection[] => {
    const sections: ContactSection[] = [];
    const grouped = filteredContacts.reduce((acc, contact) => {
      const firstLetter = contact.name.charAt(0).toUpperCase();
      if (!acc[firstLetter]) acc[firstLetter] = [];
      acc[firstLetter].push(contact);
      return acc;
    }, {} as Record<string, Contact[]>);

    Object.keys(grouped).sort().forEach(key => {
      sections.push({ title: key, data: grouped[key] });
    });

    return sections;
  };

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleContactPress = (contact: Contact) => {
    const existingChat = state.chats.find(chat => chat.id === contact.id);
    const currentTimestamp = Date.now();
    const messages = state.messagesByChat[contact.id] || [];

    if (!existingChat) {
      const newChat = {
        id: contact.id,
        name: contact.name,
        lastMessage: '',
        time: '',
        unread: 0,
        avatar: contact.avatar,
        type: 'individual' as const,
        timestamp: currentTimestamp,
      };
      dispatch({ type: 'ADD_CHAT', payload: newChat });
      dispatch({ type: 'SET_MESSAGES', payload: { chatId: contact.id, messages: [] } });
    } else {
      dispatch({ type: 'UPDATE_CHAT', payload: { id: contact.id, updates: { timestamp: currentTimestamp, unread: 0 } } });
    }

    dispatch({ type: 'SET_MESSAGES', payload: { chatId: contact.id, messages } });
    dispatch({ type: 'SET_FROM_CONTACTS', payload: { fromContacts: true, originalContact: contact, initialMessageCount: 0 } });
    dispatch({ type: 'SET_SELECTED_CHAT', payload: contact.id });
    router.push('/');
  };

  const renderSectionHeader = ({ section }: { section: ContactSection }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{section.title}</Text>
    </View>
  );

  const renderContactItem = ({ item }: { item: Contact }) => (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity
        style={styles.contactItem}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.7}
        onPress={() => handleContactPress(item)}
      >
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: item.avatar }}
            style={styles.avatar}
          />
          {item.online && (
            <View style={styles.onlineIndicator}></View>
          )}
        </View>
        <View style={styles.contactInfo}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.about} numberOfLines={1}>{item.about}</Text>
        </View>
        <ChevronRight size={20} color="#526F8A" style={styles.chevron} />
      </TouchableOpacity>
    </Animated.View>
  );

  const addNewContact = () => {
    if (!firstName.trim() || !lastName.trim() || !phoneNumber.trim()) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const newContact: Contact = {
      id: Date.now().toString(),
      name: fullName,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=60',
      about: 'New contact',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      unread: 0,
      online: false
    };
    setContacts(prev => [...prev, newContact].sort((a, b) => a.name.localeCompare(b.name)));
    setShowNewContactModal(false);
    setFirstName('');
    setLastName('');
    setPhoneNumber('');
    Alert.alert('Success', 'Contact added successfully');
  };

  const toggleGroupContact = (id: string) => {
    setSelectedGroupContacts(prev =>
      prev.map(contact =>
        contact.id === id ? { ...contact, selected: !contact.selected } : contact
      )
    );
  };

  const handleCreateGroup = () => {
    const selected = selectedGroupContacts.filter(c => c.selected);
    if (selected.length < 2) {
      Alert.alert('Error', 'Select at least 2 contacts to create a group');
      return;
    }
    const defaultName = selected.length <= 2 ? selected.map(c => c.name).join(', ') : `${selected[0].name}, ${selected[1].name}...`;
    setGroupNameInput(defaultName);
    setShowNewGroupModal(false);
    setShowGroupNameModal(true);
  };

  const confirmCreateGroup = () => {
    const selected = selectedGroupContacts.filter(c => c.selected);
    const defaultName = selected.length <= 2 ? selected.map(c => c.name).join(', ') : `${selected[0].name}, ${selected[1].name}...`;
    const finalName = groupNameInput.trim() || defaultName;
    const newGroupChat = {
      id: Date.now().toString(),
      name: finalName,
      lastMessage: '',
      time: '',
      unread: 0,
      avatar: selected[0].avatar, // Use first member's avatar
      type: 'group' as const,
      timestamp: Date.now(),
    };
    dispatch({ type: 'ADD_CHAT', payload: newGroupChat });
    dispatch({ type: 'SET_MESSAGES', payload: { chatId: newGroupChat.id, messages: [] } });
    dispatch({ type: 'SET_SELECTED_CHAT', payload: newGroupChat.id });
    Alert.alert('Success', `Group "${finalName}" created!`);
    setShowGroupNameModal(false);
    setSelectedGroupContacts([]);
    router.push('/');
  };

  const sections = getSections();

  const handleNewGroupPress = () => {
    const groupContacts = contacts.map(c => ({ id: c.id, name: c.name, avatar: c.avatar, selected: false }));
    setSelectedGroupContacts(groupContacts);
    setShowNewGroupModal(true);
  };

  return (
    <View style={styles.container}>
      {/* Header with New Group and New Contact */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Contacts</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.newButton} onPress={handleNewGroupPress}>
              <Users size={20} color={themeColor} />
              <Text style={styles.newButtonText}>New Group</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.newButton} onPress={() => setShowNewContactModal(true)}>
              <UserPlus size={20} color={themeColor} />
              <Text style={styles.newButtonText}>New Contact</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#526F8A" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search contacts"
            placeholderTextColor="#526F8A"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Contact List with Sections */}
      <SectionList<Contact, ContactSection>
        ref={sectionListRef}
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderContactItem}
        renderSectionHeader={renderSectionHeader}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={true}
      />

      {/* New Contact Modal */}
      <Modal visible={showNewContactModal} animationType="slide" transparent={false}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>New Contact</Text>
            <TouchableOpacity onPress={() => setShowNewContactModal(false)}>
              <X size={24} color="#526F8A" />
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.modalInput}
              placeholder="First name"
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Last name"
              value={lastName}
              onChangeText={setLastName}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Phone number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
            <TouchableOpacity style={styles.saveButton} onPress={addNewContact}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* New Group Modal */}
      <Modal visible={showNewGroupModal} animationType="slide" transparent={false}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>New Group</Text>
            <TouchableOpacity onPress={() => setShowNewGroupModal(false)}>
              <X size={24} color="#526F8A" />
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <FlatList
              data={selectedGroupContacts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.groupContactItem}
                  onPress={() => toggleGroupContact(item.id)}
                >
                  <View style={[styles.checkbox, item.selected && styles.checkboxSelected]}>
                    {item.selected && <Check size={16} color="white" />}
                  </View>
                  <Image source={{ uri: item.avatar }} style={styles.groupAvatar} />
                  <Text style={styles.groupName}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleCreateGroup}>
              <Text style={styles.saveButtonText}>Create Group</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Group Name Modal */}
      <Modal visible={showGroupNameModal} animationType="slide" transparent={false}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Group Name</Text>
            <TouchableOpacity onPress={() => { setShowGroupNameModal(false); setShowNewGroupModal(true); }}>
              <X size={24} color="#526F8A" />
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter group name (optional)"
              value={groupNameInput}
              onChangeText={setGroupNameInput}
            />
            <TouchableOpacity style={styles.saveButton} onPress={confirmCreateGroup}>
              <Text style={styles.saveButtonText}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const themeColor = '#FFDA7C';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B141A',
  },
  header: {
    backgroundColor: '#051834',
    paddingTop: 44,
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: themeColor,
  },
  headerActions: {
    flexDirection: 'row',
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 8,
  },
  newButtonText: {
    color: themeColor,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#0B141A',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#051834',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#FFFFFF',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#031229',
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#526F8A',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#051834',
    borderBottomWidth: 1,
    borderBottomColor: '#031229',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#00FF00',
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  contactInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  about: {
    fontSize: 15,
    color: '#526F8A',
  },
  chevron: {
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#051834',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#031229',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#031229',
    color: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: '#020E20',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#526F8A',
    fontSize: 16,
    fontWeight: 'bold',
  },
  groupContactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#031229',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxSelected: {
    backgroundColor: themeColor,
    borderColor: themeColor,
  },
  groupAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  groupName: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
});