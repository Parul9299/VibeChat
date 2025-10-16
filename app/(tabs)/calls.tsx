import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native';
import { Search, Phone, Video, MoreVertical, ArrowUpLeft, ArrowDownLeft, Clock, MessageCircle, CircleDashed, Settings } from 'lucide-react-native';

interface CallHistory {
    id: string;
    name: string;
    avatar: string;
    time: string;
    duration: string;
    type: 'incoming' | 'outgoing' | 'missed';
    isVideo: boolean;
}

export default function CallsScreen() {
    const [searchQuery, setSearchQuery] = useState('');

    // Mock call history data
    const callHistory: CallHistory[] = [
        {
            id: '1',
            name: 'Alex Morgan',
            avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTF8fHVzZXJ8ZW58MHx8MHx8fDA%3D',
            time: '2 hours ago',
            duration: '12:45',
            type: 'outgoing',
            isVideo: false
        },
        {
            id: '2',
            name: 'Sarah Johnson',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D',
            time: 'Yesterday',
            duration: '5:22',
            type: 'incoming',
            isVideo: true
        },
        {
            id: '3',
            name: 'Mike Chen',
            avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fHVzZXJ8ZW58MHx8MHx8fDA%3D',
            time: 'Yesterday',
            duration: '0:00',
            type: 'missed',
            isVideo: false
        },
        {
            id: '4',
            name: 'Emma Wilson',
            avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fHVzZXJ8ZW58MHx8MHx8fDA%3D',
            time: '2 days ago',
            duration: '24:18',
            type: 'incoming',
            isVideo: false
        },
        {
            id: '5',
            name: 'David Kim',
            avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTd8fHVzZXJ8ZW58MHx8MHx8fDA%3D',
            time: '3 days ago',
            duration: '8:33',
            type: 'outgoing',
            isVideo: true
        },
        {
            id: '6',
            name: 'Lisa Anderson',
            avatar: 'https://images.unsplash.com/photo-1578445714074-946b536079aa?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fFByb2Zlc3Npb25hbCUyMGF2YXRhciUyMHdpdGglMjBnbGFzc2VzfGVufDB8fDB8fHww',
            time: '4 days ago',
            duration: '0:00',
            type: 'missed',
            isVideo: false
        },
        {
            id: '7',
            name: 'James Wilson',
            avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fHVzZXJ8ZW58MHx8MHx8fDA%3D',
            time: '1 week ago',
            duration: '15:42',
            type: 'incoming',
            isVideo: false
        }
    ];

    // Filter calls based on search query
    const filteredCalls = callHistory.filter(call =>
        call.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Render each call history item
    const renderCallItem = ({ item }: { item: CallHistory }) => {
        const isMissed = item.type === 'missed';
        const isOutgoing = item.type === 'outgoing';
        const arrowColor = isMissed ? '#FF6B6B' : '#526F8A';
        const textColor = isMissed ? '#FF6B6B' : '#526F8A';

        return (
            <TouchableOpacity style={styles.callItem}>
                <View style={styles.avatarContainer}>
                    <Image
                        source={{ uri: item.avatar }}
                        style={styles.avatar}
                    />
                    <View style={[
                        styles.callTypeIcon,
                        item.isVideo ? styles.videoIcon : styles.audioIcon
                    ]}>
                        {item.isVideo ? (
                            <Video size={14} color="white" />
                        ) : (
                            <Phone size={14} color="white" />
                        )}
                    </View>
                </View>

                <View style={styles.callInfo}>
                    <View style={styles.callHeader}>
                        <Text style={[
                            styles.callName,
                            { color: isMissed ? '#FF6B6B' : '#FFFFFF' }
                        ]}>{item.name}</Text>
                    </View>

                    <View style={styles.callDetails}>
                        {isOutgoing ? (
                            <ArrowUpLeft size={16} color={arrowColor} style={styles.arrowIcon} />
                        ) : (
                            <ArrowDownLeft size={16} color={arrowColor} style={styles.arrowIcon} />
                        )}
                        <Text style={[
                            styles.callDuration,
                            { color: textColor }
                        ]}>
                            {isMissed ? 'Missed call' : item.duration}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.callButton}>
                    <Text style={styles.callTime}>{item.time}</Text>
                    <Phone size={20} color={themeColor} />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    const handleClearAll = () => {
        console.log('Clear all calls');
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Calls</Text>
                    <View style={styles.headerActions}>
                        <TouchableOpacity style={styles.headerIcon}>
                            <Phone size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.headerIcon}>
                            <Video size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.headerIcon}>
                            <MoreVertical size={24} color="white" />
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
                        placeholder="Search calls"
                        placeholderTextColor="#526F8A"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {/* Call History List */}
            <FlatList
                data={filteredCalls}
                renderItem={renderCallItem}
                keyExtractor={(item) => item.id}
                style={styles.list}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View style={styles.listHeader}>
                        <Text style={styles.listHeaderTitle}>Recent Calls</Text>
                        <TouchableOpacity style={styles.clearAllButton} onPress={handleClearAll}>
                            <Clock size={16} color={themeColor} style={styles.clearAllIcon} />
                            <Text style={styles.clearAllText}>Clear all</Text>
                        </TouchableOpacity>
                    </View>
                }
            />

            {/* Floating Action Button for new call */}
            <TouchableOpacity style={styles.fab}>
                <Phone size={24} color="white" />
            </TouchableOpacity>

            {/* Bottom Navigation */}
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
    headerIcon: {
        marginLeft: 16,
        padding: 4,
    },
    searchContainer: {
        padding: 16,
        backgroundColor: '#0B141A',
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#051834',
        borderRadius: 24,
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
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#031229',
    },
    listHeaderTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#526F8A',
    },
    clearAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    clearAllIcon: {
        marginRight: 4,
    },
    clearAllText: {
        fontSize: 14,
        fontWeight: '600',
        color: themeColor,
    },
    callItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#051834',
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
    callTypeIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },
    videoIcon: {
        backgroundColor: themeColor,
    },
    audioIcon: {
        backgroundColor: '#10B981',
    },
    callInfo: {
        flex: 1,
    },
    callHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
    },
    callName: {
        fontSize: 16,
        fontWeight: '600',
    },
    callTime: {
        fontSize: 14,
        color: '#526F8A',
    },
    callDetails: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    arrowIcon: {
        marginRight: 4,
    },
    callDuration: {
        fontSize: 14,
    },
    callButton: {
        padding: 8,
        width: 125,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    fab: {
        position: 'absolute',
        bottom: 10,
        right: 16,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#CA973E',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
    },
});