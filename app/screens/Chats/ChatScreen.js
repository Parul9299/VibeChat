import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

export default function ChatScreen({ route }) {
  const { chatName } = route.params;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  const sendMessage = () => {
    if (text.trim() === '') return;
    setMessages([...messages, { id: Date.now().toString(), text }]);
    setText('');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text style={styles.message}>{item.text}</Text>}
      />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Type a message"
          value={text}
          onChangeText={setText}
          style={styles.input}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  message: { backgroundColor: '#dcf8c6', padding: 8, borderRadius: 8, marginVertical: 4, alignSelf: 'flex-start' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 'auto' },
  input: { flex: 1, borderWidth: 1, borderRadius: 20, padding: 10 },
  sendButton: { marginLeft: 10, backgroundColor: '#25D366', padding: 10, borderRadius: 20 },
  sendText: { color: '#fff' }
});
