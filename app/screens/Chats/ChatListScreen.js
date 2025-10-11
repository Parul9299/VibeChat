import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const dummyChats = [
  { id: '1', name: 'Ravi' },
  { id: '2', name: 'Sneha' },
  { id: '3', name: 'Parul' }
];

export default function ChatListScreen({ navigation, route }) {
  const username = route.params?.username || 'User';

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Hello, {username} 👋</Text>
      <FlatList
        data={dummyChats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatItem}
            onPress={() => navigation.navigate('Chat', { chatName: item.name })}
          >
            <Text style={styles.chatName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  header: { fontSize: 18, marginBottom: 10 },
  chatItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  chatName: { fontSize: 16 }
});
