import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  StyleSheet
} from 'react-native';
import { Plus, ChevronRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface Status {
  id: string;
  name: string;
  time: string;
  avatar: string;
  preview: string;
}

// Mock data for status updates
const myStatus: Status & { isMyStatus: true } = {
  id: '1',
  name: 'My Status',
  time: 'Tap to add status update',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D',
  preview: 'https://images.unsplash.com/photo-1480694313141-fce5e697ee25?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c21hcnRwaG9uZXxlbnwwfHwwfHx8MA%3D%3D',
  isMyStatus: true,
};

const recentUpdates: Status[] = [
  {
    id: '2',
    name: 'Alex Johnson',
    time: '2 hours ago',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTF8fHVzZXJ8ZW58MHx8MHx8fDA%3D',
    preview: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fE5ldHdvcmtpbmclMjBjb25mZXJlbmNlfGVufDB8fDB8fHww',
  },
  {
    id: '3',
    name: 'Sarah Miller',
    time: '5 hours ago',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D',
    preview: 'https://images.unsplash.com/photo-1624561172888-ac93c696e10c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fE1hbiUyMG1hbGUlMjBnZW50bGVtYW4lMjBwcm9maWxlfGVufDB8fDB8fHww',
  },
  {
    id: '4',
    name: 'Michael Chen',
    time: 'Yesterday',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fHVzZXJ8ZW58MHx8MHx8fDA%3D',
    preview: 'https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8MyUyMGdyYXBoaWNzfGVufDB8fDB8fHww',
  },
  {
    id: '5',
    name: 'Emma Wilson',
    time: 'Yesterday',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fHVzZXJ8ZW58MHx8MHx8fDA%3D',
    preview: 'https://images.unsplash.com/photo-1729179666011-38d13280b92f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fDMlMjBncmFwaGljc3xlbnwwfHwwfHx8MA%3D%3D',
  },
];

const viewedUpdates: Status[] = [
  {
    id: '6',
    name: 'David Kim',
    time: '2 days ago',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTd8fHVzZXJ8ZW58MHx8MHx8fDA%3D',
    preview: 'https://images.unsplash.com/photo-1480694313141-fce5e697ee25?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c21hcnRwaG9uZXxlbnwwfHwwfHx8MA%3D%3D',
  },
  {
    id: '7',
    name: 'Lisa Anderson',
    time: '3 days ago',
    avatar: 'https://images.unsplash.com/photo-1578445714074-946b536079aa?w=100&h=100&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fFByb2Zlc3Npb25hbCUyMGF2YXRhciUyMHdpdGglMjBnbGFzc2VzfGVufDB8fDB8fHww',
    preview: 'https://images.unsplash.com/photo-1608447718455-ed5006c46051?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8MyUyMGdyYXBoaWNzfGVufDB8fDB8fHww',
  },
];

export default function StatusScreen() {
  const [statuses] = useState<Status[]>([...recentUpdates, ...viewedUpdates]);

  const handleAddStatus = () => {
    console.log('Add status pressed');
    // In a real app, this would open the camera or gallery
  };

  const handleViewStatus = (statusId: string) => {
    console.log('Viewing status:', statusId);
    // In a real app, this would open the status viewer
  };

  const renderStatusPreview = ({ item }: { item: Status }) => (
    <TouchableOpacity 
      style={styles.previewItem}
      onPress={() => handleViewStatus(item.id)}
    >
      <Image 
        source={{ uri: item.preview }} 
        style={styles.previewImage}
      />
      <View style={styles.previewOverlay}>
        <Text style={styles.previewName}>{item.name}</Text>
        <Text style={styles.previewTime}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Status</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* My Status Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Status</Text>
          <TouchableOpacity 
            style={styles.myStatusItem}
            onPress={handleAddStatus}
          >
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: myStatus.avatar }} 
                style={styles.avatar}
              />
              <View style={styles.plusIcon}>
                <Plus size={16} color="white" />
              </View>
            </View>
            <View style={styles.statusInfo}>
              <Text style={styles.statusName}>{myStatus.name}</Text>
              <Text style={styles.statusTime}>{myStatus.time}</Text>
            </View>
            <ChevronRight size={20} color="#526F8A" />
          </TouchableOpacity>
        </View>

        {/* Recent Updates Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Updates</Text>
          {recentUpdates.map((status) => (
            <TouchableOpacity 
              key={status.id} 
              style={styles.statusItem}
              onPress={() => handleViewStatus(status.id)}
            >
              <View style={styles.avatarContainer}>
                <Image 
                  source={{ uri: status.avatar }} 
                  style={styles.avatar}
                />
                <View style={styles.onlineDot}></View>
              </View>
              <View style={styles.statusInfo}>
                <Text style={styles.statusName}>{status.name}</Text>
                <Text style={styles.statusTime}>{status.time}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Viewed Updates Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Viewed Updates</Text>
          {viewedUpdates.map((status) => (
            <TouchableOpacity 
              key={status.id} 
              style={styles.statusItem}
              onPress={() => handleViewStatus(status.id)}
            >
              <View style={styles.avatarContainer}>
                <Image 
                  source={{ uri: status.avatar }} 
                  style={[styles.avatar, styles.viewedAvatar]}
                />
                <View style={styles.viewedDot}></View>
              </View>
              <View style={styles.statusInfo}>
                <Text style={[styles.statusName, styles.viewedName]}>{status.name}</Text>
                <Text style={[styles.statusTime, styles.viewedTime]}>{status.time}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Status Previews */}
        <View style={styles.previewsSection}>
          <Text style={styles.sectionTitle}>Recent Status Previews</Text>
          <FlatList
            data={statuses}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderStatusPreview}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.previewsList}
          />
        </View>
      </ScrollView>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: themeColor,
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
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#526F8A',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#031229',
  },
  myStatusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#031229',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  plusIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: themeColor,
    borderRadius: 14,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00FF00',
    borderWidth: 2,
    borderColor: 'white',
  },
  viewedDot: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#526F8A',
    borderWidth: 2,
    borderColor: 'white',
  },
  viewedAvatar: {
    opacity: 0.5,
  },
  statusInfo: {
    flex: 1,
  },
  statusName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  viewedName: {
    color: '#9CA3AF',
  },
  statusTime: {
    fontSize: 14,
    color: '#526F8A',
  },
  viewedTime: {
    color: '#9CA3AF',
  },
  previewsSection: {
    margin: 16,
  },
  previewsList: {
    paddingVertical: 8,
  },
  previewItem: {
    position: 'relative',
    marginRight: 12,
  },
  previewImage: {
    width: width * 0.6,
    height: 160,
    borderRadius: 12,
  },
  previewOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  previewName: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  previewTime: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
});