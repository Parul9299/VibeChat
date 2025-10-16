import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Modal, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Edit3, Save, X, Camera, ChevronLeft } from 'lucide-react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const [name, setName] = useState('Alex Morgan');
  const [phoneNumber, setPhoneNumber] = useState('+1 (555) 123-4567');
  const [email, setEmail] = useState('alex.morgan@example.com');
  const [about, setAbout] = useState('Digital designer & photographer. Love traveling and coffee.');
  const [isEditing, setIsEditing] = useState(false);
  const [isAboutModalVisible, setIsAboutModalVisible] = useState(false);
  const [tempAbout, setTempAbout] = useState(about);
  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D');

  const avatarOptions = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1533227268428-f9ed7c3c8e37?w=150&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1524504388940-7b8a6c5e8b0a?w=150&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=60'
  ];

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert('Profile Updated', 'Your profile information has been updated successfully.');
  };

  const handleAboutSave = () => {
    setAbout(tempAbout);
    setIsAboutModalVisible(false);
  };

  const handleImageSelect = (imageUri: string) => {
    setProfileImage(imageUri);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity 
            onPress={() => setIsEditing(!isEditing)}
            style={styles.editButton}
          >
            {isEditing ? (
              <Save size={24} color="#FFFFFF" />
            ) : (
              <Edit3 size={24} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Profile Image Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: profileImage }} 
              style={styles.avatar}
            />
            {isEditing && (
              <TouchableOpacity 
                onPress={() => setIsAboutModalVisible(true)}
                style={styles.cameraButton}
              >
                <Camera size={16} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.profileName}>{name}</Text>
          <Text style={styles.onlineStatus}>Online</Text>
        </View>

        {/* Profile Details */}
        <View style={styles.detailsCard}>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Name</Text>
            {isEditing ? (
              <TextInput
                value={name}
                onChangeText={setName}
                style={styles.inputField}
              />
            ) : (
              <Text style={styles.fieldValue}>{name}</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Phone Number</Text>
            {isEditing ? (
              <TextInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                style={styles.inputField}
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.fieldValue}>{phoneNumber}</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Email</Text>
            {isEditing ? (
              <TextInput
                value={email}
                onChangeText={setEmail}
                style={styles.inputField}
                keyboardType="email-address"
              />
            ) : (
              <Text style={styles.fieldValue}>{email}</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <View style={styles.aboutHeader}>
              <Text style={styles.fieldLabel}>About</Text>
              {isEditing && (
                <TouchableOpacity onPress={() => setIsAboutModalVisible(true)}>
                  <Edit3 size={18} color="#FFDA7C" />
                </TouchableOpacity>
              )}
            </View>
            {isEditing ? (
              <Text style={styles.fieldValue}>{about}</Text>
            ) : (
              <Text style={styles.fieldValue}>{about}</Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* About Edit Modal */}
      <Modal
        visible={isAboutModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit About</Text>
              <TouchableOpacity onPress={() => setIsAboutModalVisible(false)}>
                <X size={24} color="#526F8A" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalField}>
              <Text style={styles.fieldLabel}>About</Text>
              <TextInput
                value={tempAbout}
                onChangeText={setTempAbout}
                style={styles.modalInput}
                multiline={true}
                textAlignVertical="top"
              />
            </View>
            
            <TouchableOpacity 
              onPress={handleAboutSave}
              style={styles.modalSaveButton}
            >
              <Text style={styles.modalSaveButtonText}>Save</Text>
            </TouchableOpacity>
            
            <Text style={styles.avatarLabel}>Choose Avatar</Text>
            <ScrollView horizontal={true} style={styles.avatarScroll}>
              {avatarOptions.map((imageUri, index) => (
                <TouchableOpacity 
                  key={index} 
                  onPress={() => handleImageSelect(imageUri)}
                  style={[
                    styles.avatarOption,
                    profileImage === imageUri && styles.selectedAvatar
                  ]}
                >
                  <Image 
                    source={{ uri: imageUri }} 
                    style={styles.avatarOptionImage}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {isEditing && (
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      )}
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
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    color: themeColor,
  },
  editButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 8,
    borderRadius: 20,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: themeColor,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
  },
  onlineStatus: {
    fontSize: 16,
    color: '#00FF00',
    marginTop: 4,
  },
  detailsCard: {
    backgroundColor: '#051834',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  aboutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#526F8A',
    marginBottom: 8,
  },
  inputField: {
    fontSize: 18,
    color: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    paddingBottom: 8,
  },
  fieldValue: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#051834',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    height: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalField: {
    marginBottom: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 12,
    height: 120,
    color: '#FFFFFF',
    textAlignVertical: 'top',
  },
  modalSaveButton: {
    backgroundColor: themeColor,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  modalSaveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  avatarLabel: {
    fontSize: 14,
    color: '#526F8A',
    marginBottom: 12,
  },
  avatarScroll: {
    maxHeight: 96,
  },
  avatarOption: {
    marginRight: 12,
  },
  selectedAvatar: {
    borderWidth: 2,
    borderColor: themeColor,
    borderRadius: 32,
  },
  avatarOptionImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  saveButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: themeColor,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});